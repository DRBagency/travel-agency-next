import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function GET() {
  try {
    await requireValidApiDomain();
  } catch {
    return NextResponse.json({}, { status: 403 });
  }

  const client = await requireAdminClient();

  const host = (await headers()).get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const rawBase = `${protocol}://${host}`;

  let stripeAccountId = client.stripe_account_id;

  if (!stripeAccountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "ES",
      email: client.contact_email || undefined,
      business_type: "company",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    stripeAccountId = account.id;

    await supabaseAdmin
      .from("clientes")
      .update({ stripe_account_id: stripeAccountId })
      .eq("id", client.id);
  }

  const baseUrl = rawBase.startsWith("http")
    ? rawBase
    : `https://${rawBase}`;

  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${baseUrl}/admin/stripe`,
    return_url: `${baseUrl}/admin/stripe`,
    type: "account_onboarding",
  });

  return NextResponse.redirect(accountLink.url);
}
