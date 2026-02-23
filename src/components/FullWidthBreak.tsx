"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";

interface FullWidthBreakProps {
  imageUrl?: string | null;
  destinations?: { nombre: string }[];
  primaryColor?: string | null;
}

const FullWidthBreak = ({
  imageUrl,
  destinations = [],
  primaryColor,
}: FullWidthBreakProps) => {
  const t = useTranslations("landing.break");
  const accentColor = primaryColor || "#1CABB0";
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const safeImageUrl = (() => {
    if (typeof imageUrl !== "string") return null;
    const cleaned = imageUrl.trim();
    if (!cleaned) return null;
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
    if (cleaned.startsWith("/")) return cleaned;
    return null;
  })();

  if (!safeImageUrl) return null;

  // Take up to 5 destination names for badges
  const badges = destinations.slice(0, 5);

  // Scattered positions for badges
  const positions = [
    { top: "20%", start: "10%" },
    { top: "35%", start: "65%" },
    { top: "60%", start: "20%" },
    { top: "45%", start: "80%" },
    { top: "75%", start: "55%" },
  ];

  return (
    <div ref={sectionRef} className="relative h-[400px] md:h-[500px] overflow-hidden">
      {/* Parallax image */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY }}
      >
        <Image
          src={safeImageUrl}
          alt=""
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Scattered destination name badges */}
      <div className="absolute inset-0 z-10 hidden md:block">
        {badges.map((dest, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            viewport={{ once: true }}
            className="absolute"
            style={{
              top: positions[i]?.top,
              insetInlineStart: positions[i]?.start,
            }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-medium text-white shadow-lg">
              {t("discover")} {dest.nombre}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FullWidthBreak;
