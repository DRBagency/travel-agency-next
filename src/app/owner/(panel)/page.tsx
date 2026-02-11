import { getDashboardMetrics } from "@/lib/owner/get-dashboard-metrics";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-white/60 mb-8">Vista general de tu plataforma SaaS</p>

      {/* Grid de métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm">Total de agencias</p>
            <span className="text-2xl">🏢</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {metrics.totalClientes}
          </p>
          <p className="text-xs text-white/40 mt-1">
            {metrics.clientesConSuscripcion} con suscripción activa
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm">MRR</p>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-white">{metrics.mrr} €</p>
          <p className="text-xs text-white/40 mt-1">
            Ingresos mensuales recurrentes
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm">Reservas este mes</p>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {metrics.reservasMes}
          </p>
          <p className="text-xs text-white/40 mt-1">Reservas procesadas</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm">Comisiones este mes</p>
            <span className="text-2xl">💵</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {metrics.comisionesMes.toFixed(2)} €
          </p>
          <p className="text-xs text-white/40 mt-1">Generadas por reservas</p>
        </div>
      </div>

      {/* Últimos clientes */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Últimas agencias registradas
            </h2>
            <Link
              href="/owner/clientes"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Ver todas →
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Nombre
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Dominio
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Plan
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Estado
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Registrado
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.ultimosClientes.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-white/40"
                  >
                    No hay clientes registrados
                  </td>
                </tr>
              ) : (
                metrics.ultimosClientes.map((cliente: any) => (
                  <tr
                    key={cliente.id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-4 text-white">{cliente.nombre}</td>
                    <td className="p-4 text-white/60 text-sm">
                      {cliente.domain || "—"}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-300">
                        {cliente.plan || "Sin plan"}
                      </span>
                    </td>
                    <td className="p-4">
                      {cliente.stripe_subscription_id ? (
                        <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-300">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-300">
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-white/60 text-sm">
                      {new Date(cliente.created_at).toLocaleDateString(
                        "es-ES"
                      )}
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
