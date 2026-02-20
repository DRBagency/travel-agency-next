import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { getTranslations, getLocale } from "next-intl/server";
import MensajesContent from "./MensajesContent";

export const dynamic = "force-dynamic";

export default async function MensajesPage() {
  const client = await requireAdminClient();
  const t = await getTranslations("admin.mensajes");
  const locale = await getLocale();

  const { data: messages } = await supabaseAdmin
    .from("contact_messages")
    .select("id, sender_name, sender_email, message, read, created_at")
    .eq("cliente_id", client.id)
    .order("created_at", { ascending: false });

  const safe = messages ?? [];
  const unreadCount = safe.filter((m) => !m.read).length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {t("title")}
        </h1>
        <p className="text-gray-400 dark:text-white/40">{t("subtitle")}</p>
      </div>

      <MensajesContent
        messages={safe}
        locale={locale}
        unreadCount={unreadCount}
      />
    </div>
  );
}
