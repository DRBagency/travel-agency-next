import { supabaseAdmin } from "@/lib/supabase-server";
import { getTranslations } from "next-intl/server";
import {
  Users,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import KPICard from "@/components/ui/KPICard";
import KanbanBoard from "./KanbanBoard";
import RecentActivities from "./RecentActivities";

export const dynamic = "force-dynamic";

export default async function CRMPage() {
  const t = await getTranslations("owner.crm");

  // Fetch all clients with lead_status
  const { data: clientes } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre, plan, lead_status, client_notes")
    .order("created_at", { ascending: false });

  const all = clientes || [];

  // Fetch last activity date per client for the kanban cards
  const { data: lastActivities } = await supabaseAdmin
    .from("client_activities")
    .select("client_id, created_at")
    .order("created_at", { ascending: false });

  const lastActivityMap: Record<string, string> = {};
  (lastActivities || []).forEach((a: { client_id: string; created_at: string }) => {
    if (!lastActivityMap[a.client_id]) {
      lastActivityMap[a.client_id] = a.created_at;
    }
  });

  const clientsForKanban = all.map((c) => ({
    ...c,
    last_activity_at: lastActivityMap[c.id] || null,
  }));

  // KPI calculations
  const totalLeads = all.length;
  const inNegotiation = all.filter(
    (c) => (c.lead_status === "contactado" || c.lead_status === "demo")
  ).length;
  const activos = all.filter((c) => c.lead_status === "activo").length;
  const enRiesgo = all.filter((c) => c.lead_status === "en_riesgo").length;

  // Fetch recent global activities (last 15)
  const { data: recentActivitiesRaw } = await supabaseAdmin
    .from("client_activities")
    .select("id, client_id, type, content, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(15);

  // Map client names to activities
  const clientNameMap: Record<string, string> = {};
  all.forEach((c) => {
    clientNameMap[c.id] = c.nombre || "—";
  });

  const recentActivities = (recentActivitiesRaw || []).map((a: Record<string, unknown>) => ({
    ...a,
    client_name: clientNameMap[a.client_id as string] || "—",
  })) as Array<{
    id: string;
    client_id: string;
    type: string;
    content: string;
    metadata: Record<string, unknown>;
    created_at: string;
    client_name: string;
  }>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="text-gray-400 dark:text-white/40 text-sm mt-1">
          {t("subtitle")}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t("totalLeads")}
          value={totalLeads}
          icon={<Users className="w-5 h-5" />}
          accentColor="turquoise"
        />
        <KPICard
          title={t("inNegotiation")}
          value={inNegotiation}
          icon={<MessageSquare className="w-5 h-5" />}
          accentColor="purple"
        />
        <KPICard
          title={t("active")}
          value={activos}
          icon={<CheckCircle className="w-5 h-5" />}
          accentColor="emerald"
        />
        <KPICard
          title={t("atRisk")}
          value={enRiesgo}
          icon={<AlertTriangle className="w-5 h-5" />}
          accentColor="amber"
        />
      </div>

      {/* Kanban */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-white/70 mb-3">
          {t("pipeline")}
        </h2>
        <KanbanBoard clients={clientsForKanban} />
      </div>

      {/* Recent Activities */}
      <RecentActivities activities={recentActivities} />
    </div>
  );
}
