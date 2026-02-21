"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Loader2, CalendarDays, ChevronDown, ChevronUp, Sun, Cloud, Lightbulb } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useTranslations } from "next-intl";

export interface Destination {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_adulto?: number;
  precio_nino?: number;
  precio_grupo?: number;
  imagen_url: string | null;
  itinerario: any | null;
}

interface DestinationsGridProps {
  clienteId: string;
  onReserve: (destination: Destination) => void;
  primaryColor?: string | null;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const DestinationsGrid = ({
  clienteId,
  onReserve,
  primaryColor,
}: DestinationsGridProps) => {
  const t = useTranslations("landing.destinations");
  const [destinos, setDestinos] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const accentColor = primaryColor || "#1CABB0";

  useEffect(() => {
    const loadDestinos = async () => {
      const { data } = await supabase
        .from("destinos")
        .select("*")
        .eq("cliente_id", clienteId)
        .eq("activo", true);
      if (data) setDestinos(data);
      setLoading(false);
    };
    loadDestinos();
  }, [clienteId]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-white/60">
        <Loader2 className="w-5 h-5 animate-spin" />
        {t("loading")}
      </div>
    );
  }

  if (destinos.length === 0) {
    return (
      <p className="text-center py-20 text-white/60">
        {t("empty")}
      </p>
    );
  }

  return (
    <section id="destinos" className="py-24 md:py-28 lg:py-32 relative scroll-mt-24">
      {/* Background effects */}
      <div className="absolute -top-24 end-0 h-80 w-80 rounded-full blur-[120px] animate-float-slow" style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 18%, transparent)` }} />
      <div className="absolute bottom-0 start-0 h-64 w-64 rounded-full bg-drb-lime-500/10 blur-[100px] animate-float-slower" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <span
            className="inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-4"
            style={{
              borderColor: `color-mix(in srgb, ${accentColor} 35%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
            }}
          >
            <MapPin className="w-3.5 h-3.5 me-2" style={{ color: accentColor }} />
            {t("badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
            {t("title")}{" "}
            <span className="gradient-text-ocean">{t("titleHighlight")}</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mt-4">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Cards grid with staggered entrance */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinos.map((d, i) => {
            const isExpanded = expandedId === d.id;
            const dias = d.itinerario?.dias || d.itinerario?.days || [];
            const hasItinerary = d.itinerario && dias.length > 0;

            return (
              <motion.div
                key={d.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden backdrop-blur-xl shadow-[0_20px_40px_rgba(2,6,23,0.45)] transition-colors hover:border-white/25"
              >
                {/* Image container */}
                <div className="relative h-60 overflow-hidden">
                  {d.imagen_url ? (
                    <Image
                      src={d.imagen_url}
                      alt={d.nombre}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-slate-900 text-white/70">
                      {t("noImage")}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Price badge with glow */}
                  <div
                    className="absolute top-4 end-4 rounded-full px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm border transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${accentColor} 85%, transparent)`,
                      borderColor: `color-mix(in srgb, ${accentColor} 70%, transparent)`,
                      boxShadow: `0 4px 20px color-mix(in srgb, ${accentColor} 30%, transparent)`,
                    }}
                  >
                    {d.precio} €
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    {d.nombre}
                  </h3>
                  <p className="text-sm text-white/65 mb-4 line-clamp-2">
                    {d.descripcion}
                  </p>

                  {/* Price breakdown */}
                  {((d.precio_adulto ?? 0) > 0 || (d.precio_nino ?? 0) > 0) && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/55 mb-4">
                      {(d.precio_adulto ?? 0) > 0 && (
                        <span>{d.precio_adulto} € {t("perAdult")}</span>
                      )}
                      {(d.precio_nino ?? 0) > 0 && (
                        <span>{d.precio_nino} € {t("perChild")}</span>
                      )}
                      {(d.precio_grupo ?? 0) > 0 && (
                        <span>{d.precio_grupo} € {t("perGroup")}</span>
                      )}
                    </div>
                  )}

                  {/* View itinerary button */}
                  {hasItinerary && (
                    <button
                      onClick={() => toggleExpand(d.id)}
                      className="flex items-center gap-2 text-sm font-medium mb-4 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all"
                    >
                      <CalendarDays className="w-4 h-4" />
                      {isExpanded ? t("hideItinerary") : t("viewItinerary")}
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  {/* Expanded itinerary panel */}
                  <AnimatePresence>
                    {isExpanded && hasItinerary && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mb-4 space-y-3">
                          {/* Summary badges */}
                          <div className="flex flex-wrap gap-2">
                            {(d.itinerario.precio_total_estimado || d.itinerario.estimated_price) && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/[0.08] text-white/70 border border-white/10">
                                💰 {d.itinerario.precio_total_estimado || d.itinerario.estimated_price}
                              </span>
                            )}
                            {(d.itinerario.mejor_epoca || d.itinerario.best_season) && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/[0.08] text-white/70 border border-white/10">
                                <Sun className="w-3 h-3" />
                                {t("bestSeason")}: {d.itinerario.mejor_epoca || d.itinerario.best_season}
                              </span>
                            )}
                            {(d.itinerario.clima || d.itinerario.weather) && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/[0.08] text-white/70 border border-white/10">
                                <Cloud className="w-3 h-3" />
                                {t("weather")}: {d.itinerario.clima || d.itinerario.weather}
                              </span>
                            )}
                          </div>

                          {/* Days list */}
                          <div className="max-h-72 overflow-y-auto space-y-2 pe-1">
                            {dias.map((dia: any, idx: number) => {
                              const activities = dia.actividades || dia.activities || {};
                              const morning = activities.manana || activities.morning;
                              const afternoon = activities.tarde || activities.afternoon;
                              const night = activities.noche || activities.night;

                              return (
                                <div
                                  key={idx}
                                  className="border-s-2 ps-3 py-1.5"
                                  style={{ borderColor: `color-mix(in srgb, ${accentColor} 60%, transparent)` }}
                                >
                                  <div className="text-sm font-medium text-white/80">
                                    {t("dayLabel", { n: idx + 1 })} — {dia.titulo || dia.title}
                                  </div>
                                  <div className="mt-1 space-y-0.5 text-xs text-white/50">
                                    {morning && (
                                      <div>
                                        <span className="text-white/60 font-medium">{t("morning")}:</span>{" "}
                                        {typeof morning === "string" ? morning : morning.titulo || morning.title || ""}
                                      </div>
                                    )}
                                    {afternoon && (
                                      <div>
                                        <span className="text-white/60 font-medium">{t("afternoon")}:</span>{" "}
                                        {typeof afternoon === "string" ? afternoon : afternoon.titulo || afternoon.title || ""}
                                      </div>
                                    )}
                                    {night && (
                                      <div>
                                        <span className="text-white/60 font-medium">{t("night")}:</span>{" "}
                                        {typeof night === "string" ? night : night.titulo || night.title || ""}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* First tip */}
                          {(() => {
                            const tips = d.itinerario.tips_generales || d.itinerario.general_tips || [];
                            const firstTip = Array.isArray(tips) ? tips[0] : null;
                            if (!firstTip) return null;
                            return (
                              <div className="flex items-start gap-2 text-xs text-white/50 bg-white/[0.04] rounded-xl px-3 py-2 border border-white/[0.06]">
                                <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0 text-white/40" />
                                <span>{typeof firstTip === "string" ? firstTip : firstTip.texto || firstTip.text || ""}</span>
                              </div>
                            );
                          })()}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/55">
                      {t("from")}
                      <div className="text-xl font-bold text-white">
                        {d.precio} €
                      </div>
                    </div>
                    <button
                      onClick={() => onReserve(d)}
                      className="px-5 py-3 rounded-2xl flex items-center gap-2 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110 hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                      style={{
                        backgroundColor: accentColor,
                        boxShadow: `0 8px 24px color-mix(in srgb, ${accentColor} 35%, transparent)`,
                      }}
                    >
                      {t("reserve")}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DestinationsGrid;
