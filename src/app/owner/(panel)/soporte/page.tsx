import { createClient } from "@supabase/supabase-js";
import { getTranslations } from 'next-intl/server';
import SoporteTable from "./SoporteTable";

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('title')}</h1>
        <p className="text-gray-400 dark:text-white/40">
          {t('subtitle')}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      <SoporteTable tickets={tickets} />
    </div>
  );
}
