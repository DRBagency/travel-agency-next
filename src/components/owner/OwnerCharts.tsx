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
    gridStroke: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    axisStroke: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
  };
}

export function MRRChart({ data }: { data: { month: string; mrr: number }[] }) {
  const styles = useChartStyles();
  const t = useTranslations('owner.charts');
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {t('mrrGrowth')}
      </h3>
      <p className="text-sm text-gray-400 dark:text-white/40 mb-4">{t('last6Months')}</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradientMRR" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1CABB0" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#1CABB0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
          <XAxis dataKey="month" stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <YAxis stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={styles.tooltipStyle}
            labelStyle={styles.labelStyle}
            formatter={(value) => `${Number(value).toLocaleString()} €`}
          />
          <Area
            type="monotone"
            dataKey="mrr"
            stroke="#1CABB0"
            strokeWidth={2.5}
            fill="url(#gradientMRR)"
            dot={{ r: 4, fill: "#1CABB0", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, fill: "#1CABB0" }}
            name={t('mrrEur')}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function ClientesChart({ data }: { data: { month: string; clientes: number }[] }) {
  const styles = useChartStyles();
  const t = useTranslations('owner.charts');
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {t('newClients')}
      </h3>
      <p className="text-sm text-gray-400 dark:text-white/40 mb-4">{t('last6Months')}</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradientClientes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4F24D" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#D4F24D" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
          <XAxis dataKey="month" stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <YAxis stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={styles.tooltipStyle} labelStyle={styles.labelStyle} />
          <Area
            type="monotone"
            dataKey="clientes"
            stroke="#D4F24D"
            strokeWidth={2.5}
            fill="url(#gradientClientes)"
            dot={{ r: 4, fill: "#D4F24D", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, fill: "#D4F24D" }}
            name={t('clients')}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function ReservasOwnerChart({ data }: { data: { month: string; reservas: number }[] }) {
  const styles = useChartStyles();
  const t = useTranslations('owner.charts');
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {t('platformBookings')}
      </h3>
      <p className="text-sm text-gray-400 dark:text-white/40 mb-4">{t('last6Months')}</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradientReservasOwner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
          <XAxis dataKey="month" stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <YAxis stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={styles.tooltipStyle} labelStyle={styles.labelStyle} />
          <Area
            type="monotone"
            dataKey="reservas"
            stroke="#F59E0B"
            strokeWidth={2.5}
            fill="url(#gradientReservasOwner)"
            dot={{ r: 4, fill: "#F59E0B", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, fill: "#F59E0B" }}
            name={t('bookings')}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

const PLAN_COLORS: Record<string, string> = {
  start: "#1CABB0",
  grow: "#D4F24D",
  pro: "#E91E63",
  unknown: "#94a3b8",
};

export function RevenueBreakdownChart({
  data,
}: {
  data: Record<string, { count: number; mrr: number }>;
}) {
  const styles = useChartStyles();
  const t = useTranslations("owner.charts");

  const chartData = Object.entries(data).map(([plan, vals]) => ({
    name: plan.charAt(0).toUpperCase() + plan.slice(1),
    value: vals.mrr,
    count: vals.count,
    plan,
  }));

  if (chartData.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="panel-card p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {t("revenueByPlan")}
      </h3>
      <p className="text-sm text-gray-400 dark:text-white/40 mb-4">
        {t("mrrDistribution")}
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}€`}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.plan}
                fill={PLAN_COLORS[entry.plan] || PLAN_COLORS.unknown}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={styles.tooltipStyle}
            formatter={(value: any, _: any, props: any) => [
              `${value}€ (${props.payload.count} ${t("agencies")})`,
              props.payload.name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function TopDestinosChart({
  data,
}: {
  data: { name: string; count: number }[];
}) {
  const styles = useChartStyles();
  const t = useTranslations("owner.charts");

  if (data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="panel-card p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {t("topDestinations")}
      </h3>
      <p className="text-sm text-gray-400 dark:text-white/40 mb-4">
        {t("byBookings")}
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={styles.gridStroke}
            horizontal={false}
          />
          <XAxis type="number" stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            stroke={styles.axisStroke}
            tick={{ fontSize: 11 }}
            width={120}
          />
          <Tooltip
            contentStyle={styles.tooltipStyle}
            labelStyle={styles.labelStyle}
            formatter={(value: any) => [`${value}`, t("bookings")]}
          />
          <Bar dataKey="count" fill="#1CABB0" radius={[0, 6, 6, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
