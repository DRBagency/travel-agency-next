"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

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

const accentMap: Record<string, { border: string; tint: string; glow: string; iconGradient: string }> = {
  emerald: {
    border: "border-s-emerald-500",
    tint: "bg-emerald-50/50 dark:bg-emerald-500/[0.04]",
    glow: "card-glow-emerald",
    iconGradient: "from-emerald-500 to-emerald-600",
  },
  turquoise: {
    border: "border-s-drb-turquoise-500",
    tint: "bg-drb-turquoise-50/40 dark:bg-drb-turquoise-500/[0.04]",
    glow: "card-glow-turquoise",
    iconGradient: "from-drb-turquoise-500 to-drb-turquoise-600",
  },
  purple: {
    border: "border-s-purple-500",
    tint: "bg-purple-50/50 dark:bg-purple-500/[0.04]",
    glow: "card-glow-purple",
    iconGradient: "from-purple-500 to-purple-600",
  },
  amber: {
    border: "border-s-amber-500",
    tint: "bg-amber-50/50 dark:bg-amber-500/[0.04]",
    glow: "card-glow-amber",
    iconGradient: "from-amber-500 to-amber-600",
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
                  {trend > 0 ? "+" : ""}{trend}%
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
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        className={`kpi-card border-s-4 ${accent.border} ${accent.tint} ${accent.glow}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-white/60 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
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
              <div className="flex items-center gap-1 mt-2">
                {trend > 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                ) : trend < 0 ? (
                  <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span className={`text-xs font-semibold ${trend > 0 ? "text-emerald-600 dark:text-emerald-400" : trend < 0 ? "text-red-600 dark:text-red-400" : "text-gray-400"}`}>
                  {trend > 0 ? "+" : ""}{trend}%
                </span>
                <span className="text-xs text-gray-400 dark:text-white/40 ms-1">{trendLabel}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-2">
                <Minus className="w-3.5 h-3.5 text-gray-300 dark:text-white/20" />
                <span className="text-xs text-gray-400 dark:text-white/40">
                  {subtitle || "\u2014"}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${accent.iconGradient} flex items-center justify-center shrink-0 shadow-lg`}>
              <div className="text-white [&>svg]:w-6 [&>svg]:h-6">{icon}</div>
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
                {trend > 0 ? "+" : ""}{trend}%
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
