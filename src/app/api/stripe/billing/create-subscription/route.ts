import Stripe from "stripe";
import { NextResponse } from "next/server";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { supabaseAdmin } from "@/lib/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const PRICE_BY_PLAN: Record<string, string | undefined> = {
  start: process.env.STRIPE_PRICE_START,
  grow: process.env.STRIPE_PRICE_GROW,
  pro: process.env.STRIPE_PRICE_PRO,
};

export async function POST(request: Request) {
  try {
    await requireValidApiDomain();
  } catch {
    return NextResponse.json({}, { status: 403 });
  }

  let client;
  try {
    client = await requireAdminClient();
  } catch {
    return NextResponse.json({}, { status: 401 });
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
      return NextResponse.json(
        { error: "Failed to save customer ID" },
        { status: 500 }
      );
    }

    console.log(`✅ [Create Subscription] Saved stripe_customer_id: ${customerId} for cliente: ${client.id}`);
  } else {
    console.log(`ℹ️ [Create Subscription] Reusing existing Stripe customer: ${customerId}`);
  }

  // Support returnTo param for onboarding flow
  let returnTo = "/admin/stripe";
  try {
    const body = await request.json().catch(() => ({}));
    if (body.returnTo && typeof body.returnTo === "string" && body.returnTo.startsWith("/admin/")) {
      returnTo = body.returnTo;
    }
  } catch {}

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}${returnTo}?stripe_success=1`,
    cancel_url: `${baseUrl}${returnTo}?stripe_cancelled=1`,
    metadata: {
      cliente_id: client.id,
      plan,
    },
  });

  return NextResponse.json({ url: session.url });
}
