import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getClientByDomain, normalizeHost } from "@/lib/getClientByDomain";
import { sendMagicLinkEmail } from "@/lib/emails/send-magic-link-email";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    // Resolve agency
    let client: any;
    try {
      client = await getClientByDomain();
    } catch {
      if (body.clienteId) {
        const { data } = await supabaseAdmin
          .from("clientes")
          .select("*")
          .eq("id", body.clienteId)
          .eq("activo", true)
          .single();
        client = data;
      }
    }

    if (!client) {
      return NextResponse.json({ error: "Agencia no encontrada" }, { status: 404 });
    }

    // Check if email has at least 1 reserva with this agency
    const { count } = await supabaseAdmin
      .from("reservas")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .eq("cliente_id", client.id);

    if (!count || count === 0) {
      return NextResponse.json({ error: "no_reservations" }, { status: 404 });
    }

    // Rate limit: max 5 tokens per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentCount } = await supabaseAdmin
      .from("traveler_sessions")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .eq("cliente_id", client.id)
      .gte("created_at", oneHourAgo);

    if (recentCount && recentCount >= 5) {
      return NextResponse.json({ error: "rate_limit" }, { status: 429 });
    }

    // Generate token and session
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

    await supabaseAdmin.from("traveler_sessions").insert({
      email,
      token,
      cliente_id: client.id,
      expires_at: expiresAt,
    });

    // Build magic link URL
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const magicLinkUrl = `${protocol}://${host}/api/portal/auth/verify?token=${token}`;

    // Detect lang
    const lang = client.preferred_language || "es";

    // Send email
    const result = await sendMagicLinkEmail({
      toEmail: email,
      magicLinkUrl,
      clientName: client.nombre,
      logoUrl: client.logo_url,
      primaryColor: client.primary_color,
      contactEmail: client.contact_email,
      contactPhone: client.contact_phone,
      lang,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Error enviando email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in send-link:", error);
    return NextResponse.json(
      { error: error.message || "Error interno" },
      { status: 500 }
    );
  }
}
