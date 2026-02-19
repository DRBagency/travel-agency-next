"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { sileo } from "sileo";

interface PricingResult {
  precio_sugerido: number;
  rango_bajo: number;
  rango_alto: number;
  justificacion: string;
  factores: string[];
  temporada_alta: string;
  temporada_baja: string;
}

interface Props {
  destinoName: string;
  currentPrice: number;
  clienteId: string;
}

export default function AIPricingSuggestion({ destinoName, currentPrice, clienteId }: Props) {
  const t = useTranslations("ai.pricing");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PricingResult | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "optimize-pricing",
          data: {
            prompt: `Analiza el precio óptimo para este destino turístico:
- Destino: ${destinoName}
- Precio actual: ${currentPrice}€
Sugiere un precio competitivo con justificación.`,
          },
          clienteId,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      // Strip markdown code fences if present (safety net)
      let raw = json.result;
      const fenceMatch = raw.trim().match(/^```(?:json|JSON)?\s*\n?([\s\S]*?)\n?\s*```$/);
      if (fenceMatch) raw = fenceMatch[1].trim();
      setResult(JSON.parse(raw));
    } catch (e: any) {
      setError(e.message || t("errorGeneric"));
      sileo.error({ title: "Error al analizar precio" });
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => { setOpen(true); analyze(); }}
        className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        {t("suggestPrice")}
      </button>
    );
  }

  return (
    <div className="mt-2 p-4 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          {t("pricingSuggestion")}
        </span>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-400 hover:text-gray-600">
          {t("close")}
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          {t("analyzing")}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-400">{t("suggested")}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.precio_sugerido}€</p>
            </div>
            <div className="text-center px-3 py-1 rounded-lg bg-white dark:bg-white/[0.06]">
              <p className="text-xs text-gray-400">{t("range")}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-white/60">{result.rango_bajo}€ - {result.rango_alto}€</p>
            </div>
            {currentPrice > 0 && (
              <div className="flex items-center gap-1">
                {result.precio_sugerido > currentPrice ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : result.precio_sugerido < currentPrice ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : (
                  <Minus className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-xs text-gray-500">
                  {currentPrice > 0 ? `${Math.round(((result.precio_sugerido - currentPrice) / currentPrice) * 100)}%` : ""}
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-white/60">{result.justificacion}</p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-white dark:bg-white/[0.06]">
              <span className="text-gray-400">{t("highSeason")}:</span>{" "}
              <span className="text-gray-700 dark:text-white/70">{result.temporada_alta}</span>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-white/[0.06]">
              <span className="text-gray-400">{t("lowSeason")}:</span>{" "}
              <span className="text-gray-700 dark:text-white/70">{result.temporada_baja}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
