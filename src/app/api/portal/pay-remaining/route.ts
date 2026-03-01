import Stripe from "stripe";
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  try {
    // Validate traveler session
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("traveler_session")?.value;
    const email = cookieStore.get("traveler_email")?.value;

    if (!sessionId || !email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data: session } = await supabaseAdmin
      .from("traveler_sessions")
      .select("email, cliente_id")
      .eq("id", sessionId)
      .single();

    if (!session || session.email !== email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const reservaId = body.reserva_id;

    if (!reservaId) {
      return NextResponse.json({ error: "reserva_id requerido" }, { status: 400 });
    }

    // Fetch reserva and verify ownership
    const { data: reserva } = await supabaseAdmin
      .from("reservas")
      .select("*")
      .eq("id", reservaId)
      .eq("email", email)
      .eq("cliente_id", session.cliente_id)
      .single();

    if (!reserva) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    if (reserva.booking_model !== "deposito_resto") {
      return NextResponse.json({ error: "Modelo incorrecto" }, { status: 400 });
    }

    if (reserva.remaining_paid) {
      return NextResponse.json({ error: "Ya está pagado" }, { status: 400 });
    }

    const remainingAmount = Number(reserva.remaining_amount);
    if (!remainingAmount || remainingAmount <= 0) {
      return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
    }

    // Fetch client for Stripe config
    const { data: cliente } = await supabaseAdmin
      .from("clientes")
      .select("stripe_account_id, stripe_charges_enabled, commission_rate, stripe_subscription_id")
      .eq("id", session.cliente_id)
      .single();

    if (!cliente?.stripe_subscription_id) {
      return NextResponse.json({ error: "Suscripción inactiva" }, { status: 403 });
    }

    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const unitAmount = Math.round(remainingAmount * 100);

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${reserva.destino} — Pago restante`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/portal/reserva/${reservaId}?paid=true`,
      cancel_url: `${baseUrl}/portal/reserva/${reservaId}`,
      metadata: {
        reserva_id: reservaId,
        cliente_id: session.cliente_id,
        is_remaining_payment: "true",
      },
    };

    const hasConnectAccount = Boolean(cliente.stripe_account_id);
    if (hasConnectAccount && cliente.stripe_charges_enabled === true) {
      const applicationFeeAmount = Math.round(
        remainingAmount * Number(cliente.commission_rate || 0)
      );
      sessionParams.payment_intent_data = {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: cliente.stripe_account_id!,
        },
      };
    }

    const checkoutSession = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Error in pay-remaining:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
