import { supabaseAdmin } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { getTranslations, getLocale } from "next-intl/server";
import {
  ArrowLeft,
  Hotel,
  Users,
  Plane,
  CreditCard,
  Calendar,
  MapPin,
  Star,
} from "lucide-react";
import PortalChatAdmin from "@/components/portal/PortalChatAdmin";

interface ReservaPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, never>>;
}

async function updateEstado(formData: FormData) {
  "use server";

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

async function confirmBooking(formData: FormData) {
  "use server";

  const clienteId = (await cookies()).get("cliente_id")?.value;
  if (!clienteId) return;

  const id = formData.get("id") as string;

  await supabaseAdmin
    .from("reservas")
    .update({ agency_confirmed: true, estado_pago: "confirmado" })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/admin/reservas");
  revalidatePath(`/admin/reserva/${id}`);
}

export default async function ReservaPage({ params, searchParams }: ReservaPageProps) {
  const { id } = await params;
  await searchParams;

  const t = await getTranslations("admin.reserva");
  const locale = await getLocale();

  const { data: reserva, error } = await supabaseAdmin
    .from("reservas")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !reserva) notFound();

  const client = await requireAdminClient();

  const bd = (reserva.booking_details as Record<string, any>) || {};
  const hotel = bd.hotel || null;
  const habitacion = bd.habitacion || null;
  const precioUnitario = bd.precio_unitario || null;
  const suplementoTotal = bd.suplemento_total || 0;
  const depositoPorPersona = bd.deposito_por_persona || null;
  const passengers = Array.isArray(reserva.passengers) ? reserva.passengers : [];

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
  };

  const bm = reserva.booking_model || "pago_completo";
  const statusSteps =
    bm === "deposito_resto"
      ? ["pendiente_pago", "deposito_pagado", "pagado"]
      : bm === "solo_reserva"
        ? ["pendiente_confirmacion", "confirmado", "pagado"]
        : ["pendiente", "revisada", "pagado"];
  const currentIdx = statusSteps.indexOf(reserva.estado_pago ?? statusSteps[0]);
  const isCancelled = reserva.estado_pago === "cancelada" || reserva.estado_pago === "vencido";

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      pendiente: t("pending"),
      pendiente_pago: t("pending"),
      revisada: t("reviewed"),
      pagado: t("paid"),
      deposito_pagado: t("depositPaid"),
      pendiente_confirmacion: t("pendingConfirmation"),
      confirmado: t("confirmed"),
      vencido: t("expired"),
      cancelada: t("cancelled"),
    };
    return map[s] || s;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <a
          href="/admin/reservas"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/60 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToBookings")}
        </a>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-drb-turquoise-600 dark:text-drb-turquoise-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {reserva.destino ?? "—"}
              </h1>
              <p className="text-xs text-gray-400 dark:text-white/40">ID: {reserva.id}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              isCancelled
                ? "badge-danger"
                : reserva.estado_pago === "pagado"
                  ? "badge-success"
                  : reserva.estado_pago === "deposito_pagado" || reserva.estado_pago === "confirmado" || reserva.estado_pago === "revisada"
                    ? "badge-info"
                    : "badge-warning"
            }`}
          >
            {statusLabel(reserva.estado_pago ?? "pendiente")}
          </span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="panel-card p-6">
        <div className="flex items-center justify-between">
          {statusSteps.map((step, idx) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isCancelled
                      ? "bg-red-100 dark:bg-red-500/15 text-red-500"
                      : idx <= currentIdx
                        ? "bg-drb-turquoise-500 text-white"
                        : "bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-white/30"
                  } ${!isCancelled && step === reserva.estado_pago ? "ring-4 ring-drb-turquoise-200 dark:ring-drb-turquoise-500/30" : ""}`}
                >
                  {idx + 1}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  !isCancelled && idx <= currentIdx
                    ? "text-drb-turquoise-600 dark:text-drb-turquoise-400"
                    : "text-gray-400 dark:text-white/30"
                }`}>
                  {statusLabel(step)}
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
          ))}
        </div>
        {isCancelled && (
          <div className="mt-4 text-center">
            <span className="badge-danger text-sm">{t("cancelled")}</span>
          </div>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Client + Travel info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Client info */}
          <div className="panel-card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-drb-turquoise-500" />
              {t("client")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-gray-400 dark:text-white/40 block mb-0.5">{t("client")}</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{reserva.nombre ?? "—"}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 dark:text-white/40 block mb-0.5">Email</span>
                <p className="text-sm text-gray-700 dark:text-white/80">{reserva.email ?? "—"}</p>
              </div>
              {reserva.telefono && (
                <div>
                  <span className="text-xs text-gray-400 dark:text-white/40 block mb-0.5">{t("phone") || "Teléfono"}</span>
                  <p className="text-sm text-gray-700 dark:text-white/80">{reserva.telefono}</p>
                </div>
              )}
            </div>
          </div>

          {/* Travel details */}
          <div className="panel-card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Plane className="w-4 h-4 text-drb-turquoise-500" />
              {t("dates")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-gray-400 dark:text-white/40 block mb-0.5">{t("dates")}</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(reserva.fecha_salida)} → {formatDate(reserva.fecha_regreso)}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400 dark:text-white/40 block mb-0.5">{t("persons")}</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {reserva.personas ?? "—"} pax
                  {(reserva.adults > 0 || reserva.children > 0) && (
                    <span className="text-gray-400 dark:text-white/40 ms-1">
                      ({reserva.adults} {t("adults")} · {reserva.children} {t("children")})
                    </span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400 dark:text-white/40 block mb-0.5">{t("created")}</span>
                <p className="text-sm text-gray-700 dark:text-white/80">
                  {reserva.created_at ? new Date(reserva.created_at).toLocaleString(locale) : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Hotel & Room (if booking_details available) */}
          {hotel && (
            <div className="panel-card p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Hotel className="w-4 h-4 text-drb-turquoise-500" />
                Hotel
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-gray-400 dark:text-white/40 block mb-0.5">Hotel</span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{hotel.nombre}</p>
                  {hotel.estrellas > 0 && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: hotel.estrellas }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  )}
                </div>
                {habitacion && (
                  <div>
                    <span className="text-xs text-gray-400 dark:text-white/40 block mb-0.5">{t("roomType") || "Habitación"}</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{habitacion.tipo}</p>
                  </div>
                )}
                {suplementoTotal > 0 && (
                  <div>
                    <span className="text-xs text-gray-400 dark:text-white/40 block mb-0.5">{t("supplement") || "Suplemento"}</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">+{suplementoTotal} €/pax</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Passengers table */}
          {passengers.length > 0 && (
            <div className="panel-card p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-drb-turquoise-500" />
                {t("passengers")} ({passengers.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-white/10 text-start">
                      <th className="text-start py-2 pe-4 text-xs text-gray-500 dark:text-white/50 font-medium">#</th>
                      <th className="text-start py-2 pe-4 text-xs text-gray-500 dark:text-white/50 font-medium">{t("client")}</th>
                      <th className="text-start py-2 pe-4 text-xs text-gray-500 dark:text-white/50 font-medium">{t("documentType")}</th>
                      <th className="text-start py-2 pe-4 text-xs text-gray-500 dark:text-white/50 font-medium">{t("documentNumber")}</th>
                      <th className="text-start py-2 pe-4 text-xs text-gray-500 dark:text-white/50 font-medium">{t("birthDate")}</th>
                      <th className="text-start py-2 pe-4 text-xs text-gray-500 dark:text-white/50 font-medium">{t("nationality")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passengers.map((p: any, i: number) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-white/5">
                        <td className="py-2.5 pe-4 text-gray-400 dark:text-white/40">{i + 1}</td>
                        <td className="py-2.5 pe-4 font-medium text-gray-900 dark:text-white">{p.fullName || p.name || "—"}</td>
                        <td className="py-2.5 pe-4 uppercase text-gray-500 dark:text-white/50">{p.docType || p.document_type || "—"}</td>
                        <td className="py-2.5 pe-4">{p.docNumber || p.document_number || "—"}</td>
                        <td className="py-2.5 pe-4">{p.dob || p.birth_date || "—"}</td>
                        <td className="py-2.5 pe-4">{p.nationality || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar: Payment + Price breakdown */}
        <div className="space-y-4">
          {/* Price breakdown */}
          <div className="panel-card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-drb-turquoise-500" />
              {t("price")}
            </h3>
            <div className="space-y-2.5">
              {precioUnitario && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-white/50">{t("pricePerPerson") || "Precio/persona"}</span>
                  <span className="text-gray-900 dark:text-white">{precioUnitario} €</span>
                </div>
              )}
              {suplementoTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-white/50">{t("supplement") || "Suplemento"}</span>
                  <span className="text-gray-900 dark:text-white">+{suplementoTotal} €</span>
                </div>
              )}
              {reserva.personas > 1 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-white/50">{t("persons")}</span>
                  <span className="text-gray-900 dark:text-white">×{reserva.personas}</span>
                </div>
              )}
              {depositoPorPersona && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-white/50">{t("deposit") || "Depósito"}</span>
                  <span className="text-gray-900 dark:text-white">{depositoPorPersona * (reserva.personas || 1)} €</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-white/10 pt-2.5 flex justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="text-lg font-bold text-drb-turquoise-600 dark:text-drb-turquoise-400">
                  {Number(reserva.precio).toLocaleString(locale)} €
                </span>
              </div>

              {/* Deposit / Remaining info for deposito_resto model */}
              {bm === "deposito_resto" && reserva.deposit_amount != null && (
                <div className="border-t border-gray-200 dark:border-white/10 pt-2.5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-white/50">{t("depositAmount")}</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {Number(reserva.deposit_amount).toLocaleString(locale)} €
                    </span>
                  </div>
                  {reserva.remaining_amount != null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-white/50">{t("remaining")}</span>
                      <span className={`font-medium ${reserva.remaining_paid ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                        {Number(reserva.remaining_amount).toLocaleString(locale)} €
                        {reserva.remaining_paid && " ✓"}
                      </span>
                    </div>
                  )}
                  {reserva.remaining_due_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-white/50">{t("remainingDueDate")}</span>
                      <span className="text-gray-700 dark:text-white/70">
                        {formatDate(reserva.remaining_due_date)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Booking model label */}
              {bm !== "pago_completo" && (
                <div className="border-t border-gray-200 dark:border-white/10 pt-2.5 flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-white/50">{t("bookingModel")}</span>
                  <span className="text-gray-700 dark:text-white/70 capitalize">
                    {bm.replace(/_/g, " ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Confirm booking button for solo_reserva */}
          {bm === "solo_reserva" && reserva.estado_pago === "pendiente_confirmacion" && !reserva.agency_confirmed && (
            <div className="panel-card p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {t("confirmBooking")}
              </h3>
              <p className="text-xs text-gray-500 dark:text-white/50 mb-3">
                {t("confirmBookingDesc")}
              </p>
              <form action={confirmBooking}>
                <input type="hidden" name="id" value={reserva.id} />
                <button type="submit" className="btn-primary text-sm w-full">
                  {t("confirmBooking")}
                </button>
              </form>
            </div>
          )}

          {/* Payment management */}
          <div className="panel-card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              {t("paymentStatus")}
            </h3>
            <form action={updateEstado} className="flex gap-2 mb-4">
              <input type="hidden" name="id" value={reserva.id} />
              <select
                name="estado"
                defaultValue={reserva.estado_pago ?? "pendiente"}
                className="panel-input flex-1 text-sm"
              >
                <option value="pagado">{t("paid")}</option>
                <option value="pendiente">{t("pending")}</option>
                <option value="revisada">{t("reviewed")}</option>
                <option value="cancelada">{t("cancelled")}</option>
                <option value="deposito_pagado">{t("depositPaid")}</option>
                <option value="pendiente_confirmacion">{t("pendingConfirmation")}</option>
                <option value="confirmado">{t("confirmed")}</option>
                <option value="vencido">{t("expired")}</option>
              </select>
              <button
                type="submit"
                className="btn-primary text-sm px-4"
              >
                {t("save")}
              </button>
            </form>

            {reserva.stripe_session_id && (
              <div>
                <span className="text-xs text-gray-400 dark:text-white/40 block mb-0.5">{t("stripeId")}</span>
                <p className="text-xs text-gray-500 dark:text-white/50 break-all font-mono">
                  {reserva.stripe_session_id}
                </p>
              </div>
            )}
          </div>

          {/* Calendar card */}
          <div className="panel-card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-drb-turquoise-500" />
              {t("dates")}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-white/50">{t("departure") || "Salida"}</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatDate(reserva.fecha_salida)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-white/50">{t("return") || "Regreso"}</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatDate(reserva.fecha_regreso)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-white/50">{t("created")}</span>
                <span className="text-gray-700 dark:text-white/70">
                  {reserva.created_at ? new Date(reserva.created_at).toLocaleDateString(locale) : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portal Chat — Traveler messages */}
      <PortalChatAdmin reservaId={reserva.id} />
    </div>
  );
}
