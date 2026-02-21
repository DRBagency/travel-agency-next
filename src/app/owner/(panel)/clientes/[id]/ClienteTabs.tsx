"use client";

import { useState, useEffect, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Info, MapPin, ShoppingBag, Sparkles, Handshake } from "lucide-react";

interface ClienteTabsProps {
  infoTab: ReactNode;
  destinationsTab: ReactNode;
  bookingsTab: ReactNode;
  aiTab: ReactNode;
  crmTab?: ReactNode;
  destinationsCount: number;
  bookingsCount: number;
}

export default function ClienteTabs({
  infoTab,
  destinationsTab,
  bookingsTab,
  aiTab,
  crmTab,
  destinationsCount,
  bookingsCount,
}: ClienteTabsProps) {
  const t = useTranslations("owner.clientes.tabs");
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "crm" && crmTab) setActiveTab("crm");
  }, [searchParams, crmTab]);

  const tabs = [
    { id: "info", label: t("info"), icon: Info },
    { id: "destinations", label: t("destinations"), icon: MapPin, count: destinationsCount },
    { id: "bookings", label: t("bookings"), icon: ShoppingBag, count: bookingsCount },
    { id: "ai", label: t("ai"), icon: Sparkles },
    ...(crmTab ? [{ id: "crm", label: t("crm"), icon: Handshake }] : []),
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-100 dark:border-white/[0.06] mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-drb-turquoise-500 text-drb-turquoise-600 dark:text-drb-turquoise-400"
                : "border-transparent text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/60"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? "bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 text-drb-turquoise-600 dark:text-drb-turquoise-400"
                  : "bg-gray-100 dark:bg-white/[0.06] text-gray-400 dark:text-white/40"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {activeTab === "info" && infoTab}
        {activeTab === "destinations" && destinationsTab}
        {activeTab === "bookings" && bookingsTab}
        {activeTab === "ai" && aiTab}
        {activeTab === "crm" && crmTab}
      </div>
    </div>
  );
}
