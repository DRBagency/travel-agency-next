import { resend } from "@/lib/email";
import { renderEmail } from "@/lib/emails/render-email";

interface BrandingData {
  clientName: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
}

interface TemplateRow {
  subject: string | null;
  html_body: string | null;
  cta_text: string | null;
  cta_url: string | null;
  activo: boolean | null;
}

/**
 * Send a single template-based email to a recipient.
 * Returns true if sent, false if skipped (inactive/missing fields).
 */
export async function sendTemplateEmail({
  template,
  to,
  tokens,
  branding,
}: {
  template: TemplateRow | null | undefined;
  to: string;
  tokens: Record<string, string | number | null | undefined>;
  branding: BrandingData;
}): Promise<boolean> {
  if (!template?.activo || !template.html_body || !template.subject || !to) {
    return false;
  }

  const from = process.env.EMAIL_FROM!;

  await resend.emails.send({
    from,
    to,
    subject: template.subject,
    html: renderEmail({
      htmlBody: template.html_body,
      ctaText: template.cta_text,
      ctaUrl: template.cta_url,
      tokens,
      branding,
    }),
  });

  return true;
}
