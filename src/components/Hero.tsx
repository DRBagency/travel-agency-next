"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

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

function AnimatedCounter({ value, suffix = "" }: { value: string | number; suffix?: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const num = parseFloat(String(value).replace(/[^\d.]/g, ""));
    if (isNaN(num)) {
      setDisplay(String(value));
      return;
    }

    const isDecimal = String(value).includes(".");
    const raw = String(value);
    const textSuffix = raw.replace(/[\d.,]/g, "").trim();
    const duration = 1800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;

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
    <span ref={ref} className="tabular-nums">
      {display}{suffix}
    </span>
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
  const accentColor = primaryColor || "#1CABB0";
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

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

  // Split title to highlight last word
  const titleWords = (title || "").split(" ");
  const lastWord = titleWords.length > 1 ? titleWords.pop() : null;
  const mainTitle = titleWords.join(" ");

  // Stats for bottom bar
  const stats = [
    { value: statsYears, label: t("statsYears"), suffix: "+" },
    { value: statsDestinations, label: t("statsDestinations"), suffix: "+" },
    { value: statsTravelers, label: t("statsTravelers"), suffix: "+" },
    { value: statsRating, label: t("statsRating"), suffix: "" },
  ].filter((s) => s.value !== null && s.value !== undefined && String(s.value).trim() !== "");

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-end overflow-hidden"
    >
      {/* Parallax background image */}
      {safeImageUrl ? (
        <motion.div
          className="absolute inset-0"
          style={{ y: imageY, scale: imageScale }}
        >
          <Image
            src={safeImageUrl}
            alt={title ?? ""}
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      ) : (
        <div
          className={fallbackStyle ? "absolute inset-0" : "absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50"}
          style={fallbackStyle}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      {/* Content — left-aligned, pushed to bottom */}
      <motion.div
        className="relative z-10 container mx-auto px-4 pb-32 md:pb-36"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="max-w-3xl text-start">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md px-5 py-2 text-sm font-semibold text-white tracking-wide mb-6"
          >
            {t("badge")}
          </motion.span>

          {/* Title */}
          {title && (
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] text-white"
            >
              {mainTitle}{" "}
              {lastWord && (
                <span
                  className="italic"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, color-mix(in srgb, ${accentColor} 60%, #a855f7))`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
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
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg md:text-xl text-white/85 max-w-2xl mb-8 leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            {ctaText && ctaLink && (
              <a
                href={ctaLink ?? undefined}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 shadow-lg"
              >
                {ctaText}
                <ArrowRight className="w-5 h-5 ms-2" />
              </a>
            )}
            <a
              href="#destinos"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              {t("ctaSecondary")}
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats bar at very bottom */}
      {stats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-0 start-0 end-0 z-10 bg-white/10 backdrop-blur-md border-t border-white/15"
        >
          <div className="container mx-auto px-4">
            <div className={`grid ${stats.length >= 4 ? "grid-cols-2 sm:grid-cols-4" : stats.length === 3 ? "grid-cols-3" : "grid-cols-2"} divide-x divide-white/15`}>
              {stats.map((stat) => (
                <div key={stat.label} className="px-4 py-5 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    <AnimatedCounter value={stat.value!} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-white/60 mt-1 uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-24 end-8 z-10 flex flex-col items-center gap-2 hidden md:flex"
      >
        <span className="text-xs text-white/50 uppercase tracking-widest [writing-mode:vertical-lr]">{t("scrollDown")}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
