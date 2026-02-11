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

const tooltipStyle = {
  backgroundColor: "rgba(0,0,0,0.8)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "8px",
};

export function MRRChart({ data }: { data: { month: string; mrr: number }[] }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Crecimiento MRR (últimos 6 meses)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
          <YAxis stroke="rgba(255,255,255,0.6)" />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#fff" }} />
          <Line type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={2} name="MRR (€)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ClientesChart({ data }: { data: { month: string; clientes: number }[] }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Clientes nuevos (últimos 6 meses)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
          <YAxis stroke="rgba(255,255,255,0.6)" />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#fff" }} />
          <Bar dataKey="clientes" fill="#3b82f6" name="Clientes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
