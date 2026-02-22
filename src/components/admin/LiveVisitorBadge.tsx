"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";

interface Props {
  clienteId: string;
}

export default function LiveVisitorBadge({ clienteId }: Props) {
  const [activeNow, setActiveNow] = useState(0);
  const t = useTranslations("admin.shell");

  const fetchActive = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/visits/active");
      if (!res.ok) return;
      const data = await res.json();
      setActiveNow(data.activeNow ?? 0);
    } catch {
      // silent
    }
  }, []);

  // Initial fetch + polling fallback (60s)
  useEffect(() => {
    fetchActive();
    const interval = setInterval(fetchActive, 60_000);
    return () => clearInterval(interval);
  }, [fetchActive]);

  // Supabase Realtime — listen for new page_visits inserts and refetch
  useEffect(() => {
    const channel = supabase
      .channel(`visits-realtime-${clienteId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "page_visits",
          filter: `cliente_id=eq.${clienteId}`,
        },
        () => {
          fetchActive();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clienteId, fetchActive]);

  return (
    <div
      className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
        bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60
        dark:border-emerald-500/20"
    >
      {/* Pulsing green dot */}
      <span className="relative flex h-2 w-2">
        {activeNow > 0 && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        )}
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      {/* Count + label */}
      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
        {activeNow}
      </span>
      <span className="text-[11px] text-emerald-600/70 dark:text-emerald-400/60">
        {t("onYourWeb")}
      </span>
    </div>
  );
}
