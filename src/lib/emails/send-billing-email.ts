import { resend } from "@/lib/email";
import { renderEmail } from "@/lib/emails/render-email";
import {
  getPlatformSettings,
  getBillingTemplate,
  type BillingTemplateType,
} from "@/lib/billing/settings";

// ============================================================================
// TYPES
// ============================================================================

interface BillingEmailData {
  clientName: string;
  planName?: string;
  price?: string;
  billingPeriod?: string; // "mensual", "anual"
  oldPlan?: string;
  newPlan?: string;
  newPrice?: string;
  oldPlanName?: string;
  newPlanName?: string;
  newCommission?: string;
  changeDate?: string;
  cancelDate?: string;
  cancellationDate?: string;
  endDate?: string;
  adminUrl?: string;
  supportEmail?: string;
}

interface SendBillingEmailParams {
  tipo: BillingTemplateType;
  toEmail: string;
  toName: string;
  data: BillingEmailData;
}

interface SendBillingEmailResult {
  success: boolean;
  error?: string;
  emailId?: string;
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Envía un email de billing (bienvenida, cambio de plan, cancelación).
 * Usa la configuración global de platform_settings y el template correspondiente.
 */
export async function sendBillingEmail({
  tipo,
  toEmail,
  toName,
  data,
}: SendBillingEmailParams): Promise<SendBillingEmailResult> {
  try {
    console.log(`📧 [Billing Email] Starting to send ${tipo} email to ${toEmail}`);

    // ========================================
    // 1. Obtener configuración global
    // ========================================
    const platformSettings = await getPlatformSettings();

    if (!platformSettings) {
      console.error("❌ [Billing Email] Platform settings not found");
      return {
        success: false,
        error: "Platform settings not configured. Please configure in /owner/emails",
      };
    }

    console.log("✅ [Billing Email] Platform settings loaded");

    // ========================================
    // 2. Obtener template específico
    // ========================================
    const template = await getBillingTemplate(tipo);

    if (!template) {
      console.warn(
        `⚠️ [Billing Email] Template ${tipo} not found or inactive. Skipping email.`
      );
      return {
        success: false,
        error: `Template ${tipo} is not active or does not exist`,
      };
    }

    if (!template.subject || !template.html_body) {
      console.error(
        `❌ [Billing Email] Template ${tipo} is missing subject or html_body`
      );
      return {
        success: false,
        error: `Template ${tipo} is incomplete (missing subject or body)`,
      };
    }

    console.log(`✅ [Billing Email] Template ${tipo} loaded`);

    // ========================================
    // 3. Preparar tokens dinámicos
    // ========================================
    const adminUrl =
      data.adminUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/admin`;

    const tokens: Record<string, string | number | null | undefined> = {
      clientName: data.clientName,
      planName: data.planName,
      price: data.price,
      billingPeriod: data.billingPeriod,
      oldPlan: data.oldPlan,
      newPlan: data.newPlan,
      newPrice: data.newPrice,
      oldPlanName: data.oldPlanName,
      newPlanName: data.newPlanName,
      newCommission: data.newCommission,
      changeDate: data.changeDate,
      cancelDate: data.cancelDate,
      cancellationDate: data.cancellationDate,
      endDate: data.endDate,
      adminUrl,
      supportEmail: data.supportEmail || platformSettings.billing_email_from,
    };

    // ========================================
    // 4. Renderizar email con branding de plataforma
    // ========================================
    const emailHtml = renderEmail({
      htmlBody: template.html_body,
      ctaText: template.cta_text,
      ctaUrl: template.cta_url,
      tokens,
      branding: {
        clientName: "DRB Agency", // Nombre fijo de la plataforma
        logoUrl: platformSettings.billing_logo_url,
        primaryColor: "#0ea5e9", // Color del SaaS (azul sky)
        contactEmail: platformSettings.billing_email_from,
        contactPhone: null,
      },
    });

    // ========================================
    // 5. Enviar con Resend
    // ========================================
    const fromEmail = platformSettings.billing_email_from || process.env.EMAIL_FROM!;

    console.log(`📤 [Billing Email] Sending email from ${fromEmail} to ${toEmail}`);

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: template.subject,
      html: emailHtml,
    });

    if (resendError) {
      console.error("❌ [Billing Email] Resend error:", resendError);
      return {
        success: false,
        error: resendError.message || "Failed to send email via Resend",
      };
    }

    console.log(
      `✅ [Billing Email] Email sent successfully! ID: ${resendData?.id}`
    );

    return {
      success: true,
      emailId: resendData?.id,
    };
  } catch (error: any) {
    console.error("❌ [Billing Email] Exception:", error);
    return {
      success: false,
      error: error?.message || "Unknown error occurred",
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS (OPTIONAL - para casos específicos)
// ============================================================================

/**
 * Envía email de bienvenida cuando un cliente activa su suscripción.
 */
export async function sendWelcomeEmail(params: {
  toEmail: string;
  toName: string;
  planName: string;
  price?: string;
  adminUrl?: string;
}) {
  return sendBillingEmail({
    tipo: "bienvenida",
    toEmail: params.toEmail,
    toName: params.toName,
    data: {
      clientName: params.toName,
      planName: params.planName,
      price: params.price,
      billingPeriod: "mensual",
      adminUrl: params.adminUrl,
    },
  });
}

/**
 * Envía email de cambio de plan.
 */
export async function sendPlanChangeEmail(params: {
  toEmail: string;
  toName: string;
  oldPlan: string;
  newPlan: string;
  newPrice?: string;
  newCommission?: string;
  adminUrl?: string;
}) {
  return sendBillingEmail({
    tipo: "cambio_plan",
    toEmail: params.toEmail,
    toName: params.toName,
    data: {
      clientName: params.toName,
      oldPlanName: params.oldPlan,
      newPlanName: params.newPlan,
      newPrice: params.newPrice,
      newCommission: params.newCommission,
      changeDate: new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      adminUrl: params.adminUrl,
    },
  });
}

/**
 * Envía email de cancelación de suscripción.
 */
export async function sendCancellationEmail(params: {
  toEmail: string;
  toName: string;
  planName: string;
  endDate?: string;
  supportEmail?: string;
}) {
  return sendBillingEmail({
    tipo: "cancelacion",
    toEmail: params.toEmail,
    toName: params.toName,
    data: {
      clientName: params.toName,
      planName: params.planName,
      cancellationDate: new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      endDate: params.endDate,
      supportEmail: params.supportEmail,
    },
  });
}
