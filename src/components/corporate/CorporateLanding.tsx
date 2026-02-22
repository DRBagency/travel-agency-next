"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  CalendarCheck,
  CreditCard,
  Users,
  Zap,
  Headphones,
  Check,
  Menu,
  X,
  ChevronRight,
  Shield,
  Award,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const PLANS = [
  {
    name: "Start",
    price: 29,
    fee: "5%",
    highlighted: false,
  },
  {
    name: "Grow",
    price: 59,
    fee: "3%",
    highlighted: true,
  },
  {
    name: "Pro",
    price: 99,
    fee: "1%",
    highlighted: false,
  },
];

const FEATURES = [
  { icon: Globe, key: "web" },
  { icon: CalendarCheck, key: "bookings" },
  { icon: CreditCard, key: "payments" },
  { icon: Users, key: "clients" },
  { icon: Zap, key: "automations" },
  { icon: Headphones, key: "support" },
];

const BENEFITS = [
  { icon: Shield, key: "control" },
  { icon: Zap, key: "efficiency" },
  { icon: Award, key: "professional" },
  { icon: Clock, key: "time" },
  { icon: TrendingUp, key: "scale" },
  { icon: Users, key: "guidance" },
];

export default function CorporateLanding() {
  const t = useTranslations("corporate");
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#041820] text-white">
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#041820]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="DRB Agency" width={32} height={32} />
            <span className="font-display text-lg font-bold tracking-tight">
              DRB<span className="text-drb-turquoise-400"> Agency</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo("#features")} className="text-sm text-white/60 hover:text-white transition-colors">
              {t("nav.features")}
            </button>
            <button onClick={() => scrollTo("#pricing")} className="text-sm text-white/60 hover:text-white transition-colors">
              {t("nav.pricing")}
            </button>
            <button onClick={() => scrollTo("#how")} className="text-sm text-white/60 hover:text-white transition-colors">
              {t("nav.howItWorks")}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin/login"
              className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2"
            >
              {t("nav.login")}
            </Link>
            <Link
              href="/admin/register"
              className="bg-drb-turquoise-500 hover:bg-drb-turquoise-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              {t("nav.register")}
            </Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#041820] border-b border-white/[0.06] overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                <button onClick={() => scrollTo("#features")} className="text-sm text-white/60 hover:text-white py-2 text-start">
                  {t("nav.features")}
                </button>
                <button onClick={() => scrollTo("#pricing")} className="text-sm text-white/60 hover:text-white py-2 text-start">
                  {t("nav.pricing")}
                </button>
                <button onClick={() => scrollTo("#how")} className="text-sm text-white/60 hover:text-white py-2 text-start">
                  {t("nav.howItWorks")}
                </button>
                <Link href="/admin/login" className="text-sm text-white/60 py-2">
                  {t("nav.login")}
                </Link>
                <Link
                  href="/admin/register"
                  className="bg-drb-turquoise-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold text-center mt-2"
                >
                  {t("nav.register")}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-drb-turquoise-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 end-1/4 w-80 h-80 bg-drb-lime-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <motion.p
              className="text-sm text-drb-turquoise-400 font-semibold uppercase tracking-wider mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {t("hero.tagline")}
            </motion.p>
            <motion.h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {t("hero.headline")}
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl mb-10 text-white/60 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t("hero.subheadline")}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/admin/register"
                className="bg-gradient-to-r from-drb-turquoise-500 to-drb-turquoise-600 text-white px-8 py-3.5 rounded-xl text-base font-bold hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-drb-turquoise-500/20"
              >
                {t("hero.cta")}
              </Link>
              <button
                onClick={() => scrollTo("#pricing")}
                className="border border-white/20 px-8 py-3.5 rounded-xl text-base font-medium text-white/80 hover:border-white/40 hover:bg-white/5 transition-all"
              >
                {t("hero.ctaSecondary")}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-20 md:py-32 bg-[#051e28]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-sm font-semibold text-drb-turquoise-400 mb-3 tracking-wide uppercase">
              {t("features.tagline")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              {t("features.headline")}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-6 border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-drb-turquoise-500/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {t(`features.items.${key}.title`)}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {t(`features.items.${key}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="py-20 md:py-32 bg-[#041820]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-sm font-semibold text-drb-turquoise-400 mb-3 tracking-wide uppercase">
              {t("benefits.tagline")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              {t("benefits.headline")}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map(({ icon: Icon, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-6 border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-drb-turquoise-500/15 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-drb-turquoise-400" />
                </div>
                <h3 className="font-display text-base font-semibold mb-2">
                  {t(`benefits.items.${key}.title`)}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {t(`benefits.items.${key}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="py-20 md:py-32 bg-[#051e28]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-sm font-semibold text-drb-turquoise-400 mb-3 tracking-wide uppercase">
              {t("how.tagline")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              {t("how.headline")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 text-white font-display text-xl font-bold mb-6">
                  {`0${i + 1}`}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {t(`how.steps.${i}.title`)}
                </h3>
                <p className="text-white/50 leading-relaxed max-w-sm mx-auto">
                  {t(`how.steps.${i}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-20 md:py-32 bg-[#041820]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-sm font-semibold text-drb-turquoise-400 mb-3 tracking-wide uppercase">
              {t("pricing.tagline")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {t("pricing.headline")}
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              {t("pricing.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`relative rounded-2xl p-7 border transition-all hover:scale-105 ${
                  plan.highlighted
                    ? "border-drb-turquoise-500 bg-drb-turquoise-500/5 shadow-lg shadow-drb-turquoise-500/10 scale-[1.02]"
                    : "border-white/[0.08] bg-white/[0.03]"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 start-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-drb-lime-500 to-drb-turquoise-500 text-[#041820] text-xs font-bold px-4 py-1.5 rounded-full">
                      {t("pricing.popular")}
                    </span>
                  </div>
                )}
                <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-white/50 mb-4">{t(`pricing.plans.${i}.desc`)}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-display text-4xl font-bold">{plan.price}€</span>
                  <span className="text-white/50 text-sm">{t("pricing.perMonth")}</span>
                </div>
                <div className="text-sm text-drb-turquoise-400 font-medium mb-6">
                  + {plan.fee} {t("pricing.feeLabel")}
                </div>

                <ul className="space-y-3 mb-7">
                  {[0, 1, 2, 3, 4].map((j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-white/80">
                      <Check className="w-4 h-4 text-drb-turquoise-400 shrink-0 mt-0.5" />
                      {t(`pricing.plans.${i}.features.${j}`)}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/admin/register"
                  className={`block w-full py-3 rounded-xl text-sm font-semibold text-center transition-all ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-drb-lime-500 to-drb-turquoise-500 text-[#041820] hover:opacity-90"
                      : "bg-drb-turquoise-500 text-white hover:bg-drb-turquoise-600"
                  }`}
                >
                  {t("pricing.cta")}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 start-1/3 w-64 h-64 bg-drb-turquoise-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 end-1/3 w-48 h-48 bg-drb-lime-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              {t("cta.headline")}
            </h2>
            <p className="text-lg md:text-xl mb-10 text-white/60 max-w-2xl mx-auto">
              {t("cta.subheadline")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/admin/register"
                className="bg-gradient-to-r from-drb-turquoise-500 to-drb-turquoise-600 text-white px-8 py-3.5 rounded-xl text-base font-bold hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-drb-turquoise-500/20 flex items-center gap-2"
              >
                {t("cta.register")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/[0.06] py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="DRB Agency" width={28} height={28} />
            <span className="font-display text-sm font-bold">
              DRB<span className="text-drb-turquoise-400"> Agency</span>
            </span>
          </div>
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} DRB Agency. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:contact@drb.agency" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              contact@drb.agency
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
