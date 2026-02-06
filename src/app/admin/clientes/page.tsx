import { supabaseAdmin } from "@/lib/supabase-server";

export default async function ClientesPage() {
  const { data: clientes } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre, domain, activo, stripe_account_id, stripe_charges_enabled, plan, commission_rate")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <a
          href="/admin/clientes/nuevo"
          className="px-4 py-2 rounded bg-white text-slate-950 font-semibold"
        >
          Nueva agencia
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-white/10 rounded-2xl overflow-hidden">
          <thead className="bg-white/5">
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
                className="border-t border-white/10 hover:bg-white/5 transition-colors"
              >
                <td className="p-3">
                  <a
                    href={`/admin/clientes/${cliente.id}`}
                    className="text-white/90 hover:text-white underline"
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
                    <span className="inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-300 px-3 py-1 text-xs font-semibold">
                      Stripe activo
                    </span>
                  ) : cliente.stripe_account_id ? (
                    <span className="inline-flex items-center rounded-full bg-amber-500/15 text-amber-300 px-3 py-1 text-xs font-semibold">
                      Stripe pendiente
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-white/10 text-white/70 px-3 py-1 text-xs font-semibold">
                      Stripe no conectado
                    </span>
                  )}
                </td>
                <td className="p-3">{cliente.activo ? "Sí" : "No"}</td>
              </tr>
            ))}
            {!clientes?.length && (
              <tr>
                <td className="p-3 text-white/70" colSpan={6}>
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
