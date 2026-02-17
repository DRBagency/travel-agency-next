import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import SubmitButton from "@/components/admin/SubmitButton";
import { requireAdminClient } from "@/lib/requireAdminClient";

async function createOpinion(formData: FormData) {
  "use server";

  const clienteId = (await cookies()).get("cliente_id")?.value;
  if (!clienteId) return;

  const clientId = formData.get("client_id") as string;

  const payload = {
    cliente_id: clientId,
    nombre: (formData.get("nombre") as string) || null,
    ubicacion: (formData.get("ubicacion") as string) || null,
    comentario: (formData.get("comentario") as string) || null,
    rating: Number(formData.get("rating") || 0) || 0,
    activo: formData.get("activo") === "on",
  };

  await supabaseAdmin.from("opiniones").insert(payload);
  revalidatePath("/");
  revalidatePath("/admin/opiniones");
}

async function updateOpinion(formData: FormData) {
  "use server";

  const clienteId = (await cookies()).get("cliente_id")?.value;
  if (!clienteId) return;

  const id = formData.get("id") as string;

  const payload = {
    nombre: (formData.get("nombre") as string) || null,
    ubicacion: (formData.get("ubicacion") as string) || null,
    comentario: (formData.get("comentario") as string) || null,
    rating: Number(formData.get("rating") || 0) || 0,
    activo: formData.get("activo") === "on",
  };

  await supabaseAdmin.from("opiniones").update(payload).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/opiniones");
}

async function deleteOpinion(formData: FormData) {
  "use server";

  const clienteId = (await cookies()).get("cliente_id")?.value;
  if (!clienteId) return;

  const id = formData.get("id") as string;

  await supabaseAdmin.from("opiniones").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/opiniones");
}

interface AdminOpinionsPageProps {
  searchParams: Promise<{}>;
}

export default async function AdminOpinionsPage({
  searchParams,
}: AdminOpinionsPageProps) {
  await searchParams;

  const client = await requireAdminClient();

  const { data: opiniones } = await supabaseAdmin
    .from("opiniones")
    .select("*")
    .eq("cliente_id", client.id)
    .order("created_at", { ascending: false });

  const brandStyle = client.primary_color
    ? { backgroundColor: client.primary_color }
    : undefined;

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Opiniones</h1>
          <p className="text-gray-500 dark:text-white/60">
            Crea, edita y activa opiniones que aparecen en la web pública.
          </p>
        </div>

        <section className="panel-card p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Nueva opinión</h2>
            <p className="text-sm text-gray-500 dark:text-white/60">
              Añade una opinión visible para tus clientes.
            </p>
          </div>

          <form action={createOpinion} className="grid gap-4">
            <input type="hidden" name="client_id" value={client.id} />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label">
                  Nombre
                </label>
                <input
                  name="nombre"
                  className="panel-input"
                  placeholder="Ej: Ana Martínez"
                />
              </div>
              <div>
                <label className="panel-label">
                  Ubicación
                </label>
                <input
                  name="ubicacion"
                  className="panel-input"
                  placeholder="Ej: Madrid"
                />
              </div>
            </div>

            <div>
              <label className="panel-label">
                Comentario
              </label>
              <textarea
                name="comentario"
                className="panel-input min-h-[110px]"
                placeholder="Cuéntanos la experiencia del cliente"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="panel-label">
                  Rating (1-5)
                </label>
                <input
                  name="rating"
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={5}
                  className="panel-input"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                <input type="checkbox" name="activo" defaultChecked />
                Publicar ahora
              </label>
            </div>

            <div className="flex justify-end">
              <SubmitButton
                className="px-5 py-3 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold transition-colors"
              >
                Guardar opinión
              </SubmitButton>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Listado</h2>

          {(!opiniones || opiniones.length === 0) && (
            <div className="panel-card p-6 text-gray-600 dark:text-white/70">
              Todavía no hay opiniones.
            </div>
          )}

          {opiniones?.map((opinion) => (
            <form
              key={opinion.id}
              action={updateOpinion}
              className="panel-card p-6 space-y-4"
            >
              <input type="hidden" name="id" value={opinion.id} />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="panel-label">
                    Nombre
                  </label>
                  <input
                    name="nombre"
                    defaultValue={opinion.nombre ?? ""}
                    className="panel-input"
                  />
                </div>
                <div>
                  <label className="panel-label">
                    Ubicación
                  </label>
                  <input
                    name="ubicacion"
                    defaultValue={opinion.ubicacion ?? ""}
                    className="panel-input"
                  />
                </div>
              </div>

              <div>
                <label className="panel-label">
                  Comentario
                </label>
                <textarea
                  name="comentario"
                  defaultValue={opinion.comentario ?? ""}
                  className="panel-input min-h-[110px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="panel-label">
                    Rating (1-5)
                  </label>
                  <input
                    name="rating"
                    type="number"
                    min={1}
                    max={5}
                    defaultValue={opinion.rating ?? 5}
                    className="panel-input"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                  <input
                    type="checkbox"
                    name="activo"
                    defaultChecked={Boolean(opinion.activo)}
                  />
                  Activa en la web
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <SubmitButton
                  className="px-5 py-2 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold transition-colors"
                >
                  Guardar cambios
                </SubmitButton>
                <button
                  formAction={deleteOpinion}
                  className="badge-danger px-5 py-2 rounded-xl hover:bg-red-500/30 transition"
                >
                  Eliminar
                </button>
              </div>
            </form>
          ))}
        </section>
      </div>
  );
}
