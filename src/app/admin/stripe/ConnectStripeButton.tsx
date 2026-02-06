"use client";

import { useState } from "react";

interface ConnectStripeButtonProps {
  primaryColor?: string | null;
  label: string;
  disabled?: boolean;
}

export default function ConnectStripeButton({
  primaryColor,
  label,
  disabled,
}: ConnectStripeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (loading || disabled) return;
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
      disabled={loading || disabled}
      className={
        primaryColor
          ? "px-5 py-3 rounded-xl text-white font-semibold disabled:opacity-60"
          : "px-5 py-3 rounded-xl bg-white text-slate-950 font-semibold disabled:opacity-60"
      }
      style={primaryColor ? { backgroundColor: primaryColor } : undefined}
    >
      {loading ? "Conectando..." : label}
    </button>
  );
}
