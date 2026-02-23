"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/landing/ScrollReveal";

interface BentoDestination {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string | null;
  ubicacion_corta?: string | null;
}

interface DestinationsBentoProps {
  destinations: BentoDestination[];
  primaryColor?: string | null;
  onReserve: (destination: any) => void;
}

const DestinationsBento = ({
  destinations,
  primaryColor,
  onReserve,
}: DestinationsBentoProps) => {
  const t = useTranslations("landing.bento");
  const td = useTranslations("landing.destinations");
  const accentColor = primaryColor || "#1CABB0";

  if (destinations.length === 0) return null;

  // Take up to 4 featured destinations
  const items = destinations.slice(0, 4);

  return (
    <section className="py-24 md:py-28 lg:py-32 scroll-mt-24">
      <div className="container mx-auto px-4">
        {/* Split header */}
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-12">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 max-w-xl">
              {t("title")}
            </h2>
            <div className="max-w-md">
              <p className="text-slate-500 text-lg mb-4">
                {t("description")}
              </p>
              <a
                href="#destinos"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-300"
                style={{ color: accentColor }}
              >
                {t("cta")}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Bento grid */}
        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[400px] md:h-[550px] lg:h-[600px]">
            {/* Cell 1: Large left (col-span-2 row-span-2) */}
            {items[0] && (
              <BentoCell
                destination={items[0]}
                className="col-span-2 row-span-2"
                accentColor={accentColor}
                onReserve={onReserve}
                labelFrom={td("from")}
              />
            )}

            {/* Cell 2: Top right (col-span-2 row-span-1) */}
            {items[1] && (
              <BentoCell
                destination={items[1]}
                className="col-span-2 row-span-1 hidden md:block"
                accentColor={accentColor}
                onReserve={onReserve}
                labelFrom={td("from")}
              />
            )}

            {/* Cell 3: Bottom right left (col-span-1 row-span-1) */}
            {items[2] && (
              <BentoCell
                destination={items[2]}
                className="col-span-1 row-span-1 hidden md:block"
                accentColor={accentColor}
                onReserve={onReserve}
                labelFrom={td("from")}
              />
            )}

            {/* Cell 4: Bottom right right (col-span-1 row-span-1) */}
            {items[3] && (
              <BentoCell
                destination={items[3]}
                className="col-span-1 row-span-1 hidden md:block"
                accentColor={accentColor}
                onReserve={onReserve}
                labelFrom={td("from")}
              />
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

function BentoCell({
  destination,
  className,
  accentColor,
  onReserve,
  labelFrom,
}: {
  destination: BentoDestination;
  className: string;
  accentColor: string;
  onReserve: (d: any) => void;
  labelFrom: string;
}) {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden cursor-pointer group ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={() => onReserve(destination)}
    >
      {destination.imagen_url ? (
        <Image
          src={destination.imagen_url}
          alt={destination.nombre}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-200" />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content at bottom */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
        {destination.ubicacion_corta && (
          <span className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">
            {destination.ubicacion_corta}
          </span>
        )}
        <h3 className="text-white font-bold text-lg md:text-xl mb-1">
          {destination.nombre}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm">
            {labelFrom} <span className="font-bold text-white">{destination.precio}€</span>
          </span>
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: accentColor }}
          >
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default DestinationsBento;
