import { supabaseAdmin } from "@/lib/supabase-server";

export default async function OwnerClientesPage() {
  const { data: clientes } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre, domain, activo, stripe_account_id, stripe_charges_enabled, plan, commission_rate")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Clientes (Owner)</h1>
        <a
          href="/owner/clientes/nuevo"
          className="btn-primary"
        >
          Nueva agencia
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full panel-card rounded-2xl overflow-hidden">
          <thead className="bg-gray-50/50 dark:bg-white/5">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Dominio</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Comisión</th>
              <th className="p-3 text-left">Estado Stripe</th>
              <th className="p-3 text-left">Activo</th>
            </tr>
          </thead>
          <tbody>
            {clientes?.map((cliente) => (
              <tr
                key={cliente.id}
                className="table-row"
              >
                <td className="p-3">
                  <a
                    href={`/owner/clientes/${cliente.id}`}
                    className="text-gray-800 dark:text-white/90 hover:text-gray-900 dark:hover:text-white underline"
                  >
                    {cliente.nombre}
                  </a>
                </td>
                <td className="p-3">{cliente.domain}</td>
                <td className="p-3">{cliente.plan ?? "—"}</td>
                <td className="p-3">
                  {typeof cliente.commission_rate === "number"
                    ? `${Math.round(cliente.commission_rate * 100)} %`
                    : "—"}
                </td>
                <td className="p-3">
                  {cliente.stripe_charges_enabled ? (
                    <span className="badge-success px-3 py-1 text-xs font-semibold">
                      Stripe activo
                    </span>
                  ) : cliente.stripe_account_id ? (
                    <span className="badge-warning px-3 py-1 text-xs font-semibold">
                      Stripe pendiente
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/70 px-3 py-1 text-xs font-semibold">
                      Stripe no conectado
                    </span>
                  )}
                </td>
                <td className="p-3">{cliente.activo ? "Sí" : "No"}</td>
              </tr>
            ))}
            {!clientes?.length && (
              <tr>
                <td className="p-3 text-gray-600 dark:text-white/70" colSpan={6}>
                  No hay clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
