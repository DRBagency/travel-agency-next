"use client";

import { motion } from "framer-motion";
import { Shield, Globe, Heart, Award, Users, Zap } from "lucide-react";
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

const featureIcons = [
  { icon: Shield, key: "featureSafe", color: "#10B981", bg: "#ECFDF5" },
  { icon: Globe, key: "featureExclusive", color: "#1CABB0", bg: "#E6F9FA" },
  { icon: Heart, key: "featurePersonal", color: "#E91E63", bg: "#FCE4EC" },
  { icon: Award, key: "featureQuality", color: "#F59E0B", bg: "#FFFBEB" },
  { icon: Users, key: "featureExpert", color: "#8B5CF6", bg: "#F5F3FF" },
  { icon: Zap, key: "featureFast", color: "#84CC16", bg: "#F7FEE7" },
];

const About = ({
  primaryColor,
  title,
  text1,
  text2,
}: AboutProps) => {
  const t = useTranslations("landing.about");

  return (
    <section id="nosotros" className="py-24 md:py-28 lg:py-32 relative overflow-hidden scroll-mt-24 bg-slate-50">
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
            className="inline-block px-4 py-1.5 rounded-full text-sm mb-4 font-semibold"
            style={{
              backgroundColor: `color-mix(in srgb, ${primaryColor || "#1CABB0"} 8%, transparent)`,
              color: primaryColor || "#1CABB0",
              border: `1px solid color-mix(in srgb, ${primaryColor || "#1CABB0"} 30%, transparent)`,
            }}
          >
            {t("badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            {title || (
              <>
                {t("defaultTitle")}{" "}
                <span className="gradient-text-ocean-light">{t("defaultTitleHighlight")}</span>
              </>
            )}
          </h2>
        </motion.div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {text1 && (
              <p className="text-lg text-slate-600 leading-relaxed">{text1}</p>
            )}
            {text2 && (
              <p className="text-slate-500 leading-relaxed">{text2}</p>
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
                className="bg-white rounded-2xl p-5 border border-slate-100 text-center group cursor-default shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: f.bg }}
                >
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <span className="text-sm font-medium text-slate-700">{t(f.key)}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
