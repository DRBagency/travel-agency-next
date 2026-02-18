"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

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

/* ─── Animated counter ─── */
function AnimatedCounter({ value, suffix = "" }: { value: string | number; suffix?: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const num = parseFloat(String(value).replace(/[^\d.]/g, ""));
    if (isNaN(num)) {
      setDisplay(String(value));
      return;
    }

    const isDecimal = String(value).includes(".");
    const raw = String(value);
    const textSuffix = raw.replace(/[\d.,]/g, "").trim();
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (num - start) * eased;

      if (isDecimal) {
        setDisplay(current.toFixed(1) + textSuffix);
      } else {
        setDisplay(Math.round(current).toLocaleString() + textSuffix);
      }

      if (progress < 1) requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-white tabular-nums">
      {display}{suffix}
    </div>
  );
}

/* ─── Floating Orb ─── */
function FloatingOrb({
  color,
  size,
  position,
  delay,
}: {
  color: string;
  size: string;
  position: string;
  delay: string;
}) {
  return (
    <div
      className={`absolute ${size} ${position} rounded-full blur-[100px] opacity-60 animate-float`}
      style={{ backgroundColor: color, animationDelay: delay }}
    />
  );
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
  const t = useTranslations("landing.hero");
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
        backgroundImage: `radial-gradient(120% 120% at 10% 10%, color-mix(in srgb, ${primaryColor} 45%, transparent) 0%, transparent 60%), linear-gradient(135deg, color-mix(in srgb, ${primaryColor} 35%, hsl(var(--background))) 0%, hsl(var(--muted)) 60%, hsl(var(--background)) 100%)`,
      }
    : undefined;

  const stats = [
    { value: statsYears, label: t("statsYears"), suffix: "+" },
    { value: statsDestinations, label: t("statsDestinations"), suffix: "+" },
    { value: statsTravelers, label: t("statsTravelers"), suffix: "+" },
    { value: statsRating, label: t("statsRating"), suffix: "" },
  ].filter((stat) => stat.value !== null && stat.value !== undefined && String(stat.value).trim() !== "");

  const badges = [t("badgeSafe"), t("badgeInstant"), t("badgeSupport")];
  const accentColor = primaryColor || "#1CABB0";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image or fallback gradient */}
      {safeImageUrl ? (
        <Image src={safeImageUrl} alt={title ?? ""} fill priority className="object-cover" />
      ) : (
        <div
          className={fallbackStyle ? "absolute inset-0" : "absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"}
          style={fallbackStyle}
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/55 to-slate-950" />

      {/* Animated floating orbs */}
      <FloatingOrb
        color={`color-mix(in srgb, ${accentColor} 50%, transparent)`}
        size="w-[32rem] h-[32rem]"
        position="-top-32 start-1/4"
        delay="0s"
      />
      <FloatingOrb
        color={`color-mix(in srgb, ${accentColor} 30%, transparent)`}
        size="w-80 h-80"
        position="bottom-20 end-10"
        delay="2s"
      />
      <FloatingOrb
        color="rgba(212, 242, 77, 0.15)"
        size="w-64 h-64"
        position="top-1/3 end-1/4"
        delay="4s"
      />
      <div
        className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] rounded-full opacity-20 animate-spin-slow"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${accentColor}, transparent, rgba(212,242,77,0.3), transparent)`,
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl text-center md:text-start py-8 md:py-12">
          {/* Badges with staggered entrance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-8"
          >
            {badges.map((badge, i) => (
              <motion.span
                key={badge}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.12 }}
                className="inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-sm"
                style={{
                  borderColor: `color-mix(in srgb, ${accentColor} 55%, transparent)`,
                  backgroundColor: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full me-2"
                  style={{ backgroundColor: accentColor }}
                />
                {badge}
              </motion.span>
            ))}
          </motion.div>

          {/* Title with shimmer gradient */}
          {title && (
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] text-glow"
            >
              {title}
            </motion.h1>
          )}

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/70 max-w-2xl mb-10 leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA Buttons with glow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            {ctaText && ctaLink && (
              <a
                href={ctaLink ?? undefined}
                className="hero-glow-btn inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 animate-pulse-glow"
                style={{ backgroundColor: accentColor }}
              >
                {ctaText}
              </a>
            )}
            <a
              href="#destinos"
              className="group inline-flex items-center justify-center rounded-2xl border px-8 py-4 text-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              style={{
                borderColor: `color-mix(in srgb, ${accentColor} 45%, transparent)`,
                backgroundColor: `color-mix(in srgb, ${accentColor} 8%, transparent)`,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {t("viewDestinations")}
              <ChevronDown className="w-5 h-5 ms-2 transition-transform group-hover:translate-y-0.5" />
            </a>
          </motion.div>

          {/* Stats with animated counters */}
          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
                  className="group relative rounded-2xl border p-5 text-start backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    borderColor: `color-mix(in srgb, ${accentColor} 30%, transparent)`,
                    backgroundColor: `color-mix(in srgb, ${accentColor} 8%, transparent)`,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, color-mix(in srgb, ${accentColor} 15%, transparent), transparent 70%)`,
                    }}
                  />
                  <div className="relative">
                    <AnimatedCounter value={stat.value!} suffix={stat.suffix} />
                    <div className="text-sm text-white/55 mt-1 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 start-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-8 h-12 rounded-full border border-white/20 flex items-start justify-center pt-2"
        >
          <div
            className="w-1.5 h-3 rounded-full"
            style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 70%, white)` }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
