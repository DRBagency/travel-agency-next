"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  MapPin,
  Calendar,
  Wallet,
  ChevronDown,
  ChevronUp,
  Trash2,
  Loader2,
} from "lucide-react";

interface SavedItinerary {
  id: string;
  pais: string;
  duracion: number;
  estilo: string;
  itinerario: any;
  created_at: string;
}

interface Props {
  clienteId: string;
}

export default function SavedItinerariesList({ clienteId }: Props) {
  const t = useTranslations("ai.itinerarios");
  const tc = useTranslations("common");
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const res = await fetch(`/api/ai/saved-itineraries?clienteId=${clienteId}`);
      if (res.ok) {
        const data = await res.json();
        setItineraries(data.itineraries || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const deleteItinerary = async (id: string) => {
    if (!confirm(t("confirmDeleteItinerary"))) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/ai/delete-itinerary", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setItineraries((prev) => prev.filter((it) => it.id !== id));
        toast.success(tc("success"));
      } else {
        throw new Error("Failed to delete");
      }
    } catch {
      toast.error(tc("error"));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="panel-card p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-48" />
          <div className="h-20 bg-gray-200 dark:bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  if (itineraries.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t("savedItineraries")}
      </h2>

      <div className="grid gap-3">
        {itineraries.map((it) => {
          const isExpanded = expandedId === it.id;
          const resultado =
            typeof it.itinerario === "string"
              ? JSON.parse(it.itinerario)
              : it.itinerario;

          return (
            <div key={it.id} className="panel-card overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : it.id)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {it.pais}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-white/40 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {it.duracion} {t("daysUnit")}
                      </span>
                      <span className="capitalize">{it.estilo}</span>
                      {resultado?.precio_total_estimado && (
                        <span className="flex items-center gap-1">
                          <Wallet className="w-3 h-3" />
                          {resultado.precio_total_estimado}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400 dark:text-white/30 hidden sm:block">
                    {new Date(it.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItinerary(it.id);
                    }}
                    disabled={deletingId === it.id}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    {deletingId === it.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {isExpanded && resultado && (
                <div className="border-t border-gray-100 dark:border-white/[0.06] p-4 space-y-4">
                  {/* Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {resultado.precio_total_estimado && (
                      <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3">
                        <p className="text-xs text-gray-400 dark:text-white/40">
                          {t("estimatedPrice")}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {resultado.precio_total_estimado}
                        </p>
                      </div>
                    )}
                    {resultado.mejor_epoca && (
                      <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3">
                        <p className="text-xs text-gray-400 dark:text-white/40">
                          {t("bestSeason")}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {resultado.mejor_epoca}
                        </p>
                      </div>
                    )}
                    {resultado.clima && (
                      <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3">
                        <p className="text-xs text-gray-400 dark:text-white/40">
                          {t("weather")}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {resultado.clima}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Days */}
                  {resultado.dias?.map((day: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-4 space-y-3"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {t("dayLabel", { n: day.dia || idx + 1 })} — {day.titulo}
                      </h4>
                      {["manana", "tarde", "noche"].map((period) => {
                        const activity = day.actividades?.[period];
                        if (!activity) return null;
                        const periodLabel =
                          period === "manana"
                            ? t("morning")
                            : period === "tarde"
                            ? t("afternoon")
                            : t("night");
                        return (
                          <div
                            key={period}
                            className="ps-4 border-s-2 border-drb-turquoise-200 dark:border-drb-turquoise-700"
                          >
                            <p className="text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 mb-1">
                              {periodLabel}
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.titulo}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-white/50 mt-0.5">
                              {activity.descripcion}
                            </p>
                            <div className="flex gap-3 mt-1 text-xs text-gray-400 dark:text-white/30">
                              {activity.precio_estimado && (
                                <span>{activity.precio_estimado}</span>
                              )}
                              {activity.duracion && (
                                <span>{activity.duracion}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {day.tip_local && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                          💡 {day.tip_local}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Tips */}
                  {resultado.tips_generales?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {t("generalTips")}
                      </h4>
                      <ul className="space-y-1">
                        {resultado.tips_generales.map(
                          (tip: string, i: number) => (
                            <li
                              key={i}
                              className="text-sm text-gray-600 dark:text-white/60 flex items-start gap-2"
                            >
                              <span className="text-drb-turquoise-500 mt-0.5">
                                •
                              </span>
                              {tip}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
