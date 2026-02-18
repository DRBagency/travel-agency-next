"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface ChangePlanFormProps {
  currentPlan: string;
}

export default function ChangePlanForm({
  currentPlan,
}: ChangePlanFormProps) {
  const t = useTranslations('admin.stripe');
  const tc = useTranslations('common');
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
        throw new Error(t('changePlanError'));
      }
      window.location.reload();
    } catch {
      alert(t('changePlanError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
      <select
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        className="border border-white/30 rounded-xl bg-white/95 text-gray-900 px-3 py-2"
      >
        <option value="start">Start</option>
        <option value="grow">Grow</option>
        <option value="pro">Pro</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary disabled:opacity-60"
      >
        {loading ? tc('updating') : t('changePlanBtn')}
      </button>
    </form>
  );
}
