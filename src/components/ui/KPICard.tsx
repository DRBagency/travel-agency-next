"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

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
}

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
}: KPICardProps) {
  if (variant === "gradient") {
    return (
      <motion.div
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
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
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <div className="text-white">{icon}</div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

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
