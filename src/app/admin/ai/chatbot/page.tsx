import { requireAdminClient } from "@/lib/requireAdminClient";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getTranslations } from "next-intl/server";
import ChatbotConfig from "@/components/ai/ChatbotConfig";
import { Bot } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AIChatbotPage() {
  const client = await requireAdminClient();
  const t = await getTranslations("ai.chatbot");

  // Load existing config
  const { data: config } = await supabaseAdmin
    .from("ai_chatbot_config")
    .select("*")
    .eq("cliente_id", client.id)
    .single();

  // Load active destinations for context
  const { data: destinos } = await supabaseAdmin
    .from("destinos")
    .select("nombre")
    .eq("cliente_id", client.id)
    .eq("activo", true);

  const destinoNames = (destinos || []).map((d: any) => d.nombre).filter(Boolean);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
          <p className="text-gray-400 dark:text-white/40 text-sm">{t("subtitle")}</p>
        </div>
      </div>

      <ChatbotConfig
        clienteId={client.id}
        initialConfig={config ? {
          id: config.id,
          nombre_bot: config.nombre_bot,
          personalidad: config.personalidad,
          info_agencia: config.info_agencia,
          faqs: config.faqs || [],
          idiomas: config.idiomas || ["es"],
          activo: config.activo,
        } : null}
        destinos={destinoNames}
      />
    </div>
  );
}
