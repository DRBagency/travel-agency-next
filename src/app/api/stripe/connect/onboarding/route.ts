import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
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

    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const accountLink = await stripe.accountLinks.create({
      account: client.stripe_account_id,
      refresh_url: `${baseUrl}/admin/stripe`,
      return_url: `${baseUrl}/admin/stripe`,
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
