"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Loader2, RefreshCw, Check } from "lucide-react";
import { sileo } from "sileo";

interface Props {
  context: string; // e.g. destination name, field context
  fieldName: string; // which field this generates for
  onAccept: (text: string) => void;
  clienteId: string;
}

export default function AIDescriptionButton({ context, fieldName, onAccept, clienteId }: Props) {
  const t = useTranslations("ai.description");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [tone, setTone] = useState("profesional");
  const [length, setLength] = useState("media");
  const [lang, setLang] = useState("es");

  const TONES = ["profesional", "inspirador", "aventurero", "romantico", "familiar"];
  const LENGTHS = ["corta", "media", "larga"];
  const LANGS = ["es", "en", "ar"];

  const generate = async () => {
    setLoading(true);
    setResult("");
    try {
      const lengthWords = { corta: 50, media: 100, larga: 200 }[length] || 100;
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-description",
          data: {
            prompt: `Genera una descripción para: "${context}" (campo: ${fieldName}).
Tono: ${tone}
Longitud: aproximadamente ${lengthWords} palabras
Idioma: ${lang === "es" ? "español" : lang === "en" ? "inglés" : "árabe"}`,
          },
          clienteId,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      setResult(json.result);
    } catch (e: any) {
      setResult(`⚠️ ${e.message || t("errorGeneric")}`);
      sileo.error({ title: "Error al generar descripción" });
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-700 transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5" />
        {t("generateWithAI")}
      </button>
    );
  }

  return (
    <div className="mt-2 p-4 rounded-xl border border-drb-turquoise-200 dark:border-drb-turquoise-500/20 bg-drb-turquoise-50/50 dark:bg-drb-turquoise-500/5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-drb-turquoise-500" />
          {t("aiGenerator")}
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          {t("close")}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Tone */}
        <div className="flex gap-1">
          {TONES.map((tn) => (
            <button
              key={tn}
              type="button"
              onClick={() => setTone(tn)}
              className={`px-2 py-1 rounded-lg text-xs transition-all ${
                tone === tn
                  ? "bg-drb-turquoise-500 text-white"
                  : "bg-white dark:bg-white/10 text-gray-500 dark:text-white/50"
              }`}
            >
              {t(`tones.${tn}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {/* Length */}
        <select
          value={length}
          onChange={(e) => setLength(e.target.value)}
          className="panel-input text-xs py-1"
        >
          {LENGTHS.map((l) => (
            <option key={l} value={l}>{t(`lengths.${l}`)}</option>
          ))}
        </select>
        {/* Lang */}
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="panel-input text-xs py-1"
        >
          {LANGS.map((l) => (
            <option key={l} value={l}>{l.toUpperCase()}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="btn-primary text-xs px-3 py-1 flex items-center gap-1"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {t("generate")}
        </button>
      </div>

      {result && (
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-white dark:bg-white/[0.06] text-sm text-gray-700 dark:text-white/70 border border-gray-200 dark:border-white/10">
            {result}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { onAccept(result); setOpen(false); }}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
            >
              <Check className="w-3.5 h-3.5" />
              {t("useText")}
            </button>
            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t("regenerate")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
