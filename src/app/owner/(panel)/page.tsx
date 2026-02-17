import { getDashboardMetrics } from "@/lib/owner/get-dashboard-metrics";
import { getChartData } from "@/lib/owner/get-chart-data";
import { MRRChart, ClientesChart, ReservasOwnerChart } from "@/components/owner/OwnerCharts";
import DashboardCard from "@/components/ui/DashboardCard";
import Link from "next/link";
import {
  Users,
  Mail,
  TrendingUp,
  CreditCard,
  Zap,
  Headphones,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  const metrics = await getDashboardMetrics();
  const chartData = await getChartData();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Dashboard</h1>
        <p className="text-gray-500 dark:text-white/60">Vista general de tu plataforma SaaS</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="kpi-card">
          <p className="text-sm text-gray-500 dark:text-white/60 mb-2">Total de agencias</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalClientes}</p>
          <p className="text-xs text-gray-400 dark:text-white/50 mt-1">
            {metrics.clientesConSuscripcion} con suscripción activa
          </p>
        </div>

        <div className="kpi-card border-drb-lime-200 dark:border-drb-lime-500/25">
          <p className="text-sm text-gray-500 dark:text-white/60 mb-2">MRR</p>
          <p className="text-3xl font-bold text-drb-lime-600 dark:text-drb-lime-400">{metrics.mrr} €</p>
          <p className="text-xs text-gray-400 dark:text-white/50 mt-1">Ingresos mensuales recurrentes</p>
        </div>

        <div className="kpi-card">
          <p className="text-sm text-gray-500 dark:text-white/60 mb-2">Reservas este mes</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.reservasMes}</p>
          <p className="text-xs text-gray-400 dark:text-white/50 mt-1">Reservas procesadas</p>
        </div>

        <div className="kpi-card">
          <p className="text-sm text-gray-500 dark:text-white/60 mb-2">Comisiones este mes</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.comisionesMes.toFixed(2)} €</p>
          <p className="text-xs text-gray-400 dark:text-white/50 mt-1">Generadas por reservas</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <MRRChart data={chartData.mrrPorMes} />
        <ClientesChart data={chartData.clientesPorMes} />
        <ReservasOwnerChart data={chartData.reservasPorMes} />
      </div>

      {/* Navigation Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Acceso rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            icon={<Users className="w-7 h-7" />}
            title="Clientes"
            subtitle="Gestionar agencias"
            href="/owner/clientes"
          />
          <DashboardCard
            icon={<Mail className="w-7 h-7" />}
            title="Emails"
            subtitle="Templates de billing"
            href="/owner/emails"
          />
          <DashboardCard
            icon={<TrendingUp className="w-7 h-7" />}
            title="Monetización"
            subtitle="MRR y comisiones"
            href="/owner/monetizacion"
            glowColor="lime"
          />
          <DashboardCard
            icon={<CreditCard className="w-7 h-7" />}
            title="Stripe"
            subtitle="Configuración de pagos"
            href="/owner/stripe"
          />
          <DashboardCard
            icon={<Zap className="w-7 h-7" />}
            title="Automatización"
            subtitle="Flujos automáticos"
            href="/owner/automatizaciones"
          />
          <DashboardCard
            icon={<Headphones className="w-7 h-7" />}
            title="Soporte"
            subtitle="Tickets de agencias"
            href="/owner/soporte"
            gradient
          />
        </div>
      </div>

      {/* Recent Clients Table */}
      <div className="panel-card">
        <div className="p-6 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Últimas agencias registradas
            </h2>
            <Link
              href="/owner/clientes"
              className="text-sm px-3 py-1.5 rounded-lg bg-drb-turquoise-500 hover:bg-drb-turquoise-600 text-white font-bold transition-colors"
            >
              Ver todas
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">Nombre</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">Dominio</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">Plan</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">Estado</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">Registrado</th>
              </tr>
            </thead>
            <tbody>
              {metrics.ultimosClientes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 dark:text-white/40">
                    No hay clientes registrados
                  </td>
                </tr>
              ) : (
                metrics.ultimosClientes.map((cliente: any) => (
                  <tr key={cliente.id} className="table-row">
                    <td className="p-4 text-gray-900 dark:text-white">{cliente.nombre}</td>
                    <td className="p-4 text-gray-500 dark:text-white/60 text-sm">{cliente.domain || "—"}</td>
                    <td className="p-4">
                      <span className="badge-info">
                        {cliente.plan || "Sin plan"}
                      </span>
                    </td>
                    <td className="p-4">
                      {cliente.stripe_subscription_id ? (
                        <span className="badge-success">Activo</span>
                      ) : (
                        <span className="badge-warning">Pendiente</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-500 dark:text-white/60 text-sm">
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
