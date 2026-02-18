"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function SubscriptionButton() {
  const t = useTranslations('admin.stripe');
  const tc = useTranslations('common');
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
        throw new Error(t('checkoutError'));
      }
      window.location.href = data.url;
    } catch {
      alert(t('checkoutError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSubscribe}
      disabled={loading}
      className="btn-primary disabled:opacity-60"
    >
      {loading ? tc('redirecting') : t('activateSubscription')}
    </button>
  );
}
