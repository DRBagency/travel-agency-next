"use client";

import {
  AreaChart,
  Area,
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

function useChartStyles() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return {
    tooltipStyle: {
      backgroundColor: isDark ? "rgba(17,24,39,0.95)" : "#fff",
      border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
      borderRadius: "12px",
      color: isDark ? "#fff" : "#111827",
      padding: "10px 14px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    },
    labelStyle: { color: isDark ? "#fff" : "#111827" },
    legendStyle: { color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", fontSize: 12 },
    gridStroke: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    axisStroke: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
    refLineStroke: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
    refLabelFill: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
  };
}

interface MonthlyComparison {
  month: string;
  mrr: number;
  comisiones: number;
  reservas: number;
}

interface ProjectionPoint {
  month: string;
  mrr: number;
  tipo: "actual" | "proyectado";
}

export function ComparisonChart({ data }: { data: MonthlyComparison[] }) {
  const styles = useChartStyles();
  const t = useTranslations('owner.monetization.charts');
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {t('monthlyComparison')}
      </h3>
      <p className="text-sm text-gray-400 dark:text-white/40 mb-4">
        {t('mrrVsCommissions')}
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradientMRRComp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1CABB0" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#1CABB0" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientComisiones" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4F24D" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#D4F24D" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
          <XAxis dataKey="month" stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <YAxis stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={styles.tooltipStyle}
            labelStyle={styles.labelStyle}
            formatter={(value) => `${Number(value).toLocaleString()} EUR`}
          />
          <Legend wrapperStyle={styles.legendStyle} />
          <Area
            type="monotone"
            dataKey="mrr"
            stroke="#1CABB0"
            strokeWidth={2.5}
            fill="url(#gradientMRRComp)"
            dot={{ r: 3, fill: "#1CABB0", strokeWidth: 2, stroke: "#fff" }}
            name={t('mrr')}
          />
          <Area
            type="monotone"
            dataKey="comisiones"
            stroke="#D4F24D"
            strokeWidth={2.5}
            fill="url(#gradientComisiones)"
            dot={{ r: 3, fill: "#D4F24D", strokeWidth: 2, stroke: "#fff" }}
            name={t('commissions')}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function ProjectionChart({ data }: { data: ProjectionPoint[] }) {
  const styles = useChartStyles();
  const t = useTranslations('owner.monetization.charts');

  const chartData = data.map((d) => ({
    month: d.month,
    actual: d.tipo === "actual" ? d.mrr : undefined,
    proyectado: d.mrr,
  }));

  const lastActualIdx = data.findLastIndex((d) => d.tipo === "actual");
  if (lastActualIdx >= 0 && lastActualIdx < chartData.length - 1) {
    chartData[lastActualIdx].proyectado = data[lastActualIdx].mrr;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {t('revenueProjection')}
      </h3>
      <p className="text-sm text-gray-400 dark:text-white/40 mb-4">
        {t('basedOnTrend')}
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="gradientActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1CABB0" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#1CABB0" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientProyectado" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
          <XAxis dataKey="month" stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <YAxis stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={styles.tooltipStyle}
            labelStyle={styles.labelStyle}
            formatter={(value) =>
              value !== undefined
                ? `${Number(value).toLocaleString()} EUR`
                : "-"
            }
          />
          <Legend wrapperStyle={styles.legendStyle} />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="#1CABB0"
            strokeWidth={2.5}
            fill="url(#gradientActual)"
            dot={{ r: 4, fill: "#1CABB0", strokeWidth: 2, stroke: "#fff" }}
            name={t('mrrActual')}
            connectNulls={false}
          />
          <Area
            type="monotone"
            dataKey="proyectado"
            stroke="#8B5CF6"
            strokeWidth={2}
            strokeDasharray="6 4"
            fill="url(#gradientProyectado)"
            dot={{ r: 3, strokeDasharray: "0", fill: "#8B5CF6", strokeWidth: 2, stroke: "#fff" }}
            name={t('projected')}
            connectNulls
          />
          {lastActualIdx >= 0 && (
            <ReferenceLine
              x={data[lastActualIdx]?.month}
              stroke={styles.refLineStroke}
              strokeDasharray="3 3"
              label={{
                value: t('today'),
                position: "top",
                fill: styles.refLabelFill,
                fontSize: 11,
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
