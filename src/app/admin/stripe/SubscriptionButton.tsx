"use client";

import { useState } from "react";

export default function SubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/billing/create-subscription", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error("No se pudo iniciar el checkout");
      }
      window.location.href = data.url;
    } catch {
      alert("No se pudo iniciar la suscripción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSubscribe}
      disabled={loading}
      className="px-5 py-3 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold disabled:opacity-60 transition-colors"
    >
      {loading ? "Redirigiendo..." : "Activar suscripción"}
    </button>
  );
}
