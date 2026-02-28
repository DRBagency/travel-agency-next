import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { getTranslations, getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  CalendarDays,
  MapPin,
  Users,
  Hotel,
  ExternalLink,
} from "lucide-react";

import CustomerCRMPanel from "./CustomerCRMPanel";
import CustomerActivitySection from "./CustomerActivitySection";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const client = await requireAdminClient();
  const t = await getTranslations("admin.crm");
  const locale = await getLocale();

  // Fetch customer
  const { data: customer } = await supabaseAdmin
    .from("agency_customers")
    .select("*")
    .eq("id", id)
    .eq("cliente_id", client.id)
    .single();

  if (!customer) notFound();

  // Fetch activities
  const { data: activities } = await supabaseAdmin
    .from("agency_customer_activities")
    .select("id, customer_id, type, content, metadata, created_at")
    .eq("customer_id", id)
    .eq("cliente_id", client.id)
    .order("created_at", { ascending: false })
    .limit(50);

  // Fetch reservas by email match — include booking_details, passengers, adults, children
  const reservas = customer.email
    ? (
        await supabaseAdmin
          .from("reservas")
          .select("id, nombre, destino, precio, estado_pago, fecha_salida, fecha_regreso, personas, adults, children, passengers, booking_details, created_at")
          .eq("cliente_id", client.id)
          .ilike("email", customer.email)
          .order("created_at", { ascending: false })
      ).data || []
    : [];

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusBadge: Record<string, string> = {
    pagado: "badge-success",
    pendiente: "badge-warning",
    pendiente_pago: "badge-warning",
    cancelada: "badge-danger",
    revisada: "badge-info",
  };

  // Compute favorite destinations
  const destCounts: Record<string, number> = {};
  for (const r of reservas) {
    const d = (r as Record<string, unknown>).destino as string;
    if (d) destCounts[d] = (destCounts[d] || 0) + 1;
  }
  const favDestinos = Object.entries(destCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Total travelers across bookings
  const totalPax = reservas.reduce((sum, r: any) => sum + (r.personas || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back link + header */}
      <div>
        <Link
          href="/admin/crm"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/60 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 text-drb-turquoise-600 dark:text-drb-turquoise-400 flex items-center justify-center text-lg font-bold shrink-0">
            {customer.nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {customer.nombre}
            </h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-400 dark:text-white/40">
              {customer.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {customer.email}
                </span>
              )}
              {customer.telefono && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {customer.telefono}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="panel-card p-3 text-center">
          <ShoppingBag className="w-4 h-4 mx-auto text-drb-turquoise-500 mb-1" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {customer.total_bookings}
          </div>
          <div className="text-xs text-gray-400 dark:text-white/40">{t("totalBookings")}</div>
        </div>
        <div className="panel-card p-3 text-center">
          <DollarSign className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {Number(customer.total_spent).toLocaleString(locale)} €
          </div>
          <div className="text-xs text-gray-400 dark:text-white/40">{t("totalSpent")}</div>
        </div>
        <div className="panel-card p-3 text-center">
          <CalendarDays className="w-4 h-4 mx-auto text-blue-500 mb-1" />
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatDate(customer.first_booking_at)}
          </div>
          <div className="text-xs text-gray-400 dark:text-white/40">{t("firstBooking")}</div>
        </div>
        <div className="panel-card p-3 text-center">
          <CalendarDays className="w-4 h-4 mx-auto text-purple-500 mb-1" />
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatDate(customer.last_booking_at)}
          </div>
          <div className="text-xs text-gray-400 dark:text-white/40">{t("lastBooking")}</div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: CRM Panel (status, notes, tags) */}
        <CustomerCRMPanel
          customerId={customer.id}
          notes={customer.notes || ""}
          leadStatus={customer.lead_status || "nuevo"}
          tags={(customer.tags as string[] | null) || []}
        />

        {/* Right: Booking history + Traveler insights */}
        <div className="space-y-4">
          {/* Booking history — expanded cards */}
          <div className="panel-card p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              {t("bookingHistory")} ({reservas.length})
            </h3>
            {reservas.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-white/40">{t("noBookings")}</p>
            ) : (
              <div className="space-y-3">
                {reservas.map((r: Record<string, unknown>) => {
                  const bd = (r.booking_details as Record<string, any>) || {};
                  const hotel = bd.hotel || null;
                  const habitacion = bd.habitacion || null;
                  const pax = r.personas as number;
                  const adults = (r.adults as number) || 0;
                  const children = (r.children as number) || 0;

                  return (
                    <div
                      key={r.id as string}
                      className="panel-card p-4 space-y-2.5"
                    >
                      {/* Header: destination + status + link */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-drb-turquoise-500" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {(r.destino as string) || "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] ${statusBadge[(r.estado_pago as string)] || "badge-info"}`}>
                            {r.estado_pago as string}
                          </span>
                          <Link
                            href={`/admin/reserva/${r.id}`}
                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 hover:text-drb-turquoise-500 transition-colors"
                            title="Ver detalle"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* Details grid */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400 dark:text-white/40 block">{t("dates")}</span>
                          <span className="text-gray-700 dark:text-white/70">
                            {formatDate(r.fecha_salida as string)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 dark:text-white/40 block">{t("travelers") || "Viajeros"}</span>
                          <span className="text-gray-700 dark:text-white/70">
                            {pax} pax
                            {(adults > 0 || children > 0) && (
                              <span className="text-gray-400 dark:text-white/30 ms-1">
                                ({adults}A · {children}N)
                              </span>
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 dark:text-white/40 block">{t("totalSpent") || "Total"}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {Number(r.precio).toLocaleString(locale)} €
                          </span>
                        </div>
                      </div>

                      {/* Hotel info if available */}
                      {hotel && (
                        <div className="flex items-center gap-2 text-xs bg-gray-50 dark:bg-white/[0.03] rounded-lg px-2.5 py-1.5">
                          <Hotel className="w-3 h-3 text-gray-400 dark:text-white/40" />
                          <span className="text-gray-600 dark:text-white/60">
                            {hotel.nombre}
                            {hotel.estrellas > 0 && ` ${"★".repeat(hotel.estrellas)}`}
                            {habitacion && ` · ${habitacion.tipo}`}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Traveler insights */}
          {reservas.length > 0 && (
            <div className="panel-card p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                {t("travelerInsights") || "Resumen del viajero"}
              </h3>
              <div className="space-y-3">
                {/* Favorite destinations */}
                {favDestinos.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-400 dark:text-white/40 block mb-1.5">
                      {t("favoriteDestinations") || "Destinos favoritos"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {favDestinos.map(([dest, count]) => (
                        <span
                          key={dest}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-drb-turquoise-50 dark:bg-drb-turquoise-500/10 text-drb-turquoise-700 dark:text-drb-turquoise-400 border border-drb-turquoise-200 dark:border-drb-turquoise-500/20"
                        >
                          <MapPin className="w-3 h-3" />
                          {dest}
                          {count > 1 && (
                            <span className="text-[10px] text-drb-turquoise-500/60">×{count}</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total travelers booked */}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-gray-500 dark:text-white/50">
                    <Users className="w-3.5 h-3.5" />
                    {t("totalTravelers") || "Total viajeros reservados"}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">{totalPax}</span>
                </div>

                {/* Average booking value */}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-gray-500 dark:text-white/50">
                    <DollarSign className="w-3.5 h-3.5" />
                    {t("avgBookingValue") || "Valor medio por reserva"}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {reservas.length > 0
                      ? Math.round(Number(customer.total_spent) / reservas.length).toLocaleString(locale)
                      : 0} €
                  </span>
                </div>

                {/* Member since */}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-gray-500 dark:text-white/50">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {t("memberSince") || "Cliente desde"}
                  </span>
                  <span className="text-gray-700 dark:text-white/70">
                    {formatDate(customer.created_at)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-width: Activity registration + Timeline */}
      <CustomerActivitySection
        customerId={customer.id}
        activities={activities || []}
      />
    </div>
  );
}
