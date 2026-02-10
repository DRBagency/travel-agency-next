import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";
import { supabaseAdmin } from "@/lib/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const PRICE_BY_PLAN: Record<string, string | undefined> = {
  start: process.env.STRIPE_PRICE_START,
  grow: process.env.STRIPE_PRICE_GROW,
  pro: process.env.STRIPE_PRICE_PRO,
};

export async function POST() {
  try {
    await requireValidApiDomain();
  } catch {
    return NextResponse.json({}, { status: 403 });
  }

  const client = await getClientByDomain();
  if (!client) {
    return NextResponse.json({}, { status: 404 });
  }

  const plan = (client.plan || "").toString().toLowerCase();
  const priceId = PRICE_BY_PLAN[plan];

  if (!priceId) {
    return NextResponse.json({}, { status: 400 });
  }

  // Create or reuse Stripe customer
  let customerId = client.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: client.email,
      name: client.nombre,
      metadata: { cliente_id: client.id },
    });
    customerId = customer.id;
    console.log(`✅ [Create Subscription] Stripe customer created: ${customerId} for cliente: ${client.id}`);

    // Save stripe_customer_id to DB
    const { error: updateError } = await supabaseAdmin
      .from("clientes")
      .update({ stripe_customer_id: customerId })
      .eq("id", client.id);

    if (updateError) {
      console.error(`❌ [Create Subscription] Failed to save stripe_customer_id:`, updateError);
    }
  } else {
    console.log(`ℹ️ [Create Subscription] Reusing existing Stripe customer: ${customerId}`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/stripe`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/stripe`,
    metadata: {
      cliente_id: client.id,
      plan,
    },
  });

  return NextResponse.json({ url: session.url });
}
