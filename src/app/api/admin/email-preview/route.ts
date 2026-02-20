import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { renderEmail } from "@/lib/emails/render-email";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;
  if (!clienteId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("nombre, primary_color, logo_url, contact_email, contact_phone")
    .eq("id", clienteId)
    .single();

  if (!client) {
    return new NextResponse("Client not found", { status: 404 });
  }

  const body = await req.json();
  const { html_body, cta_text, cta_url } = body;

  const sampleTokens: Record<string, string> = {
    customerName: "Juan Garcia",
    destination: "Bali - 7 noches",
    persons: "2",
    total: "1.499,00 EUR",
    departureDate: "15/03/2026",
    returnDate: "22/03/2026",
    adminUrl: "https://example.com/admin",
    contactEmail: client.contact_email || "info@agencia.com",
    contactPhone: client.contact_phone || "+34 600 000 000",
    clientName: client.nombre || "Mi Agencia",
    primaryColor: client.primary_color || "#1CABB0",
  };

  const html = renderEmail({
    htmlBody: html_body || "<p>Sin contenido</p>",
    ctaText: cta_text || null,
    ctaUrl: cta_url || null,
    tokens: sampleTokens,
    branding: {
      clientName: client.nombre,
      logoUrl: client.logo_url,
      primaryColor: client.primary_color,
      contactEmail: client.contact_email,
      contactPhone: client.contact_phone,
    },
  });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
