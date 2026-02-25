"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Sun,
  Sunset,
  Moon,
  Lightbulb,
  Trash2,
  Plus,
  Sparkles,
  ImageIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ItineraryEditorProps {
  itinerario: any;
  onChange: (updated: any) => void;
  onOpenUnsplash?: (fieldKey: string) => void;
}

const PERIODS = [
  { key: "manana", icon: Sun, color: "text-amber-500" },
  { key: "tarde", icon: Sunset, color: "text-orange-500" },
  { key: "noche", icon: Moon, color: "text-indigo-400" },
] as const;

export default function ItineraryEditor({
  itinerario,
  onChange,
  onOpenUnsplash,
}: ItineraryEditorProps) {
  const t = useTranslations("admin.destinos");
  const ti = useTranslations("ai.itinerarios");

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [openDays, setOpenDays] = useState<Record<number, boolean>>({});
  const [tipsOpen, setTipsOpen] = useState(false);
  const [queLlevarOpen, setQueLlevarOpen] = useState(false);

  // Handle both formats: AI-generated { dias: [...] } or flat array [{ day, title, description }]
  const isFlat = Array.isArray(itinerario);
  const dias: any[] = isFlat
    ? itinerario
    : (itinerario?.dias || itinerario?.days || []);
  const tips: string[] = isFlat
    ? []
    : (itinerario?.tips_generales || itinerario?.general_tips || []);
  const queLlevar: string[] = isFlat
    ? []
    : (itinerario?.que_llevar || []);

  function clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  /** Convert flat array to rich format if needed */
  function ensureRichFormat(data: any): any {
    if (Array.isArray(data)) {
      return { dias: clone(data), tips_generales: [], que_llevar: [] };
    }
    return clone(data);
  }

  function toggleDay(index: number) {
    setOpenDays((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  // --- Update helpers ---

  function updateSummary(field: string, value: string) {
    if (isFlat) return; // flat arrays don't have summary
    const updated = clone(itinerario);
    updated[field] = value;
    onChange(updated);
  }

  function updateDay(index: number, field: string, value: string) {
    const updated = clone(itinerario);
    if (isFlat) {
      updated[index][field] = value;
    } else {
      const daysKey = updated.dias ? "dias" : "days";
      updated[daysKey][index][field] = value;
    }
    onChange(updated);
  }

  function updateActivity(
    dayIndex: number,
    period: string,
    field: string,
    value: string
  ) {
    const updated = clone(itinerario);
    const day = isFlat ? updated[dayIndex] : updated[updated.dias ? "dias" : "days"][dayIndex];
    const actividades = day.actividades || day.activities || {};
    if (!day.actividades && day.activities) {
      day.activities[period][field] = value;
    } else {
      if (!actividades[period]) actividades[period] = {};
      actividades[period][field] = value;
      day.actividades = actividades;
    }
    onChange(updated);
  }

  function updateTip(index: number, value: string) {
    const updated = clone(itinerario);
    const tipsKey = updated.tips_generales ? "tips_generales" : "general_tips";
    if (!updated[tipsKey]) updated[tipsKey] = [];
    updated[tipsKey][index] = value;
    onChange(updated);
  }

  function removeTip(index: number) {
    const updated = clone(itinerario);
    const tipsKey = updated.tips_generales ? "tips_generales" : "general_tips";
    if (!updated[tipsKey]) return;
    updated[tipsKey].splice(index, 1);
    onChange(updated);
  }

  function addTip() {
    const updated = clone(itinerario);
    const tipsKey = updated.tips_generales ? "tips_generales" : "general_tips";
    if (!updated[tipsKey]) updated[tipsKey] = [];
    updated[tipsKey].push("");
    onChange(updated);
  }

  // --- Add / Remove day helpers ---

  function addDay() {
    const updated = ensureRichFormat(itinerario);
    const daysKey = updated.dias ? "dias" : "days";
    if (!updated[daysKey]) updated[daysKey] = [];
    const currentDias = updated[daysKey];
    currentDias.push({
      dia: currentDias.length + 1,
      titulo: "",
      actividades: {
        manana: { titulo: "", descripcion: "", precio_estimado: "", duracion: "" },
        tarde: { titulo: "", descripcion: "", precio_estimado: "", duracion: "" },
        noche: { titulo: "", descripcion: "", precio_estimado: "", duracion: "" },
      },
      tip_local: "",
      imagen: "",
    });
    onChange(updated);
  }

  function removeDay(index: number) {
    const updated = ensureRichFormat(itinerario);
    const daysKey = updated.dias ? "dias" : "days";
    if (!updated[daysKey]) return;
    updated[daysKey].splice(index, 1);
    // Re-number remaining days
    updated[daysKey].forEach((d: any, idx: number) => {
      d.dia = idx + 1;
    });
    onChange(updated);
  }

  // --- Que llevar helpers ---

  function updateQueLlevar(index: number, value: string) {
    const updated = ensureRichFormat(itinerario);
    if (!updated.que_llevar) updated.que_llevar = [];
    updated.que_llevar[index] = value;
    onChange(updated);
  }

  function removeQueLlevar(index: number) {
    const updated = ensureRichFormat(itinerario);
    if (!updated.que_llevar) return;
    updated.que_llevar.splice(index, 1);
    onChange(updated);
  }

  function addQueLlevar() {
    const updated = ensureRichFormat(itinerario);
    if (!updated.que_llevar) updated.que_llevar = [];
    updated.que_llevar.push("");
    onChange(updated);
  }

  // --- Period i18n key ---
  function periodLabel(key: string) {
    if (key === "manana") return ti("morning");
    if (key === "tarde") return ti("afternoon");
    return ti("night");
  }

  return (
    <div className="rounded-xl border border-drb-turquoise-200 dark:border-drb-turquoise-500/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-drb-turquoise-50/50 dark:bg-drb-turquoise-500/5 border-b border-drb-turquoise-200 dark:border-drb-turquoise-500/20">
        <Sparkles className="w-4 h-4 text-drb-turquoise-500" />
        <span className="text-sm font-semibold text-drb-turquoise-700 dark:text-drb-turquoise-400">
          {t("editItinerary")}
        </span>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
        {/* ===== SUMMARY SECTION ===== */}
        <div>
          <button
            type="button"
            onClick={() => setSummaryOpen(!summaryOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-start hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-sm font-medium text-gray-700 dark:text-white/70">
              {t("itinerarySummary")}
            </span>
            {summaryOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {summaryOpen && (
            <div className="px-4 pb-4 grid gap-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-white/40 mb-1 block">
                  {ti("estimatedPrice")}
                </label>
                <input
                  type="text"
                  value={itinerario.precio_total_estimado || ""}
                  onChange={(e) =>
                    updateSummary("precio_total_estimado", e.target.value)
                  }
                  className="panel-input w-full text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-white/40 mb-1 block">
                  {ti("bestSeason")}
                </label>
                <input
                  type="text"
                  value={itinerario.mejor_epoca || ""}
                  onChange={(e) => updateSummary("mejor_epoca", e.target.value)}
                  className="panel-input w-full text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-white/40 mb-1 block">
                  {ti("weather")}
                </label>
                <input
                  type="text"
                  value={itinerario.clima || ""}
                  onChange={(e) => updateSummary("clima", e.target.value)}
                  className="panel-input w-full text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* ===== DAYS ===== */}
        {dias.map((dia: any, i: number) => {
          const isOpen = !!openDays[i];
          const actividades = dia.actividades || dia.activities || {};
          return (
            <div key={i}>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => toggleDay(i)}
                  className="flex-1 flex items-center justify-between px-4 py-2.5 text-start hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-white/70">
                    {ti("dayLabel", { n: i + 1 })} —{" "}
                    <span className="font-normal text-gray-500 dark:text-white/50">
                      {dia.titulo || dia.title || ""}
                    </span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => removeDay(i)}
                  className="p-2 me-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
                  title={t("removeDay")}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {isOpen && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Day title */}
                  <div>
                    <label className="text-xs text-gray-500 dark:text-white/40 mb-1 block">
                      {t("activityTitle")}
                    </label>
                    <input
                      type="text"
                      value={dia.titulo || dia.title || ""}
                      onChange={(e) =>
                        updateDay(i, dia.titulo !== undefined ? "titulo" : "title", e.target.value)
                      }
                      className="panel-input w-full text-sm"
                    />
                  </div>

                  {/* Day image */}
                  <div>
                    <label className="text-xs text-gray-500 dark:text-white/40 mb-1 block">
                      {t("dayImage")}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={dia.imagen || ""}
                        onChange={(e) => updateDay(i, "imagen", e.target.value)}
                        placeholder="https://..."
                        className="panel-input flex-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => onOpenUnsplash?.("itinerary_day_" + i)}
                        className="p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors shrink-0"
                        title="Unsplash"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      {dia.imagen && (
                        <img
                          src={dia.imagen}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover shrink-0 border border-gray-200 dark:border-white/10"
                        />
                      )}
                    </div>
                  </div>

                  {/* Periods: morning / afternoon / night */}
                  {PERIODS.map(({ key, icon: Icon, color }) => {
                    const activity = actividades[key] || {};
                    return (
                      <div
                        key={key}
                        className="border border-gray-100 dark:border-white/[0.06] rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${color}`} />
                          <span className="text-xs font-semibold text-gray-600 dark:text-white/60 uppercase tracking-wide">
                            {periodLabel(key)}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-gray-400 dark:text-white/30 block mb-0.5">
                              {t("activityTitle")}
                            </label>
                            <input
                              type="text"
                              value={activity.titulo || ""}
                              onChange={(e) =>
                                updateActivity(i, key, "titulo", e.target.value)
                              }
                              className="panel-input w-full text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-gray-400 dark:text-white/30 block mb-0.5">
                              {t("activityPrice")}
                            </label>
                            <input
                              type="text"
                              value={activity.precio_estimado || ""}
                              onChange={(e) =>
                                updateActivity(
                                  i,
                                  key,
                                  "precio_estimado",
                                  e.target.value
                                )
                              }
                              className="panel-input w-full text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] text-gray-400 dark:text-white/30 block mb-0.5">
                            {t("activityDesc")}
                          </label>
                          <textarea
                            value={activity.descripcion || ""}
                            onChange={(e) =>
                              updateActivity(
                                i,
                                key,
                                "descripcion",
                                e.target.value
                              )
                            }
                            className="panel-input w-full text-sm min-h-[48px] resize-y"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-gray-400 dark:text-white/30 block mb-0.5">
                            {t("activityDuration")}
                          </label>
                          <input
                            type="text"
                            value={activity.duracion || ""}
                            onChange={(e) =>
                              updateActivity(i, key, "duracion", e.target.value)
                            }
                            className="panel-input w-full text-sm"
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Local tip */}
                  <div>
                    <label className="text-xs text-gray-500 dark:text-white/40 mb-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      {t("localTip")}
                    </label>
                    <input
                      type="text"
                      value={dia.tip_local || ""}
                      onChange={(e) => updateDay(i, "tip_local", e.target.value)}
                      className="panel-input w-full text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ===== ADD DAY BUTTON ===== */}
        <div className="px-4 py-3">
          <button
            type="button"
            onClick={addDay}
            className="flex items-center gap-1.5 text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            {t("addDay")}
          </button>
        </div>

        {/* ===== GENERAL TIPS ===== */}
        {tips.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setTipsOpen(!tipsOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-start hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-white/70">
                {ti("generalTips")}
              </span>
              {tipsOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {tipsOpen && (
              <div className="px-4 pb-4 space-y-2">
                {tips.map((tip: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => updateTip(i, e.target.value)}
                      className="panel-input flex-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeTip(i)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTip}
                  className="flex items-center gap-1.5 text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t("addTip")}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add tip button when no tips exist */}
        {tips.length === 0 && (
          <div className="px-4 py-3">
            <button
              type="button"
              onClick={addTip}
              className="flex items-center gap-1.5 text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              {t("addTip")}
            </button>
          </div>
        )}

        {/* ===== QUE LLEVAR (What to pack) ===== */}
        {queLlevar.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setQueLlevarOpen(!queLlevarOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-start hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-white/70">
                {t("queLlevar")}
              </span>
              {queLlevarOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {queLlevarOpen && (
              <div className="px-4 pb-4 space-y-2">
                {queLlevar.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateQueLlevar(i, e.target.value)}
                      className="panel-input flex-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeQueLlevar(i)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addQueLlevar}
                  className="flex items-center gap-1.5 text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t("addQueLlevarItem")}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add que_llevar button when no items exist */}
        {queLlevar.length === 0 && (
          <div className="px-4 py-3">
            <button
              type="button"
              onClick={addQueLlevar}
              className="flex items-center gap-1.5 text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              {t("addQueLlevarItem")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
