"use client";

import { motion } from "framer-motion";
import { Shield, Globe, Heart, Award, Users, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface AboutProps {
  primaryColor?: string | null;
  title?: string | null;
  text1?: string | null;
  text2?: string | null;
  statsYears?: string | number | null;
  statsDestinations?: string | number | null;
  statsTravelers?: string | number | null;
  statsRating?: string | number | null;
}

function AnimatedStat({ value, label }: { value: string | number; label: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const num = parseFloat(String(value).replace(/[^\d.]/g, ""));
    if (isNaN(num)) { setDisplay(String(value)); return; }
    const isDecimal = String(value).includes(".");
    const raw = String(value);
    const textSuffix = raw.replace(/[\d.,]/g, "").trim();
    const duration = 1600;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;
      setDisplay(isDecimal ? current.toFixed(1) + textSuffix : Math.round(current).toLocaleString() + textSuffix);
      if (progress < 1) requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { requestAnimationFrame(animate); observer.disconnect(); }
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white tabular-nums">{display}</div>
      <div className="text-sm text-white/55 mt-1">{label}</div>
    </div>
  );
}

const featureIcons = [
  { icon: Shield, key: "featureSafe", color: "#10B981" },
  { icon: Globe, key: "featureExclusive", color: "#1CABB0" },
  { icon: Heart, key: "featurePersonal", color: "#E91E63" },
  { icon: Award, key: "featureQuality", color: "#F59E0B" },
  { icon: Users, key: "featureExpert", color: "#8B5CF6" },
  { icon: Zap, key: "featureFast", color: "#D4F24D" },
];

const About = ({
  primaryColor,
  title,
  text1,
  text2,
  statsYears,
  statsDestinations,
  statsTravelers,
  statsRating,
}: AboutProps) => {
  const t = useTranslations("landing.about");
  const accentColor = primaryColor || "#1CABB0";

  const stats = [
    { value: statsYears, label: t("statsYears") },
    { value: statsDestinations, label: t("statsDestinations") },
    { value: statsTravelers, label: t("statsTravelers") },
    { value: statsRating, label: t("statsRating") },
  ].filter((s) => s.value !== null && s.value !== undefined && String(s.value).trim() !== "");

  return (
    <section id="nosotros" className="py-24 md:py-28 lg:py-32 relative overflow-hidden scroll-mt-24">
      {/* Background */}
      <div className="absolute top-1/2 end-0 w-[28rem] h-[28rem] rounded-full blur-[140px] -translate-y-1/2 animate-float-slower" style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 15%, transparent)` }} />
      <div className="absolute bottom-0 start-0 w-72 h-72 bg-drb-lime-500/8 rounded-full blur-[100px] animate-float-slow" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full glass-card text-sm text-white/70 mb-4"
            style={{
              borderColor: `color-mix(in srgb, ${accentColor} 35%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
            }}
          >
            {t("badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {title || (
              <>
                {t("defaultTitle")}{" "}
                <span className="gradient-text-ocean">{t("defaultTitleHighlight")}</span>
              </>
            )}
          </h2>
        </motion.div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {text1 && (
              <p className="text-lg text-white/75 leading-relaxed">{text1}</p>
            )}
            {text2 && (
              <p className="text-white/60 leading-relaxed">{text2}</p>
            )}

            {/* Stats */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 gap-6 pt-6">
                {stats.map((s) => (
                  <AnimatedStat key={s.label} value={s.value!} label={s.label} />
                ))}
              </div>
            )}
          </motion.div>

          {/* Feature icons grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {featureIcons.map((f, i) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-5 border border-white/10 text-center group cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${f.color} 18%, transparent)`,
                  }}
                >
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <span className="text-sm font-medium text-white/75">{t(f.key)}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
