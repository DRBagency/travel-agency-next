"use client";

import { useTranslations } from "next-intl";

interface FunnelItem {
  stage: string;
  count: number;
}

interface CRMFunnelChartProps {
  data: FunnelItem[];
}

const STAGE_COLORS: Record<string, string> = {
  nuevo: "bg-gray-400",
  interesado: "bg-blue-500",
  presupuesto: "bg-purple-500",
  reservado: "bg-emerald-500",
  viajado: "bg-sky-500",
  inactivo: "bg-amber-500",
};

const STAGE_BAR_BG: Record<string, string> = {
  nuevo: "bg-gray-400/20",
  interesado: "bg-blue-500/20",
  presupuesto: "bg-purple-500/20",
  reservado: "bg-emerald-500/20",
  viajado: "bg-sky-500/20",
  inactivo: "bg-amber-500/20",
};

export default function CRMFunnelChart({ data }: CRMFunnelChartProps) {
  const t = useTranslations("admin.crm");
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  // Conversion stages (skip inactivo for conversion calc)
  const conversionStages = data.filter((d) => d.stage !== "inactivo");

  return (
    <div className="panel-card p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {t("funnelTitle")}
        </h3>
        <p className="text-xs text-gray-400 dark:text-white/40">
          {t("funnelSubtitle")}
        </p>
      </div>
      <div className="space-y-2">
        {data.map((item, i) => {
          const widthPct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

          // Calculate conversion rate from previous stage (skip inactivo)
          let conversionPct: number | null = null;
          if (item.stage !== "inactivo") {
            const convIdx = conversionStages.findIndex((c) => c.stage === item.stage);
            if (convIdx > 0) {
              const prev = conversionStages[convIdx - 1];
              conversionPct = prev.count > 0 ? Math.round((item.count / prev.count) * 100) : null;
            }
          }

          return (
            <div key={item.stage} className="flex items-center gap-3">
              <div className="w-24 flex items-center gap-1.5 shrink-0">
                <div className={`w-2 h-2 rounded-full ${STAGE_COLORS[item.stage]}`} />
                <span className="text-xs font-medium text-gray-600 dark:text-white/70 truncate">
                  {t(`stages.${item.stage}`)}
                </span>
              </div>
              <div className={`flex-1 h-6 rounded-md ${STAGE_BAR_BG[item.stage]} overflow-hidden`}>
                <div
                  className={`h-full rounded-md ${STAGE_COLORS[item.stage]} transition-all duration-500`}
                  style={{ width: `${Math.max(widthPct, 2)}%` }}
                />
              </div>
              <div className="w-16 text-end shrink-0">
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {item.count}
                </span>
                {conversionPct !== null && (
                  <span className="text-[10px] text-gray-400 dark:text-white/30 ms-1">
                    ({conversionPct}%)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
