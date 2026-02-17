import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { subMonths, format, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import {
  ReservasChart,
  IngresosChart,
  DestinosChart,
} from "@/components/admin/AdminAnalyticsCharts";
import ExportPDFButton from "@/components/admin/ExportPDFButton";

export const dynamic = "force-dynamic";

interface AnalyticsPageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

async function getClientAnalytics(clienteId: string, fromDate?: string, toDate?: string) {
  const monthCount = 6;
  const months = Array.from({ length: monthCount }, (_, i) => {
    const date = subMonths(new Date(), monthCount - 1 - i);
    return {
      month: format(date, "MMM yy", { locale: es }),
      start: startOfMonth(date).toISOString(),
      end: endOfMonth(date).toISOString(),
    };
  });

  const reservasPorMes = await Promise.all(
    months.map(async (m) => {
      const { data: reservas } = await supabaseAdmin
        .from("reservas")
        .select("precio, estado_pago")
        .eq("cliente_id", clienteId)
        .gte("created_at", m.start)
        .lte("created_at", m.end);

      const all = reservas || [];
      const pagadas = all.filter((r) => r.estado_pago === "pagado");
      const ingresos = pagadas.reduce((sum, r) => sum + (r.precio || 0), 0);

      return {
        month: m.month,
        reservas: all.length,
        pagadas: pagadas.length,
        ingresos,
      };
    })
  );

  let destinosQuery = supabaseAdmin
    .from("reservas")
    .select("destino")
    .eq("cliente_id", clienteId)
    .eq("estado_pago", "pagado");

  if (fromDate) destinosQuery = destinosQuery.gte("created_at", `${fromDate}T00:00:00.000Z`);
  if (toDate) destinosQuery = destinosQuery.lte("created_at", `${toDate}T23:59:59.999Z`);

  const { data: destinosData } = await destinosQuery;

  const destinosCount: Record<string, number> = {};
  destinosData?.forEach((r) => {
    destinosCount[r.destino] = (destinosCount[r.destino] || 0) + 1;
  });

  const topDestinos = Object.entries(destinosCount)
    .map(([destino, value]) => ({ destino, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const totalReservas = reservasPorMes.reduce((s, m) => s + m.reservas, 0);
  const totalPagadas = reservasPorMes.reduce((s, m) => s + m.pagadas, 0);
  const totalIngresos = reservasPorMes.reduce((s, m) => s + m.ingresos, 0);
  const ticketMedio = totalPagadas > 0 ? Math.round(totalIngresos / totalPagadas) : 0;
  const conversionRate = totalReservas > 0 ? Math.round((totalPagadas / totalReservas) * 100) : 0;

  return {
    reservasPorMes,
    topDestinos,
    kpis: { totalReservas, totalPagadas, totalIngresos, ticketMedio, conversionRate },
  };
}

export default async function AdminAnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const client = await requireAdminClient();
  const { from = "", to = "" } = await searchParams;
  const analytics = await getClientAnalytics(client.id, from || undefined, to || undefined);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Analytics</h1>
          <p className="text-gray-500 dark:text-white/60">
            Metricas y estadisticas de tu agencia (ultimos 6 meses)
          </p>
        </div>
      </div>

      {/* Filters */}
      <form method="get" className="flex flex-wrap gap-3 mb-6">
        <input
          type="date"
          name="from"
          defaultValue={from}
          className="panel-input"
        />
        <input
          type="date"
          name="to"
          defaultValue={to}
          className="panel-input"
        />
        <button className="px-4 py-2 bg-drb-turquoise-500 hover:bg-drb-turquoise-600 text-white rounded-xl font-bold transition-colors">
          Filtrar
        </button>
        <div className="ml-auto flex gap-2">
          <ExportPDFButton estado="todos" q="" from={from} to={to} />
          <a
            href={`/api/admin/export?estado=todos&q=&from=${from}&to=${to}`}
            className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-xl font-semibold transition-colors"
          >
            Exportar CSV
          </a>
        </div>
      </form>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="kpi-card">
          <p className="text-sm text-gray-500 dark:text-white/60">Total reservas</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.kpis.totalReservas}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm text-gray-500 dark:text-white/60">Pagadas</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-green-400">{analytics.kpis.totalPagadas}</p>
        </div>
        <div className="kpi-card border-drb-lime-200 dark:border-drb-lime-500/25">
          <p className="text-sm text-gray-500 dark:text-white/60">Ingresos totales</p>
          <p className="text-2xl font-bold text-drb-lime-600 dark:text-drb-lime-400">{analytics.kpis.totalIngresos.toLocaleString("es-ES")} EUR</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm text-gray-500 dark:text-white/60">Ticket medio</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.kpis.ticketMedio} EUR</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm text-gray-500 dark:text-white/60">Tasa conversion</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.kpis.conversionRate}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ReservasChart data={analytics.reservasPorMes} />
        <IngresosChart data={analytics.reservasPorMes} />
      </div>

      {/* Top destinos + Monthly table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DestinosChart data={analytics.topDestinos} />

        <div className="panel-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Desglose mensual</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10">
                  <th className="text-left p-2 text-gray-500 dark:text-white/60">Mes</th>
                  <th className="text-right p-2 text-gray-500 dark:text-white/60">Reservas</th>
                  <th className="text-right p-2 text-gray-500 dark:text-white/60">Pagadas</th>
                  <th className="text-right p-2 text-gray-500 dark:text-white/60">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {analytics.reservasPorMes.map((m) => (
                  <tr key={m.month} className="table-row">
                    <td className="p-2 text-gray-900 dark:text-white">{m.month}</td>
                    <td className="p-2 text-right text-gray-500 dark:text-white/60">{m.reservas}</td>
                    <td className="p-2 text-right text-emerald-600 dark:text-green-400">{m.pagadas}</td>
                    <td className="p-2 text-right text-drb-lime-600 dark:text-drb-lime-400">{m.ingresos.toLocaleString("es-ES")} EUR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
