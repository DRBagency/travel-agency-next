"use client";

import {
  LineChart,
  Line,
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
} from "recharts";
import { useTheme } from "next-themes";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

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
    gridStroke: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
    axisStroke: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)",
    labelColor: isDark ? "#fff" : "#111827",
  };
}

export function ReservasChart({ data }: { data: { month: string; reservas: number }[] }) {
  const styles = useChartStyles();
  return (
    <div className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reservas (últimos 6 meses)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
          <XAxis dataKey="month" stroke={styles.axisStroke} />
          <YAxis stroke={styles.axisStroke} />
          <Tooltip contentStyle={styles.tooltipStyle} />
          <Bar dataKey="reservas" fill="#3b82f6" name="Reservas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IngresosChart({ data }: { data: { month: string; ingresos: number }[] }) {
  const styles = useChartStyles();
  return (
    <div className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ingresos (últimos 6 meses)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
          <XAxis dataKey="month" stroke={styles.axisStroke} />
          <YAxis stroke={styles.axisStroke} />
          <Tooltip contentStyle={styles.tooltipStyle} />
          <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} name="Ingresos (€)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DestinosChart({ data }: { data: { destino: string; value: number }[] }) {
  const styles = useChartStyles();
  return (
    <div className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 5 Destinos más vendidos</h3>
      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ destino, value, cx, cy, midAngle, outerRadius }: any) => {
                const RADIAN = Math.PI / 180;
                const radius = outerRadius + 25;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text x={x} y={y} fill={styles.labelColor} textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
                    {`${destino} (${value})`}
                  </text>
                );
              }}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
