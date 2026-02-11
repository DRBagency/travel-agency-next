"use client";

import { useState } from "react";

export default function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (loading) return;

    const confirmed = window.confirm(
      "¿Estás seguro de que deseas cancelar tu suscripción? Se cancelará al final del periodo actual."
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/billing/cancel-subscription", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al cancelar");
      }

      alert(
        "Suscripción cancelada. Se mantendrá activa hasta el final del periodo de facturación."
      );
      window.location.reload();
    } catch (error: any) {
      alert(error.message || "Error al cancelar la suscripción");
      console.error("❌ [CancelSubscriptionButton]", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={loading}
      className="px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm font-semibold hover:bg-red-500/20 disabled:opacity-60 transition-colors"
    >
      {loading ? "Cancelando..." : "Cancelar suscripción"}
    </button>
  );
}
