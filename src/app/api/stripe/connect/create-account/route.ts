import Stripe from "stripe";
import { NextResponse } from "next/server";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";
import { requireAdminClient } from "@/lib/requireAdminClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
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

    if (client.stripe_account_id) {
      return NextResponse.json({
        stripe_account_id: client.stripe_account_id,
      });
    }

    const account = await stripe.accounts.create({
      type: "express",
      country: "ES",
      business_type: "company",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/stripe`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/stripe`,
      type: "account_onboarding",
    });

    return NextResponse.json({
      url: accountLink.url,
      stripe_account_id: account.id,
    });
  } catch (error: any) {
    console.error("Stripe create account error:", error?.message || error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
