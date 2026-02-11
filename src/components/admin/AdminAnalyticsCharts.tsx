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

const tooltipStyle = {
  backgroundColor: "rgba(0,0,0,0.8)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "8px",
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function ReservasChart({ data }: { data: { month: string; reservas: number }[] }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Reservas (últimos 6 meses)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
          <YAxis stroke="rgba(255,255,255,0.6)" />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="reservas" fill="#3b82f6" name="Reservas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IngresosChart({ data }: { data: { month: string; ingresos: number }[] }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Ingresos (últimos 6 meses)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
          <YAxis stroke="rgba(255,255,255,0.6)" />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} name="Ingresos (€)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DestinosChart({ data }: { data: { destino: string; value: number }[] }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Top 5 Destinos más vendidos</h3>
      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.destino} (${entry.value})`}
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
