"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";
import { syncCustomers } from "./actions";

export default function SyncButton() {
  const t = useTranslations("admin.crm");
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => syncCustomers())}
      disabled={isPending}
      className="btn-primary text-sm flex items-center gap-2"
    >
      <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? t("syncing") : t("sync")}
    </button>
  );
}
