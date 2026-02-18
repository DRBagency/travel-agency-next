import { createClient } from "@supabase/supabase-js";
import { getTranslations, getLocale } from 'next-intl/server';

export const dynamic = "force-dynamic";

async function getAllTickets() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabaseAdmin
    .from("support_tickets")
    .select("*, clientes(nombre)")
    .order("created_at", { ascending: false });

  return data || [];
}

export default async function OwnerSoportePage() {
  const tickets = await getAllTickets();
  const t = await getTranslations('owner.soporte');
  const tc = await getTranslations('common');
  const locale = await getLocale();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
      <p className="text-gray-500 dark:text-white/60 mb-8">
        {t('subtitle')}
      </p>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="kpi-card">
          <p className="text-gray-500 dark:text-white/60 text-sm mb-1">{t('totalTickets')}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{tickets.length}</p>
        </div>
        <div className="kpi-card">
          <p className="text-gray-500 dark:text-white/60 text-sm mb-1">{t('open')}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {tickets.filter((tk) => tk.status === "open").length}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-gray-500 dark:text-white/60 text-sm mb-1">{t('inProgress')}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {tickets.filter((tk) => tk.status === "in_progress").length}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-gray-500 dark:text-white/60 text-sm mb-1">{t('urgent')}</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {tickets.filter((tk) => tk.priority === "urgent").length}
          </p>
        </div>
      </div>

      {/* Lista de tickets */}
      <div className="panel-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  ID
                </th>
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  {t('agency')}
                </th>
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  {t('subject')}
                </th>
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  {t('priority')}
                </th>
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  {t('status')}
                </th>
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  {t('date')}
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-gray-400 dark:text-white/40"
                  >
                    {t('noTickets')}
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => {
                  const cliente = ticket.clientes as unknown as { nombre: string } | null;
                  return (
                    <tr
                      key={ticket.id}
                      className="table-row"
                    >
                      <td className="p-4 text-gray-500 dark:text-white/60 text-sm font-mono">
                        #{ticket.id.substring(0, 8)}
                      </td>
                      <td className="p-4 text-gray-900 dark:text-white">
                        {cliente?.nombre}
                      </td>
                      <td className="p-4 text-gray-900 dark:text-white">{ticket.subject}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            ticket.priority === "urgent"
                              ? "badge-danger"
                              : ticket.priority === "high"
                                ? "badge-warning"
                                : "badge-info"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            ticket.status === "open"
                              ? "badge-success"
                              : ticket.status === "in_progress"
                                ? "badge-warning"
                                : "bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-white/60"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 dark:text-white/60 text-sm">
                        {new Date(ticket.created_at).toLocaleDateString(
                          locale
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
