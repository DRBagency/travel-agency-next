import Stripe from "stripe";
import { NextResponse } from "next/server";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  try {
    await requireValidApiDomain();
  } catch {
    return NextResponse.json({}, { status: 403 });
  }

  try {
    const account = await stripe.accounts.create({
      type: "express",
      country: "ES",
      email: "agencia-demo@ejemplo.com",
      business_type: "company",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    return NextResponse.json({
      stripe_account_id: account.id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
