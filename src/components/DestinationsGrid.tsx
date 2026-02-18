"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

const DestinationsGrid = ({
  clienteId,
  onReserve,
  primaryColor,
}: DestinationsGridProps) => {
  const [destinos, setDestinos] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

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
    return <p className="text-center py-20 text-white/70">Cargando destinos…</p>;
  }

  if (destinos.length === 0) {
    return (
      <p className="text-center py-20 text-white/60">
        Este cliente no tiene destinos activos
      </p>
    );
  }

  return (
    <section id="destinos" className="py-24 md:py-28 lg:py-32 relative scroll-mt-24">
      <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-sky-500/15 blur-[120px]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Destinos destacados
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
            Encuentra tu próxima <span className="gradient-text-ocean">aventura</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mt-4">
            Selección curada de destinos con experiencias premium, pagos seguros
            y atención personalizada.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinos.map((d) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-xl shadow-[0_20px_40px_rgba(2,6,23,0.45)] transition hover:-translate-y-1 hover:border-white/25"
          >
            <div className="relative h-60">
              {d.imagen_url ? (
                <Image
                  src={d.imagen_url}
                  alt={d.nombre}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-slate-900 text-white/70">
                  Sin imagen
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div
                className="absolute top-4 end-4 rounded-full px-4 py-1.5 text-sm font-semibold text-white backdrop-blur border"
                style={
                  primaryColor
                    ? {
                        backgroundColor: primaryColor,
                        borderColor: "color-mix(in srgb, " + primaryColor + " 70%, transparent)",
                      }
                    : {
                        backgroundColor: "rgba(255,255,255,0.12)",
                        borderColor: "rgba(255,255,255,0.2)",
                      }
                }
              >
                {d.precio} €
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-[0_8px_18px_rgba(2,6,23,0.6)]">
                {d.nombre}
              </h3>
              <p className="text-sm text-white/70 mb-6">
                {d.descripcion}
              </p>

              <div className="flex items-center justify-between">
                <div className="text-sm text-white/60">
                  Desde
                  <div className="text-xl font-bold text-white">
                    {d.precio} €
                  </div>
                </div>
                <button
                  onClick={() => onReserve(d)}
                  className={
                    primaryColor
                      ? "px-5 py-3 rounded-2xl flex items-center gap-2 text-sm font-semibold text-white transition hover:brightness-110 shadow-[0_14px_30px_rgba(2,6,23,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      : "btn-gradient px-5 py-3 rounded-2xl flex items-center gap-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  }
                  style={
                    primaryColor
                      ? { backgroundColor: primaryColor }
                      : undefined
                  }
                >
                  Reservar
                  <ArrowRight className="w-4 h-4" />
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
