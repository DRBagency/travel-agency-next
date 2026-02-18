"use client";

import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { BarChart3, DollarSign, MapPin } from "lucide-react";

const CHART_COLORS = ['#1CABB0', '#D4F24D', '#E91E63', '#8B5CF6', '#F59E0B'];

function useChartStyles() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return {
    tooltipStyle: {
      backgroundColor: isDark ? "rgba(7,35,49,0.95)" : "rgba(255,255,255,0.95)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: isDark ? "1px solid rgba(28,171,176,0.2)" : "1px solid rgba(28,171,176,0.15)",
      borderRadius: "12px",
      color: isDark ? "#fff" : "#111827",
      padding: "10px 14px",
      boxShadow: isDark
        ? "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(28,171,176,0.1)"
        : "0 8px 32px rgba(7,35,49,0.12), 0 0 0 1px rgba(28,171,176,0.06)",
    },
    gridStroke: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    axisStroke: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
    labelColor: isDark ? "#fff" : "#111827",
    isDark,
  };
}

const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ReservasChart({ data }: { data: { month: string; reservas: number }[] }) {
  const styles = useChartStyles();
  const t = useTranslations('admin.analytics.charts');
  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="panel-card p-6"
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('bookings')}</h3>
          <p className="text-xs text-gray-400 dark:text-white/40">{t('last6Months')}</p>
        </div>
      </div>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gradientReservas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1CABB0" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#1CABB0" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
            <XAxis dataKey="month" stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
            <YAxis stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={styles.tooltipStyle} />
            <Area
              type="monotone"
              dataKey="reservas"
              stroke="#1CABB0"
              strokeWidth={2.5}
              fill="url(#gradientReservas)"
              dot={{ r: 4, fill: "#1CABB0", strokeWidth: 2, stroke: styles.isDark ? "#072331" : "#fff" }}
              activeDot={{
                r: 7,
                fill: "#1CABB0",
                strokeWidth: 3,
                stroke: styles.isDark ? "#072331" : "#fff",
                style: { filter: "drop-shadow(0 0 6px rgba(28,171,176,0.5))" },
              }}
              name={t('bookings')}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function IngresosChart({ data }: { data: { month: string; ingresos: number }[] }) {
  const styles = useChartStyles();
  const t = useTranslations('admin.analytics.charts');
  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="panel-card p-6"
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-drb-lime-500 to-drb-lime-600 flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('revenue')}</h3>
          <p className="text-xs text-gray-400 dark:text-white/40">{t('last6Months')}</p>
        </div>
      </div>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gradientIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B8D63E" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#B8D63E" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
            <XAxis dataKey="month" stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
            <YAxis stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={styles.tooltipStyle}
              formatter={(value) => `${Number(value).toLocaleString()} €`}
            />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#B8D63E"
              strokeWidth={2.5}
              fill="url(#gradientIngresos)"
              dot={{ r: 4, fill: "#B8D63E", strokeWidth: 2, stroke: styles.isDark ? "#072331" : "#fff" }}
              activeDot={{
                r: 7,
                fill: "#B8D63E",
                strokeWidth: 3,
                stroke: styles.isDark ? "#072331" : "#fff",
                style: { filter: "drop-shadow(0 0 6px rgba(184,214,62,0.5))" },
              }}
              name={t('revenueEur')}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function DestinosChart({ data }: { data: { destino: string; value: number }[] }) {
  const styles = useChartStyles();
  const t = useTranslations('admin.analytics.charts');
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className="panel-card p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('topDestinations')}</h3>
          <p className="text-xs text-gray-400 dark:text-white/40">{t('byBookings')}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={styles.tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
              <div className="text-xs text-gray-400 dark:text-white/40">{t('total')}</div>
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="flex-1 space-y-2.5">
          {data.map((item, index) => (
            <div key={item.destino} className="flex items-center gap-2.5">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <span className="text-sm text-gray-600 dark:text-white/70 flex-1 truncate">{item.destino}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
