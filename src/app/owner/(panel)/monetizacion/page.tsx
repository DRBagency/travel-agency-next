import { getMonetizationData } from "@/lib/owner/get-monetization-data";
import { getComparisonData } from "@/lib/owner/get-comparison-data";
import {
  ComparisonChart,
  ProjectionChart,
} from "@/components/owner/MonetizationCharts";
import { getTranslations, getLocale } from "next-intl/server";
import KPICard from "@/components/ui/KPICard";
import { DollarSign, TrendingUp, Percent } from "lucide-react";
import CommissionsTable from "./CommissionsTable";

export const dynamic = "force-dynamic";

export default async function OwnerMonetizacionPage() {
  const t = await getTranslations('owner.monetizacion');
  const locale = await getLocale();

  const [data, chartData] = await Promise.all([
    getMonetizationData(),
    getComparisonData(locale),
  ]);

  const totalCommissions = data.comisionesPorCliente.reduce((s, c) => s + c.total, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('title')}</h1>
        <p className="text-gray-400 dark:text-white/40">{t('subtitle')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title={t('mrrTotal')}
          value={`${data.mrrTotal} €`}
          icon={<DollarSign className="w-5 h-5" />}
          variant="gradient"
          subtitle={t('mrrRecurring')}
        />
        <KPICard
          title={t('topCommissions')}
          value={`${totalCommissions.toFixed(2)} €`}
          icon={<Percent className="w-5 h-5" />}
          iconBg="bg-emerald-50 dark:bg-emerald-500/15"
          iconColor="text-emerald-600 dark:text-emerald-400"
          subtitle={t('clients')}
        />
        <KPICard
          title={t('planBreakdown')}
          value={`${data.desglosePlanes.start.count + data.desglosePlanes.grow.count + data.desglosePlanes.pro.count}`}
          icon={<TrendingUp className="w-5 h-5" />}
          iconBg="bg-purple-50 dark:bg-purple-500/15"
          iconColor="text-purple-600 dark:text-purple-400"
          subtitle={`Start: ${data.desglosePlanes.start.count} · Grow: ${data.desglosePlanes.grow.count} · Pro: ${data.desglosePlanes.pro.count}`}
        />
      </div>

      {/* Plan breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="panel-card p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Start</h3>
            <span className="text-xs text-gray-400 dark:text-white/40">29€/mes</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.desglosePlanes.start.count}</p>
          <p className="text-sm text-gray-400 dark:text-white/40 mb-3">{t('clients')}</p>
          <div className="border-t border-gray-100 dark:border-white/[0.06] pt-3">
            <p className="text-sm text-gray-400 dark:text-white/40">MRR</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{data.desglosePlanes.start.mrr} €</p>
          </div>
        </div>

        <div className="panel-card p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Grow</h3>
            <span className="text-xs text-gray-400 dark:text-white/40">59€/mes</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.desglosePlanes.grow.count}</p>
          <p className="text-sm text-gray-400 dark:text-white/40 mb-3">{t('clients')}</p>
          <div className="border-t border-gray-100 dark:border-white/[0.06] pt-3">
            <p className="text-sm text-gray-400 dark:text-white/40">MRR</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{data.desglosePlanes.grow.mrr} €</p>
          </div>
        </div>

        <div className="panel-card p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Pro</h3>
            <span className="text-xs text-gray-400 dark:text-white/40">99€/mes</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.desglosePlanes.pro.count}</p>
          <p className="text-sm text-gray-400 dark:text-white/40 mb-3">{t('clients')}</p>
          <div className="border-t border-gray-100 dark:border-white/[0.06] pt-3">
            <p className="text-sm text-gray-400 dark:text-white/40">MRR</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{data.desglosePlanes.pro.mrr} €</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ComparisonChart data={chartData.comparison} />
        <ProjectionChart data={chartData.projection} />
      </div>

      {/* Top commissions table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('topCommissions')}</h2>
        <CommissionsTable data={data.comisionesPorCliente} />
      </div>
    </div>
  );
}
