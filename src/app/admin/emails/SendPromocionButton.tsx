"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { sileo } from "sileo";
import { Send, Loader2 } from "lucide-react";

export default function SendPromocionButton() {
  const t = useTranslations("admin.emails");
  const tt = useTranslations("toast");
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!confirm(t("confirmSendPromo"))) return;

    setSending(true);
    try {
      const res = await fetch("/api/admin/emails/send-promocion", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        sileo.error({ title: data.error || tt("errorSaving") });
        return;
      }

      sileo.success({
        title: t("promoSent", { count: data.sent }),
      });
    } catch {
      sileo.error({ title: tt("errorSaving") });
    } finally {
      setSending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSend}
      disabled={sending}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/25 transition-colors disabled:opacity-50"
    >
      {sending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Send className="w-4 h-4" />
      )}
      {t("sendToAllCustomers")}
    </button>
  );
}
