"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { sileo } from "sileo";

export default function CancelSubscriptionButton() {
  const t = useTranslations('admin.stripe');
  const tc = useTranslations('common');
  const tt = useTranslations("toast");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (loading) return;

    const confirmed = window.confirm(t('confirmCancel'));
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/billing/cancel-subscription", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t('cancelError'));
      }

      sileo.success({ title: tt("subscriptionCancelled") });
      window.location.reload();
    } catch (error: any) {
      sileo.error({ title: tt("errorCancelSubscription") });
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
      {loading ? tc('cancelling') : t('cancelSubscription')}
    </button>
  );
}
