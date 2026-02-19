import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import SubmitButton from "@/components/admin/SubmitButton";
import EmailPreviewButton from "@/components/admin/EmailPreviewButton";
import EmailBodyWithAI from "./EmailBodyWithAI";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { getTranslations } from 'next-intl/server';

const EMAIL_TYPES = [
  { tipo: "reserva_cliente", labelKey: "reservaCliente" as const },
  { tipo: "reserva_agencia", labelKey: "reservaAgencia" as const },
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
          <p className="text-gray-300 dark:text-white/30 text-sm mt-2">
            {t('note')}
          </p>
        </div>

        {EMAIL_TYPES.map((type) => {
          const template = templateByType[type.tipo] || null;

          return (
            <form
              key={type.tipo}
              id={`email-form-${type.tipo}`}
              action={saveEmailTemplate}
              className="panel-card p-6 space-y-4"
            >
              <input type="hidden" name="client_id" value={client.id} />
              <input type="hidden" name="tipo" value={type.tipo} />
              {template?.id && (
                <input type="hidden" name="id" value={template.id} />
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{t(type.labelKey)}</h2>
                  <p className="text-sm text-gray-500 dark:text-white/60">
                    {tc('type')}: {type.tipo}
                  </p>
                </div>
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
                <label className="panel-label">
                  {t('subjectLabel')}
                </label>
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
                  <label className="panel-label">
                    {t('ctaText')}
                  </label>
                  <input
                    name="cta_text"
                    defaultValue={template?.cta_text ?? ""}
                    className="panel-input"
                    placeholder={t('ctaTextPlaceholder')}
                  />
                </div>
                <div>
                  <label className="panel-label">
                    {t('ctaUrl')}
                  </label>
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
                <SubmitButton
                  className="btn-primary"
                >
                  {t('saveTemplate')}
                </SubmitButton>
              </div>
            </form>
          );
        })}
      </div>
  );
}
