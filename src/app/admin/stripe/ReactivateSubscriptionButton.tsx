"use client";

import { useState } from "react";

export default function ReactivateSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleReactivate = async () => {
    if (loading) return;

    const confirmed = window.confirm(
      "¿Deseas reactivar tu suscripción? Se renovará automáticamente al final del periodo."
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/billing/reactivate-subscription", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al reactivar");
      }

      alert("Suscripción reactivada con éxito.");
      window.location.reload();
    } catch (error: any) {
      alert(error.message || "Error al reactivar la suscripción");
      console.error("❌ [ReactivateSubscriptionButton]", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleReactivate}
      disabled={loading}
      className="px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/20 disabled:opacity-60 transition-colors"
    >
      {loading ? "Reactivando..." : "Reactivar suscripción"}
    </button>
  );
}
