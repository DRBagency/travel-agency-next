import { resend } from "@/lib/email";
import { renderEmail } from "@/lib/emails/render-email";

const translations: Record<string, Record<string, string>> = {
  es: {
    subject: "Tu enlace de acceso al portal",
    greeting: "Hola",
    body: "Has solicitado acceder a tu portal de viajero. Haz clic en el siguiente enlace para iniciar sesión:",
    cta: "Acceder al portal",
    expiry: "Este enlace expira en 15 minutos y solo puede usarse una vez.",
    ignore: "Si no has solicitado este enlace, puedes ignorar este email.",
  },
  en: {
    subject: "Your portal access link",
    greeting: "Hello",
    body: "You have requested access to your traveler portal. Click the link below to sign in:",
    cta: "Access portal",
    expiry: "This link expires in 15 minutes and can only be used once.",
    ignore: "If you did not request this link, you can ignore this email.",
  },
  ar: {
    subject: "رابط الوصول إلى البوابة",
    greeting: "مرحبا",
    body: "لقد طلبت الوصول إلى بوابة المسافر الخاصة بك. انقر على الرابط أدناه لتسجيل الدخول:",
    cta: "الوصول إلى البوابة",
    expiry: "تنتهي صلاحية هذا الرابط خلال 15 دقيقة ولا يمكن استخدامه إلا مرة واحدة.",
    ignore: "إذا لم تطلب هذا الرابط، يمكنك تجاهل هذا البريد الإلكتروني.",
  },
};

interface SendMagicLinkEmailParams {
  toEmail: string;
  magicLinkUrl: string;
  clientName: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  lang?: string;
}

export async function sendMagicLinkEmail({
  toEmail,
  magicLinkUrl,
  clientName,
  logoUrl,
  primaryColor,
  contactEmail,
  contactPhone,
  lang = "es",
}: SendMagicLinkEmailParams) {
  const t = translations[lang] || translations.es;

  const htmlBody = `
    <p style="font-size:16px;margin-bottom:8px;">${t.greeting},</p>
    <p style="font-size:14px;color:#475569;line-height:1.6;margin-bottom:20px;">${t.body}</p>
    <p style="font-size:12px;color:#94a3b8;margin-top:24px;">${t.expiry}</p>
    <p style="font-size:12px;color:#94a3b8;">${t.ignore}</p>
  `;

  const emailHtml = renderEmail({
    htmlBody,
    ctaText: t.cta,
    ctaUrl: magicLinkUrl,
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
    from: fromEmail,
    to: toEmail,
    subject: `${t.subject} — ${clientName}`,
    html: emailHtml,
  });

  if (error) {
    console.error("Error sending magic link email:", error);
    return { success: false, error: error.message };
  }

  return { success: true, emailId: data?.id };
}
