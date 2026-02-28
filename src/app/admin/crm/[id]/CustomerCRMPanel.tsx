"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateCustomerNotes, updateCustomerStatus, updateCustomerTags } from "../actions";
import { X, Plus } from "lucide-react";

interface CustomerCRMPanelProps {
  customerId: string;
  notes: string;
  leadStatus: string;
  tags: string[];
}

const SUGGESTED_TAGS = ["VIP", "Repetidor", "Corporativo", "Grupo", "Urgente"];

const TAG_COLORS: Record<string, string> = {
  VIP: "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Repetidor: "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Corporativo: "bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400",
  Grupo: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Urgente: "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400",
};

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

export default function CustomerCRMPanel({
  customerId,
  notes,
  leadStatus,
  tags: initialTags,
}: CustomerCRMPanelProps) {
  const t = useTranslations("admin.crm");
  const [isPending, startTransition] = useTransition();

  const [currentNotes, setCurrentNotes] = useState(notes);
  const [notesSaved, setNotesSaved] = useState(false);

  const [currentTags, setCurrentTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState("");

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

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || currentTags.includes(trimmed)) return;
    const updated = [...currentTags, trimmed];
    setCurrentTags(updated);
    setNewTag("");
    startTransition(() => {
      updateCustomerTags(customerId, updated);
    });
  };

  const handleRemoveTag = (tag: string) => {
    const updated = currentTags.filter((t) => t !== tag);
    setCurrentTags(updated);
    startTransition(() => {
      updateCustomerTags(customerId, updated);
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

      {/* Tags */}
      <div className="panel-card p-4">
        <label className="panel-label block mb-2">{t("tags")}</label>
        {currentTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {currentTags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  TAG_COLORS[tag] || "bg-gray-100 dark:bg-white/[0.08] text-gray-600 dark:text-white/70"
                }`}
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  disabled={isPending}
                  className="hover:opacity-70 transition-opacity"
                  title={t("removeTag")}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag(newTag);
              }
            }}
            placeholder={t("tagPlaceholder")}
            className="panel-input text-sm flex-1"
          />
          <button
            onClick={() => handleAddTag(newTag)}
            disabled={isPending || !newTag.trim()}
            className="btn-primary text-sm flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            {t("addTag")}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] text-gray-400 dark:text-white/30 self-center me-1">
            {t("suggestedTags")}:
          </span>
          {SUGGESTED_TAGS.filter((s) => !currentTags.includes(s)).map((tag) => (
            <button
              key={tag}
              onClick={() => handleAddTag(tag)}
              disabled={isPending}
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border border-dashed transition-colors ${
                TAG_COLORS[tag] || "bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-white/50"
              } border-gray-300 dark:border-white/[0.12] hover:border-drb-turquoise-400 dark:hover:border-drb-turquoise-500`}
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
