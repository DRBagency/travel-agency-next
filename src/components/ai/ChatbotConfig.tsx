"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Bot, Save, Loader2, Plus, Trash2, Lightbulb } from "lucide-react";
import { sileo } from "sileo";

interface FAQ {
  question: string;
  answer: string;
}

interface ChatbotConfigData {
  id?: string;
  nombre_bot: string;
  personalidad: string;
  info_agencia: string;
  faqs: FAQ[];
  idiomas: string[];
  activo: boolean;
}

interface Props {
  clienteId: string;
  initialConfig: ChatbotConfigData | null;
  destinos: string[];
}

export default function ChatbotConfig({ clienteId, initialConfig, destinos }: Props) {
  const t = useTranslations("ai.chatbot");

  const [config, setConfig] = useState<ChatbotConfigData>(
    initialConfig || {
      nombre_bot: "Asistente de Viajes",
      personalidad: "cercano",
      info_agencia: "",
      faqs: [],
      idiomas: ["es"],
      activo: true,
    }
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const addFaq = () => {
    setConfig((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const removeFaq = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== idx),
    }));
  };

  const updateFaq = (idx: number, field: "question" | "answer", value: string) => {
    setConfig((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => (i === idx ? { ...faq, [field]: value } : faq)),
    }));
  };

  const toggleIdioma = (lang: string) => {
    setConfig((prev) => ({
      ...prev,
      idiomas: prev.idiomas.includes(lang)
        ? prev.idiomas.filter((l) => l !== lang)
        : [...prev.idiomas, lang],
    }));
  };

  const addSuggestedFaq = (questionKey: string, answerKey: string) => {
    setConfig((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        { question: t(questionKey), answer: t(answerKey) },
      ],
    }));
  };

  const FAQ_SUGGESTIONS = [
    { qKey: "faqSuggestion1q", aKey: "faqSuggestion1a" },
    { qKey: "faqSuggestion2q", aKey: "faqSuggestion2a" },
    { qKey: "faqSuggestion3q", aKey: "faqSuggestion3a" },
    { qKey: "faqSuggestion4q", aKey: "faqSuggestion4a" },
    { qKey: "faqSuggestion5q", aKey: "faqSuggestion5a" },
    { qKey: "faqSuggestion6q", aKey: "faqSuggestion6a" },
  ];

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/ai/save-chatbot-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clienteId, config }),
      });
      if (res.ok) {
        setSaved(true);
        sileo.success({ title: "Configuración guardada" });
      }
    } catch {
      sileo.error({ title: "Error al guardar configuración" });
    } finally {
      setSaving(false);
    }
  };

  const PERSONALIDADES = ["formal", "cercano", "entusiasta"];
  const IDIOMAS = [
    { code: "es", label: "Español" },
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ];

  return (
    <div className="space-y-6">
      {/* General config */}
      <div className="panel-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("generalConfig")}</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="panel-label">{t("botName")}</label>
            <input
              value={config.nombre_bot}
              onChange={(e) => setConfig({ ...config, nombre_bot: e.target.value })}
              className="panel-input w-full"
              placeholder={t("botNamePlaceholder")}
            />
          </div>
          <div>
            <label className="panel-label">{t("personality")}</label>
            <div className="flex gap-2">
              {PERSONALIDADES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setConfig({ ...config, personalidad: p })}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                    config.personalidad === p
                      ? "border-drb-turquoise-500 bg-drb-turquoise-50 dark:bg-drb-turquoise-500/10 text-drb-turquoise-600 dark:text-drb-turquoise-400"
                      : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50"
                  }`}
                >
                  {t(`personalities.${p}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="panel-label">{t("agencyInfo")}</label>
          <textarea
            value={config.info_agencia}
            onChange={(e) => setConfig({ ...config, info_agencia: e.target.value })}
            className="panel-input w-full min-h-[100px]"
            placeholder={t("agencyInfoPlaceholder")}
          />
        </div>

        {/* Languages */}
        <div>
          <label className="panel-label">{t("languages")}</label>
          <div className="flex gap-2">
            {IDIOMAS.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => toggleIdioma(code)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  config.idiomas.includes(code)
                    ? "border-drb-turquoise-500 bg-drb-turquoise-50 dark:bg-drb-turquoise-500/10 text-drb-turquoise-600 dark:text-drb-turquoise-400"
                    : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Active toggle */}
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60">
          <input
            type="checkbox"
            checked={config.activo}
            onChange={(e) => setConfig({ ...config, activo: e.target.checked })}
            className="rounded"
          />
          {t("active")}
        </label>
      </div>

      {/* Destinations (auto-loaded) */}
      {destinos.length > 0 && (
        <div className="panel-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t("availableDestinations")}</h2>
          <p className="text-sm text-gray-400 dark:text-white/40 mb-3">{t("destinationsAutoLoaded")}</p>
          <div className="flex flex-wrap gap-2">
            {destinos.map((d) => (
              <span key={d} className="badge-info">{d}</span>
            ))}
          </div>
        </div>
      )}

      {/* FAQs */}
      <div className="panel-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("faqs")}</h2>
          <button
            type="button"
            onClick={addFaq}
            className="flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-700"
          >
            <Plus className="w-4 h-4" />
            {t("addFaq")}
          </button>
        </div>

        {config.faqs.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 dark:text-white/40">{t("noFaqs")}</p>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-white/50 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                {t("faqSuggestions")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {FAQ_SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => addSuggestedFaq(s.qKey, s.aKey)}
                    className="text-start p-3 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-white/60 hover:border-drb-turquoise-500 hover:text-drb-turquoise-600 dark:hover:text-drb-turquoise-400 transition-colors"
                  >
                    {t(s.qKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {config.faqs.map((faq, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400 dark:text-white/40">FAQ #{idx + 1}</span>
              <button
                type="button"
                onClick={() => removeFaq(idx)}
                className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input
              value={faq.question}
              onChange={(e) => updateFaq(idx, "question", e.target.value)}
              className="panel-input w-full"
              placeholder={t("faqQuestionPlaceholder")}
            />
            <textarea
              value={faq.answer}
              onChange={(e) => updateFaq(idx, "answer", e.target.value)}
              className="panel-input w-full min-h-[60px]"
              placeholder={t("faqAnswerPlaceholder")}
            />
          </div>
        ))}
      </div>

      {/* Save */}
      <button
        onClick={save}
        disabled={saving}
        className="btn-primary flex items-center gap-2"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {saved ? t("saved") : t("saveConfig")}
      </button>
    </div>
  );
}
