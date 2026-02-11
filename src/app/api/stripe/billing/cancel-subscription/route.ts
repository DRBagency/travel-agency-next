import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST() {
  try {
    await requireValidApiDomain();
  } catch {
    return NextResponse.json({}, { status: 403 });
  }

  const client = await getClientByDomain();
  if (!client) {
    return NextResponse.json(
      { error: "Cliente no encontrado" },
      { status: 404 }
    );
  }

  if (!client.stripe_subscription_id) {
    return NextResponse.json(
      { error: "No hay suscripción activa" },
      { status: 400 }
    );
  }

  try {
    await stripe.subscriptions.update(client.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    console.log(
      `✅ [Cancel Subscription] Subscription marked for cancellation: ${client.stripe_subscription_id} for cliente: ${client.id}`
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ [Cancel Subscription] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
