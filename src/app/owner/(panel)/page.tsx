import { getDashboardMetrics } from "@/lib/owner/get-dashboard-metrics";
import { getChartData } from "@/lib/owner/get-chart-data";
import { supabaseAdmin } from "@/lib/supabase-server";
import { MRRChart, ClientesChart, RevenueBreakdownChart, TopDestinosChart } from "@/components/owner/OwnerCharts";
import LatestAgenciesTable from "@/components/owner/LatestAgenciesTable";
import OwnerSupportWidget from "@/components/owner/OwnerSupportWidget";
import OwnerCalendarWidget from "@/components/owner/OwnerCalendarWidget";
import KPICard from "@/components/ui/KPICard";
import AIInsightsCard from "@/components/ai/AIInsightsCard";
import { getTranslations, getLocale } from "next-intl/server";
import {
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
  const locale = await getLocale();
  const metrics = await getDashboardMetrics();
  const chartData = await getChartData(locale);

  /* Support tickets — últimos 3 */
  const { data: supportTickets } = await supabaseAdmin
    .from("support_tickets")
    .select("id, subject, status, priority, created_at, clientes(nombre)")
    .order("created_at", { ascending: false })
    .limit(3);

  /* Calendar events — próximos 3 */
  const { data: calendarEvents } = await supabaseAdmin
    .from("calendar_events")
    .select("id, title, start_time, end_time, all_day, color")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(3);

  const ticketsSafe = (supportTickets ?? []).map((t: any) => ({
    ...t,
    cliente_nombre: t.clientes?.nombre || undefined,
  }));

  const greeting = t('greeting');
  const dateStr = new Date().toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-2 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{greeting}</h1>
          <p className="text-gray-400 dark:text-white/40 text-sm">{dateStr}</p>
        </div>
      </div>

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
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

      {/* Middle row: Charts (left) | Agencies (center) | Charts (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] gap-2">
        {/* Left — MRR + Clientes charts stacked */}
        <div className="space-y-2">
          <MRRChart data={chartData.mrrPorMes} compact />
          <ClientesChart data={chartData.clientesPorMes} compact />
        </div>

        {/* Center — Latest agencies table (compact) */}
        <LatestAgenciesTable data={metrics.ultimosClientes.slice(0, 5)} />

        {/* Right — Breakdown + Top Destinos stacked */}
        <div className="space-y-2">
          <RevenueBreakdownChart data={metrics.planBreakdown} compact />
          {metrics.topDestinos.length > 0 && (
            <TopDestinosChart data={metrics.topDestinos} compact />
          )}
        </div>
      </div>

      {/* Bottom row: AI Insights | Support | Calendar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <AIInsightsCard
          compact
          metricsContext={`Total agencias: ${metrics.totalClientes}\nCon suscripción: ${metrics.clientesConSuscripcion}\nMRR: ${metrics.mrr}€\nReservas este mes: ${metrics.reservasMes}\nComisiones este mes: ${metrics.comisionesMes.toFixed(2)}€`}
        />
        <OwnerSupportWidget
          tickets={ticketsSafe}
          labels={{
            title: t('supportTickets'),
            viewAll: tc('viewAll'),
            noTickets: t('noTickets'),
          }}
        />
        <OwnerCalendarWidget
          events={(calendarEvents ?? []) as any[]}
          locale={locale}
          labels={{
            upcomingEvents: t('upcomingEvents'),
            viewCalendar: t('viewCalendar'),
            noUpcomingEvents: t('noUpcomingEvents'),
            today: tc('today'),
            tomorrow: tc('tomorrow'),
            allDay: t('allDay'),
          }}
        />
      </div>
    </div>
  );
}
