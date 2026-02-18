"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface ConnectStripeButtonProps {
  label: string;
  disabled?: boolean;
}

export default function ConnectStripeButton({
  label,
  disabled,
}: ConnectStripeButtonProps) {
  const t = useTranslations('admin.stripe');
  const tc = useTranslations('common');
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
        throw new Error(t('onboardingError'));
      }

      window.location.href = data.url;
    } catch {
      alert(t('onboardingError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleConnect}
      disabled={loading || disabled}
      className="btn-primary disabled:opacity-60"
    >
      {loading ? tc('connecting') : label}
    </button>
  );
}
