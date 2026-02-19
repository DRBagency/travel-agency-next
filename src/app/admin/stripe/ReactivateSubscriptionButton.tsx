"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { sileo } from "sileo";

export default function ReactivateSubscriptionButton() {
  const t = useTranslations('admin.stripe');
  const tc = useTranslations('common');
  const tt = useTranslations("toast");
  const [loading, setLoading] = useState(false);

  const handleReactivate = async () => {
    if (loading) return;

    const confirmed = window.confirm(t('confirmReactivate'));
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/billing/reactivate-subscription", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t('reactivateError'));
      }

      sileo.success({ title: tt("subscriptionReactivated") });
      window.location.reload();
    } catch (error: any) {
      sileo.error({ title: tt("errorReactivateSubscription") });
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
      {loading ? tc('reactivating') : t('reactivateSubscription')}
    </button>
  );
}
