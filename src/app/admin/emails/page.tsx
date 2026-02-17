import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import AdminShell from "@/components/admin/AdminShell";
import SaveToast from "@/components/admin/SaveToast";
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
  redirect("/admin/emails?saved=guardado");
}

interface AdminEmailsPageProps {
  searchParams: Promise<{ saved?: string }>;
}

export default async function AdminEmailsPage({
  searchParams,
}: AdminEmailsPageProps) {
  const { saved } = await searchParams;

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
    <AdminShell
      clientName={client.nombre}
      primaryColor={client.primary_color}
      logoUrl={client.logo_url}
      subscriptionActive={Boolean(client.stripe_subscription_id)}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
          <h1 className="text-3xl font-bold mb-1">Emails</h1>
          <p className="text-white/60">
            Edita los emails automáticos. Acepta HTML y placeholders como
            {" "}{"{{customerName}}"}, {"{{destination}}"}, {"{{total}}"}.
          </p>
          <p className="text-white/50 text-sm mt-2">
            Nota: la página /success puede recibir <strong>session_id</strong> en la URL para mostrar un resumen real de la reserva.
          </p>
          </div>
          <SaveToast message={saved === "guardado" ? "Plantilla guardada" : null} />
        </div>

        {EMAIL_TYPES.map((type) => {
          const template = templateByType[type.tipo] || null;

          return (
            <form
              key={type.tipo}
              action={saveEmailTemplate}
              className="rounded-2xl border border-white/20 bg-white/10 p-6 space-y-4"
            >
              <input type="hidden" name="client_id" value={client.id} />
              <input type="hidden" name="tipo" value={type.tipo} />
              {template?.id && (
                <input type="hidden" name="id" value={template.id} />
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{type.label}</h2>
                  <p className="text-sm text-white/60">
                    Tipo: {type.tipo}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    name="activo"
                    defaultChecked={template?.activo ?? true}
                  />
                  Activo
                </label>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Asunto
                </label>
                <input
                  name="subject"
                  defaultValue={template?.subject ?? ""}
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: ✅ Reserva confirmada"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">
                  HTML Body
                </label>
                <textarea
                  name="html_body"
                  defaultValue={template?.html_body ?? ""}
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400 min-h-[200px]"
                  placeholder="<h1>...</h1><p>...</p>"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    CTA · Texto
                  </label>
                  <input
                    name="cta_text"
                    defaultValue={template?.cta_text ?? ""}
                    className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                    placeholder="Ej: Ver detalles"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    CTA · URL
                  </label>
                  <input
                    name="cta_url"
                    defaultValue={template?.cta_url ?? ""}
                    className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold transition-colors"
                >
                  Guardar plantilla
                </button>
              </div>
            </form>
          );
        })}
      </div>
    </AdminShell>
  );
}
