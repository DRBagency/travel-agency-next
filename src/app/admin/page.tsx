import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import DashboardCard from "@/components/ui/DashboardCard";
import { ReservasChart, IngresosChart } from "@/components/admin/AdminAnalyticsCharts";
import { subMonths, format, startOfMonth, endOfMonth } from "date-fns";
import {
  Globe,
  MapPin,
  CalendarCheck,
  Star,
  Mail,
  FileText,
  CreditCard,
  BarChart3,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const client = await requireAdminClient();

  /* Métricas de reservas */
  const { data: reservas } = await supabaseAdmin
    .from("reservas")
    .select("precio, estado_pago, created_at, destino, nombre")
    .eq("cliente_id", client.id)
    .order("created_at", { ascending: false });

  /* Destinos activos */
  const { count: destinosActivos } = await supabaseAdmin
    .from("destinos")
    .select("id", { count: "exact", head: true })
    .eq("cliente_id", client.id)
    .eq("activo", true);

  const reservasSafe = reservas ?? [];
  const pagadas = reservasSafe.filter((r) => r.estado_pago === "pagado");
  const totalFacturado = pagadas.reduce((sum, r) => sum + Number(r.precio), 0);
  const numeroReservas = pagadas.length;
  const ticketMedio = numeroReservas > 0 ? Math.round(totalFacturado / numeroReservas) : 0;

  /* Chart data — últimos 6 meses */
  const now = new Date();
  const reservasChartData: { month: string; reservas: number }[] = [];
  const ingresosChartData: { month: string; ingresos: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const label = format(monthDate, "MMM yy");

    const monthReservas = pagadas.filter((r) => {
      const d = new Date(r.created_at);
      return d >= monthStart && d <= monthEnd;
    });

    reservasChartData.push({ month: label, reservas: monthReservas.length });
    ingresosChartData.push({
      month: label,
      ingresos: monthReservas.reduce((sum, r) => sum + Number(r.precio), 0),
    });
  }

  return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Dashboard</h1>
          <p className="text-gray-500 dark:text-white/60">Vista general de tu agencia</p>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="kpi-card">
            <p className="text-sm text-gray-500 dark:text-white/60 mb-1">Total facturado</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalFacturado} €</p>
          </div>
          <div className="kpi-card border-drb-lime-200 dark:border-drb-lime-500/25">
            <p className="text-sm text-gray-500 dark:text-white/60 mb-1">Reservas pagadas</p>
            <p className="text-2xl font-bold text-drb-lime-600 dark:text-drb-lime-400">{numeroReservas}</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-gray-500 dark:text-white/60 mb-1">Ticket medio</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{ticketMedio} €</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-gray-500 dark:text-white/60 mb-1">Destinos activos</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{destinosActivos ?? 0}</p>
          </div>
        </div>

        {/* 2 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ReservasChart data={reservasChartData} />
          <IngresosChart data={ingresosChartData} />
        </div>

        {/* Navigation Cards */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Gestiona tu agencia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <DashboardCard
              icon={<Globe className="w-7 h-7" />}
              title="Contenido Web"
              subtitle="Hero, stats, textos"
              href="/admin/contenido"
            />
            <DashboardCard
              icon={<MapPin className="w-7 h-7" />}
              title="Destinos"
              subtitle="Crear y editar"
              href="/admin/destinos"
            />
            <DashboardCard
              icon={<CalendarCheck className="w-7 h-7" />}
              title="Reservas"
              subtitle="Ver y filtrar"
              href="/admin/reservas"
            />
            <DashboardCard
              icon={<Star className="w-7 h-7" />}
              title="Opiniones"
              subtitle="Moderar reviews"
              href="/admin/opiniones"
            />
            <DashboardCard
              icon={<Mail className="w-7 h-7" />}
              title="Emails"
              subtitle="Templates automáticos"
              href="/admin/emails"
            />
            <DashboardCard
              icon={<FileText className="w-7 h-7" />}
              title="Páginas Legales"
              subtitle="Privacidad, términos"
              href="/admin/legales"
            />
            <DashboardCard
              icon={<CreditCard className="w-7 h-7" />}
              title="Stripe / Pagos"
              subtitle="Suscripción y cobros"
              href="/admin/stripe"
            />
            <DashboardCard
              icon={<BarChart3 className="w-7 h-7" />}
              title="Analytics"
              subtitle="Métricas y gráficas"
              href="/admin/analytics"
              glowColor="lime"
            />
          </div>
        </div>

        {/* Últimas reservas */}
        <div className="panel-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Últimas reservas</h2>
            <a
              href="/admin/reservas"
              className="text-sm px-3 py-1.5 rounded-lg bg-drb-turquoise-500 hover:bg-drb-turquoise-600 text-white font-bold transition-colors"
            >
              Ver todas
            </a>
          </div>
          {reservasSafe.length === 0 ? (
            <p className="text-gray-500 dark:text-white/50">No hay reservas todavía.</p>
          ) : (
            <div className="space-y-3">
              {reservasSafe.slice(0, 5).map((r: any) => (
                <div
                  key={r.id || r.created_at}
                  className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3"
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{r.nombre || "Reserva"}</div>
                    <div className="text-sm text-gray-500 dark:text-white/50">
                      {r.destino || "—"} · {new Date(r.created_at).toLocaleDateString("es-ES")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{r.precio} €</span>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      r.estado_pago === "pagado"
                        ? "badge-success"
                        : r.estado_pago === "pendiente"
                          ? "badge-warning"
                          : "badge-info"
                    }`}>
                      {r.estado_pago}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}
