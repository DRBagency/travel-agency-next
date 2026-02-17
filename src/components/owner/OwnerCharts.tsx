"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

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
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        Crecimiento MRR
      </h3>
      <p className="text-sm text-gray-400 dark:text-white/40 mb-4">Últimos 6 meses</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradientMRR" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
          <XAxis dataKey="month" stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <YAxis stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={styles.tooltipStyle}
            labelStyle={styles.labelStyle}
            formatter={(value) => `${Number(value).toLocaleString("es-ES")} €`}
          />
          <Area
            type="monotone"
            dataKey="mrr"
            stroke="#10B981"
            strokeWidth={2.5}
            fill="url(#gradientMRR)"
            dot={{ r: 4, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, fill: "#10B981" }}
            name="MRR (€)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function ClientesChart({ data }: { data: { month: string; clientes: number }[] }) {
  const styles = useChartStyles();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        Clientes nuevos
      </h3>
      <p className="text-sm text-gray-400 dark:text-white/40 mb-4">Últimos 6 meses</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradientClientes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A8FE7" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#4A8FE7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
          <XAxis dataKey="month" stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <YAxis stroke={styles.axisStroke} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={styles.tooltipStyle} labelStyle={styles.labelStyle} />
          <Area
            type="monotone"
            dataKey="clientes"
            stroke="#4A8FE7"
            strokeWidth={2.5}
            fill="url(#gradientClientes)"
            dot={{ r: 4, fill: "#4A8FE7", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, fill: "#4A8FE7" }}
            name="Clientes"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function ReservasOwnerChart({ data }: { data: { month: string; reservas: number }[] }) {
  const styles = useChartStyles();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        Reservas plataforma
      </h3>
      <p className="text-sm text-gray-400 dark:text-white/40 mb-4">Últimos 6 meses</p>
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
            name="Reservas"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
