"use client";

import { useState } from "react";

interface ConnectStripeButtonProps {
  primaryColor?: string | null;
}

export default function ConnectStripeButton({ primaryColor }: ConnectStripeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/connect/create-account", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error("No se pudo iniciar el onboarding");
      }

      window.location.href = data.url;
    } catch {
      alert("No se pudo iniciar el onboarding de Stripe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleConnect}
      disabled={loading}
      className={
        primaryColor
          ? "px-5 py-3 rounded-xl text-white font-semibold disabled:opacity-60"
          : "px-5 py-3 rounded-xl bg-white text-slate-950 font-semibold disabled:opacity-60"
      }
      style={primaryColor ? { backgroundColor: primaryColor } : undefined}
    >
      {loading ? "Conectando..." : "Conectar Stripe"}
    </button>
  );
}
