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
  Legend,
  ReferenceLine,
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
    legendStyle: { color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)", fontSize: 12 },
    gridStroke: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
    axisStroke: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)",
    refLineStroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
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
  return (
    <div className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        Comparativa mensual
      </h3>
      <p className="text-sm text-gray-500 dark:text-white/40 mb-4">
        MRR vs Comisiones (ultimos 6 meses)
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
          <XAxis dataKey="month" stroke={styles.axisStroke} />
          <YAxis stroke={styles.axisStroke} />
          <Tooltip
            contentStyle={styles.tooltipStyle}
            labelStyle={styles.labelStyle}
            formatter={(value) => `${Number(value).toLocaleString("es-ES")} EUR`}
          />
          <Legend wrapperStyle={styles.legendStyle} />
          <Bar dataKey="mrr" fill="#10b981" name="MRR" radius={[4, 4, 0, 0]} />
          <Bar dataKey="comisiones" fill="#3b82f6" name="Comisiones" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProjectionChart({ data }: { data: ProjectionPoint[] }) {
  const styles = useChartStyles();

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
    <div className="panel-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        Proyeccion de ingresos (MRR)
      </h3>
      <p className="text-sm text-gray-500 dark:text-white/40 mb-4">
        Basada en tendencia lineal de los ultimos 6 meses
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStroke} />
          <XAxis dataKey="month" stroke={styles.axisStroke} />
          <YAxis stroke={styles.axisStroke} />
          <Tooltip
            contentStyle={styles.tooltipStyle}
            labelStyle={styles.labelStyle}
            formatter={(value) =>
              value !== undefined
                ? `${Number(value).toLocaleString("es-ES")} EUR`
                : "-"
            }
          />
          <Legend wrapperStyle={styles.legendStyle} />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="MRR Actual"
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="proyectado"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, strokeDasharray: "0" }}
            name="Proyectado"
            connectNulls
          />
          {lastActualIdx >= 0 && (
            <ReferenceLine
              x={data[lastActualIdx]?.month}
              stroke={styles.refLineStroke}
              strokeDasharray="3 3"
              label={{
                value: "Hoy",
                position: "top",
                fill: styles.refLabelFill,
                fontSize: 11,
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
