"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function AILockedOverlay() {
  const t = useTranslations("ai.locked");

  return (
    <div className="panel-card p-8 flex flex-col items-center justify-center text-center max-w-lg mx-auto mt-12">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-white/10 dark:to-white/5 flex items-center justify-center mb-5">
        <Lock className="w-7 h-7 text-gray-500 dark:text-white/40" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {t("title")}
      </h2>
      <p className="text-sm text-gray-500 dark:text-white/50 mb-6 max-w-sm">
        {t("description")}
      </p>
      <Link
        href="/admin/stripe"
        className="btn-primary px-6 py-3 rounded-xl text-sm font-semibold"
      >
        {t("upgrade")}
      </Link>
    </div>
  );
}
