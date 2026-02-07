import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_BY_PLAN: Record<string, string | undefined> = {
  start: process.env.STRIPE_PRICE_START,
  grow: process.env.STRIPE_PRICE_GROW,
  pro: process.env.STRIPE_PRICE_PRO,
};

const COMMISSION_BY_PLAN: Record<string, number> = {
  start: 0.05,
  grow: 0.03,
  pro: 0.01,
};

export async function POST(req: Request) {
  try {
    await requireValidApiDomain();
  } catch {
    return NextResponse.json({}, { status: 403 });
  }

  const client = await getClientByDomain();
  if (!client) {
    return NextResponse.json({}, { status: 404 });
  }

  const body = await req.json();
  const plan = (body?.plan || "").toString().toLowerCase();
  const priceId = PRICE_BY_PLAN[plan];

  if (!priceId) {
    return NextResponse.json({}, { status: 400 });
  }

  if (!client.stripe_subscription_id) {
    return NextResponse.json({}, { status: 400 });
  }

  const subscription = await stripe.subscriptions.retrieve(
    client.stripe_subscription_id
  );

  const item = subscription.items.data[0];
  if (!item) {
    return NextResponse.json({}, { status: 400 });
  }

  await stripe.subscriptions.update(client.stripe_subscription_id, {
    items: [{ id: item.id, price: priceId }],
    proration_behavior: "create_prorations",
  });

  await supabaseAdmin
    .from("clientes")
    .update({
      plan,
      commission_rate: COMMISSION_BY_PLAN[plan],
    })
    .eq("id", client.id);

  return NextResponse.json({ ok: true });
}
