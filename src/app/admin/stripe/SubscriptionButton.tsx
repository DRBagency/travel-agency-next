"use client";

import { useState } from "react";

interface SubscriptionButtonProps {
  primaryColor?: string | null;
}

export default function SubscriptionButton({ primaryColor }: SubscriptionButtonProps) {
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
      className={
        primaryColor
          ? "px-5 py-3 rounded-xl text-white font-semibold disabled:opacity-60"
          : "px-5 py-3 rounded-xl bg-white text-slate-950 font-semibold disabled:opacity-60"
      }
      style={primaryColor ? { backgroundColor: primaryColor } : undefined}
    >
      {loading ? "Redirigiendo..." : "Activar suscripción"}
    </button>
  );
}
