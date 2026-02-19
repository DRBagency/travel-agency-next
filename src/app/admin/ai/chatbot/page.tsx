import { requireAdminClient } from "@/lib/requireAdminClient";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getTranslations } from "next-intl/server";
import { isAILocked } from "@/lib/plan-gating";
import ChatbotConfig from "@/components/ai/ChatbotConfig";
import AILockedOverlay from "@/components/ai/AILockedOverlay";
import { Bot } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AIChatbotPage() {
  const client = await requireAdminClient();
  const t = await getTranslations("ai.chatbot");

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

      {isAILocked(client.plan) ? (
        <AILockedOverlay />
      ) : (
        <ChatbotPageContent clientId={client.id} />
      )}
    </div>
  );
}

async function ChatbotPageContent({ clientId }: { clientId: string }) {
  // Load existing config
  const { data: config } = await supabaseAdmin
    .from("ai_chatbot_config")
    .select("*")
    .eq("cliente_id", clientId)
    .single();

  // Load active destinations for context
  const { data: destinos } = await supabaseAdmin
    .from("destinos")
    .select("nombre")
    .eq("cliente_id", clientId)
    .eq("activo", true);

  const destinoNames = (destinos || []).map((d: any) => d.nombre).filter(Boolean);

  return (
    <ChatbotConfig
      clienteId={clientId}
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
  );
}
