import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { getTranslations } from "next-intl/server";
import { syncCustomers } from "./actions";
import {
  Users,
  Sparkles,
  CalendarCheck,
  AlertTriangle,
} from "lucide-react";
import KPICard from "@/components/ui/KPICard";
import KanbanBoard from "./KanbanBoard";
import RecentActivities from "./RecentActivities";
import SyncButton from "./SyncButton";

export const dynamic = "force-dynamic";

export default async function CRMPage() {
  const client = await requireAdminClient();
  const t = await getTranslations("admin.crm");
  const clienteId = client.id;

  // Auto-sync on first visit (when no customers exist yet)
  const { count } = await supabaseAdmin
    .from("agency_customers")
    .select("id", { count: "exact", head: true })
    .eq("cliente_id", clienteId);

  if (count === 0) {
    await syncCustomers();
  }

  // Fetch all customers for this agency
  const { data: customers } = await supabaseAdmin
    .from("agency_customers")
    .select("id, nombre, email, telefono, lead_status, total_bookings, total_spent, updated_at")
    .eq("cliente_id", clienteId)
    .order("updated_at", { ascending: false });

  const all = customers || [];

  // Fetch last activity date per customer
  const { data: lastActivities } = await supabaseAdmin
    .from("agency_customer_activities")
    .select("customer_id, created_at")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });

  const lastActivityMap: Record<string, string> = {};
  (lastActivities || []).forEach((a: { customer_id: string; created_at: string }) => {
    if (!lastActivityMap[a.customer_id]) {
      lastActivityMap[a.customer_id] = a.created_at;
    }
  });

  const customersForKanban = all.map((c) => ({
    ...c,
    last_activity_at: lastActivityMap[c.id] || null,
  }));

  // KPI calculations
  const totalCustomers = all.length;
  const interested = all.filter(
    (c) => c.lead_status === "interesado" || c.lead_status === "presupuesto"
  ).length;
  const booked = all.filter(
    (c) => c.lead_status === "reservado" || c.lead_status === "viajado"
  ).length;
  const inactive = all.filter((c) => c.lead_status === "inactivo").length;

  // Fetch recent global activities (last 15)
  const { data: recentActivitiesRaw } = await supabaseAdmin
    .from("agency_customer_activities")
    .select("id, customer_id, type, content, metadata, created_at")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false })
    .limit(15);

  // Map customer names to activities
  const customerNameMap: Record<string, string> = {};
  all.forEach((c) => {
    customerNameMap[c.id] = c.nombre || "—";
  });

  const recentActivities = (recentActivitiesRaw || []).map((a: Record<string, unknown>) => ({
    ...a,
    customer_name: customerNameMap[a.customer_id as string] || "—",
  })) as Array<{
    id: string;
    customer_id: string;
    type: string;
    content: string;
    metadata: Record<string, unknown>;
    created_at: string;
    customer_name: string;
  }>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-gray-400 dark:text-white/40 text-sm mt-1">
            {t("subtitle")}
          </p>
        </div>
        <SyncButton />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t("totalCustomers")}
          value={totalCustomers}
          icon={<Users className="w-5 h-5" />}
          accentColor="turquoise"
        />
        <KPICard
          title={t("interested")}
          value={interested}
          icon={<Sparkles className="w-5 h-5" />}
          accentColor="purple"
        />
        <KPICard
          title={t("booked")}
          value={booked}
          icon={<CalendarCheck className="w-5 h-5" />}
          accentColor="emerald"
        />
        <KPICard
          title={t("inactive")}
          value={inactive}
          icon={<AlertTriangle className="w-5 h-5" />}
          accentColor="amber"
        />
      </div>

      {/* Kanban */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-white/70 mb-3">
          {t("pipeline")}
        </h2>
        <KanbanBoard customers={customersForKanban} />
      </div>

      {/* Recent Activities */}
      <RecentActivities activities={recentActivities} />
    </div>
  );
}
