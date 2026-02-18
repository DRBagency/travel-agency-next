"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Loader2, Check, RefreshCw, Eye } from "lucide-react";

interface Props {
  clienteId: string;
  onAccept: (html: string) => void;
}

export default function AIEmailGenerator({ clienteId, onAccept }: Props) {
  const t = useTranslations("ai.email");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [preview, setPreview] = useState(false);

  const [tipo, setTipo] = useState("confirmacion");
  const [tono, setTono] = useState("profesional");
  const [nombre, setNombre] = useState("");
  const [destino, setDestino] = useState("");

  const TIPOS = ["bienvenida", "confirmacion", "recordatorio", "promocion", "seguimiento"];
  const TONOS = ["formal", "cercano", "promocional"];

  const generate = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "draft-email",
          data: {
            prompt: `Genera un email HTML de tipo "${tipo}" con tono "${tono}".
${nombre ? `Nombre del destinatario: ${nombre}` : ""}
${destino ? `Destino: ${destino}` : ""}
El email debe ser profesional, atractivo y con estilos inline.`,
          },
          clienteId,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      setResult(json.result);
    } catch (e: any) {
      setResult(`<p style="color:red">⚠️ ${e.message || t("errorGeneric")}</p>`);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-700 px-3 py-2 rounded-xl border border-drb-turquoise-200 dark:border-drb-turquoise-500/20 hover:bg-drb-turquoise-50 dark:hover:bg-drb-turquoise-500/5 transition-all"
      >
        <Sparkles className="w-4 h-4" />
        {t("generateWithAI")}
      </button>
    );
  }

  return (
    <div className="panel-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-drb-turquoise-500" />
          {t("aiEmailTitle")}
        </h3>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-gray-400 hover:text-gray-600">
          {t("close")}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="panel-label">{t("emailType")}</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="panel-input w-full">
            {TIPOS.map((tp) => (
              <option key={tp} value={tp}>{t(`types.${tp}`)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="panel-label">{t("tone")}</label>
          <select value={tono} onChange={(e) => setTono(e.target.value)} className="panel-input w-full">
            {TONOS.map((tn) => (
              <option key={tn} value={tn}>{t(`tones.${tn}`)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="panel-label">{t("recipientName")}</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="panel-input w-full" placeholder={t("namePlaceholder")} />
        </div>
        <div>
          <label className="panel-label">{t("destination")}</label>
          <input value={destino} onChange={(e) => setDestino(e.target.value)} className="panel-input w-full" placeholder={t("destinationPlaceholder")} />
        </div>
      </div>

      <button onClick={generate} disabled={loading} className="btn-primary flex items-center gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {t("generate")}
      </button>

      {result && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              <Eye className="w-3.5 h-3.5" />
              {preview ? t("showCode") : t("showPreview")}
            </button>
          </div>

          {preview ? (
            <div className="p-4 rounded-xl bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/10">
              <div dangerouslySetInnerHTML={{ __html: result }} />
            </div>
          ) : (
            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="panel-input w-full min-h-[200px] font-mono text-xs"
            />
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { onAccept(result); setOpen(false); }}
              className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400"
            >
              <Check className="w-4 h-4" />
              {t("useEmail")}
            </button>
            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <RefreshCw className="w-4 h-4" />
              {t("regenerate")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
