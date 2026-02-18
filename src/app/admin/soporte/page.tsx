import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import Link from "next/link";
import KPICard from "@/components/ui/KPICard";
import { MessageCircle, Clock, CheckCircle2, Plus } from "lucide-react";
import { getTranslations, getLocale } from 'next-intl/server';

export const dynamic = "force-dynamic";

async function getTickets(clienteId: string) {
  const { data } = await supabaseAdmin
    .from("support_tickets")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });

  return data || [];
}

export default async function AdminSoportePage() {
  const client = await requireAdminClient();
  const tickets = await getTickets(client.id);
  const t = await getTranslations('admin.soporte');
  const tc = await getTranslations('common');
  const locale = await getLocale();

  const open = tickets.filter((tk) => tk.status === "open").length;
  const inProgress = tickets.filter((tk) => tk.status === "in_progress").length;
  const closed = tickets.filter((tk) => tk.status === "closed").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('title')}</h1>
          <p className="text-gray-400 dark:text-white/40">{t('subtitle')}</p>
        </div>
        <Link
          href="/admin/soporte/nuevo"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('newTicket')}
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title={t('openTickets')}
          value={open}
          icon={<MessageCircle className="w-5 h-5" />}
          iconBg="bg-emerald-50 dark:bg-emerald-500/15"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <KPICard
          title={t('inProgress')}
          value={inProgress}
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-amber-50 dark:bg-amber-500/15"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <KPICard
          title={t('closed')}
          value={closed}
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-gray-100 dark:bg-white/[0.06]"
          iconColor="text-gray-500 dark:text-white/50"
        />
      </div>

      {/* Ticket list */}
      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/80 dark:bg-white/[0.02]">
                <th className="text-start px-6 py-3 text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">
                  {t('id')}
                </th>
                <th className="text-start px-6 py-3 text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">
                  {t('subject')}
                </th>
                <th className="text-start px-6 py-3 text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">
                  {t('priority')}
                </th>
                <th className="text-start px-6 py-3 text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="text-start px-6 py-3 text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">
                  {t('date')}
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400 dark:text-white/40"
                  >
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-white/20" />
                    {t('noTickets')}
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="table-row"
                  >
                    <td className="px-6 py-4 text-gray-500 dark:text-white/50 text-sm font-mono">
                      <Link
                        href={`/admin/soporte/${ticket.id}`}
                        className="hover:text-drb-turquoise-600 dark:hover:text-drb-turquoise-400 transition-colors"
                      >
                        #{ticket.id.substring(0, 8)}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/soporte/${ticket.id}`}
                        className="font-medium text-sm text-gray-900 dark:text-white hover:text-drb-turquoise-600 dark:hover:text-drb-turquoise-400 transition-colors"
                      >
                        {ticket.subject}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          ticket.priority === "urgent"
                            ? "badge-danger"
                            : ticket.priority === "high"
                              ? "badge-warning"
                              : "badge-info"
                        }
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          ticket.status === "open"
                            ? "badge-success"
                            : ticket.status === "in_progress"
                              ? "badge-warning"
                              : "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-white/50 border border-gray-200/60 dark:border-white/[0.08]"
                        }
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 dark:text-white/40 text-sm">
                      {new Date(ticket.created_at).toLocaleDateString(locale)}
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
