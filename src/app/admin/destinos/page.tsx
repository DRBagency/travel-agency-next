import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import SubmitButton from "@/components/admin/SubmitButton";
import { requireAdminClient } from "@/lib/requireAdminClient";
import DeleteWithConfirm from "@/components/ui/DeleteWithConfirm";
import DestinoCreateForm from "./DestinoCreateForm";
import { MapPin, Trash2, Sparkles } from "lucide-react";
import { getTranslations } from 'next-intl/server';

async function createDestino(formData: FormData) {
  "use server";

  const clientId = (await cookies()).get("cliente_id")?.value;
  if (!clientId) return;

  const itinerarioRaw = formData.get("itinerario") as string | null;

  const payload: Record<string, any> = {
    cliente_id: clientId,
    nombre: (formData.get("nombre") as string) || null,
    descripcion: (formData.get("descripcion") as string) || null,
    precio: Number(formData.get("precio") || 0) || 0,
    imagen_url: (formData.get("imagen_url") as string) || null,
    activo: formData.get("activo") === "on",
    itinerario: itinerarioRaw ? JSON.parse(itinerarioRaw) : null,
  };

  await supabaseAdmin.from("destinos").insert(payload);
  revalidatePath("/");
  revalidatePath("/admin/destinos");
}

async function updateDestino(formData: FormData) {
  "use server";

  const clientId = (await cookies()).get("cliente_id")?.value;
  if (!clientId) return;

  const id = formData.get("id") as string;
  const itinerarioRaw = formData.get("itinerario") as string | null;

  const payload: Record<string, any> = {
    nombre: (formData.get("nombre") as string) || null,
    descripcion: (formData.get("descripcion") as string) || null,
    precio: Number(formData.get("precio") || 0) || 0,
    imagen_url: (formData.get("imagen_url") as string) || null,
    activo: formData.get("activo") === "on",
    itinerario: itinerarioRaw ? JSON.parse(itinerarioRaw) : null,
  };

  await supabaseAdmin.from("destinos").update(payload).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/destinos");
}

async function deleteDestino(formData: FormData) {
  "use server";

  const clientId = (await cookies()).get("cliente_id")?.value;
  if (!clientId) return;

  const id = formData.get("id") as string;

  await supabaseAdmin.from("destinos").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/destinos");
}

interface AdminDestinosPageProps {
  searchParams: Promise<{}>;
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

  const activeCount = destinos?.filter(d => d.activo).length ?? 0;

  const t = await getTranslations('admin.destinos');
  const tc = await getTranslations('common');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('title')}</h1>
          <p className="text-gray-400 dark:text-white/40">
            {t('count', { total: destinos?.length ?? 0, active: activeCount })}
          </p>
        </div>
      </div>

      {/* Create form with AI generator */}
      <DestinoCreateForm
        action={createDestino}
        clienteId={client.id}
        plan={client.plan}
        labels={{
          name: tc('name'),
          description: tc('description'),
          priceLabel: t('priceLabel'),
          pricePlaceholder: t('pricePlaceholder'),
          descriptionPlaceholder: t('descriptionPlaceholder'),
          namePlaceholder: t('namePlaceholder'),
          publishNow: tc('publishNow'),
          saveDestination: t('saveDestination'),
        }}
      />

      {/* Destinations Visual Grid */}
      {(!destinos || destinos.length === 0) && (
        <div className="panel-card p-12 text-center">
          <MapPin className="w-10 h-10 text-gray-300 dark:text-white/20 mx-auto mb-3" />
          <p className="text-gray-400 dark:text-white/40">{t('noDestinations')}</p>
          <p className="text-sm text-gray-300 dark:text-white/20 mt-1">{t('addFirstDestination')}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {destinos?.map((destino) => {
          const dias = destino.itinerario?.dias || destino.itinerario?.days || [];
          return (
            <div
              key={destino.id}
              className="group panel-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              {/* Image with overlay */}
              <div className="relative h-52 bg-gray-100 dark:bg-white/[0.04] overflow-hidden">
                {destino.imagen_url ? (
                  <img
                    src={destino.imagen_url}
                    alt={destino.nombre ?? ""}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src="/images/placeholder-destination.svg"
                    alt={t('noImage')}
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Status badge + AI badge */}
                <div className="absolute top-3 end-3 flex items-center gap-2">
                  {destino.itinerario && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-drb-turquoise-500/90 text-white shadow-lg backdrop-blur-sm">
                      <Sparkles className="w-3 h-3" />
                      {t('hasItinerary')}
                    </span>
                  )}
                  {destino.activo ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-lg">
                      {tc('active')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-800/70 text-white/80 backdrop-blur-sm">
                      {tc('inactive')}
                    </span>
                  )}
                </div>

                {/* Info overlaid on image */}
                <div className="absolute bottom-0 start-0 end-0 p-4">
                  <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>{t('destination')}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{destino.nombre || t('noName')}</h3>
                  {destino.descripcion && (
                    <p className="text-white/70 text-sm mt-1 line-clamp-2">{destino.descripcion}</p>
                  )}
                </div>
              </div>

              {/* Bottom info + actions */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {destino.precio ?? 0} €
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={updateDestino}>
                      <input type="hidden" name="id" value={destino.id} />
                      <input type="hidden" name="nombre" value={destino.nombre ?? ""} />
                      <input type="hidden" name="descripcion" value={destino.descripcion ?? ""} />
                      <input type="hidden" name="precio" value={destino.precio ?? 0} />
                      <input type="hidden" name="imagen_url" value={destino.imagen_url ?? ""} />
                      <input type="hidden" name="itinerario" value={destino.itinerario ? JSON.stringify(destino.itinerario) : ""} />
                      {destino.activo ? (
                        <SubmitButton className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors">
                          {tc('deactivate')}
                        </SubmitButton>
                      ) : (
                        <>
                          <input type="hidden" name="activo" value="on" />
                          <SubmitButton className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 transition-colors">
                            {tc('activate')}
                          </SubmitButton>
                        </>
                      )}
                    </form>
                    <DeleteWithConfirm
                      action={deleteDestino}
                      hiddenFields={{ id: destino.id }}
                      title={tc('confirmDelete')}
                      description={tc('confirmDeleteDesc')}
                      confirmLabel={tc('delete')}
                      cancelLabel={tc('cancel')}
                      trigger={
                        <button type="button" className="p-1.5 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Itinerary accordion */}
              {destino.itinerario && dias.length > 0 && (
                <details className="border-t border-gray-100 dark:border-white/[0.06]">
                  <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer list-none text-sm text-gray-500 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <Sparkles className="w-3.5 h-3.5 text-drb-turquoise-500" />
                    <span className="font-medium">{t('hasItinerary')} — {dias.length} días</span>
                  </summary>
                  <div className="px-4 pb-4 space-y-1.5 max-h-48 overflow-y-auto">
                    {dias.map((dia: any, i: number) => (
                      <div
                        key={i}
                        className="text-xs text-gray-500 dark:text-white/50 border-s-2 border-drb-turquoise-300 dark:border-drb-turquoise-500/40 ps-3 py-1"
                      >
                        <span className="font-medium text-gray-700 dark:text-white/70">
                          Día {i + 1}:
                        </span>{" "}
                        {dia.titulo || dia.title || `Day ${i + 1}`}
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
