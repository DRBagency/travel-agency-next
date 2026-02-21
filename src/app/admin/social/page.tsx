import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { getTranslations, getLocale } from "next-intl/server";
import SocialContent from "./SocialContent";

export const dynamic = "force-dynamic";

export default async function SocialPage() {
  const client = await requireAdminClient();
  const t = await getTranslations("admin.social");
  const locale = await getLocale();

  // Fetch social connections
  const { data: connections } = await supabaseAdmin
    .from("social_connections")
    .select("*")
    .eq("cliente_id", client.id);

  // Get facebook_url from clientes table
  const facebookUrl = client.facebook_url || null;

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {t("title")}
        </h1>
        <p className="text-gray-400 dark:text-white/40">{t("subtitle")}</p>
      </div>

      <SocialContent
        connections={connections ?? []}
        facebookUrl={facebookUrl}
        locale={locale}
      />
    </div>
  );
}
