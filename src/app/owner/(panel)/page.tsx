import { getDashboardMetrics } from "@/lib/owner/get-dashboard-metrics";
import { getChartData } from "@/lib/owner/get-chart-data";
import { MRRChart, ClientesChart, ReservasOwnerChart, RevenueBreakdownChart, TopDestinosChart } from "@/components/owner/OwnerCharts";
import LatestAgenciesTable from "@/components/owner/LatestAgenciesTable";
import DashboardCard from "@/components/ui/DashboardCard";
import KPICard from "@/components/ui/KPICard";
import { getTranslations, getLocale } from "next-intl/server";
import AIInsightsCard from "@/components/ai/AIInsightsCard";
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
  Receipt,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  const t = await getTranslations('owner.dashboard');
  const tc = await getTranslations('common');
  const tn = await getTranslations('owner.nav');
  const locale = await getLocale();
  const metrics = await getDashboardMetrics();
  const chartData = await getChartData(locale);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('greeting')}</h1>
        <p className="text-gray-400 dark:text-white/40">{t('subtitle')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title={t('totalAgencies')}
          value={metrics.totalClientes}
          icon={<Building2 className="w-5 h-5" />}
          iconBg="bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15"
          iconColor="text-drb-turquoise-600 dark:text-drb-turquoise-400"
          subtitle={t('withSubscription', { count: metrics.clientesConSuscripcion })}
        />
        <KPICard
          title={t('mrr')}
          value={`${metrics.mrr} €`}
          icon={<DollarSign className="w-5 h-5" />}
          variant="gradient"
          subtitle={t('mrrSub')}
        />
        <KPICard
          title={t('bookingsThisMonth')}
          value={metrics.reservasMes}
          icon={<ShoppingBag className="w-5 h-5" />}
          iconBg="bg-amber-50 dark:bg-amber-500/15"
          iconColor="text-amber-600 dark:text-amber-400"
          subtitle={t('bookingsProcessed')}
        />
        <KPICard
          title={t('commissionsThisMonth')}
          value={`${metrics.comisionesMes.toFixed(2)} €`}
          icon={<Percent className="w-5 h-5" />}
          iconBg="bg-purple-50 dark:bg-purple-500/15"
          iconColor="text-purple-600 dark:text-purple-400"
          subtitle={t('generatedByBookings')}
        />
        <KPICard
          title={t('avgTicket')}
          value={`${metrics.ticketMedio.toFixed(0)} €`}
          icon={<Receipt className="w-5 h-5" />}
          iconBg="bg-emerald-50 dark:bg-emerald-500/15"
          iconColor="text-emerald-600 dark:text-emerald-400"
          subtitle={t('avgTicketSub')}
        />
      </div>

      {/* Charts - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MRRChart data={chartData.mrrPorMes} />
        <ClientesChart data={chartData.clientesPorMes} />
        <ReservasOwnerChart data={chartData.reservasPorMes} />
      </div>

      {/* Charts - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueBreakdownChart data={metrics.planBreakdown} />
        <TopDestinosChart data={metrics.topDestinos} />
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('quickAccess')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <DashboardCard
            icon={<Users className="w-5 h-5" />}
            title={t('clients')}
            subtitle={t('manageAgencies')}
            href="/owner/clientes"
          />
          <DashboardCard
            icon={<Mail className="w-5 h-5" />}
            title={tn('emails')}
            subtitle={t('billingTemplates')}
            href="/owner/emails"
          />
          <DashboardCard
            icon={<TrendingUp className="w-5 h-5" />}
            title={tn('monetizacion')}
            subtitle={t('mrrAndCommissions')}
            href="/owner/monetizacion"
          />
          <DashboardCard
            icon={<CreditCard className="w-5 h-5" />}
            title={tn('stripe')}
            subtitle={t('paymentConfig')}
            href="/owner/stripe"
          />
          <DashboardCard
            icon={<Zap className="w-5 h-5" />}
            title={tn('automatizaciones')}
            subtitle={t('autoFlows')}
            href="/owner/automatizaciones"
          />
          <DashboardCard
            icon={<Headphones className="w-5 h-5" />}
            title={tn('soporte')}
            subtitle={t('agencyTickets')}
            href="/owner/soporte"
          />
        </div>
      </div>

      {/* AI Insights */}
      <AIInsightsCard
        metricsContext={`Total agencias: ${metrics.totalClientes}\nCon suscripción: ${metrics.clientesConSuscripcion}\nMRR: ${metrics.mrr}€\nReservas este mes: ${metrics.reservasMes}\nComisiones este mes: ${metrics.comisionesMes.toFixed(2)}€`}
      />

      {/* Recent Clients Table */}
      <LatestAgenciesTable data={metrics.ultimosClientes} />
    </div>
  );
}
