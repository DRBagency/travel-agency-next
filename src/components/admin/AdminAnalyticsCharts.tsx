"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { BarChart3, DollarSign, MapPin, TrendingUp } from "lucide-react";

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

export function ReservasChart({ data, compact }: { data: { month: string; reservas: number }[]; compact?: boolean }) {
  const styles = useChartStyles();
  const t = useTranslations('admin.analytics.charts');
  const h = compact ? 140 : 280;
  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className={compact ? "panel-card p-4" : "panel-card p-6"}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={`${compact ? "w-6 h-6" : "w-8 h-8"} rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 flex items-center justify-center`}>
          <BarChart3 className={`${compact ? "w-3 h-3" : "w-4 h-4"} text-white`} />
        </div>
        <div>
          <h3 className={`${compact ? "text-sm" : "text-lg"} font-semibold text-gray-900 dark:text-white`}>{t('bookings')}</h3>
          {!compact && <p className="text-xs text-gray-400 dark:text-white/40">{t('last6Months')}</p>}
        </div>
      </div>
      <div className={compact ? "mt-2" : "mt-4"}>
        <ResponsiveContainer width="100%" height={h}>
          <BarChart data={data}>
            <defs>
              <linearGradient id="gradientReservasBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1CABB0" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#1CABB0" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
            <XAxis dataKey="month" stroke={styles.axisStroke} tick={{ fontSize: compact ? 10 : 12 }} />
            <YAxis stroke={styles.axisStroke} tick={{ fontSize: compact ? 10 : 12 }} width={compact ? 30 : 60} />
            <Tooltip contentStyle={styles.tooltipStyle} cursor={{ fill: styles.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }} />
            <Bar
              dataKey="reservas"
              fill="url(#gradientReservasBar)"
              radius={[4, 4, 0, 0]}
              name={t('bookings')}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function IngresosChart({ data, compact }: { data: { month: string; ingresos: number }[]; compact?: boolean }) {
  const styles = useChartStyles();
  const t = useTranslations('admin.analytics.charts');
  const h = compact ? 140 : 280;
  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className={compact ? "panel-card p-4" : "panel-card p-6"}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={`${compact ? "w-6 h-6" : "w-8 h-8"} rounded-lg bg-gradient-to-br from-drb-lime-500 to-drb-lime-600 flex items-center justify-center`}>
          <DollarSign className={`${compact ? "w-3 h-3" : "w-4 h-4"} text-white`} />
        </div>
        <div>
          <h3 className={`${compact ? "text-sm" : "text-lg"} font-semibold text-gray-900 dark:text-white`}>{t('revenue')}</h3>
          {!compact && <p className="text-xs text-gray-400 dark:text-white/40">{t('last6Months')}</p>}
        </div>
      </div>
      <div className={compact ? "mt-2" : "mt-4"}>
        <ResponsiveContainer width="100%" height={h}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gradientIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B8D63E" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#B8D63E" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
            <XAxis dataKey="month" stroke={styles.axisStroke} tick={{ fontSize: compact ? 10 : 12 }} />
            <YAxis stroke={styles.axisStroke} tick={{ fontSize: compact ? 10 : 12 }} width={compact ? 30 : 60} />
            <Tooltip
              contentStyle={styles.tooltipStyle}
              formatter={(value) => `${Number(value).toLocaleString()} €`}
            />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#B8D63E"
              strokeWidth={2}
              fill="url(#gradientIngresos)"
              dot={{ r: compact ? 2.5 : 4, fill: "#B8D63E", strokeWidth: 2, stroke: styles.isDark ? "#072331" : "#fff" }}
              activeDot={{
                r: compact ? 4 : 7,
                fill: "#B8D63E",
                strokeWidth: 2,
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

export function DestinosChart({ data, compact }: { data: { destino: string; value: number }[]; compact?: boolean }) {
  const styles = useChartStyles();
  const t = useTranslations('admin.analytics.charts');
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const pieSize = compact ? 120 : 180;
  const innerR = compact ? 36 : 55;
  const outerR = compact ? 52 : 80;

  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className={compact ? "panel-card p-4" : "panel-card p-6"}
    >
      <div className={`flex items-center gap-2 ${compact ? "mb-2" : "mb-4"}`}>
        <div className={`${compact ? "w-6 h-6" : "w-8 h-8"} rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center`}>
          <MapPin className={`${compact ? "w-3 h-3" : "w-4 h-4"} text-white`} />
        </div>
        <div>
          <h3 className={`${compact ? "text-sm" : "text-lg"} font-semibold text-gray-900 dark:text-white`}>{t('topDestinations')}</h3>
          {!compact && <p className="text-xs text-gray-400 dark:text-white/40">{t('byBookings')}</p>}
        </div>
      </div>
      <div className={compact ? "flex flex-col items-center gap-2" : "flex items-center gap-6"}>
        <div className="relative">
          <ResponsiveContainer width={pieSize} height={pieSize}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={innerR}
                outerRadius={outerR}
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className={`${compact ? "text-lg" : "text-2xl"} font-bold text-gray-900 dark:text-white`}>{total}</div>
              <div className="text-[10px] text-gray-400 dark:text-white/40">{t('total')}</div>
            </div>
          </div>
        </div>
        <div className={compact ? "w-full space-y-1" : "flex-1 space-y-2.5"}>
          {data.map((item, index) => (
            <div key={item.destino} className="flex items-center gap-1.5">
              <div
                className={`${compact ? "w-2 h-2" : "w-3 h-3"} rounded-full shrink-0`}
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <span className={`${compact ? "text-xs" : "text-sm"} text-gray-600 dark:text-white/70 flex-1 truncate`}>{item.destino}</span>
              <span className={`${compact ? "text-xs" : "text-sm"} font-semibold text-gray-900 dark:text-white`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface ProjectionPoint {
  month: string;
  ingresos: number;
  tipo: "actual" | "proyectado";
}

export function RevenueProjectionChart({ data, compact }: { data: ProjectionPoint[]; compact?: boolean }) {
  const styles = useChartStyles();
  const t = useTranslations('admin.analytics.charts');
  const h = compact ? 140 : 280;

  const chartData = data.map((d) => ({
    month: d.month,
    actual: d.tipo === "actual" ? d.ingresos : undefined,
    proyectado: d.ingresos,
  }));

  const lastActualIdx = data.findLastIndex((d) => d.tipo === "actual");
  if (lastActualIdx >= 0 && lastActualIdx < chartData.length - 1) {
    chartData[lastActualIdx].proyectado = data[lastActualIdx].ingresos;
  }

  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
      className={compact ? "panel-card p-4" : "panel-card p-6"}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={`${compact ? "w-6 h-6" : "w-8 h-8"} rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center`}>
          <TrendingUp className={`${compact ? "w-3 h-3" : "w-4 h-4"} text-white`} />
        </div>
        <div>
          <h3 className={`${compact ? "text-sm" : "text-lg"} font-semibold text-gray-900 dark:text-white`}>{t('revenueProjection')}</h3>
          {!compact && <p className="text-xs text-gray-400 dark:text-white/40">{t('basedOnTrend')}</p>}
        </div>
      </div>
      <div className={compact ? "mt-2" : "mt-4"}>
        <ResponsiveContainer width="100%" height={h}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradientActualAdmin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1CABB0" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#1CABB0" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gradientProyectadoAdmin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
            <XAxis dataKey="month" stroke={styles.axisStroke} tick={{ fontSize: compact ? 10 : 12 }} />
            <YAxis stroke={styles.axisStroke} tick={{ fontSize: compact ? 10 : 12 }} width={compact ? 30 : 60} />
            <Tooltip
              contentStyle={styles.tooltipStyle}
              formatter={(value: number | undefined) =>
                value !== undefined ? `${Number(value).toLocaleString()} €` : "-"
              }
            />
            {!compact && <Legend wrapperStyle={{ color: styles.isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", fontSize: 12 }} />}
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#1CABB0"
              strokeWidth={2}
              fill="url(#gradientActualAdmin)"
              dot={{ r: compact ? 2.5 : 4, fill: "#1CABB0", strokeWidth: 2, stroke: styles.isDark ? "#072331" : "#fff" }}
              name={t('actual')}
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="proyectado"
              stroke="#8B5CF6"
              strokeWidth={compact ? 1.5 : 2}
              strokeDasharray="6 4"
              fill="url(#gradientProyectadoAdmin)"
              dot={{ r: compact ? 2 : 3, strokeDasharray: "0", fill: "#8B5CF6", strokeWidth: 2, stroke: styles.isDark ? "#072331" : "#fff" }}
              name={t('projected')}
              connectNulls
            />
            {lastActualIdx >= 0 && (
              <ReferenceLine
                x={data[lastActualIdx]?.month}
                stroke={styles.isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}
                strokeDasharray="3 3"
                label={compact ? undefined : {
                  value: t('today'),
                  position: "top",
                  fill: styles.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                  fontSize: 11,
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
