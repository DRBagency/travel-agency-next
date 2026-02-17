import { getMonetizationData } from "@/lib/owner/get-monetization-data";
import { getComparisonData } from "@/lib/owner/get-comparison-data";
import {
  ComparisonChart,
  ProjectionChart,
} from "@/components/owner/MonetizationCharts";

export const dynamic = "force-dynamic";

export default async function OwnerMonetizacionPage() {
  const [data, chartData] = await Promise.all([
    getMonetizationData(),
    getComparisonData(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Monetización</h1>
      <p className="text-gray-500 dark:text-white/60 mb-8">Desglose de ingresos y comisiones</p>

      {/* MRR Total */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-green-500/20 dark:to-emerald-500/20 backdrop-blur-sm rounded-lg p-8 border border-emerald-200 dark:border-green-500/30 mb-8">
        <p className="text-gray-500 dark:text-white/60 text-sm mb-2">MRR Total (Suscripciones)</p>
        <p className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{data.mrrTotal}€</p>
        <p className="text-gray-400 dark:text-white/40 text-sm">Ingresos mensuales recurrentes</p>
      </div>

      {/* Desglose por planes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Desglose por planes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan Start */}
          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Start</h3>
              <span className="text-2xl">🌱</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{data.desglosePlanes.start.count}</p>
            <p className="text-sm text-gray-500 dark:text-white/60 mb-3">clientes</p>
            <div className="border-t border-gray-100 dark:border-white/10 pt-3">
              <p className="text-sm text-gray-500 dark:text-white/60">MRR</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-green-400">{data.desglosePlanes.start.mrr}€</p>
            </div>
          </div>

          {/* Plan Grow */}
          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Grow</h3>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{data.desglosePlanes.grow.count}</p>
            <p className="text-sm text-gray-500 dark:text-white/60 mb-3">clientes</p>
            <div className="border-t border-gray-100 dark:border-white/10 pt-3">
              <p className="text-sm text-gray-500 dark:text-white/60">MRR</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-green-400">{data.desglosePlanes.grow.mrr}€</p>
            </div>
          </div>

          {/* Plan Pro */}
          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pro</h3>
              <span className="text-2xl">🚀</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{data.desglosePlanes.pro.count}</p>
            <p className="text-sm text-gray-500 dark:text-white/60 mb-3">clientes</p>
            <div className="border-t border-gray-100 dark:border-white/10 pt-3">
              <p className="text-sm text-gray-500 dark:text-white/60">MRR</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-green-400">{data.desglosePlanes.pro.mrr}€</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts: Comparativa + Proyeccion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ComparisonChart data={chartData.comparison} />
        <ProjectionChart data={chartData.projection} />
      </div>

      {/* Top comisiones por cliente */}
      <div className="panel-card">
        <div className="p-6 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Top 10 - Comisiones este mes</h2>
          <p className="text-sm text-gray-400 dark:text-white/40 mt-1">Generadas por reservas de viajes</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">#</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">Agencia</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">Reservas</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">Comisiones</th>
              </tr>
            </thead>
            <tbody>
              {data.comisionesPorCliente.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400 dark:text-white/40">
                    No hay comisiones generadas este mes
                  </td>
                </tr>
              ) : (
                data.comisionesPorCliente.map((cliente, index) => (
                  <tr key={cliente.clienteId} className="table-row">
                    <td className="p-4 text-gray-500 dark:text-white/60">{index + 1}</td>
                    <td className="p-4 text-gray-900 dark:text-white">{cliente.nombre}</td>
                    <td className="p-4 text-gray-500 dark:text-white/60">{cliente.count}</td>
                    <td className="p-4">
                      <span className="text-emerald-600 dark:text-green-400 font-semibold">
                        {cliente.total.toFixed(2)}€
                      </span>
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
