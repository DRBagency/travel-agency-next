"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Brain, Loader2, RefreshCw } from "lucide-react";

interface Props {
  metricsContext: string;
}

export default function AIInsightsCard({ metricsContext }: Props) {
  const t = useTranslations("ai.insights");
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-drb-turquoise-500" />
          {t("title")}
        </h2>
        <button
          onClick={generate}
          disabled={loading}
          className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : result ? (
            <RefreshCw className="w-3.5 h-3.5" />
          ) : (
            <Brain className="w-3.5 h-3.5" />
          )}
          {loading ? t("generating") : result ? t("refresh") : t("generateReport")}
        </button>
      </div>

      {!result && !loading && (
        <p className="text-sm text-gray-400 dark:text-white/40">{t("description")}</p>
      )}

      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-5/6" />
        </div>
      )}

      {result && !loading && (
        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-white/70">
          {result.split("\n").map((line, i) => {
            if (line.startsWith("## ")) return <h3 key={i} className="text-base font-semibold text-gray-900 dark:text-white mt-4 mb-2">{line.replace("## ", "")}</h3>;
            if (line.startsWith("### ")) return <h4 key={i} className="text-sm font-semibold text-gray-800 dark:text-white/80 mt-3 mb-1">{line.replace("### ", "")}</h4>;
            if (line.startsWith("- ")) return <li key={i} className="text-sm ms-4">{line.replace("- ", "")}</li>;
            if (line.startsWith("**")) return <p key={i} className="text-sm font-semibold">{line.replace(/\*\*/g, "")}</p>;
            if (line.trim() === "") return <br key={i} />;
            return <p key={i} className="text-sm">{line}</p>;
          })}
        </div>
      )}
    </div>
  );
}
