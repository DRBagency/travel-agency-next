import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import SubmitButton from "@/components/admin/SubmitButton";
import EmailPreviewButton from "@/components/admin/EmailPreviewButton";
import EmailBodyWithAI from "./EmailBodyWithAI";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { getTranslations } from 'next-intl/server';

const EMAIL_GROUPS = [
  {
    groupKey: "groupReservas" as const,
    types: [
      { tipo: "reserva_cliente", labelKey: "reservaCliente" as const, descKey: "reservaClienteDesc" as const, tokensKey: "tokensReserva" as const },
      { tipo: "reserva_agencia", labelKey: "reservaAgencia" as const, descKey: "reservaAgenciaDesc" as const, tokensKey: "tokensReserva" as const },
    ],
  },
  {
    groupKey: "groupMarketing" as const,
    types: [
      { tipo: "bienvenida", labelKey: "bienvenida" as const, descKey: "bienvenidaDesc" as const, tokensKey: "tokensBienvenida" as const },
      { tipo: "recordatorio_viaje", labelKey: "recordatorioViaje" as const, descKey: "recordatorioViajeDesc" as const, tokensKey: "tokensRecordatorio" as const },
      { tipo: "seguimiento", labelKey: "seguimiento" as const, descKey: "seguimientoDesc" as const, tokensKey: "tokensSeguimiento" as const },
      { tipo: "promocion", labelKey: "promocion" as const, descKey: "promocionDesc" as const, tokensKey: "tokensPromocion" as const },
    ],
  },
];


async function saveEmailTemplate(formData: FormData) {
  "use server";

  const clienteId = (await cookies()).get("cliente_id")?.value;
  if (!clienteId) return;

  const clientId = formData.get("client_id") as string;

  const id = formData.get("id") as string | null;
  const tipo = formData.get("tipo") as string;

  const payload = {
    cliente_id: clientId,
    tipo,
    subject: (formData.get("subject") as string) || null,
    html_body: (formData.get("html_body") as string) || null,
    cta_text: (formData.get("cta_text") as string) || null,
    cta_url: (formData.get("cta_url") as string) || null,
    activo: formData.get("activo") === "on",
  };

  if (id) {
    await supabaseAdmin.from("email_templates").update(payload).eq("id", id);
  } else {
    await supabaseAdmin.from("email_templates").insert(payload);
  }

  revalidatePath("/admin/emails");
}

interface AdminEmailsPageProps {
  searchParams: Promise<{}>;
}

export default async function AdminEmailsPage({
  searchParams,
}: AdminEmailsPageProps) {
  await searchParams;

  const t = await getTranslations('admin.emails');
  const tc = await getTranslations('common');

  const client = await requireAdminClient();

  const { data: templates } = await supabaseAdmin
    .from("email_templates")
    .select("*")
    .eq("cliente_id", client.id);

  const templateByType = (templates || []).reduce(
    (acc: Record<string, any>, row: any) => {
      acc[row.tipo] = row;
      return acc;
    },
    {}
  );

  const brandStyle = client.primary_color
    ? { backgroundColor: client.primary_color }
    : undefined;

  return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('title')}</h1>
          <p className="text-gray-400 dark:text-white/40">
            {t('subtitle')}
          </p>
        </div>

        {EMAIL_GROUPS.map((group) => (
          <div key={group.groupKey} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t(group.groupKey)}</h2>

            {group.types.map((type) => {
              const template = templateByType[type.tipo] || null;

              return (
                <details key={type.tipo} className="panel-card group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t(type.labelKey)}</h3>
                      <p className="text-sm text-gray-400 dark:text-white/40 mt-0.5">{t(type.descKey)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {template?.activo ? (
                        <span className="badge-success">{tc('active')}</span>
                      ) : (
                        <span className="badge-warning">{tc('inactive')}</span>
                      )}
                    </div>
                  </summary>

                  <form
                    id={`email-form-${type.tipo}`}
                    action={saveEmailTemplate}
                    className="px-5 pb-5 pt-4 border-t border-gray-100 dark:border-white/[0.06] space-y-4"
                  >
                    <input type="hidden" name="client_id" value={client.id} />
                    <input type="hidden" name="tipo" value={type.tipo} />
                    {template?.id && (
                      <input type="hidden" name="id" value={template.id} />
                    )}

                    <p className="text-xs text-gray-400 dark:text-white/30 bg-gray-50 dark:bg-white/[0.03] rounded-lg px-3 py-2">
                      <span className="font-medium text-gray-500 dark:text-white/50">{t('availableTokens')}:</span>{" "}
                      {t(type.tokensKey)}
                    </p>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                        <input
                          type="checkbox"
                          name="activo"
                          defaultChecked={template?.activo ?? true}
                        />
                        {tc('active')}
                      </label>
                    </div>

                    <div>
                      <label className="panel-label">{t('subjectLabel')}</label>
                      <input
                        name="subject"
                        defaultValue={template?.subject ?? ""}
                        className="panel-input"
                        placeholder={t('subjectPlaceholder')}
                      />
                    </div>

                    <EmailBodyWithAI
                      defaultValue={template?.html_body ?? ""}
                      clienteId={client.id}
                      plan={client.plan}
                      label={t('htmlBody')}
                      name="html_body"
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="panel-label">{t('ctaText')}</label>
                        <input
                          name="cta_text"
                          defaultValue={template?.cta_text ?? ""}
                          className="panel-input"
                          placeholder={t('ctaTextPlaceholder')}
                        />
                      </div>
                      <div>
                        <label className="panel-label">{t('ctaUrl')}</label>
                        <input
                          name="cta_url"
                          defaultValue={template?.cta_url ?? ""}
                          className="panel-input"
                          placeholder="https://"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <EmailPreviewButton
                        apiUrl="/api/admin/email-preview"
                        formId={`email-form-${type.tipo}`}
                      />
                      <SubmitButton className="btn-primary">
                        {t('saveTemplate')}
                      </SubmitButton>
                    </div>
                  </form>
                </details>
              );
            })}
          </div>
        ))}
      </div>
  );
}
