import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { subMonths, format, startOfMonth, endOfMonth } from "date-fns";
import {
  ReservasChart,
  IngresosChart,
  DestinosChart,
} from "@/components/admin/AdminAnalyticsCharts";

export const dynamic = "force-dynamic";

async function getClientAnalytics(clienteId: string) {
  // Últimos 6 meses
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    return {
      month: format(date, "MMM"),
      start: startOfMonth(date).toISOString(),
      end: endOfMonth(date).toISOString(),
    };
  });

  // Reservas por mes
  const reservasPorMes = await Promise.all(
    months.map(async (m) => {
      const { data: reservas } = await supabaseAdmin
        .from("reservas")
        .select("precio")
        .eq("cliente_id", clienteId)
        .gte("created_at", m.start)
        .lte("created_at", m.end);

      const count = reservas?.length || 0;
      const ingresos =
        reservas?.reduce((sum, r) => sum + (r.precio || 0), 0) || 0;

      return { month: m.month, reservas: count, ingresos };
    })
  );

  // Destinos más vendidos
  const { data: destinosData } = await supabaseAdmin
    .from("reservas")
    .select("destino")
    .eq("cliente_id", clienteId)
    .eq("estado_pago", "pagado");

  const destinosCount: Record<string, number> = {};
  destinosData?.forEach((r) => {
    destinosCount[r.destino] = (destinosCount[r.destino] || 0) + 1;
  });

  const topDestinos = Object.entries(destinosCount)
    .map(([destino, value]) => ({ destino, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return { reservasPorMes, topDestinos };
}

export default async function AdminAnalyticsPage() {
  const client = await requireAdminClient();
  const analytics = await getClientAnalytics(client.id);

  return (
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-white/60 mb-8">Métricas y estadísticas de tu agencia</p>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ReservasChart data={analytics.reservasPorMes} />
          <IngresosChart data={analytics.reservasPorMes} />
        </div>

        {/* Top destinos */}
        <DestinosChart data={analytics.topDestinos} />
      </div>
  );
}
