import { resend } from "@/lib/email";
import { renderEmail } from "@/lib/emails/render-email";

const translations: Record<string, Record<string, string>> = {
  es: {
    subject: "Nuevo mensaje de tu agencia",
    greeting: "Hola",
    body: "Tu agencia de viajes te ha enviado un mensaje:",
    cta: "Ver en el portal",
    footer: "Puedes responder directamente desde tu portal de viajero.",
  },
  en: {
    subject: "New message from your agency",
    greeting: "Hello",
    body: "Your travel agency has sent you a message:",
    cta: "View in portal",
    footer: "You can reply directly from your traveler portal.",
  },
  ar: {
    subject: "رسالة جديدة من وكالتك",
    greeting: "مرحبا",
    body: "أرسلت لك وكالة السفر رسالة:",
    cta: "عرض في البوابة",
    footer: "يمكنك الرد مباشرة من بوابة المسافر الخاصة بك.",
  },
};

interface SendPortalMessageEmailParams {
  toEmail: string;
  messageText: string;
  destinoName: string;
  portalUrl: string;
  clientName: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  lang?: string;
}

export async function sendPortalMessageEmail({
  toEmail,
  messageText,
  destinoName,
  portalUrl,
  clientName,
  logoUrl,
  primaryColor,
  contactEmail,
  contactPhone,
  lang = "es",
}: SendPortalMessageEmailParams) {
  const t = translations[lang] || translations.es;

  const truncated =
    messageText.length > 500 ? messageText.slice(0, 500) + "…" : messageText;

  const htmlBody = `
    <p style="font-size:16px;margin-bottom:8px;">${t.greeting},</p>
    <p style="font-size:14px;color:#475569;line-height:1.6;margin-bottom:16px;">${t.body}</p>
    <div style="background:#f1f5f9;border-radius:10px;padding:16px;margin-bottom:16px;border-left:4px solid ${primaryColor || "#0ea5e9"};">
      <p style="font-size:14px;color:#1e293b;line-height:1.6;margin:0;white-space:pre-line;">{{messageText}}</p>
    </div>
    <p style="font-size:13px;color:#64748b;margin-bottom:4px;"><strong>${destinoName}</strong></p>
    <p style="font-size:12px;color:#94a3b8;margin-top:20px;">${t.footer}</p>
  `;

  const emailHtml = renderEmail({
    htmlBody,
    ctaText: t.cta,
    ctaUrl: portalUrl,
    tokens: { messageText: truncated },
    branding: {
      clientName,
      logoUrl,
      primaryColor,
      contactEmail,
      contactPhone,
    },
  });

  const fromEmail = process.env.EMAIL_FROM || "contact@drb.agency";

  const { data, error } = await resend.emails.send({
    from: `${clientName} <${fromEmail}>`,
    to: toEmail,
    subject: `${t.subject} — ${clientName}`,
    html: emailHtml,
    ...(contactEmail ? { replyTo: contactEmail } : {}),
  });

  if (error) {
    console.error("Error sending portal message email:", error);
    return { success: false, error: error.message };
  }

  return { success: true, emailId: data?.id };
}
