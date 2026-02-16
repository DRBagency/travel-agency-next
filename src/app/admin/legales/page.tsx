import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdminClient } from "@/lib/requireAdminClient";

async function createLegal(formData: FormData) {
  "use server";

  const session = (await cookies()).get("admin_session");
  if (!session || session.value !== "ok") return;

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

  const session = (await cookies()).get("admin_session");
  if (!session || session.value !== "ok") return;

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

  const session = (await cookies()).get("admin_session");
  if (!session || session.value !== "ok") return;

  const id = formData.get("id") as string;

  await supabaseAdmin.from("paginas_legales").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/legales");
}

interface AdminLegalesPageProps {
  searchParams: Promise<{
  }>;
}

export default async function AdminLegalesPage({
  searchParams,
}: AdminLegalesPageProps) {
  await searchParams;

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
    <AdminShell
      clientName={client.nombre}
      primaryColor={client.primary_color}
      subscriptionActive={Boolean(client.stripe_subscription_id)}
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Legales</h1>
          <p className="text-white/60">
            Gestiona páginas legales que se muestran en /legal/[slug].
          </p>
          <p className="text-white/50 text-sm mt-2">
            Nota: solo las páginas con “Activa en la web” aparecen en el footer.
          </p>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Nueva página legal</h2>
            <p className="text-sm text-white/60">
              El contenido acepta HTML (se renderiza tal cual).
            </p>
          </div>

          <form action={createLegal} className="grid gap-4">
            <input type="hidden" name="client_id" value={client.id} />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Título
                </label>
                <input
                  name="titulo"
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white"
                  placeholder="Ej: Política de privacidad"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Slug
                </label>
                <input
                  name="slug"
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white"
                  placeholder="privacidad"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">
                Contenido (HTML)
              </label>
              <textarea
                name="contenido"
                className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white min-h-[160px]"
                placeholder="<h2>...</h2><p>...</p>"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" name="activo" defaultChecked />
              Publicar ahora
            </label>

            <div className="flex justify-end">
              <button
                type="submit"
                className={
                  client.primary_color
                    ? "px-5 py-3 rounded-xl text-white font-semibold"
                    : "px-5 py-3 rounded-xl bg-white text-slate-950 font-semibold"
                }
                style={brandStyle}
              >
                Guardar página
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Listado</h2>

          {(!legales || legales.length === 0) && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
              Todavía no hay páginas legales.
            </div>
          )}

          {legales?.map((item) => (
            <form
              key={item.id}
              action={updateLegal}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
            >
              <input type="hidden" name="id" value={item.id} />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    Título
                  </label>
                  <input
                    name="titulo"
                    defaultValue={item.titulo ?? ""}
                    className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    Slug
                  </label>
                  <input
                    name="slug"
                    defaultValue={item.slug ?? ""}
                    className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Contenido (HTML)
                </label>
                <textarea
                  name="contenido"
                  defaultValue={item.contenido ?? ""}
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white min-h-[160px]"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  name="activo"
                  defaultChecked={Boolean(item.activo)}
                />
                Activa en la web
              </label>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="submit"
                  className={
                    client.primary_color
                      ? "px-5 py-2 rounded-xl text-white font-semibold"
                      : "px-5 py-2 rounded-xl bg-white text-slate-950 font-semibold"
                  }
                  style={brandStyle}
                >
                  Guardar cambios
                </button>
                <button
                  formAction={deleteLegal}
                  className="px-5 py-2 rounded-xl border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition"
                >
                  Eliminar
                </button>
              </div>
            </form>
          ))}
        </section>
      </div>
    </AdminShell>
  );
}
