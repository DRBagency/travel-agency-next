"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Brain, Loader2, RefreshCw } from "lucide-react";
import { sileo } from "sileo";

interface Props {
  metricsContext: string;
  compact?: boolean;
}

export default function AIInsightsCard({ metricsContext, compact }: Props) {
  const t = useTranslations("ai.insights");
  const tt = useTranslations("toast");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const generate = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-report",
          data: { prompt: `Analiza estas métricas de mi plataforma SaaS de agencias de viajes:\n\n${metricsContext}` },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      setResult(json.result);
    } catch (e: any) {
      setResult(`⚠️ ${e.message || t("errorGeneric")}`);
      sileo.error({ title: tt("errorGenerateReport") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`panel-card ${compact ? "p-4" : "p-6"} h-full`}>
      <div className={`flex items-center justify-between ${compact ? "mb-2" : "mb-4"}`}>
        <h2 className={`${compact ? "text-sm" : "text-lg"} font-semibold text-gray-900 dark:text-white flex items-center gap-2`}>
          <Brain className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-drb-turquoise-500`} />
          {t("title")}
        </h2>
        <button
          onClick={generate}
          disabled={loading}
          className={`btn-primary ${compact ? "text-[11px] px-2 py-1" : "text-xs px-3 py-1.5"} flex items-center gap-1.5`}
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : result ? (
            <RefreshCw className="w-3 h-3" />
          ) : (
            <Brain className="w-3 h-3" />
          )}
          {loading ? t("generating") : result ? t("refresh") : t("generateReport")}
        </button>
      </div>

      {!result && !loading && (
        <p className={`${compact ? "text-xs" : "text-sm"} text-gray-400 dark:text-white/40`}>{t("description")}</p>
      )}

      {loading && (
        <div className={`${compact ? "space-y-2" : "space-y-3"} animate-pulse`}>
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
        </div>
      )}

      {result && !loading && (
        <div className={`${compact ? "max-h-[140px] overflow-y-auto" : ""} prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-white/70`}>
          {result.split("\n").map((line, i) => {
            if (line.startsWith("## ")) return <h3 key={i} className={`${compact ? "text-sm" : "text-base"} font-semibold text-gray-900 dark:text-white mt-3 mb-1`}>{line.replace("## ", "")}</h3>;
            if (line.startsWith("### ")) return <h4 key={i} className="text-xs font-semibold text-gray-800 dark:text-white/80 mt-2 mb-1">{line.replace("### ", "")}</h4>;
            if (line.startsWith("- ")) return <li key={i} className="text-xs ms-4">{line.replace("- ", "")}</li>;
            if (line.startsWith("**")) return <p key={i} className="text-xs font-semibold">{line.replace(/\*\*/g, "")}</p>;
            if (line.trim() === "") return <br key={i} />;
            return <p key={i} className="text-xs">{line}</p>;
          })}
        </div>
      )}
    </div>
  );
}
