import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { subMonths, format, startOfMonth, endOfMonth } from "date-fns";
import {
  ReservasChart,
  IngresosChart,
  DestinosChart,
} from "@/components/admin/AdminAnalyticsCharts";

export const dynamic = "force-dynamic";

async function getClientAnalytics(clienteId: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

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
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie) {
    redirect("/admin/login");
  }

  const cliente = await getClientByDomain();
  if (!cliente) {
    return <div>Cliente no encontrado</div>;
  }

  const analytics = await getClientAnalytics(cliente.id);

  return (
    <div className="p-8">
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
