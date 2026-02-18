import { supabaseAdmin } from "@/lib/supabase-server";
import { getTranslations } from "next-intl/server";
import ClientesTable from "./ClientesTable";

export default async function OwnerClientesPage() {
  const t = await getTranslations('owner.clientes');

  const { data: clientes } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre, domain, activo, stripe_account_id, stripe_charges_enabled, plan, commission_rate")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <a
          href="/owner/clientes/nuevo"
          className="btn-primary"
        >
          {t('newAgency')}
        </a>
      </div>

      <ClientesTable clientes={clientes || []} />
    </div>
  );
}
