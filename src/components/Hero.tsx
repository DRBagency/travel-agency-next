"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface HeroProps {
  title?: string | null;
  subtitle?: string | null;
  imageUrl?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  primaryColor?: string | null;
  statsYears?: string | number | null;
  statsDestinations?: string | number | null;
  statsTravelers?: string | number | null;
  statsRating?: string | number | null;
}

const Hero = ({
  title,
  subtitle,
  imageUrl,
  ctaText,
  ctaLink,
  primaryColor,
  statsYears,
  statsDestinations,
  statsTravelers,
  statsRating,
}: HeroProps) => {
  const safeImageUrl = (() => {
    if (typeof imageUrl !== "string") return null;

    const cleaned = imageUrl.trim();

    if (!cleaned) return null;

    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
      return cleaned;
    }

    if (cleaned.startsWith("/")) {
      return cleaned;
    }

    return null;
  })();

  const fallbackStyle = primaryColor
    ? {
        backgroundImage: `radial-gradient(120% 120% at 10% 10%, color-mix(in srgb, ${primaryColor} 45%, transparent) 0%, transparent 60%), linear-gradient(135deg, color-mix(in srgb, ${primaryColor} 35%, hsl(var(--background))) 0%, hsl(var(--muted)) 60%, hsl(var(--background)) 100%)`,
      }
    : undefined;

  const stats = [
    { value: statsYears, label: "Años" },
    { value: statsDestinations, label: "Destinos" },
    { value: statsTravelers, label: "Viajeros" },
    { value: statsRating, label: "Rating" },
  ].filter((stat) => stat.value !== null && stat.value !== undefined && String(stat.value).trim() !== "");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {safeImageUrl ? (
        <Image
          src={safeImageUrl}
          alt={title ?? ""}
          fill
          priority
          className="object-cover"
        />
      ) : (
        <div
          className={
            fallbackStyle
              ? "absolute inset-0"
              : "absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          }
          style={fallbackStyle}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/55 to-slate-950" />
      <div className="absolute -top-24 start-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full blur-[140px]"
        style={{ backgroundColor: primaryColor ? "color-mix(in srgb, " + primaryColor + " 40%, transparent)" : "rgba(56, 189, 248, 0.2)" }}
      />
      <div className="absolute bottom-0 end-0 h-72 w-72 rounded-full blur-[120px]"
        style={{ backgroundColor: primaryColor ? "color-mix(in srgb, " + primaryColor + " 35%, transparent)" : "rgba(14, 165, 233, 0.18)" }}
      />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl text-center md:text-start py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            {["Reserva segura", "Pago instantáneo", "Soporte 24/7"].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  borderColor: primaryColor
                    ? "color-mix(in srgb, " + primaryColor + " 55%, transparent)"
                    : "rgba(255,255,255,0.15)",
                  backgroundColor: primaryColor
                    ? "color-mix(in srgb, " + primaryColor + " 18%, transparent)"
                    : "rgba(255,255,255,0.05)",
                  color: primaryColor ? "white" : "rgba(255,255,255,0.8)",
                }}
              >
                {badge}
              </span>
            ))}
          </motion.div>

        {title && (
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            {title}
          </motion.h1>
        )}

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/75 max-w-2xl mb-10"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap items-center gap-4"
        >
          {ctaText && ctaLink && (
            <a
              href={ctaLink ?? undefined}
            className={
                primaryColor
                  ? "inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  : "inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-semibold bg-white text-slate-950 shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            }
              style={
                primaryColor
                  ? { backgroundColor: primaryColor }
                  : undefined
              }
            >
              {ctaText}
            </a>
          )}
          <a
            href="#destinos"
            className="inline-flex items-center justify-center rounded-2xl border px-8 py-4 text-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            style={{
              borderColor: primaryColor
                ? "color-mix(in srgb, " + primaryColor + " 55%, transparent)"
                : "rgba(255,255,255,0.2)",
              backgroundColor: primaryColor
                ? "color-mix(in srgb, " + primaryColor + " 12%, transparent)"
                : "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Ver destinos
          </a>
        </motion.div>

        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border p-4 text-start backdrop-blur"
                style={{
                  borderColor: primaryColor
                    ? "color-mix(in srgb, " + primaryColor + " 35%, transparent)"
                    : "rgba(255,255,255,0.1)",
                  backgroundColor: primaryColor
                    ? "color-mix(in srgb, " + primaryColor + " 10%, transparent)"
                    : "rgba(255,255,255,0.05)",
                }}
              >
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
