import { getTranslations } from 'next-intl/server';
import { revalidatePath } from "next/cache";
import {
  getPlatformSettings,
  updatePlatformSettings,
  getAllBillingTemplates,
  updateBillingTemplate,
  type BillingTemplateType,
} from "@/lib/billing/settings";
import EmailPreviewButton from "@/components/admin/EmailPreviewButton";

// ============================================================================
// SERVER ACTIONS
// ============================================================================

async function updatePlatformSettingsAction(formData: FormData) {
  "use server";

  const data = {
    billing_logo_url: (formData.get("billing_logo_url") as string) || null,
    billing_email_from: (formData.get("billing_email_from") as string) || null,
    billing_footer_text: (formData.get("billing_footer_text") as string) || null,
  };

  await updatePlatformSettings(data);
  revalidatePath("/owner/emails");
}

async function updateBillingTemplateAction(formData: FormData) {
  "use server";

  const tipo = formData.get("tipo") as BillingTemplateType;

  const data = {
    subject: (formData.get("subject") as string) || null,
    html_body: (formData.get("html_body") as string) || null,
    cta_text: (formData.get("cta_text") as string) || null,
    cta_url: (formData.get("cta_url") as string) || null,
    activo: formData.get("activo") === "on",
  };

  await updateBillingTemplate(tipo, data);
  revalidatePath("/owner/emails");
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function OwnerEmailsPage() {
  const t = await getTranslations('owner.emails');
  const tc = await getTranslations('common');
  const settings = await getPlatformSettings();
  const templates = await getAllBillingTemplates();

  const templatesByType = templates.reduce(
    (acc, tmpl) => {
      acc[tmpl.tipo] = tmpl;
      return acc;
    },
    {} as Record<string, any>
  );

  const templateTypes = [
    {
      tipo: "bienvenida" as const,
      label: `🎉 ${t('welcome')}`,
      description: t('welcomeDesc'),
    },
    {
      tipo: "cambio_plan" as const,
      label: `🔄 ${t('planChange')}`,
      description: t('planChangeDesc'),
    },
    {
      tipo: "cancelacion" as const,
      label: `😢 ${t('cancellation')}`,
      description: t('cancellationDesc'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* ====================================
          HEADER
      ==================================== */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-gray-500 dark:text-white/60">
          {t('subtitle')}
        </p>
      </div>

      {/* ====================================
          SECCIÓN 1: CONFIGURACIÓN GLOBAL
      ==================================== */}
      <div className="panel-card p-6">
        <h2 className="text-xl font-semibold mb-4">
          {t('globalConfig')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-white/60 mb-6">
          {t('globalConfigDesc')}
        </p>

        <form action={updatePlatformSettingsAction} className="space-y-4">
          <div>
            <label className="panel-label block mb-1">
              {t('logoUrl')}
            </label>
            <input
              name="billing_logo_url"
              type="text"
              defaultValue={settings?.billing_logo_url ?? ""}
              placeholder="https://example.com/logo.png"
              className="w-full panel-input"
            />
            <p className="text-xs text-gray-400 dark:text-white/50 mt-1">
              {t('logoUrlDesc')}
            </p>
          </div>

          <div>
            <label className="panel-label block mb-1">
              {t('emailFrom')}
            </label>
            <input
              name="billing_email_from"
              type="text"
              defaultValue={settings?.billing_email_from ?? ""}
              placeholder='DRB Agency <billing@drb.agency>'
              className="w-full panel-input"
            />
            <p className="text-xs text-gray-400 dark:text-white/50 mt-1">
              {t('emailFromDesc')}
            </p>
          </div>

          <div>
            <label className="panel-label block mb-1">
              {t('footerText')}
            </label>
            <textarea
              name="billing_footer_text"
              defaultValue={settings?.billing_footer_text ?? ""}
              placeholder="© 2026 DRB Agency. Todos los derechos reservados."
              className="w-full panel-input min-h-[80px]"
            />
            <p className="text-xs text-gray-400 dark:text-white/50 mt-1">
              {t('footerTextDesc')}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
            >
              {t('saveConfig')}
            </button>
          </div>
        </form>
      </div>

      {/* ====================================
          SECCIÓN 2: TEMPLATES DE EMAILS
      ==================================== */}
      <div className="panel-card p-6">
        <h2 className="text-xl font-semibold mb-4">{t('templates')}</h2>
        <p className="text-sm text-gray-500 dark:text-white/60 mb-6">
          {t('templatesDesc')}
        </p>

        {/* Tokens disponibles */}
        <div className="rounded-xl bg-sky-50 dark:bg-drb-turquoise-500/10 border border-sky-200 dark:border-drb-turquoise-500/20 p-4 mb-6">
          <h3 className="text-sm font-semibold text-sky-700 dark:text-drb-turquoise-300 mb-2">
            📝 {t('availableTokens')}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              "{{clientName}}",
              "{{planName}}",
              "{{price}}",
              "{{billingPeriod}}",
              "{{adminUrl}}",
              "{{oldPlan}}",
              "{{newPlan}}",
              "{{cancelDate}}",
              "{{changeDate}}",
              "{{endDate}}",
              "{{newCommission}}",
              "{{oldPlanName}}",
              "{{newPlanName}}",
              "{{cancellationDate}}",
              "{{supportEmail}}",
            ].map((token) => (
              <code
                key={token}
                className="px-2 py-1 rounded bg-sky-100 text-sky-700 dark:bg-drb-turquoise-500/20 dark:text-drb-turquoise-200"
              >
                {token}
              </code>
            ))}
          </div>
        </div>

        {/* Templates en accordions */}
        <div className="space-y-6">
          {templateTypes.map((templateType) => {
            const template = templatesByType[templateType.tipo] || null;

            return (
              <details
                key={templateType.tipo}
                id={`billing-form-${templateType.tipo}`}
                className="group panel-card overflow-hidden"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition">
                  <div>
                    <div className="font-semibold text-lg">
                      {templateType.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-white/60">
                      {templateType.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {template?.activo ? (
                      <span className="badge-success px-3 py-1 text-xs font-semibold">
                        {tc('active')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-white/50 px-3 py-1 text-xs font-semibold">
                        {tc('inactive')}
                      </span>
                    )}
                    <svg
                      className="w-5 h-5 text-gray-400 dark:text-white/50 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </summary>

                <form
                  id={`billing-form-${templateType.tipo}`}
                  action={updateBillingTemplateAction}
                  className="p-4 border-t border-gray-100 dark:border-white/10 space-y-4"
                >
                  <input type="hidden" name="tipo" value={templateType.tipo} />

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="activo"
                      id={`activo-${templateType.tipo}`}
                      defaultChecked={template?.activo ?? true}
                      className="rounded border-gray-200 dark:border-white/10"
                    />
                    <label
                      htmlFor={`activo-${templateType.tipo}`}
                      className="panel-label"
                    >
                      {t('activateTemplate')}
                    </label>
                  </div>

                  <div>
                    <label className="panel-label block mb-1">
                      {t('emailSubject')}
                    </label>
                    <input
                      name="subject"
                      type="text"
                      defaultValue={template?.subject ?? ""}
                      placeholder="Ej: 🎉 ¡Bienvenido a {{planName}}!"
                      className="w-full panel-input"
                    />
                  </div>

                  <div>
                    <label className="panel-label block mb-1">
                      {t('htmlBody')}
                    </label>
                    <textarea
                      name="html_body"
                      defaultValue={template?.html_body ?? ""}
                      placeholder="<h1>Hola {{clientName}}</h1><p>Contenido del email...</p>"
                      className="w-full panel-input min-h-[300px] font-mono text-sm"
                    />
                    <p className="text-xs text-gray-400 dark:text-white/50 mt-1">
                      {t('htmlBodyDesc')}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="panel-label block mb-1">
                        {t('ctaText')}
                      </label>
                      <input
                        name="cta_text"
                        type="text"
                        defaultValue={template?.cta_text ?? ""}
                        placeholder="Ej: Ir a mi panel"
                        className="w-full panel-input"
                      />
                    </div>
                    <div>
                      <label className="panel-label block mb-1">
                        {t('ctaUrl')}
                      </label>
                      <input
                        name="cta_url"
                        type="text"
                        defaultValue={template?.cta_url ?? ""}
                        placeholder="Ej: {{adminUrl}} o https://..."
                        className="w-full panel-input"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <EmailPreviewButton
                      apiUrl="/api/owner/email-preview"
                      formId={`billing-form-${templateType.tipo}`}
                    />
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {t('saveTemplate')}
                    </button>
                  </div>
                </form>
              </details>
            );
          })}
        </div>
      </div>

      {/* ====================================
          NOTA INFORMATIVA
      ==================================== */}
      <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4">
        <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">
          ℹ️ {t('importantInfo')}
        </h3>
        <ul className="text-sm text-amber-700/80 dark:text-amber-200/80 space-y-1">
          <li>
            • {t('infoItem1')}
          </li>
          <li>
            • {t('infoItem2')}
          </li>
          <li>
            • {t('infoItem3')}
          </li>
          <li>
            • {t('infoItem4')}
          </li>
        </ul>
      </div>
    </div>
  );
}
