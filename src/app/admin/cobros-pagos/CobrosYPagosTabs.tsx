"use client";

import { useState, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

interface Props {
  cobrosSection: ReactNode;
  pagosSection: ReactNode;
}

const TAB_CONFIG = [
  { key: "cobros" as const, icon: ArrowDownToLine },
  { key: "pagos" as const, icon: ArrowUpFromLine },
] as const;

type TabKey = (typeof TAB_CONFIG)[number]["key"];

export default function CobrosYPagosTabs({ cobrosSection, pagosSection }: Props) {
  const [tab, setTab] = useState<TabKey>("cobros");
  const t = useTranslations("admin.cobros");

  const tabLabels: Record<TabKey, string> = {
    cobros: t("tabCobros"),
    pagos: t("tabPagos"),
  };

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/[0.06] rounded-xl">
        {TAB_CONFIG.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70"
            }`}
          >
            <Icon className="w-4 h-4" />
            {tabLabels[key]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "cobros" && cobrosSection}
      {tab === "pagos" && pagosSection}
    </div>
  );
}
