"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Loader2, Clock, Users, Star } from "lucide-react";
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
      <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        {t("loading")}
      </div>
    );
  }

  if (destinos.length === 0) {
    return (
      <p className="text-center py-20 text-slate-400">
        {t("empty")}
      </p>
    );
  }

  return (
    <section id="destinos" className="py-24 md:py-28 lg:py-32 relative scroll-mt-24">
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
            className="inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] mb-4"
            style={{
              borderColor: `color-mix(in srgb, ${accentColor} 30%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${accentColor} 8%, transparent)`,
              color: accentColor,
            }}
          >
            <MapPin className="w-3.5 h-3.5 me-2" style={{ color: accentColor }} />
            {t("badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-slate-900">
            {t("title")}{" "}
            <span className="gradient-text-ocean-light">{t("titleHighlight")}</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto mt-4">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinos.map((d, i) => {
            const dias = d.itinerario?.dias || d.itinerario?.days || [];
            const daysCount = dias.length;

            return (
              <motion.div
                key={d.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Image container */}
                <div className="relative h-72 overflow-hidden">
                  {d.imagen_url ? (
                    <Image
                      src={d.imagen_url}
                      alt={d.nombre}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      {t("noImage")}
                    </div>
                  )}

                  {/* Rating badge top-right */}
                  <div className="absolute top-4 end-4 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-md">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    4.9
                  </div>

                  {/* Price badge */}
                  <div
                    className="absolute bottom-4 end-4 rounded-full px-4 py-1.5 text-sm font-bold text-white shadow-lg"
                    style={{ backgroundColor: accentColor }}
                  >
                    {d.precio} €
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-slate-900">
                    {d.nombre}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {d.descripcion}
                  </p>

                  {/* Metadata row */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-5">
                    {daysCount > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {t("days", { n: daysCount })}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {t("person")}
                    </span>
                  </div>

                  {/* CTA button — full width outlined */}
                  <button
                    onClick={() => onReserve(d)}
                    className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2"
                    style={{
                      borderColor: accentColor,
                      color: accentColor,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = accentColor;
                      (e.currentTarget as HTMLElement).style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      (e.currentTarget as HTMLElement).style.color = accentColor;
                    }}
                  >
                    {t("viewDetails")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
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
