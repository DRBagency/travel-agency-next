"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useTranslations } from "next-intl";

export interface Destination {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string | null;
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
          {destinos.map((d, i) => (
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
                <p className="text-sm text-white/65 mb-6 line-clamp-2">
                  {d.descripcion}
                </p>

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
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsGrid;
