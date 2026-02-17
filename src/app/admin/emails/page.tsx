import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import SubmitButton from "@/components/admin/SubmitButton";
import EmailPreviewButton from "@/components/admin/EmailPreviewButton";
import { requireAdminClient } from "@/lib/requireAdminClient";

const EMAIL_TYPES = [
  { tipo: "reserva_cliente", label: "Reserva · Cliente" },
  { tipo: "reserva_agencia", label: "Reserva · Agencia" },
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Emails</h1>
          <p className="text-gray-500 dark:text-white/60">
            Edita los emails automáticos. Acepta HTML y placeholders como
            {" "}{"{{customerName}}"}, {"{{destination}}"}, {"{{total}}"}.
          </p>
          <p className="text-gray-400 dark:text-white/50 text-sm mt-2">
            Nota: la página /success puede recibir <strong>session_id</strong> en la URL para mostrar un resumen real de la reserva.
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
                  <h2 className="text-xl font-semibold">{type.label}</h2>
                  <p className="text-sm text-gray-500 dark:text-white/60">
                    Tipo: {type.tipo}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                  <input
                    type="checkbox"
                    name="activo"
                    defaultChecked={template?.activo ?? true}
                  />
                  Activo
                </label>
              </div>

              <div>
                <label className="panel-label">
                  Asunto
                </label>
                <input
                  name="subject"
                  defaultValue={template?.subject ?? ""}
                  className="panel-input"
                  placeholder="Ej: Reserva confirmada"
                />
              </div>

              <div>
                <label className="panel-label">
                  HTML Body
                </label>
                <textarea
                  name="html_body"
                  defaultValue={template?.html_body ?? ""}
                  className="panel-input min-h-[200px]"
                  placeholder="<h1>...</h1><p>...</p>"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="panel-label">
                    CTA · Texto
                  </label>
                  <input
                    name="cta_text"
                    defaultValue={template?.cta_text ?? ""}
                    className="panel-input"
                    placeholder="Ej: Ver detalles"
                  />
                </div>
                <div>
                  <label className="panel-label">
                    CTA · URL
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
                  className="px-5 py-3 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold transition-colors"
                >
                  Guardar plantilla
                </SubmitButton>
              </div>
            </form>
          );
        })}
      </div>
  );
}
