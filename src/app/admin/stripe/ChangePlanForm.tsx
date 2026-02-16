"use client";

import { useState } from "react";

interface ChangePlanFormProps {
  primaryColor?: string | null;
  currentPlan: string;
}

export default function ChangePlanForm({
  primaryColor,
  currentPlan,
}: ChangePlanFormProps) {
  const [plan, setPlan] = useState(currentPlan);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/billing/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) {
        throw new Error("No se pudo cambiar el plan");
      }
      window.location.reload();
    } catch {
      alert("No se pudo cambiar el plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
      <select
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        className="border border-white/10 rounded-xl bg-white/10 text-white px-3 py-2"
      >
        <option value="start">Start</option>
        <option value="grow">Grow</option>
        <option value="pro">Pro</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className={
          primaryColor
            ? "px-5 py-2 rounded-xl text-white font-semibold disabled:opacity-60"
            : "px-5 py-2 rounded-xl bg-white text-slate-950 font-semibold disabled:opacity-60"
        }
        style={primaryColor ? { backgroundColor: primaryColor } : undefined}
      >
        {loading ? "Actualizando..." : "Cambiar plan"}
      </button>
    </form>
  );
}
