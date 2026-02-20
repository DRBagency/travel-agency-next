import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendTemplateEmail } from "@/lib/emails/send-template-email";

export async function POST() {
  const clienteId = (await cookies()).get("cliente_id")?.value;
  if (!clienteId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get client branding
  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("nombre, logo_url, primary_color, contact_email, contact_phone")
    .eq("id", clienteId)
    .single();

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  // Get promocion template
  const { data: tpl } = await supabaseAdmin
    .from("email_templates")
    .select("subject, html_body, cta_text, cta_url, activo")
    .eq("cliente_id", clienteId)
    .eq("tipo", "promocion")
    .eq("activo", true)
    .single();

  if (!tpl || !tpl.html_body || !tpl.subject) {
    return NextResponse.json(
      { error: "Template not found or inactive" },
      { status: 400 }
    );
  }

  // Get unique customer emails from past bookings
  const { data: reservas } = await supabaseAdmin
    .from("reservas")
    .select("nombre, email")
    .eq("cliente_id", clienteId)
    .eq("estado_pago", "pagado")
    .not("email", "is", null);

  if (!reservas || reservas.length === 0) {
    return NextResponse.json({ sent: 0, error: "No customers found" });
  }

  // Deduplicate by email
  const uniqueCustomers = new Map<string, string>();
  for (const r of reservas) {
    if (r.email && !uniqueCustomers.has(r.email)) {
      uniqueCustomers.set(r.email, r.nombre || "");
    }
  }

  const branding = {
    clientName: client.nombre,
    logoUrl: client.logo_url,
    primaryColor: client.primary_color,
    contactEmail: client.contact_email,
    contactPhone: client.contact_phone,
  };

  let sent = 0;
  let errors = 0;

  for (const [email, nombre] of uniqueCustomers) {
    try {
      const ok = await sendTemplateEmail({
        template: tpl,
        to: email,
        tokens: {
          customerName: nombre,
          clientName: client.nombre,
          contactEmail: client.contact_email,
          contactPhone: client.contact_phone,
        },
        branding,
      });
      if (ok) sent++;
    } catch {
      errors++;
    }
  }

  return NextResponse.json({ sent, errors, total: uniqueCustomers.size });
}
