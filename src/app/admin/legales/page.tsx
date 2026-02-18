import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import SubmitButton from "@/components/admin/SubmitButton";
import { requireAdminClient } from "@/lib/requireAdminClient";
import DeleteWithConfirm from "@/components/ui/DeleteWithConfirm";
import { getTranslations } from 'next-intl/server';

async function createLegal(formData: FormData) {
  "use server";

  const clienteId = (await cookies()).get("cliente_id")?.value;
  if (!clienteId) return;

  const clientId = formData.get("client_id") as string;

  const payload = {
    cliente_id: clientId,
    titulo: (formData.get("titulo") as string) || null,
    slug: (formData.get("slug") as string) || null,
    contenido: (formData.get("contenido") as string) || null,
    activo: formData.get("activo") === "on",
  };

  await supabaseAdmin.from("paginas_legales").insert(payload);
  revalidatePath("/");
  revalidatePath("/admin/legales");
  if (payload.slug) {
    revalidatePath(`/legal/${payload.slug}`);
  }
}

async function updateLegal(formData: FormData) {
  "use server";

  const clienteId = (await cookies()).get("cliente_id")?.value;
  if (!clienteId) return;

  const id = formData.get("id") as string;

  const payload = {
    titulo: (formData.get("titulo") as string) || null,
    slug: (formData.get("slug") as string) || null,
    contenido: (formData.get("contenido") as string) || null,
    activo: formData.get("activo") === "on",
  };

  await supabaseAdmin.from("paginas_legales").update(payload).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/legales");
  if (payload.slug) {
    revalidatePath(`/legal/${payload.slug}`);
  }
}

async function deleteLegal(formData: FormData) {
  "use server";

  const clienteId = (await cookies()).get("cliente_id")?.value;
  if (!clienteId) return;

  const id = formData.get("id") as string;

  await supabaseAdmin.from("paginas_legales").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/legales");
}

interface AdminLegalesPageProps {
  searchParams: Promise<{}>;
}

export default async function AdminLegalesPage({
  searchParams,
}: AdminLegalesPageProps) {
  await searchParams;

  const t = await getTranslations('admin.legales');
  const tc = await getTranslations('common');

  const client = await requireAdminClient();

  const { data: legales } = await supabaseAdmin
    .from("paginas_legales")
    .select("*")
    .eq("cliente_id", client.id)
    .order("created_at", { ascending: false });

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
          <p className="text-gray-400 dark:text-white/50 text-sm mt-2">
            {t('note')}
          </p>
        </div>

        <section className="panel-card p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">{t('newPage')}</h2>
            <p className="text-sm text-gray-500 dark:text-white/60">
              {t('contentNote')}
            </p>
          </div>

          <form action={createLegal} className="grid gap-4">
            <input type="hidden" name="client_id" value={client.id} />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label">
                  {t('titleLabel')}
                </label>
                <input
                  name="titulo"
                  className="panel-input"
                  placeholder={t('titlePlaceholder')}
                />
              </div>
              <div>
                <label className="panel-label">
                  {t('slug')}
                </label>
                <input
                  name="slug"
                  className="panel-input"
                  placeholder={t('slugPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label className="panel-label">
                {t('contentLabel')}
              </label>
              <textarea
                name="contenido"
                className="panel-input min-h-[160px]"
                placeholder="<h2>...</h2><p>...</p>"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
              <input type="checkbox" name="activo" defaultChecked />
              {tc('publishNow')}
            </label>

            <div className="flex justify-end">
              <SubmitButton
                className="btn-primary"
              >
                {t('savePage')}
              </SubmitButton>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('list')}</h2>

          {(!legales || legales.length === 0) && (
            <div className="panel-card p-6 text-gray-600 dark:text-white/70">
              {t('noPages')}
            </div>
          )}

          {legales?.map((item) => (
            <form
              key={item.id}
              action={updateLegal}
              className="panel-card p-6 space-y-4"
            >
              <input type="hidden" name="id" value={item.id} />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="panel-label">
                    {t('titleLabel')}
                  </label>
                  <input
                    name="titulo"
                    defaultValue={item.titulo ?? ""}
                    className="panel-input"
                  />
                </div>
                <div>
                  <label className="panel-label">
                    {t('slug')}
                  </label>
                  <input
                    name="slug"
                    defaultValue={item.slug ?? ""}
                    className="panel-input"
                  />
                </div>
              </div>

              <div>
                <label className="panel-label">
                  {t('contentLabel')}
                </label>
                <textarea
                  name="contenido"
                  defaultValue={item.contenido ?? ""}
                  className="panel-input min-h-[160px]"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                <input
                  type="checkbox"
                  name="activo"
                  defaultChecked={Boolean(item.activo)}
                />
                {t('activeOnWeb')}
              </label>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <SubmitButton
                  className="btn-primary"
                >
                  {tc('saveChanges')}
                </SubmitButton>
                <DeleteWithConfirm
                  action={deleteLegal}
                  hiddenFields={{ id: item.id }}
                  title={tc('confirmDelete')}
                  description={tc('confirmDeleteDesc')}
                  confirmLabel={tc('delete')}
                  cancelLabel={tc('cancel')}
                  trigger={
                    <button type="button" className="badge-danger px-5 py-2 rounded-xl hover:bg-red-500/30 transition">
                      {tc('delete')}
                    </button>
                  }
                />
              </div>
            </form>
          ))}
        </section>
      </div>
  );
}
