import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import SubmitButton from "@/components/admin/SubmitButton";
import { requireAdminClient } from "@/lib/requireAdminClient";
import StarRating from "@/components/ui/StarRating";
import OpinionesClient from "./OpinionesClient";
import { Star, Plus, MessageSquare } from "lucide-react";

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

  const opinionesSafe = opiniones ?? [];
  const avgRating = opinionesSafe.length > 0
    ? (opinionesSafe.reduce((sum, o) => sum + (o.rating || 0), 0) / opinionesSafe.length).toFixed(1)
    : "0.0";
  const activeCount = opinionesSafe.filter(o => o.activo).length;

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: opinionesSafe.filter(o => o.rating === stars).length,
    percent: opinionesSafe.length > 0
      ? Math.round((opinionesSafe.filter(o => o.rating === stars).length / opinionesSafe.length) * 100)
      : 0,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Opiniones</h1>
        <p className="text-gray-400 dark:text-white/40">
          {opinionesSafe.length} opiniones · {activeCount} publicadas
        </p>
      </div>

      {/* Stats panel */}
      <div className="panel-card p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Average rating */}
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-gray-900 dark:text-white">{avgRating}</div>
            <div>
              <StarRating value={Math.round(Number(avgRating))} readonly size="lg" />
              <p className="text-sm text-gray-400 dark:text-white/40 mt-1">{opinionesSafe.length} reviews</p>
            </div>
          </div>
          {/* Distribution bars */}
          <div className="flex-1 space-y-1.5">
            {distribution.map(({ stars, count, percent }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-white/50 w-6 text-right">{stars}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 dark:text-white/40 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create form */}
      <details className="panel-card group">
        <summary className="flex items-center gap-3 p-6 cursor-pointer list-none">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/15 flex items-center justify-center">
            <Plus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Nueva opinión</h2>
            <p className="text-sm text-gray-400 dark:text-white/40">Click para añadir una nueva opinión</p>
          </div>
        </summary>
        <div className="px-6 pb-6 border-t border-gray-100 dark:border-white/[0.06] pt-6">
          <OpinionesClient
            clientId={client.id}
            createAction={createOpinion}
            mode="create"
          />
        </div>
      </details>

      {/* Review cards */}
      {opinionesSafe.length === 0 && (
        <div className="panel-card p-12 text-center">
          <MessageSquare className="w-10 h-10 text-gray-300 dark:text-white/20 mx-auto mb-3" />
          <p className="text-gray-400 dark:text-white/40">Todavía no hay opiniones.</p>
        </div>
      )}

      <div className="space-y-4">
        {opinionesSafe.map((opinion) => {
          const initial = (opinion.nombre || "?").charAt(0).toUpperCase();
          const colors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"];
          const colorIdx = opinion.nombre
            ? opinion.nombre.charCodeAt(0) % colors.length
            : 0;

          return (
            <div key={opinion.id} className="panel-card p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-11 h-11 rounded-full ${colors[colorIdx]} flex items-center justify-center text-white font-semibold text-sm shrink-0`}>
                  {initial}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        {opinion.nombre || "Anónimo"}
                      </span>
                      {opinion.ubicacion && (
                        <span className="text-gray-400 dark:text-white/40 text-sm ml-2">
                          · {opinion.ubicacion}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {opinion.activo ? (
                        <span className="badge-success">Publicada</span>
                      ) : (
                        <span className="badge-warning">Borrador</span>
                      )}
                    </div>
                  </div>

                  {/* Stars + date */}
                  <div className="flex items-center gap-3 mb-3">
                    <StarRating value={opinion.rating ?? 0} readonly size="sm" />
                    <span className="text-xs text-gray-400 dark:text-white/30">
                      {new Date(opinion.created_at).toLocaleDateString("es-ES")}
                    </span>
                  </div>

                  {/* Comment */}
                  {opinion.comentario && (
                    <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed mb-4">
                      {opinion.comentario}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
                    <form action={updateOpinion} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={opinion.id} />
                      <input type="hidden" name="nombre" value={opinion.nombre ?? ""} />
                      <input type="hidden" name="ubicacion" value={opinion.ubicacion ?? ""} />
                      <input type="hidden" name="comentario" value={opinion.comentario ?? ""} />
                      <input type="hidden" name="rating" value={opinion.rating ?? 5} />
                      {opinion.activo ? (
                        <SubmitButton className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors">
                          Despublicar
                        </SubmitButton>
                      ) : (
                        <>
                          <input type="hidden" name="activo" value="on" />
                          <SubmitButton className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 transition-colors">
                            Publicar
                          </SubmitButton>
                        </>
                      )}
                    </form>
                    <form action={deleteOpinion}>
                      <input type="hidden" name="id" value={opinion.id} />
                      <SubmitButton className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                        Eliminar
                      </SubmitButton>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
