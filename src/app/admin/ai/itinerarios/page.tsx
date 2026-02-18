import { requireAdminClient } from "@/lib/requireAdminClient";
import { getTranslations } from "next-intl/server";
import ItineraryGenerator from "@/components/ai/ItineraryGenerator";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AIItinerariosPage() {
  const client = await requireAdminClient();
  const t = await getTranslations("ai.itinerarios");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
          <p className="text-gray-400 dark:text-white/40 text-sm">{t("subtitle")}</p>
        </div>
      </div>

      <ItineraryGenerator clienteId={client.id} />
    </div>
  );
}
