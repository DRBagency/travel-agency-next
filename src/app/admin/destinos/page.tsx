import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdminClient } from "@/lib/requireAdminClient";

async function createDestino(formData: FormData) {
  "use server";

  const session = (await cookies()).get("admin_session");
  if (!session || session.value !== "ok") return;

  const clientId = formData.get("client_id") as string;

  const payload = {
    cliente_id: clientId,
    nombre: (formData.get("nombre") as string) || null,
    descripcion: (formData.get("descripcion") as string) || null,
    precio: Number(formData.get("precio") || 0) || 0,
    imagen_url: (formData.get("imagen_url") as string) || null,
    activo: formData.get("activo") === "on",
  };

  await supabaseAdmin.from("destinos").insert(payload);
  revalidatePath("/");
  revalidatePath("/admin/destinos");
}

async function updateDestino(formData: FormData) {
  "use server";

  const session = (await cookies()).get("admin_session");
  if (!session || session.value !== "ok") return;

  const id = formData.get("id") as string;

  const payload = {
    nombre: (formData.get("nombre") as string) || null,
    descripcion: (formData.get("descripcion") as string) || null,
    precio: Number(formData.get("precio") || 0) || 0,
    imagen_url: (formData.get("imagen_url") as string) || null,
    activo: formData.get("activo") === "on",
  };

  await supabaseAdmin.from("destinos").update(payload).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/destinos");
}

async function deleteDestino(formData: FormData) {
  "use server";

  const session = (await cookies()).get("admin_session");
  if (!session || session.value !== "ok") return;

  const id = formData.get("id") as string;

  await supabaseAdmin.from("destinos").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/destinos");
}

interface AdminDestinosPageProps {
  searchParams: Promise<{
  }>;
}

export default async function AdminDestinosPage({
  searchParams,
}: AdminDestinosPageProps) {
  await searchParams;

  const client = await requireAdminClient();

  const { data: destinos } = await supabaseAdmin
    .from("destinos")
    .select("*")
    .eq("cliente_id", client.id)
    .order("created_at", { ascending: false });

  const brandStyle = client.primary_color
    ? { backgroundColor: client.primary_color }
    : undefined;

  return (
    <AdminShell clientName={client.nombre} primaryColor={client.primary_color}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Destinos</h1>
          <p className="text-white/60">
            Crea y actualiza los destinos visibles en la web.
          </p>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Nuevo destino</h2>
            <p className="text-sm text-white/60">
              Añade un destino con precio, descripción e imagen.
            </p>
          </div>

          <form action={createDestino} className="grid gap-4">
            <input type="hidden" name="client_id" value={client.id} />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Nombre
                </label>
                <input
                  name="nombre"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white"
                  placeholder="Ej: Islas Canarias"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Precio (€)
                </label>
                <input
                  name="precio"
                  type="number"
                  min={0}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white"
                  placeholder="Ej: 799"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white min-h-[110px]"
                placeholder="Descripción breve y atractiva del destino"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">
                Imagen (URL)
              </label>
              <input
                name="imagen_url"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white"
                placeholder="https://..."
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
                Guardar destino
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Listado</h2>

          {(!destinos || destinos.length === 0) && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
              Todavía no hay destinos.
            </div>
          )}

          {destinos?.map((destino) => (
            <form
              key={destino.id}
              action={updateDestino}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
            >
              <input type="hidden" name="id" value={destino.id} />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    Nombre
                  </label>
                  <input
                    name="nombre"
                    defaultValue={destino.nombre ?? ""}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    Precio (€)
                  </label>
                  <input
                    name="precio"
                    type="number"
                    min={0}
                    defaultValue={destino.precio ?? 0}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  defaultValue={destino.descripcion ?? ""}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white min-h-[110px]"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Imagen (URL)
                </label>
                <input
                  name="imagen_url"
                  defaultValue={destino.imagen_url ?? ""}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  name="activo"
                  defaultChecked={Boolean(destino.activo)}
                />
                Activo en la web
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
                  formAction={deleteDestino}
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
