"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateCustomerNotes, updateCustomerStatus, createCustomerActivity } from "../actions";
import CustomerActivityTimeline from "./CustomerActivityTimeline";

interface Activity {
  id: string;
  customer_id: string;
  type: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface CustomerCRMPanelProps {
  customerId: string;
  notes: string;
  leadStatus: string;
  activities: Activity[];
}

const STAGES = [
  "nuevo",
  "interesado",
  "presupuesto",
  "reservado",
  "viajado",
  "inactivo",
] as const;

const STAGE_DOTS: Record<string, string> = {
  nuevo: "bg-gray-400",
  interesado: "bg-blue-500",
  presupuesto: "bg-purple-500",
  reservado: "bg-emerald-500",
  viajado: "bg-sky-500",
  inactivo: "bg-amber-500",
};

const ACTIVITY_TYPES = ["note", "call", "email", "meeting"] as const;

export default function CustomerCRMPanel({
  customerId,
  notes,
  leadStatus,
  activities,
}: CustomerCRMPanelProps) {
  const t = useTranslations("admin.crm");
  const [isPending, startTransition] = useTransition();

  const [currentNotes, setCurrentNotes] = useState(notes);
  const [notesSaved, setNotesSaved] = useState(false);

  const [actType, setActType] = useState<string>("note");
  const [actContent, setActContent] = useState("");

  const handleSaveNotes = () => {
    startTransition(async () => {
      await updateCustomerNotes(customerId, currentNotes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    });
  };

  const handleStatusChange = (newStatus: string) => {
    startTransition(() => {
      updateCustomerStatus(customerId, newStatus);
    });
  };

  const handleAddActivity = () => {
    if (!actContent.trim()) return;
    startTransition(async () => {
      await createCustomerActivity(customerId, actType, actContent);
      setActContent("");
    });
  };

  return (
    <div className="space-y-6">
      {/* Status selector */}
      <div className="panel-card p-4">
        <label className="panel-label block mb-2">{t("changeStatus")}</label>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((stage) => (
            <button
              key={stage}
              onClick={() => handleStatusChange(stage)}
              disabled={isPending}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                leadStatus === stage
                  ? "border-drb-turquoise-500 bg-drb-turquoise-50 dark:bg-drb-turquoise-500/10 text-drb-turquoise-600 dark:text-drb-turquoise-400"
                  : "border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${STAGE_DOTS[stage]}`} />
              {t(`stages.${stage}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="panel-card p-4">
        <label className="panel-label block mb-2">{t("notes")}</label>
        <textarea
          value={currentNotes}
          onChange={(e) => setCurrentNotes(e.target.value)}
          placeholder={t("notesPlaceholder")}
          rows={4}
          className="w-full panel-input resize-y"
        />
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={handleSaveNotes}
            disabled={isPending}
            className="btn-primary text-sm"
          >
            {t("saveNotes")}
          </button>
          {notesSaved && (
            <span className="text-sm text-emerald-500">{t("notesSaved")}</span>
          )}
        </div>
      </div>

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
          rows={2}
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
