import { getDashboardMetrics } from "@/lib/owner/get-dashboard-metrics";
import { getChartData } from "@/lib/owner/get-chart-data";
import { MRRChart, ClientesChart, ReservasOwnerChart } from "@/components/owner/OwnerCharts";
import DashboardCard from "@/components/ui/DashboardCard";
import KPICard from "@/components/ui/KPICard";
import Link from "next/link";
import {
  Users,
  Mail,
  TrendingUp,
  CreditCard,
  Zap,
  Headphones,
  Building2,
  DollarSign,
  ShoppingBag,
  Percent,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  const metrics = await getDashboardMetrics();
  const chartData = await getChartData();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Hola, Owner!</h1>
        <p className="text-gray-400 dark:text-white/40">Vista general de tu plataforma SaaS</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total de agencias"
          value={metrics.totalClientes}
          icon={<Building2 className="w-5 h-5" />}
          iconBg="bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15"
          iconColor="text-drb-turquoise-600 dark:text-drb-turquoise-400"
          subtitle={`${metrics.clientesConSuscripcion} con suscripción activa`}
        />
        <KPICard
          title="MRR"
          value={`${metrics.mrr} €`}
          icon={<DollarSign className="w-5 h-5" />}
          variant="gradient"
          subtitle="Ingresos mensuales recurrentes"
        />
        <KPICard
          title="Reservas este mes"
          value={metrics.reservasMes}
          icon={<ShoppingBag className="w-5 h-5" />}
          iconBg="bg-amber-50 dark:bg-amber-500/15"
          iconColor="text-amber-600 dark:text-amber-400"
          subtitle="Reservas procesadas"
        />
        <KPICard
          title="Comisiones este mes"
          value={`${metrics.comisionesMes.toFixed(2)} €`}
          icon={<Percent className="w-5 h-5" />}
          iconBg="bg-purple-50 dark:bg-purple-500/15"
          iconColor="text-purple-600 dark:text-purple-400"
          subtitle="Generadas por reservas"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MRRChart data={chartData.mrrPorMes} />
        <ClientesChart data={chartData.clientesPorMes} />
        <ReservasOwnerChart data={chartData.reservasPorMes} />
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acceso rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <DashboardCard
            icon={<Users className="w-5 h-5" />}
            title="Clientes"
            subtitle="Gestionar agencias"
            href="/owner/clientes"
          />
          <DashboardCard
            icon={<Mail className="w-5 h-5" />}
            title="Emails"
            subtitle="Templates de billing"
            href="/owner/emails"
          />
          <DashboardCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="Monetización"
            subtitle="MRR y comisiones"
            href="/owner/monetizacion"
          />
          <DashboardCard
            icon={<CreditCard className="w-5 h-5" />}
            title="Stripe"
            subtitle="Configuración de pagos"
            href="/owner/stripe"
          />
          <DashboardCard
            icon={<Zap className="w-5 h-5" />}
            title="Automatización"
            subtitle="Flujos automáticos"
            href="/owner/automatizaciones"
          />
          <DashboardCard
            icon={<Headphones className="w-5 h-5" />}
            title="Soporte"
            subtitle="Tickets de agencias"
            href="/owner/soporte"
          />
        </div>
      </div>

      {/* Recent Clients Table */}
      <div className="panel-card">
        <div className="p-6 pb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Últimas agencias registradas
          </h2>
          <Link
            href="/owner/clientes"
            className="btn-primary text-xs px-4 py-2"
          >
            Ver todas
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">Dominio</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">Plan</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">Estado</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">Registrado</th>
              </tr>
            </thead>
            <tbody>
              {metrics.ultimosClientes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 dark:text-white/40">
                    No hay clientes registrados
                  </td>
                </tr>
              ) : (
                metrics.ultimosClientes.map((cliente: any) => (
                  <tr key={cliente.id} className="table-row">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center text-drb-turquoise-600 dark:text-drb-turquoise-400 text-xs font-semibold">
                          {(cliente.nombre || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{cliente.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-white/50 text-sm">{cliente.domain || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="badge-info">
                        {cliente.plan || "Sin plan"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {cliente.stripe_subscription_id ? (
                        <span className="badge-success">Activo</span>
                      ) : (
                        <span className="badge-warning">Pendiente</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 dark:text-white/40 text-sm">
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
