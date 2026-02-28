"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { createCustomerActivity } from "../actions";
import CustomerActivityTimeline from "./CustomerActivityTimeline";

interface Activity {
  id: string;
  customer_id: string;
  type: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface CustomerActivitySectionProps {
  customerId: string;
  activities: Activity[];
}

const ACTIVITY_TYPES = ["note", "call", "email", "meeting"] as const;

export default function CustomerActivitySection({
  customerId,
  activities,
}: CustomerActivitySectionProps) {
  const t = useTranslations("admin.crm");
  const [isPending, startTransition] = useTransition();

  const [actType, setActType] = useState<string>("note");
  const [actContent, setActContent] = useState("");

  const handleAddActivity = () => {
    if (!actContent.trim()) return;
    startTransition(async () => {
      await createCustomerActivity(customerId, actType, actContent);
      setActContent("");
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add activity */}
      <div className="panel-card p-4">
        <label className="panel-label block mb-2">{t("addActivity")}</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {ACTIVITY_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setActType(type)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                actType === type
                  ? "border-drb-turquoise-500 bg-drb-turquoise-50 dark:bg-drb-turquoise-500/10 text-drb-turquoise-600 dark:text-drb-turquoise-400"
                  : "border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
              }`}
            >
              {t(`types.${type}`)}
            </button>
          ))}
        </div>
        <textarea
          value={actContent}
          onChange={(e) => setActContent(e.target.value)}
          placeholder={t("activityContentPlaceholder")}
          rows={3}
          className="w-full panel-input resize-y"
        />
        <button
          onClick={handleAddActivity}
          disabled={isPending || !actContent.trim()}
          className="btn-primary text-sm mt-2"
        >
          {t("addActivity")}
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="panel-card p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {t("timeline")}
        </h3>
        <CustomerActivityTimeline activities={activities} />
      </div>
    </div>
  );
}
