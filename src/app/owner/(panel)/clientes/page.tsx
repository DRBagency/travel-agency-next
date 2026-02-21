import { supabaseAdmin } from "@/lib/supabase-server";
import { getTranslations } from "next-intl/server";
import ClientesTable from "./ClientesTable";
import KPICard from "@/components/ui/KPICard";
import { Building2, CheckCircle, CreditCard, Crown } from "lucide-react";

export default async function OwnerClientesPage() {
  const t = await getTranslations('owner.clientes');

  const { data: clientes } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre, domain, activo, stripe_account_id, stripe_charges_enabled, plan, commission_rate")
    .order("created_at", { ascending: false });

  const all = clientes || [];
  const active = all.filter((c) => c.activo);
  const withSub = all.filter((c) => c.plan);
  const planCounts: Record<string, number> = {};
  withSub.forEach((c) => {
    const p = c.plan || "none";
    planCounts[p] = (planCounts[p] || 0) + 1;
  });
  const topPlan = Object.entries(planCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('title')}</h1>
          <p className="text-gray-400 dark:text-white/40">{t('subtitle')}</p>
        </div>
        <a
          href="/owner/clientes/nuevo"
          className="btn-primary"
        >
          {t('newAgency')}
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t('title')}
          value={all.length}
          icon={<Building2 className="w-5 h-5" />}
          accentColor="turquoise"
        />
        <KPICard
          title={t('activeAgencies')}
          value={active.length}
          icon={<CheckCircle className="w-5 h-5" />}
          accentColor="emerald"
        />
        <KPICard
          title={t('withSub')}
          value={withSub.length}
          icon={<CreditCard className="w-5 h-5" />}
          accentColor="purple"
        />
        <KPICard
          title={t('topPlan')}
          value={topPlan ? `${topPlan[0]} (${topPlan[1]})` : "—"}
          icon={<Crown className="w-5 h-5" />}
          accentColor="amber"
        />
      </div>

      <div className="panel-card overflow-hidden">
        <ClientesTable clientes={all} />
      </div>
    </div>
  );
}
