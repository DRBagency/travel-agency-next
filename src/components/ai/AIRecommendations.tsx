"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb, Loader2, RefreshCw } from "lucide-react";

interface Props {
  clientData: string;
}

export default function AIRecommendations({ clientData }: Props) {
  const t = useTranslations("ai.recommendations");
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
          action: "ai-recommendations",
          data: {
            prompt: `Analiza los datos de este cliente y genera recomendaciones personalizadas:\n\n${clientData}`,
          },
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

  // Auto-generate on mount
  useEffect(() => {
    generate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="panel-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          {t("title")}
        </h2>
        {result && !loading && (
          <button
            onClick={generate}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t("refresh")}
          </button>
        )}
      </div>

      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
        </div>
      )}

      {result && !loading && (
        <div className="text-sm text-gray-700 dark:text-white/70 space-y-1">
          {result.split("\n").map((line, i) => {
            if (line.startsWith("## ")) return <h3 key={i} className="text-base font-semibold text-gray-900 dark:text-white mt-3 mb-1">{line.replace("## ", "")}</h3>;
            if (line.startsWith("### ")) return <h4 key={i} className="text-sm font-semibold text-gray-800 dark:text-white/80 mt-2">{line.replace("### ", "")}</h4>;
            if (line.startsWith("- ")) return <li key={i} className="ms-4">{line.replace("- ", "")}</li>;
            if (line.trim() === "") return <br key={i} />;
            return <p key={i}>{line}</p>;
          })}
        </div>
      )}
    </div>
  );
}
