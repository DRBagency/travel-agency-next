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

const tooltipStyle = {
  backgroundColor: "rgba(0,0,0,0.8)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "8px",
};

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
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-1">
        Comparativa mensual
      </h3>
      <p className="text-sm text-white/40 mb-4">
        MRR vs Comisiones (ultimos 6 meses)
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.1)"
          />
          <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
          <YAxis stroke="rgba(255,255,255,0.6)" />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: "#fff" }}
            formatter={(value) => `${Number(value).toLocaleString("es-ES")} EUR`}
          />
          <Legend
            wrapperStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}
          />
          <Bar dataKey="mrr" fill="#10b981" name="MRR" radius={[4, 4, 0, 0]} />
          <Bar
            dataKey="comisiones"
            fill="#3b82f6"
            name="Comisiones"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProjectionChart({ data }: { data: ProjectionPoint[] }) {
  // Split into actual and projected for dual lines
  const chartData = data.map((d) => ({
    month: d.month,
    actual: d.tipo === "actual" ? d.mrr : undefined,
    proyectado: d.mrr,
  }));

  // Find the dividing index between actual and projected
  const lastActualIdx = data.findLastIndex((d) => d.tipo === "actual");
  // Bridge: repeat last actual point in projected line
  if (lastActualIdx >= 0 && lastActualIdx < chartData.length - 1) {
    chartData[lastActualIdx].proyectado = data[lastActualIdx].mrr;
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-1">
        Proyeccion de ingresos (MRR)
      </h3>
      <p className="text-sm text-white/40 mb-4">
        Basada en tendencia lineal de los ultimos 6 meses
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.1)"
          />
          <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
          <YAxis stroke="rgba(255,255,255,0.6)" />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: "#fff" }}
            formatter={(value) =>
              value !== undefined
                ? `${Number(value).toLocaleString("es-ES")} EUR`
                : "-"
            }
          />
          <Legend
            wrapperStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}
          />
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
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="3 3"
              label={{
                value: "Hoy",
                position: "top",
                fill: "rgba(255,255,255,0.4)",
                fontSize: 11,
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
