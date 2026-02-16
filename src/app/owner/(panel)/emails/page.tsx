import { revalidatePath } from "next/cache";
import {
  getPlatformSettings,
  updatePlatformSettings,
  getAllBillingTemplates,
  updateBillingTemplate,
  type BillingTemplateType,
} from "@/lib/billing/settings";

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
  const settings = await getPlatformSettings();
  const templates = await getAllBillingTemplates();

  const templatesByType = templates.reduce(
    (acc, t) => {
      acc[t.tipo] = t;
      return acc;
    },
    {} as Record<string, any>
  );

  const templateTypes = [
    {
      tipo: "bienvenida" as const,
      label: "🎉 Bienvenida",
      description: "Email enviado cuando un cliente activa su suscripción",
    },
    {
      tipo: "cambio_plan" as const,
      label: "🔄 Cambio de plan",
      description: "Email enviado cuando un cliente cambia de plan",
    },
    {
      tipo: "cancelacion" as const,
      label: "😢 Cancelación",
      description: "Email enviado cuando un cliente cancela su suscripción",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ====================================
          HEADER
      ==================================== */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Emails de Billing</h1>
        <p className="text-white/60">
          Gestión global de plantillas de emails para eventos de facturación
        </p>
      </div>

      {/* ====================================
          SECCIÓN 1: CONFIGURACIÓN GLOBAL
      ==================================== */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-4">
          Configuración Global de Billing
        </h2>
        <p className="text-sm text-white/60 mb-6">
          Esta configuración se aplica a todos los emails de billing (logo,
          remitente, footer).
        </p>

        <form action={updatePlatformSettingsAction} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">
              URL del Logo
            </label>
            <input
              name="billing_logo_url"
              type="text"
              defaultValue={settings?.billing_logo_url ?? ""}
              placeholder="https://example.com/logo.png"
              className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-white/30"
            />
            <p className="text-xs text-white/50 mt-1">
              Logo que aparecerá en el header de los emails de billing
            </p>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">
              Email Remitente (From)
            </label>
            <input
              name="billing_email_from"
              type="text"
              defaultValue={settings?.billing_email_from ?? ""}
              placeholder='DRB Agency <billing@drb.agency>'
              className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-white/30"
            />
            <p className="text-xs text-white/50 mt-1">
              Formato: &quot;Nombre &lt;email@dominio.com&gt;&quot; o solo
              &quot;email@dominio.com&quot;
            </p>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">
              Texto del Footer
            </label>
            <textarea
              name="billing_footer_text"
              defaultValue={settings?.billing_footer_text ?? ""}
              placeholder="© 2026 DRB Agency. Todos los derechos reservados."
              className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-white/30 min-h-[80px]"
            />
            <p className="text-xs text-white/50 mt-1">
              Texto que aparecerá en el footer de todos los emails
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-semibold hover:bg-white/90 transition"
            >
              Guardar configuración
            </button>
          </div>
        </form>
      </div>

      {/* ====================================
          SECCIÓN 2: TEMPLATES DE EMAILS
      ==================================== */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-4">Templates de Emails</h2>
        <p className="text-sm text-white/60 mb-6">
          Edita los templates de emails para eventos de billing. Puedes usar
          tokens dinámicos.
        </p>

        {/* Tokens disponibles */}
        <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-300 mb-2">
            📝 Tokens disponibles:
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
                className="px-2 py-1 rounded bg-blue-500/20 text-blue-200"
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
                className="group rounded-xl border border-white/10 bg-white/5 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition">
                  <div>
                    <div className="font-semibold text-lg">
                      {templateType.label}
                    </div>
                    <div className="text-sm text-white/60">
                      {templateType.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {template?.activo ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-300 px-3 py-1 text-xs font-semibold">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-white/10 text-white/50 px-3 py-1 text-xs font-semibold">
                        Inactivo
                      </span>
                    )}
                    <svg
                      className="w-5 h-5 text-white/50 transition-transform group-open:rotate-180"
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
                  action={updateBillingTemplateAction}
                  className="p-4 border-t border-white/10 space-y-4"
                >
                  <input type="hidden" name="tipo" value={templateType.tipo} />

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="activo"
                      id={`activo-${templateType.tipo}`}
                      defaultChecked={template?.activo ?? true}
                      className="rounded border-white/10"
                    />
                    <label
                      htmlFor={`activo-${templateType.tipo}`}
                      className="text-sm text-white/70"
                    >
                      Activar este template
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Asunto del Email
                    </label>
                    <input
                      name="subject"
                      type="text"
                      defaultValue={template?.subject ?? ""}
                      placeholder="Ej: 🎉 ¡Bienvenido a {{planName}}!"
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Cuerpo HTML
                    </label>
                    <textarea
                      name="html_body"
                      defaultValue={template?.html_body ?? ""}
                      placeholder="<h1>Hola {{clientName}}</h1><p>Contenido del email...</p>"
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-white/30 min-h-[300px] font-mono text-sm"
                    />
                    <p className="text-xs text-white/50 mt-1">
                      Escribe HTML y usa tokens como {`{{clientName}}`},{" "}
                      {`{{planName}}`}, etc.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/70 mb-1">
                        CTA · Texto del Botón
                      </label>
                      <input
                        name="cta_text"
                        type="text"
                        defaultValue={template?.cta_text ?? ""}
                        placeholder="Ej: Ir a mi panel"
                        className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-white/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-1">
                        CTA · URL del Botón
                      </label>
                      <input
                        name="cta_url"
                        type="text"
                        defaultValue={template?.cta_url ?? ""}
                        placeholder="Ej: {{adminUrl}} o https://..."
                        className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-semibold hover:bg-white/90 transition"
                    >
                      Guardar template
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
      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
        <h3 className="text-sm font-semibold text-amber-300 mb-2">
          ℹ️ Información importante:
        </h3>
        <ul className="text-sm text-amber-200/80 space-y-1">
          <li>
            • Los emails solo se enviarán si el template correspondiente está
            <strong> activo</strong>
          </li>
          <li>
            • Los tokens se reemplazan automáticamente al enviar el email
          </li>
          <li>
            • Puedes usar HTML para dar formato al contenido (negrita, listas,
            etc.)
          </li>
          <li>
            • El logo y footer se aplicarán automáticamente desde la
            configuración global
          </li>
        </ul>
      </div>
    </div>
  );
}
