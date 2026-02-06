import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
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
