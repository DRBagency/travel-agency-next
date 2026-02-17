import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import AdminShell from "@/components/admin/AdminShell";
import SaveToast from "@/components/admin/SaveToast";
import { requireAdminClient } from "@/lib/requireAdminClient";
import DestinoImageField from "./DestinoImageField";

async function createDestino(formData: FormData) {
  "use server";

  const clientId = (await cookies()).get("cliente_id")?.value;
  if (!clientId) return;

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
  redirect("/admin/destinos?saved=creado");
}

async function updateDestino(formData: FormData) {
  "use server";

  const clientId = (await cookies()).get("cliente_id")?.value;
  if (!clientId) return;

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
  redirect("/admin/destinos?saved=guardado");
}

async function deleteDestino(formData: FormData) {
  "use server";

  const clientId = (await cookies()).get("cliente_id")?.value;
  if (!clientId) return;

  const id = formData.get("id") as string;

  await supabaseAdmin.from("destinos").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/destinos");
  redirect("/admin/destinos?saved=eliminado");
}

interface AdminDestinosPageProps {
  searchParams: Promise<{ saved?: string }>;
}

const toastMessages: Record<string, string> = {
  creado: "Destino creado correctamente",
  guardado: "Cambios guardados",
  eliminado: "Destino eliminado",
};

export default async function AdminDestinosPage({
  searchParams,
}: AdminDestinosPageProps) {
  const { saved } = await searchParams;

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
    <AdminShell
      clientName={client.nombre}
      primaryColor={client.primary_color}
      logoUrl={client.logo_url}
      subscriptionActive={Boolean(client.stripe_subscription_id)}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Destinos</h1>
            <p className="text-white/60">
              Crea y actualiza los destinos visibles en la web.
            </p>
          </div>
          <SaveToast message={saved ? toastMessages[saved] || "Guardado" : null} />
        </div>

        <section className="rounded-2xl border border-white/20 bg-white/10 p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Nuevo destino</h2>
            <p className="text-sm text-white/60">
              Añade un destino con precio, descripción e imagen.
            </p>
          </div>

          <form action={createDestino} className="grid gap-4">

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Nombre
                </label>
                <input
                  name="nombre"
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
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
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
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
                className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400 min-h-[110px]"
                placeholder="Descripción breve y atractiva del destino"
              />
            </div>

            <DestinoImageField />

            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" name="activo" defaultChecked />
              Publicar ahora
            </label>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold transition-colors"
              >
                Guardar destino
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Listado</h2>

          {(!destinos || destinos.length === 0) && (
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-white/70">
              Todavía no hay destinos.
            </div>
          )}

          {destinos?.map((destino) => (
            <form
              key={destino.id}
              action={updateDestino}
              className="rounded-2xl border border-white/20 bg-white/10 p-6 space-y-4"
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
                    className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
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
                    className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
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
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400 min-h-[110px]"
                />
              </div>

              <DestinoImageField
                defaultValue={destino.imagen_url ?? ""}
                defaultQuery={destino.nombre ?? "travel destination"}
              />

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
                  className="px-5 py-2 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold transition-colors"
                >
                  Guardar cambios
                </button>
                <button
                  formAction={deleteDestino}
                  className="px-5 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition"
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
