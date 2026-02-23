"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/landing/ScrollReveal";

interface Destination {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string | null;
  categoria?: string | null;
  ubicacion_corta?: string | null;
  precio_adulto?: number;
  precio_nino?: number;
  precio_grupo?: number;
  itinerario?: any;
}

interface DestinationsFilteredProps {
  clienteId: string;
  primaryColor?: string | null;
  onReserve: (destination: any) => void;
}

const DestinationsFiltered = ({
  clienteId,
  primaryColor,
  onReserve,
}: DestinationsFilteredProps) => {
  const t = useTranslations("landing.filtered");
  const tc = useTranslations("landing.categories");
  const accentColor = primaryColor || "#1CABB0";
  const [destinos, setDestinos] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("destinos")
        .select("*")
        .eq("cliente_id", clienteId)
        .eq("activo", true);
      if (data) setDestinos(data);
      setLoading(false);
    };
    load();
  }, [clienteId]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    destinos.forEach((d) => {
      if (d.categoria) cats.add(d.categoria);
    });
    return Array.from(cats);
  }, [destinos]);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return destinos;
    return destinos.filter((d) => d.categoria === activeCategory);
  }, [destinos, activeCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (destinos.length === 0) return null;

  return (
    <section id="destinos" className="py-24 md:py-28 lg:py-32 scroll-mt-24 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {t("title")}
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Category tabs */}
        {categories.length > 1 && (
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setActiveCategory("all")}
                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
                style={{
                  backgroundColor: activeCategory === "all" ? "#0f172a" : "#f1f5f9",
                  color: activeCategory === "all" ? "#ffffff" : "#475569",
                }}
              >
                {t("all")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: activeCategory === cat ? "#0f172a" : "#f1f5f9",
                    color: activeCategory === cat ? "#ffffff" : "#475569",
                  }}
                >
                  {tc(cat as any)}
                </button>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((d) => (
              <motion.div
                key={d.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 h-full border border-slate-100">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    {d.imagen_url ? (
                      <Image
                        src={d.imagen_url}
                        alt={d.nombre}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        No image
                      </div>
                    )}

                    {/* Location badge */}
                    {d.ubicacion_corta && (
                      <div className="absolute top-4 start-4 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                        <MapPin className="w-3 h-3" />
                        {d.ubicacion_corta}
                      </div>
                    )}

                    {/* Category label */}
                    {d.categoria && (
                      <div className="absolute top-4 end-4 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white">
                        {tc(d.categoria as any)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {d.nombre}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                      {d.descripcion}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">
                          {t("from")}
                        </span>
                        <p className="text-2xl font-bold text-slate-900">
                          {d.precio}<span className="text-sm font-normal text-slate-400">€</span>
                        </p>
                      </div>
                      <button
                        onClick={() => onReserve(d)}
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        style={{ backgroundColor: accentColor }}
                      >
                        {t("reserve")}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default DestinationsFiltered;
