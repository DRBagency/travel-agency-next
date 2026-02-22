import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { getTranslations } from "next-intl/server";
import { syncCustomers } from "./actions";
import {
  Users,
  Sparkles,
  CalendarCheck,
  AlertTriangle,
  Search,
  Download,
} from "lucide-react";
import KPICard from "@/components/ui/KPICard";
import KanbanBoard from "./KanbanBoard";
import RecentActivities from "./RecentActivities";
import SyncButton from "./SyncButton";
import CRMFunnelChart from "./CRMFunnelChart";

export const dynamic = "force-dynamic";

const STAGES = [
  "nuevo",
  "interesado",
  "presupuesto",
  "reservado",
  "viajado",
  "inactivo",
] as const;

interface CRMPageProps {
  searchParams: Promise<{
    q?: string;
    stage?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function CRMPage({ searchParams }: CRMPageProps) {
  const {
    q = "",
    stage = "",
    from = "",
    to = "",
  } = await searchParams;

  const client = await requireAdminClient();
  const t = await getTranslations("admin.crm");
  const tc = await getTranslations("common");
  const clienteId = client.id;

  // Auto-sync on first visit (when no customers exist yet)
  const { count } = await supabaseAdmin
    .from("agency_customers")
    .select("id", { count: "exact", head: true })
    .eq("cliente_id", clienteId);

  if (count === 0) {
    await syncCustomers();
  }

  // Fetch customers with filters
  let query = supabaseAdmin
    .from("agency_customers")
    .select("id, nombre, email, telefono, lead_status, total_bookings, total_spent, tags, updated_at")
    .eq("cliente_id", clienteId);

  if (q) {
    query = query.or(`nombre.ilike.%${q}%,email.ilike.%${q}%`);
  }
  if (stage) {
    query = query.eq("lead_status", stage);
  }
  if (from) {
    query = query.gte("created_at", `${from}T00:00:00.000Z`);
  }
  if (to) {
    query = query.lte("created_at", `${to}T23:59:59.999Z`);
  }

  const { data: customers } = await query.order("updated_at", { ascending: false });

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
    tags: (c.tags as string[] | null) || [],
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

  // Funnel data — count customers per stage (from all customers, not filtered)
  const { data: allCustomersForFunnel } = await supabaseAdmin
    .from("agency_customers")
    .select("lead_status")
    .eq("cliente_id", clienteId);

  const funnelData = STAGES.map((s) => ({
    stage: s,
    count: (allCustomersForFunnel || []).filter(
      (c) => (c.lead_status || "nuevo") === s
    ).length,
  }));

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

  // Build export URL with current filters
  const exportParams = new URLSearchParams();
  if (q) exportParams.set("q", q);
  if (stage) exportParams.set("stage", stage);
  if (from) exportParams.set("from", from);
  if (to) exportParams.set("to", to);
  const exportUrl = `/api/admin/crm/export${exportParams.toString() ? `?${exportParams}` : ""}`;

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
        <div className="flex items-center gap-2">
          <a
            href={exportUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:bg-drb-turquoise-100 dark:hover:bg-drb-turquoise-500/25 font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {t("exportCSV")}
          </a>
          <SyncButton />
        </div>
      </div>

      {/* Filters */}
      <details className="panel-card">
        <summary className="flex items-center gap-2 p-4 cursor-pointer list-none text-sm font-medium text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70 transition-colors [&::-webkit-details-marker]:hidden">
          <Search className="w-4 h-4" />
          {t("searchAndFilter")}
        </summary>
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-white/[0.06]">
          <form method="get" className="flex flex-wrap items-center gap-3 pt-3">
            <input
              name="q"
              defaultValue={q}
              placeholder={t("searchPlaceholder")}
              className="panel-input text-sm"
            />
            <select
              name="stage"
              defaultValue={stage}
              className="panel-input text-sm"
            >
              <option value="">{t("allStages")}</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>{t(`stages.${s}`)}</option>
              ))}
            </select>
            <input
              type="date"
              name="from"
              defaultValue={from}
              className="panel-input text-sm"
            />
            <input
              type="date"
              name="to"
              defaultValue={to}
              className="panel-input text-sm"
            />
            <button className="btn-primary text-sm">
              {tc("filter")}
            </button>
            {(q || stage || from || to) && (
              <a
                href="/admin/crm"
                className="text-sm text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/60 transition-colors"
              >
                {t("clearFilters")}
              </a>
            )}
          </form>
        </div>
      </details>

      {/* KPIs + Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-4">
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
        <CRMFunnelChart data={funnelData} />
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
