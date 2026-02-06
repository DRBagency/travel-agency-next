import Stripe from "stripe";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";
import { getClientByDomain } from "@/lib/getClientByDomain";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    const hasConnectAccount = Boolean(cliente.stripe_account_id);

    if (hasConnectAccount && cliente.stripe_charges_enabled === false) {
      return NextResponse.json(
        { error: "Esta agencia aún no tiene Stripe activo" },
        { status: 400 }
      );
    }

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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: {
        cliente_id: body.cliente_id,
        destino_id: body.destino_id,
        destino_nombre: body.destino_nombre,
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono,
        personas: String(body.personas),
        total: String(total),
        fecha_salida: body.fecha_salida,
        fecha_regreso: body.fecha_regreso,
      },
    } as Stripe.Checkout.SessionCreateParams;

    const stripeClient = hasConnectAccount
      ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
          stripeAccount: cliente.stripe_account_id,
        })
      : stripe;

    const session = await stripeClient.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
