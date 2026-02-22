import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";
import { requireAdminClient } from "@/lib/requireAdminClient";
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

  try {
    if (process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")) {
      console.error("Stripe secret key is not live");
      return NextResponse.json(
        { error: "Stripe no configurado en modo live" },
        { status: 500 }
      );
    }

    const client = await requireAdminClient();

    let stripeAccountId = client.stripe_account_id;

    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "ES",
        business_type: "company",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      stripeAccountId = account.id;
    }

    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${baseUrl}/admin/stripe`,
      return_url: `${baseUrl}/admin/stripe`,
      type: "account_onboarding",
    });

    if (!client.stripe_account_id) {
      await supabaseAdmin
        .from("clientes")
        .update({ stripe_account_id: stripeAccountId })
        .eq("id", client.id);
    }

    return NextResponse.json({
      url: accountLink.url,
      stripe_account_id: stripeAccountId,
    });
  } catch (error: any) {
    console.error("Stripe create account error:", error?.message || error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
