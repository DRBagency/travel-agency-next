import { supabaseAdmin } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { getTranslations } from "next-intl/server";

interface ReservaPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
  }>;
}

async function updateEstado(formData: FormData) {
  "use server";

  const t = await getTranslations('admin.reserva');

  const clienteId = (await cookies()).get("cliente_id")?.value;
  if (!clienteId) return;

  const id = formData.get("id") as string;
  const estado = formData.get("estado") as string;

  await supabaseAdmin
    .from("reservas")
    .update({ estado_pago: estado })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/admin/reservas");
  revalidatePath(`/admin/reserva/${id}`);
}

export default async function ReservaPage({
  params,
  searchParams,
}: ReservaPageProps) {
  const { id } = await params;
  await searchParams;

  const t = await getTranslations('admin.reserva');
  const tc = await getTranslations('common');

  const { data: reserva, error } = await supabaseAdmin
    .from("reservas")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !reserva) {
    notFound();
  }

  const client = await requireAdminClient();
  const brandStyle = client?.primary_color
    ? { backgroundColor: client.primary_color }
    : undefined;

  const badgeStyle = client?.primary_color
    ? {
        borderColor: client.primary_color,
        backgroundColor: `color-mix(in srgb, ${client.primary_color} 15%, transparent)`,
        color: client.primary_color,
      }
    : undefined;

  return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('bookingTitle')} · {reserva.destino ?? "—"}
            </h1>
            <p className="text-gray-400 dark:text-white/40">ID: {reserva.id}</p>
          </div>
          <span
            className="px-3 py-1 text-sm font-semibold rounded-full border"
            style={badgeStyle}
          >
            {reserva.estado_pago ?? "pendiente"}
          </span>
        </div>

        {/* Status Timeline */}
        <div className="panel-card p-6">
          <div className="flex items-center justify-between">
            {["pendiente", "revisada", "pagado"].map((step, idx) => {
              const steps = ["pendiente", "revisada", "pagado"];
              const currentIdx = steps.indexOf(reserva.estado_pago ?? "pendiente");
              const isCancelled = reserva.estado_pago === "cancelada";
              const isActive = !isCancelled && idx <= currentIdx;
              const isCurrent = !isCancelled && step === reserva.estado_pago;

              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        isCancelled
                          ? "bg-red-100 dark:bg-red-500/15 text-red-500"
                          : isActive
                            ? "bg-drb-turquoise-500 text-white"
                            : "bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-white/30"
                      } ${isCurrent ? "ring-4 ring-drb-turquoise-200 dark:ring-drb-turquoise-500/30" : ""}`}
                    >
                      {idx + 1}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${
                      isActive && !isCancelled
                        ? "text-drb-turquoise-600 dark:text-drb-turquoise-400"
                        : "text-gray-400 dark:text-white/30"
                    }`}>
                      {step === "pendiente" ? t("pending") : step === "revisada" ? t("reviewed") : t("paid")}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className={`flex-1 h-0.5 mx-3 ${
                      !isCancelled && idx < currentIdx
                        ? "bg-drb-turquoise-500"
                        : "bg-gray-200 dark:bg-white/10"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          {reserva.estado_pago === "cancelada" && (
            <div className="mt-4 text-center">
              <span className="badge-danger text-sm">{t("cancelled")}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4 border border-gray-100 dark:border-white/10 rounded-2xl p-6 bg-gray-50/50 dark:bg-white/5">
          <div>
            <span className="text-gray-500 dark:text-white/60">{t('client')}</span>
            <p className="font-semibold">{reserva.nombre ?? "—"}</p>
            <p className="text-sm text-gray-400 dark:text-white/50">
              {reserva.email ?? "—"}
            </p>
            {reserva.telefono && (
              <p className="text-sm text-gray-400 dark:text-white/50">
                Tel: {reserva.telefono}
              </p>
            )}
          </div>

          <div>
            <span className="text-gray-500 dark:text-white/60">{t('dates')}</span>
            <p>
              {reserva.fecha_salida ?? "—"} →{" "}
              {reserva.fecha_regreso ?? "—"}
            </p>
          </div>

          <div>
            <span className="text-gray-500 dark:text-white/60">{t('persons')}</span>
            <p>{reserva.personas ?? "—"}</p>
          </div>

          <div>
            <span className="text-gray-500 dark:text-white/60">{t('price')}</span>
            <p className="font-bold">{reserva.precio ?? "—"} €</p>
          </div>
        </div>

        <div className="space-y-4 border border-gray-100 dark:border-white/10 rounded-2xl p-6 bg-gray-50/50 dark:bg-white/5">
          <div>
            <span className="text-gray-500 dark:text-white/60">
              {t('paymentStatus')}
            </span>
            <form action={updateEstado} className="mt-2 flex gap-2">
              <input type="hidden" name="id" value={reserva.id} />
              <select
                name="estado"
                defaultValue={reserva.estado_pago ?? "pendiente"}
                className="border rounded-xl px-2 py-1 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white border-gray-200 dark:border-white/10"
              >
                <option value="pagado">{t('paid')}</option>
                <option value="pendiente">{t('pending')}</option>
                <option value="revisada">{t('reviewed')}</option>
                <option value="cancelada">{t('cancelled')}</option>
              </select>
              <button
                type="submit"
                className={
                  client?.primary_color
                    ? "px-3 py-1 text-sm text-white rounded-lg"
                    : "px-3 py-1 text-sm bg-gray-900 dark:bg-white text-white dark:text-slate-950 rounded-lg"
                }
                style={brandStyle}
              >
                {t('save')}
              </button>
            </form>
          </div>

          <div>
            <span className="text-gray-500 dark:text-white/60">{t('stripeId')}</span>
            <p className="text-sm break-all">
              {reserva.stripe_session_id ?? "—"}
            </p>
          </div>

          <div>
            <span className="text-gray-500 dark:text-white/60">{t('created')}</span>
            <p>
              {reserva.created_at
                ? new Date(reserva.created_at).toLocaleString()
                : "—"}
            </p>
          </div>
        </div>
      </div>

        <div className="mt-2">
        <a
          href={`/admin/reservas`}
          className="text-gray-600 dark:text-white/70 underline hover:text-gray-900 dark:hover:text-white"
        >
          {`← ${t('backToBookings')}`}
        </a>
        </div>
      </div>
  );
}
