import { supabaseAdmin } from "@/lib/supabase-server";
import { getTranslations } from "next-intl/server";

export default async function OwnerClientesPage() {
  const t = await getTranslations('owner.clientes');
  const tc = await getTranslations('common');

  const { data: clientes } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre, domain, activo, stripe_account_id, stripe_charges_enabled, plan, commission_rate")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <a
          href="/owner/clientes/nuevo"
          className="btn-primary"
        >
          {t('newAgency')}
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full panel-card rounded-2xl overflow-hidden">
          <thead className="bg-gray-50/50 dark:bg-white/5">
            <tr>
              <th className="p-3 text-start">{tc('name')}</th>
              <th className="p-3 text-start">{t('domain')}</th>
              <th className="p-3 text-start">{tc('plan')}</th>
              <th className="p-3 text-start">{t('commission')}</th>
              <th className="p-3 text-start">{t('stripeStatus')}</th>
              <th className="p-3 text-start">{tc('active')}</th>
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
                      {t('stripeActive')}
                    </span>
                  ) : cliente.stripe_account_id ? (
                    <span className="badge-warning px-3 py-1 text-xs font-semibold">
                      {t('stripePending')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/70 px-3 py-1 text-xs font-semibold">
                      {t('stripeNotConnected')}
                    </span>
                  )}
                </td>
                <td className="p-3">{cliente.activo ? tc('yes') : tc('no')}</td>
              </tr>
            ))}
            {!clientes?.length && (
              <tr>
                <td className="p-3 text-gray-600 dark:text-white/70" colSpan={6}>
                  {t('noClients')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
