import { getDashboardMetrics } from "@/lib/owner/get-dashboard-metrics";
import { getChartData } from "@/lib/owner/get-chart-data";
import { MRRChart, ClientesChart, ReservasOwnerChart } from "@/components/owner/OwnerCharts";
import DashboardCard from "@/components/ui/DashboardCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  const metrics = await getDashboardMetrics();
  const chartData = await getChartData();

  return (
    <div>
      {/* Header premium */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-white/40 text-sm">DRB Agency — Panel Owner</span>
        </div>
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-white/60">Vista general de tu plataforma SaaS</p>
      </div>

      {/* Métricas principales con estilo premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl p-6 bg-white/15 border border-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm">Total de agencias</p>
            <span className="text-2xl">🏢</span>
          </div>
          <p className="text-3xl font-bold text-white">{metrics.totalClientes}</p>
          <p className="text-xs text-white/50 mt-1">
            {metrics.clientesConSuscripcion} con suscripción activa
          </p>
        </div>

        <div className="rounded-2xl p-6 bg-white/10 border border-drb-lime-500/25 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm">MRR</p>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-drb-lime-400">{metrics.mrr} €</p>
          <p className="text-xs text-white/50 mt-1">Ingresos mensuales recurrentes</p>
        </div>

        <div className="rounded-2xl p-6 bg-white/15 border border-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm">Reservas este mes</p>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-3xl font-bold text-white">{metrics.reservasMes}</p>
          <p className="text-xs text-white/50 mt-1">Reservas procesadas</p>
        </div>

        <div className="rounded-2xl p-6 bg-white/15 border border-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm">Comisiones este mes</p>
            <span className="text-2xl">💵</span>
          </div>
          <p className="text-3xl font-bold text-white">{metrics.comisionesMes.toFixed(2)} €</p>
          <p className="text-xs text-white/50 mt-1">Generadas por reservas</p>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <MRRChart data={chartData.mrrPorMes} />
        <ClientesChart data={chartData.clientesPorMes} />
        <ReservasOwnerChart data={chartData.reservasPorMes} />
      </div>

      {/* Grid de Cards de navegación premium */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">Acceso rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            icon="👥"
            title="Clientes"
            subtitle="Gestionar agencias"
            href="/owner/clientes"
          />
          <DashboardCard
            icon="✉️"
            title="Emails"
            subtitle="Templates de billing"
            href="/owner/emails"
          />
          <DashboardCard
            icon="📊"
            title="Monetización"
            subtitle="MRR y comisiones"
            href="/owner/monetizacion"
            glowColor="lime"
          />
          <DashboardCard
            icon="💳"
            title="Stripe"
            subtitle="Configuración de pagos"
            href="/owner/stripe"
          />
          <DashboardCard
            icon="⚡"
            title="Automatización"
            subtitle="Flujos automáticos"
            href="/owner/automatizaciones"
          />
          <DashboardCard
            icon="🎧"
            title="Soporte"
            subtitle="Tickets de agencias"
            href="/owner/soporte"
            gradient
          />
        </div>
      </div>

      {/* Últimos clientes */}
      <div className="rounded-2xl border border-white/20 bg-white/15 backdrop-blur-sm">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Últimas agencias registradas
            </h2>
            <Link
              href="/owner/clientes"
              className="text-sm px-3 py-1.5 rounded-lg bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold transition-colors"
            >
              Ver todas →
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm font-medium text-white/60">Nombre</th>
                <th className="text-left p-4 text-sm font-medium text-white/60">Dominio</th>
                <th className="text-left p-4 text-sm font-medium text-white/60">Plan</th>
                <th className="text-left p-4 text-sm font-medium text-white/60">Estado</th>
                <th className="text-left p-4 text-sm font-medium text-white/60">Registrado</th>
              </tr>
            </thead>
            <tbody>
              {metrics.ultimosClientes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/40">
                    No hay clientes registrados
                  </td>
                </tr>
              ) : (
                metrics.ultimosClientes.map((cliente: any) => (
                  <tr key={cliente.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white">{cliente.nombre}</td>
                    <td className="p-4 text-white/60 text-sm">{cliente.domain || "—"}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-drb-turquoise-500/20 text-drb-turquoise-300 border border-drb-turquoise-500/30">
                        {cliente.plan || "Sin plan"}
                      </span>
                    </td>
                    <td className="p-4">
                      {cliente.stripe_subscription_id ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-drb-lime-500/20 text-drb-lime-400 border border-drb-lime-500/30">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-white/60 text-sm">
                      {new Date(cliente.created_at).toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
