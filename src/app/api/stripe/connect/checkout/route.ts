import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";
import { getClientByDomain } from "@/lib/getClientByDomain";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  try {
    await requireValidApiDomain();
  } catch {
    return NextResponse.json({}, { status: 403 });
  }

  try {
    const body = await req.json();

    const total = Number(body.total);

    /* 🔒 VALIDACIÓN FUERTE */
    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json(
        { error: "Precio inválido" },
        { status: 400 }
      );
    }

    const cliente = await getClientByDomain();
    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    if (!cliente.stripe_subscription_id) {
      return NextResponse.json(
        { error: "Suscripción inactiva" },
        { status: 403 }
      );
    }

    const hasConnectAccount = Boolean(cliente.stripe_account_id);

    if (hasConnectAccount && cliente.stripe_charges_enabled === false) {
      return NextResponse.json(
        { error: "Esta agencia aún no tiene Stripe activo" },
        { status: 400 }
      );
    }

    /* 📦 Crear reserva en Supabase ANTES del checkout (estado pendiente_pago) */
    const { data: reserva, error: reservaError } = await supabaseAdmin
      .from("reservas")
      .insert({
        cliente_id: body.cliente_id,
        destino: body.destino_nombre,
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono || null,
        fecha_salida: body.fecha_salida,
        fecha_regreso: body.fecha_regreso,
        personas: Number(body.personas),
        precio: total,
        estado_pago: "pendiente_pago",
        passengers: body.passengers || [],
        adults: Number(body.adults) || 0,
        children: Number(body.children) || 0,
      })
      .select("id")
      .single();

    if (reservaError || !reserva) {
      console.error("Supabase insert error:", reservaError);
      return NextResponse.json(
        { error: "Error creando reserva" },
        { status: 500 }
      );
    }

    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const unitAmount = Math.round(total * 100); // céntimos

    const sessionParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: body.destino_nombre,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
      metadata: {
        reserva_id: reserva.id,
        cliente_id: body.cliente_id,
        destino_nombre: body.destino_nombre,
        nombre: body.nombre,
        email: body.email,
      },
    } as Stripe.Checkout.SessionCreateParams;

    if (hasConnectAccount && cliente.stripe_charges_enabled === true) {
      const applicationFeeAmount = Math.round(
        total * Number(cliente.commission_rate || 0)
      );
      sessionParams.payment_intent_data = {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: cliente.stripe_account_id!,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    /* Guardar stripe_session_id en la reserva */
    await supabaseAdmin
      .from("reservas")
      .update({ stripe_session_id: session.id })
      .eq("id", reserva.id);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
