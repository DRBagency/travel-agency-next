"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import FloatingShapes from "@/components/landing/FloatingShapes";

interface StatsBarProps {
  statsYears?: string | number | null;
  statsDestinations?: string | number | null;
  statsTravelers?: string | number | null;
  statsRating?: string | number | null;
  primaryColor?: string | null;
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

const StatsBar = ({
  statsYears,
  statsDestinations,
  statsTravelers,
  statsRating,
  primaryColor,
}: StatsBarProps) => {
  const t = useTranslations("landing.hero");
  const accentColor = primaryColor || "#1CABB0";

  const stats = [
    { value: statsYears, label: t("statsYears"), suffix: "+" },
    { value: statsDestinations, label: t("statsDestinations"), suffix: "+" },
    { value: statsTravelers, label: t("statsTravelers"), suffix: "+" },
    { value: statsRating, label: t("statsRating"), suffix: "" },
  ].filter((s) => s.value !== null && s.value !== undefined && String(s.value).trim() !== "");

  if (stats.length === 0) return null;

  return (
    <div className="relative z-20 -mt-16 mx-4 md:mx-auto max-w-5xl">
      <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40">
        {/* Floating decorative shapes */}
        <FloatingShapes count={4} primaryColor={accentColor} />

        <div className={`relative z-10 grid grid-cols-2 ${stats.length >= 4 ? "sm:grid-cols-4" : stats.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"} divide-y sm:divide-y-0 sm:divide-x divide-slate-100/50`}>
          {stats.map((stat) => (
            <div key={stat.label} className="px-6 py-8 text-center">
              <div className="text-3xl md:text-4xl font-bold" style={{ color: accentColor }}>
                <AnimatedCounter value={stat.value!} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-slate-500 mt-1 uppercase tracking-wide font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
