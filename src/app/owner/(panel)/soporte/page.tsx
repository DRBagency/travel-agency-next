import { createClient } from "@supabase/supabase-js";
import { getTranslations } from 'next-intl/server';
import SoporteTable from "./SoporteTable";
import KPICard from "@/components/ui/KPICard";
import { Ticket, CircleDot, Clock, AlertTriangle } from "lucide-react";

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
        <KPICard
          title={t('totalTickets')}
          value={tickets.length}
          icon={<Ticket className="w-5 h-5" />}
          accentColor="turquoise"
        />
        <KPICard
          title={t('open')}
          value={tickets.filter((tk) => tk.status === "open").length}
          icon={<CircleDot className="w-5 h-5" />}
          accentColor="blue"
        />
        <KPICard
          title={t('inProgress')}
          value={tickets.filter((tk) => tk.status === "in_progress").length}
          icon={<Clock className="w-5 h-5" />}
          accentColor="amber"
        />
        <KPICard
          title={t('urgent')}
          value={tickets.filter((tk) => tk.priority === "urgent").length}
          icon={<AlertTriangle className="w-5 h-5" />}
          accentColor="red"
        />
      </div>

      <div className="panel-card overflow-hidden">
        <SoporteTable tickets={tickets} />
      </div>
    </div>
  );
}
