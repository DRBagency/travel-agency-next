import { requireAdminClient } from "@/lib/requireAdminClient";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getTranslations } from "next-intl/server";
import FreeChat from "@/components/ai/FreeChat";
import { MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AIAssistantPage() {
  const client = await requireAdminClient();
  const t = await getTranslations("ai.assistant");

  // Build context from agency data
  const { data: destinos } = await supabaseAdmin
    .from("destinos")
    .select("nombre, descripcion, precio, activo")
    .eq("cliente_id", client.id);

  const { data: reservas } = await supabaseAdmin
    .from("reservas")
    .select("id, destino, precio, estado_pago")
    .eq("cliente_id", client.id);

  const destinosList = (destinos || [])
    .map((d: any) => `- ${d.nombre}: ${d.precio}€ (${d.activo ? "activo" : "inactivo"})`)
    .join("\n");

  const totalReservas = reservas?.length || 0;
  const pagadas = reservas?.filter((r: any) => r.estado_pago === "pagado") || [];
  const totalIngresos = pagadas.reduce((s: number, r: any) => s + Number(r.precio), 0);

  const agencyContext = `
Agencia: ${client.nombre}
Plan: ${client.plan || "No definido"}
Destinos activos:
${destinosList || "Ninguno"}
Reservas totales: ${totalReservas}
Reservas pagadas: ${pagadas.length}
Ingresos totales: ${totalIngresos}€
`.trim();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
          <p className="text-gray-400 dark:text-white/40 text-sm">{t("subtitle")}</p>
        </div>
      </div>

      <FreeChat clienteId={client.id} agencyContext={agencyContext} />
    </div>
  );
}
