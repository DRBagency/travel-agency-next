"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface HeroProps {
  title?: string | null;
  subtitle?: string | null;
  imageUrl?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  primaryColor?: string | null;
}

const Hero = ({
  title,
  subtitle,
  imageUrl,
  ctaText,
  ctaLink,
  primaryColor,
}: HeroProps) => {
  const t = useTranslations("landing.hero");
  const accentColor = primaryColor || "#1CABB0";

  const safeImageUrl = (() => {
    if (typeof imageUrl !== "string") return null;
    const cleaned = imageUrl.trim();
    if (!cleaned) return null;
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
    if (cleaned.startsWith("/")) return cleaned;
    return null;
  })();

  const fallbackStyle = primaryColor
    ? {
        backgroundImage: `radial-gradient(120% 120% at 10% 10%, color-mix(in srgb, ${primaryColor} 45%, transparent) 0%, transparent 60%), linear-gradient(135deg, color-mix(in srgb, ${primaryColor} 35%, #f8fafc) 0%, #f1f5f9 60%, #f8fafc 100%)`,
      }
    : undefined;

  // Split title to highlight last word with primaryColor
  const titleWords = (title || "").split(" ");
  const lastWord = titleWords.length > 1 ? titleWords.pop() : null;
  const mainTitle = titleWords.join(" ");

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with subtle zoom or fallback */}
      {safeImageUrl ? (
        <div className="absolute inset-0 hero-zoom">
          <Image
            src={safeImageUrl}
            alt={title ?? ""}
            fill
            priority
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className={fallbackStyle ? "absolute inset-0" : "absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50"}
          style={fallbackStyle}
        />
      )}

      {/* Gradient overlay — fades into slate-50 page bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-slate-50" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl text-center mx-auto">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md px-5 py-2 text-sm font-semibold text-white tracking-wide mb-8"
          >
            {t("badge")}
          </motion.span>

          {/* Title */}
          {title && (
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] text-white"
            >
              {mainTitle}{" "}
              {lastWord && (
                <span className="italic" style={{ color: accentColor }}>
                  {lastWord}
                </span>
              )}
            </motion.h1>
          )}

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {ctaText && ctaLink && (
              <a
                href={ctaLink ?? undefined}
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                {ctaText}
                <ArrowRight className="w-5 h-5 ms-2" />
              </a>
            )}
            <a
              href="#destinos"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              {t("ctaSecondary")}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 start-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/60 uppercase tracking-widest">{t("scrollDown")}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
