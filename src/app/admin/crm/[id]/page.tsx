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
} from "lucide-react";

import CustomerCRMPanel from "./CustomerCRMPanel";

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

  // Fetch reservas by email match
  const reservas = customer.email
    ? (
        await supabaseAdmin
          .from("reservas")
          .select("id, nombre, destino, precio, estado_pago, fecha_salida, personas, created_at")
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
    cancelada: "badge-danger",
    revisada: "badge-info",
  };

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
        {/* Left: CRM Panel */}
        <CustomerCRMPanel
          customerId={customer.id}
          notes={customer.notes || ""}
          leadStatus={customer.lead_status || "nuevo"}
          tags={(customer.tags as string[] | null) || []}
          activities={activities || []}
        />

        {/* Right: Booking history */}
        <div className="space-y-4">
          <div className="panel-card p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              {t("bookingHistory")}
            </h3>
            {reservas.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-white/40">{t("noBookings")}</p>
            ) : (
              <div className="space-y-3">
                {reservas.map((r: Record<string, unknown>) => (
                  <Link
                    key={r.id as string}
                    href={`/admin/reserva/${r.id}`}
                    className="block panel-card p-3 hover:shadow-200 hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {(r.destino as string) || "—"}
                      </span>
                      <span className={statusBadge[(r.estado_pago as string)] || "badge-info"}>
                        {r.estado_pago as string}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-white/40">
                      <span>{Number(r.precio).toLocaleString(locale)} €</span>
                      <span>{r.personas as number} pax</span>
                      <span>{formatDate(r.created_at as string)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
