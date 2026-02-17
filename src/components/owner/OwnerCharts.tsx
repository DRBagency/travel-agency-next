"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

function useChartStyles() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return {
    tooltipStyle: {
      backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "#fff",
      border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid #e5e7eb",
      borderRadius: "8px",
      color: isDark ? "#fff" : "#111827",
    },
    labelStyle: { color: isDark ? "#fff" : "#111827" },
    gridStroke: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
    axisStroke: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)",
  };
}

export function MRRChart({ data }: { data: { month: string; mrr: number }[] }) {
  const styles = useChartStyles();
  return (
    <div className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Crecimiento MRR (últimos 6 meses)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
          <XAxis dataKey="month" stroke={styles.axisStroke} />
          <YAxis stroke={styles.axisStroke} />
          <Tooltip contentStyle={styles.tooltipStyle} labelStyle={styles.labelStyle} />
          <Line type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={2} name="MRR (€)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ClientesChart({ data }: { data: { month: string; clientes: number }[] }) {
  const styles = useChartStyles();
  return (
    <div className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Clientes nuevos (últimos 6 meses)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
          <XAxis dataKey="month" stroke={styles.axisStroke} />
          <YAxis stroke={styles.axisStroke} />
          <Tooltip contentStyle={styles.tooltipStyle} labelStyle={styles.labelStyle} />
          <Bar dataKey="clientes" fill="#3b82f6" name="Clientes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReservasOwnerChart({ data }: { data: { month: string; reservas: number }[] }) {
  const styles = useChartStyles();
  return (
    <div className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Reservas plataforma (últimos 6 meses)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
          <XAxis dataKey="month" stroke={styles.axisStroke} />
          <YAxis stroke={styles.axisStroke} />
          <Tooltip contentStyle={styles.tooltipStyle} labelStyle={styles.labelStyle} />
          <Bar dataKey="reservas" fill="#f59e0b" name="Reservas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
