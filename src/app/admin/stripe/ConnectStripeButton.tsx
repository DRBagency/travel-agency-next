"use client";

import { useState } from "react";

interface ConnectStripeButtonProps {
  label: string;
  disabled?: boolean;
}

export default function ConnectStripeButton({
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
      className="px-5 py-3 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold disabled:opacity-60 transition-colors"
    >
      {loading ? "Conectando..." : label}
    </button>
  );
}
