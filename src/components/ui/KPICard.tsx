"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import { localizeDigits } from "@/lib/format-arabic";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: number;
  trendLabel?: string;
  variant?: "default" | "gradient";
  iconColor?: string;
  iconBg?: string;
  accentColor?: string;
  numericValue?: number;
  locale?: string;
  valueSuffix?: string;
}

const accentMap: Record<string, { border: string; glow: string; iconGradient: string; valueColor: string }> = {
  emerald: {
    border: "border-s-emerald-500",
    glow: "card-glow-emerald",
    iconGradient: "from-emerald-500 to-emerald-600",
    valueColor: "text-emerald-600 dark:text-emerald-400",
  },
  turquoise: {
    border: "border-s-drb-turquoise-500",
    glow: "card-glow-turquoise",
    iconGradient: "from-drb-turquoise-500 to-drb-turquoise-600",
    valueColor: "text-drb-turquoise-600 dark:text-drb-turquoise-300",
  },
  purple: {
    border: "border-s-purple-500",
    glow: "card-glow-purple",
    iconGradient: "from-purple-500 to-purple-600",
    valueColor: "text-purple-600 dark:text-purple-400",
  },
  amber: {
    border: "border-s-amber-500",
    glow: "card-glow-amber",
    iconGradient: "from-amber-500 to-amber-600",
    valueColor: "text-amber-600 dark:text-amber-400",
  },
  blue: {
    border: "border-s-blue-500",
    glow: "card-glow-blue",
    iconGradient: "from-blue-500 to-blue-600",
    valueColor: "text-blue-600 dark:text-blue-400",
  },
  red: {
    border: "border-s-red-500",
    glow: "card-glow-red",
    iconGradient: "from-red-500 to-red-600",
    valueColor: "text-red-600 dark:text-red-400",
  },
  lime: {
    border: "border-s-drb-lime-600",
    glow: "card-glow-lime",
    iconGradient: "from-drb-lime-500 to-drb-lime-700",
    valueColor: "text-drb-lime-700 dark:text-drb-lime-400",
  },
  pink: {
    border: "border-s-pink-500",
    glow: "card-glow-pink",
    iconGradient: "from-pink-500 to-pink-600",
    valueColor: "text-pink-600 dark:text-pink-400",
  },
};

export default function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel = "vs mes anterior",
  variant = "default",
  iconColor = "text-drb-turquoise-600 dark:text-drb-turquoise-400",
  iconBg = "bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15",
  accentColor,
  numericValue,
  locale = "es",
  valueSuffix = "",
}: KPICardProps) {
  const accent = accentColor ? accentMap[accentColor] : null;

  if (variant === "gradient") {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.02, transition: { duration: 0.2 } }}
        className="kpi-card-gradient">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-white/70 mb-1">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {trend >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-red-300" />
                )}
                <span className={`text-xs font-semibold ${trend >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                  {trend > 0 ? "+" : ""}{localizeDigits(trend, locale)}%
                </span>
                <span className="text-xs text-white/50 ms-1">{trendLabel}</span>
              </div>
            )}
            {subtitle && !trend && (
              <p className="text-xs text-white/50 mt-2">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <div className="text-white [&>svg]:w-6 [&>svg]:h-6">{icon}</div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Premium variant with accentColor
  if (accent) {
    return (
      <motion.div
        whileHover={{ y: -1, transition: { duration: 0.2 } }}
        className={`kpi-card !p-4 border-s-4 ${accent.border} ${accent.glow}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-white/60 mb-0.5">{title}</p>
            <p className={`text-2xl font-bold ${accent.valueColor}`}>
              {numericValue !== undefined ? (
                <AnimatedCounter
                  value={numericValue}
                  locale={locale}
                  suffix={valueSuffix ? ` ${valueSuffix}` : ""}
                />
              ) : (
                value
              )}
            </p>
            {trend !== undefined ? (
              <div className="flex items-center gap-1 mt-1">
                {trend > 0 ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : trend < 0 ? (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                ) : (
                  <Minus className="w-3 h-3 text-gray-400" />
                )}
                <span className={`text-[11px] font-semibold ${trend > 0 ? "text-emerald-600 dark:text-emerald-400" : trend < 0 ? "text-red-600 dark:text-red-400" : "text-gray-400"}`}>
                  {trend > 0 ? "+" : ""}{localizeDigits(trend, locale)}%
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 dark:text-white/40 mt-1">
                {subtitle || "\u2014"}
              </p>
            )}
          </div>
          {icon && (
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${accent.iconGradient} flex items-center justify-center shrink-0 shadow-md`}>
              <div className="text-white [&>svg]:w-4.5 [&>svg]:h-4.5">{icon}</div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Legacy default variant (backward compat)
  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="kpi-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-white/60 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              )}
              <span className={`text-xs font-semibold ${trend >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {trend > 0 ? "+" : ""}{localizeDigits(trend, locale)}%
              </span>
              <span className="text-xs text-gray-400 dark:text-white/40 ms-1">{trendLabel}</span>
            </div>
          )}
          {subtitle && trend === undefined && (
            <p className="text-xs text-gray-400 dark:text-white/40 mt-2">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
            <div className={iconColor}>{icon}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
