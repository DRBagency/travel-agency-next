/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";

interface UseAutoTranslateOptions {
  table: "clientes" | "destinos" | "opiniones";
  recordId: string;
  sourceLang: string;
  availableLangs: string[];
  plan?: string;
}

interface UseAutoTranslateReturn {
  translating: boolean;
  translationError: string | null;
  isEligible: boolean;
  translate: (fields: Record<string, any>) => Promise<void>;
}

export function useAutoTranslate({
  table,
  recordId,
  sourceLang,
  availableLangs,
  plan,
}: UseAutoTranslateOptions): UseAutoTranslateReturn {
  const [translating, setTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const isEligible =
    !!plan &&
    plan !== "start" &&
    Array.isArray(availableLangs) &&
    availableLangs.length > 1;

  const translate = useCallback(
    async (fields: Record<string, any>) => {
      if (!isEligible) return;

      // Filter empty fields
      const nonEmpty: Record<string, any> = {};
      for (const [key, value] of Object.entries(fields)) {
        if (value === null || value === undefined || value === "") continue;
        if (typeof value === "string" && value.trim() === "") continue;
        nonEmpty[key] = value;
      }

      if (Object.keys(nonEmpty).length === 0) return;

      const targetLangs = availableLangs.filter((l) => l !== sourceLang);
      if (targetLangs.length === 0) return;

      setTranslating(true);
      setTranslationError(null);

      try {
        const res = await fetch("/api/admin/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table,
            recordId,
            fields: nonEmpty,
            targetLangs,
            sourceLang,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Translation failed");
        }
      } catch (err: any) {
        setTranslationError(err?.message || "Translation failed");
      } finally {
        setTranslating(false);
      }
    },
    [table, recordId, sourceLang, availableLangs, isEligible]
  );

  return { translating, translationError, isEligible, translate };
}
