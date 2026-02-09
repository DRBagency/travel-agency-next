import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getClientByDomain } from "@/lib/getClientByDomain";
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

  try {
    const client = await getClientByDomain();

    if (!client || !client.stripe_account_id) {
      return NextResponse.json(
        { error: "Cliente sin Stripe Connect" },
        { status: 400 }
      );
    }

    const accountLink = await stripe.accountLinks.create({
      account: client.stripe_account_id,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/stripe`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/stripe`,
      type: "account_onboarding",
    });

    return NextResponse.redirect(accountLink.url);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
