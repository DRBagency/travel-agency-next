import { supabaseAdmin } from "@/lib/supabase-server";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdminClient } from "@/lib/requireAdminClient";
import DashboardCard from "@/components/ui/DashboardCard";
import { ReservasChart, IngresosChart } from "@/components/admin/AdminAnalyticsCharts";
import { subMonths, format, startOfMonth, endOfMonth } from "date-fns";

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
    <AdminShell
      clientName={client.nombre}
      primaryColor={client.primary_color}
      logoUrl={client.logo_url}
      subscriptionActive={Boolean(client.stripe_subscription_id)}
    >
      <div className="space-y-8">
        {/* Header premium */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-white/40 text-sm">{client.nombre} — Panel Agencia</span>
          </div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-white/60">Vista general de tu agencia</p>
        </div>

        {/* 4 Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl p-5 bg-white/15 border border-white/20 backdrop-blur-sm">
            <p className="text-sm text-white/60 mb-1">Total facturado</p>
            <p className="text-2xl font-bold text-white">{totalFacturado} €</p>
          </div>
          <div className="rounded-2xl p-5 bg-white/15 border border-drb-lime-500/25 backdrop-blur-sm">
            <p className="text-sm text-white/60 mb-1">Reservas pagadas</p>
            <p className="text-2xl font-bold text-drb-lime-400">{numeroReservas}</p>
          </div>
          <div className="rounded-2xl p-5 bg-white/15 border border-white/20 backdrop-blur-sm">
            <p className="text-sm text-white/60 mb-1">Ticket medio</p>
            <p className="text-2xl font-bold text-white">{ticketMedio} €</p>
          </div>
          <div className="rounded-2xl p-5 bg-white/15 border border-white/20 backdrop-blur-sm">
            <p className="text-sm text-white/60 mb-1">Destinos activos</p>
            <p className="text-2xl font-bold text-white">{destinosActivos ?? 0}</p>
          </div>
        </div>

        {/* 2 Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ReservasChart data={reservasChartData} />
          <IngresosChart data={ingresosChartData} />
        </div>

        {/* Grid de Cards de navegación */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Gestiona tu agencia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <DashboardCard
              icon="🌐"
              title="Contenido Web"
              subtitle="Hero, stats, textos"
              href="/admin/contenido"
            />
            <DashboardCard
              icon="✈️"
              title="Destinos"
              subtitle="Crear y editar"
              href="/admin/destinos"
            />
            <DashboardCard
              icon="📅"
              title="Reservas"
              subtitle="Ver y filtrar"
              href="/admin/reservas"
            />
            <DashboardCard
              icon="⭐"
              title="Opiniones"
              subtitle="Moderar reviews"
              href="/admin/opiniones"
            />
            <DashboardCard
              icon="✉️"
              title="Emails"
              subtitle="Templates automáticos"
              href="/admin/emails"
            />
            <DashboardCard
              icon="📄"
              title="Páginas Legales"
              subtitle="Privacidad, términos"
              href="/admin/legales"
            />
            <DashboardCard
              icon="💳"
              title="Stripe / Pagos"
              subtitle="Suscripción y cobros"
              href="/admin/stripe"
            />
            <DashboardCard
              icon="📊"
              title="Analytics"
              subtitle="Métricas y gráficas"
              href="/admin/analytics"
              glowColor="lime"
            />
          </div>
        </div>

        {/* Últimas reservas */}
        <div className="rounded-2xl border border-white/20 bg-white/15 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Últimas reservas</h2>
            <a
              href="/admin/reservas"
              className="text-sm px-3 py-1.5 rounded-lg bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold transition-colors"
            >
              Ver todas →
            </a>
          </div>
          {reservasSafe.length === 0 ? (
            <p className="text-white/50">No hay reservas todavía.</p>
          ) : (
            <div className="space-y-3">
              {reservasSafe.slice(0, 5).map((r: any) => (
                <div
                  key={r.id || r.created_at}
                  className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-4 py-3"
                >
                  <div>
                    <div className="font-semibold text-white">{r.nombre || "Reserva"}</div>
                    <div className="text-sm text-white/50">
                      {r.destino || "—"} · {new Date(r.created_at).toLocaleDateString("es-ES")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">{r.precio} €</span>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                      r.estado_pago === "pagado"
                        ? "bg-drb-lime-500/20 text-drb-lime-400 border-drb-lime-500/30"
                        : r.estado_pago === "pendiente"
                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          : "bg-white/10 text-white/60 border-white/20"
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
    </AdminShell>
  );
}
