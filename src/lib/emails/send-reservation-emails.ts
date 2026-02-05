import { resend } from "@/lib/email";
import { renderEmail } from "@/lib/emails/render-email";

interface ReservationData {
  customerName: string | null;
  email: string | null;
  destination: string | null;
  persons: number;
  total: number | null;
  departureDate: string | null;
  returnDate: string | null;
  adminUrl?: string | null;
}

interface BrandingData {
  clientName: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
}

interface TemplateRow {
  tipo: string;
  subject: string | null;
  html_body: string | null;
  cta_text: string | null;
  cta_url: string | null;
  activo: boolean | null;
}

interface EmailTemplates {
  reserva_cliente?: TemplateRow | null;
  reserva_agencia?: TemplateRow | null;
}

export async function sendReservationEmails(
  data: ReservationData,
  branding: BrandingData,
  templates: EmailTemplates
) {
  const from = process.env.EMAIL_FROM!;
  const tokens = {
    customerName: data.customerName,
    destination: data.destination,
    persons: data.persons,
    total: data.total,
    departureDate: data.departureDate,
    returnDate: data.returnDate,
    adminUrl: data.adminUrl,
  };

  const clientTemplate = templates.reserva_cliente;
  if (
    clientTemplate?.activo &&
    data.email &&
    clientTemplate.html_body &&
    clientTemplate.subject
  ) {
    const ctaUrl =
      clientTemplate.cta_url ||
      (branding.contactEmail ? `mailto:${branding.contactEmail}` : null);

    await resend.emails.send({
      from,
      to: data.email,
      subject: clientTemplate.subject,
      html: renderEmail({
        htmlBody: clientTemplate.html_body,
        ctaText: clientTemplate.cta_text,
        ctaUrl,
        tokens,
        branding,
      }),
    });
  }

  const agencyTemplate = templates.reserva_agencia;
  const agencyEmail =
    branding.contactEmail || process.env.EMAIL_ADMIN || null;

  if (
    agencyTemplate?.activo &&
    agencyEmail &&
    agencyTemplate.html_body &&
    agencyTemplate.subject
  ) {
    const ctaUrl = agencyTemplate.cta_url || data.adminUrl || null;

    await resend.emails.send({
      from,
      to: agencyEmail,
      subject: agencyTemplate.subject,
      html: renderEmail({
        htmlBody: agencyTemplate.html_body,
        ctaText: agencyTemplate.cta_text,
        ctaUrl,
        tokens,
        branding,
      }),
    });
  }
}
