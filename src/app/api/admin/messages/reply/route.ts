import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { resend } from "@/lib/email";
import { renderEmail } from "@/lib/emails/render-email";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;
  if (!clienteId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messageId, replyText } = await req.json();

  if (!messageId || !replyText?.trim()) {
    return NextResponse.json(
      { error: "Missing messageId or replyText" },
      { status: 400 }
    );
  }

  // Fetch the original message
  const { data: msg, error: msgError } = await supabaseAdmin
    .from("contact_messages")
    .select("id, sender_name, sender_email, message")
    .eq("id", messageId)
    .eq("cliente_id", clienteId)
    .single();

  if (msgError || !msg) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  // Fetch client info for branding
  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("nombre, logo_url, primary_color, contact_email, contact_phone")
    .eq("id", clienteId)
    .single();

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const fromAddress = process.env.EMAIL_FROM || "contact@drb.agency";
  const replyToEmail = client.contact_email || fromAddress;
  const fromName = client.nombre || "Agencia";

  // Build email HTML
  const replyHtml = `
    <p style="font-size:15px;line-height:1.7;color:#0f172a;margin:0 0 16px;">
      ${replyText.trim().replace(/\n/g, "<br/>")}
    </p>
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;">
      <p style="font-size:12px;color:#94a3b8;margin:0 0 6px;">Mensaje original de ${msg.sender_name}:</p>
      <p style="font-size:13px;color:#64748b;margin:0;font-style:italic;">
        ${msg.message.slice(0, 500).replace(/\n/g, "<br/>")}
      </p>
    </div>
  `;

  const html = renderEmail({
    htmlBody: replyHtml,
    branding: {
      clientName: client.nombre,
      logoUrl: client.logo_url,
      primaryColor: client.primary_color,
      contactEmail: client.contact_email,
      contactPhone: client.contact_phone,
    },
  });

  // Send email via Resend
  const { data: emailData, error: emailError } = await resend.emails.send({
    from: `${fromName} <${fromAddress}>`,
    to: msg.sender_email,
    replyTo: replyToEmail,
    subject: `Re: Mensaje de ${msg.sender_name}`,
    html,
  });

  if (emailError) {
    console.error("Resend error:", emailError);
    return NextResponse.json(
      { error: emailError.message || "Failed to send email" },
      { status: 500 }
    );
  }

  // Update message as replied
  await supabaseAdmin
    .from("contact_messages")
    .update({
      replied: true,
      reply_message: replyText.trim().slice(0, 5000),
      replied_at: new Date().toISOString(),
      read: true,
    })
    .eq("id", messageId)
    .eq("cliente_id", clienteId);

  return NextResponse.json({ success: true });
}
