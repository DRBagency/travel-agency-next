import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { renderEmail } from "@/lib/emails/render-email";
import { getPlatformSettings } from "@/lib/billing/settings";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const ownerId = cookieStore.get("owner_id")?.value;
  if (!ownerId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const settings = await getPlatformSettings();

  const body = await req.json();
  const { html_body, cta_text, cta_url } = body;

  const sampleTokens: Record<string, string> = {
    clientName: "Viajes Ejemplo S.L.",
    planName: "Grow",
    price: "59 EUR/mes",
    billingPeriod: "mensual",
    oldPlan: "Start",
    newPlan: "Grow",
    oldPlanName: "Start (29 EUR/mes)",
    newPlanName: "Grow (59 EUR/mes)",
    newPrice: "59 EUR/mes",
    newCommission: "3%",
    changeDate: "17 de febrero de 2026",
    cancelDate: "17 de febrero de 2026",
    cancellationDate: "17 de febrero de 2026",
    endDate: "17 de marzo de 2026",
    adminUrl: "https://example.com/admin",
    supportEmail: settings?.billing_email_from || "soporte@drb.agency",
  };

  const html = renderEmail({
    htmlBody: html_body || "<p>Sin contenido</p>",
    ctaText: cta_text || null,
    ctaUrl: cta_url || null,
    tokens: sampleTokens,
    branding: {
      clientName: "DRB Agency",
      logoUrl: settings?.billing_logo_url,
      primaryColor: "#0ea5e9",
      contactEmail: settings?.billing_email_from,
      contactPhone: null,
    },
  });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
