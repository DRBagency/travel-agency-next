"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useTranslations } from "next-intl";

interface SliderDestination {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url: string | null;
}

interface ImageSliderProps {
  clienteId: string;
  primaryColor?: string | null;
}

const ImageSlider = ({ clienteId, primaryColor }: ImageSliderProps) => {
  const t = useTranslations("landing.slider");
  const accentColor = primaryColor || "#1CABB0";
  const sliderRef = useRef<HTMLDivElement>(null);
  const [destinations, setDestinations] = useState<SliderDestination[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("destinos")
        .select("id, nombre, descripcion, imagen_url")
        .eq("cliente_id", clienteId)
        .eq("activo", true);
      if (data) setDestinations(data);
    };
    load();
  }, [clienteId]);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const amount = direction === "left" ? -380 : 380;
    sliderRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Only show with images
  const withImages = destinations.filter((d) => d.imagen_url);
  if (withImages.length === 0) return null;

  return (
    <section className="bg-slate-900 text-white py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">
              {t("title")}
            </h2>
            <p className="text-white/60 text-lg">
              {t("subtitle")}
            </p>
          </div>

          {/* Arrow navigation */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 hover:border-white/50"
              style={{
                ["--hover-bg" as string]: accentColor,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = accentColor;
                (e.currentTarget as HTMLElement).style.borderColor = accentColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 hover:border-white/50"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = accentColor;
                (e.currentTarget as HTMLElement).style.borderColor = accentColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto no-scrollbar slider-snap ps-4 md:ps-[max(1rem,calc((100vw-1280px)/2+1rem))] pe-4"
      >
        {withImages.map((d) => (
          <div
            key={d.id}
            className="slide-snap flex-shrink-0 w-[300px] md:w-[400px] h-[500px] rounded-2xl overflow-hidden relative group cursor-pointer"
          >
            {/* Image */}
            <Image
              src={d.imagen_url!}
              alt={d.nombre}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Text content — visible on hover */}
            <div className="absolute bottom-0 start-0 end-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-xl font-bold text-white mb-1">{d.nombre}</h3>
              <p className="text-white/70 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {d.descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageSlider;
