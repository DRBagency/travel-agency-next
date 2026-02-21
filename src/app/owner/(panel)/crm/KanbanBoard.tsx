"use client";

import { useTransition, useState } from "react";
import { useTranslations } from "next-intl";
import { updateLeadStatus } from "./actions";
import KanbanCard from "./KanbanCard";

interface ClientForKanban {
  id: string;
  nombre: string | null;
  plan: string | null;
  lead_status: string | null;
  last_activity_at?: string | null;
}

interface KanbanBoardProps {
  clients: ClientForKanban[];
}

const STAGES = [
  "lead",
  "contactado",
  "demo",
  "activo",
  "en_riesgo",
  "perdido",
] as const;

const STAGE_COLORS: Record<string, { dot: string; bg: string; border: string }> = {
  lead: {
    dot: "bg-gray-400",
    bg: "bg-gray-50 dark:bg-white/[0.02]",
    border: "border-gray-200 dark:border-white/[0.06]",
  },
  contactado: {
    dot: "bg-blue-500",
    bg: "bg-blue-50/50 dark:bg-blue-500/[0.04]",
    border: "border-blue-200 dark:border-blue-500/20",
  },
  demo: {
    dot: "bg-purple-500",
    bg: "bg-purple-50/50 dark:bg-purple-500/[0.04]",
    border: "border-purple-200 dark:border-purple-500/20",
  },
  activo: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50/50 dark:bg-emerald-500/[0.04]",
    border: "border-emerald-200 dark:border-emerald-500/20",
  },
  en_riesgo: {
    dot: "bg-amber-500",
    bg: "bg-amber-50/50 dark:bg-amber-500/[0.04]",
    border: "border-amber-200 dark:border-amber-500/20",
  },
  perdido: {
    dot: "bg-red-500",
    bg: "bg-red-50/50 dark:bg-red-500/[0.04]",
    border: "border-red-200 dark:border-red-500/20",
  },
};

export default function KanbanBoard({ clients }: KanbanBoardProps) {
  const t = useTranslations("owner.crm");
  const [isPending, startTransition] = useTransition();
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const clientsByStage = (stage: string) =>
    clients.filter((c) => (c.lead_status || "lead") === stage);

  const handleDrop = (stage: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverStage(null);
    const clientId = e.dataTransfer.getData("text/plain");
    if (!clientId) return;

    startTransition(() => {
      updateLeadStatus(clientId, stage);
    });
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3 min-w-max">
        {STAGES.map((stage) => {
          const stageClients = clientsByStage(stage);
          const colors = STAGE_COLORS[stage];
          const isOver = dragOverStage === stage;

          return (
            <div
              key={stage}
              className={`flex flex-col min-w-[260px] w-[260px] rounded-xl border ${colors.border} ${colors.bg} transition-colors ${
                isOver ? "ring-2 ring-drb-turquoise-400 ring-offset-1 dark:ring-offset-[#041820]" : ""
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDragOverStage(stage);
              }}
              onDragLeave={() => setDragOverStage(null)}
              onDrop={(e) => handleDrop(stage, e)}
            >
              {/* Column header */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 dark:border-white/[0.06]">
                <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                <span className="text-sm font-semibold text-gray-700 dark:text-white/80">
                  {t(`stages.${stage}`)}
                </span>
                <span className="ms-auto text-xs font-medium text-gray-400 dark:text-white/30 bg-gray-100 dark:bg-white/[0.06] px-1.5 py-0.5 rounded-full">
                  {stageClients.length}
                </span>
              </div>

              {/* Cards */}
              <div className={`flex-1 p-2 space-y-2 min-h-[120px] ${isPending ? "opacity-70" : ""}`}>
                {stageClients.length === 0 ? (
                  <div className={`flex items-center justify-center h-full min-h-[80px] rounded-lg border-2 border-dashed transition-colors ${
                    isOver
                      ? "border-drb-turquoise-400 bg-drb-turquoise-50/50 dark:bg-drb-turquoise-500/[0.06]"
                      : "border-gray-200 dark:border-white/[0.06]"
                  }`}>
                    <span className="text-xs text-gray-300 dark:text-white/20">
                      {t("noClientsInStage")}
                    </span>
                  </div>
                ) : (
                  stageClients.map((client) => (
                    <KanbanCard key={client.id} client={client} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
