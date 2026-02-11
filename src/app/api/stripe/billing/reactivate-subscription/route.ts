import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";
import { supabaseAdmin } from "@/lib/supabase-server";

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
      cancel_at_period_end: false,
    });

    // Limpiar fecha de cancelación
    const { error: updateError } = await supabaseAdmin
      .from("clientes")
      .update({ subscription_cancel_at: null })
      .eq("id", client.id);

    if (updateError) {
      console.error(
        "❌ [Reactivate Subscription] Failed to clear subscription_cancel_at:",
        updateError
      );
    }

    console.log(
      `✅ [Reactivate Subscription] Subscription reactivated: ${client.stripe_subscription_id} for cliente: ${client.id}`
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ [Reactivate Subscription] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
