"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { sileo } from "sileo";
import {
  Sparkles,
  MapPin,
  Clock,
  Sun,
  Sunset,
  Moon,
  DollarSign,
  Thermometer,
  Calendar,
  Lightbulb,
  Loader2,
  Save,
  Download,
  ChevronDown,
  Users,
  Compass,
  Heart,
  Briefcase,
  UtensilsCrossed,
  Landmark,
  Waves,
  Mountain,
  Building,
  Camera,
  ShoppingBag,
  Music,
  BookOpen,
  Pencil,
  Check,
} from "lucide-react";

interface ItineraryDay {
  dia: number;
  titulo: string;
  actividades: {
    manana: Activity;
    tarde: Activity;
    noche: Activity;
  };
  tip_local: string;
}

interface Activity {
  titulo: string;
  descripcion: string;
  precio_estimado: string;
  duracion: string;
  tipo: string;
}

interface ItineraryResult {
  dias: ItineraryDay[];
  precio_total_estimado: string;
  mejor_epoca: string;
  clima: string;
  tips_generales: string[];
  que_llevar: string[];
}

const ESTILOS = [
  { value: "relax", icon: Waves },
  { value: "aventura", icon: Mountain },
  { value: "cultural", icon: Landmark },
  { value: "lujo", icon: Sparkles },
  { value: "naturaleza", icon: Compass },
  { value: "ciudad", icon: Building },
];

const INTERESES = [
  { value: "gastronomia", icon: UtensilsCrossed },
  { value: "historia", icon: BookOpen },
  { value: "playa", icon: Waves },
  { value: "senderismo", icon: Mountain },
  { value: "museos", icon: Landmark },
  { value: "compras", icon: ShoppingBag },
  { value: "fotografia", icon: Camera },
  { value: "vida_nocturna", icon: Music },
];

const PRESUPUESTOS = ["economico", "medio", "premium", "lujo"];
const TIPOS_GRUPO = ["solo", "pareja", "familia", "amigos", "negocios"];

const ACTIVITY_ICONS: Record<string, any> = {
  cultura: Landmark,
  naturaleza: Mountain,
  gastronomia: UtensilsCrossed,
  relax: Waves,
  aventura: Compass,
  compras: ShoppingBag,
};

interface Props {
  clienteId: string;
  onSaved?: () => void;
}

export default function ItineraryGenerator({ clienteId }: Props) {
  const t = useTranslations("ai.itinerarios");

  const [form, setForm] = useState({
    pais: "",
    duracion: 5,
    estilo: "cultural",
    intereses: ["gastronomia", "historia"] as string[],
    presupuesto: "medio",
    tipo_grupo: "pareja",
    num_viajeros: 2,
    notas: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ItineraryResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [editMode, setEditMode] = useState(false);

  const updateDay = (idx: number, field: string, value: string) => {
    if (!result) return;
    setSaved(false);
    setResult({
      ...result,
      dias: result.dias.map((d, i) =>
        i === idx ? { ...d, [field]: value } : d
      ),
    });
  };

  const updateActivity = (dayIdx: number, period: "manana" | "tarde" | "noche", field: string, value: string) => {
    if (!result) return;
    setSaved(false);
    setResult({
      ...result,
      dias: result.dias.map((d, i) =>
        i === dayIdx
          ? {
              ...d,
              actividades: {
                ...d.actividades,
                [period]: { ...d.actividades[period], [field]: value },
              },
            }
          : d
      ),
    });
  };

  const updateSummary = (field: string, value: string) => {
    if (!result) return;
    setSaved(false);
    setResult({ ...result, [field]: value });
  };

  const updateTip = (idx: number, value: string) => {
    if (!result) return;
    setSaved(false);
    setResult({
      ...result,
      tips_generales: result.tips_generales.map((t, i) => (i === idx ? value : t)),
    });
  };

  const updatePackItem = (idx: number, value: string) => {
    if (!result) return;
    setSaved(false);
    setResult({
      ...result,
      que_llevar: result.que_llevar.map((t, i) => (i === idx ? value : t)),
    });
  };

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      intereses: prev.intereses.includes(interest)
        ? prev.intereses.filter((i) => i !== interest)
        : [...prev.intereses, interest],
    }));
  };

  const generate = async () => {
    if (!form.pais.trim()) {
      setError(t("errorNoCountry"));
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setSaved(false);

    try {
      const prompt = `Genera un itinerario de viaje:
- Destino: ${form.pais}
- Duración: ${form.duracion} días
- Estilo: ${form.estilo}
- Intereses: ${form.intereses.join(", ")}
- Presupuesto: ${form.presupuesto}
- Tipo de grupo: ${form.tipo_grupo}
- Número de viajeros: ${form.num_viajeros}
${form.notas ? `- Notas adicionales: ${form.notas}` : ""}`;

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-itinerary",
          data: { prompt },
          clienteId,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "AI request failed");

      // Strip markdown code fences if present (safety net)
      let raw = json.result;
      const fenceMatch = raw.trim().match(/^```(?:json|JSON)?\s*\n?([\s\S]*?)\n?\s*```$/);
      if (fenceMatch) raw = fenceMatch[1].trim();
      const parsed = JSON.parse(raw) as ItineraryResult;
      setResult(parsed);
      setExpandedDay(0);
    } catch (err: any) {
      setError(err.message || t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!result) return;
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    const addPage = () => {
      doc.addPage();
      y = 20;
    };

    const checkSpace = (needed: number) => {
      if (y + needed > 270) addPage();
    };

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(`${t("generate")} - ${form.pais}`, 14, y);
    y += 10;

    // Summary
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${t("estimatedPrice")}: ${result.precio_total_estimado}`, 14, y);
    y += 6;
    doc.text(`${t("bestSeason")}: ${result.mejor_epoca}`, 14, y);
    y += 6;
    doc.text(`${t("weather")}: ${result.clima}`, 14, y);
    y += 12;

    // Days
    for (const dia of result.dias) {
      checkSpace(50);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${t("dayLabel", { n: dia.dia })} - ${dia.titulo}`, 14, y);
      y += 8;

      const periods = [
        { label: t("morning"), act: dia.actividades.manana },
        { label: t("afternoon"), act: dia.actividades.tarde },
        { label: t("night"), act: dia.actividades.noche },
      ];

      for (const { label, act } of periods) {
        checkSpace(20);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${label}: ${act.titulo}`, 18, y);
        y += 5;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(act.descripcion, pageWidth - 36);
        doc.text(lines, 18, y);
        y += lines.length * 4 + 2;
        if (act.precio_estimado) {
          doc.text(`~${act.precio_estimado} | ${act.duracion}`, 18, y);
          y += 5;
        }
      }

      if (dia.tip_local) {
        checkSpace(12);
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        const tipLines = doc.splitTextToSize(`Tip: ${dia.tip_local}`, pageWidth - 36);
        doc.text(tipLines, 18, y);
        y += tipLines.length * 4 + 4;
      }

      y += 4;
    }

    // Tips
    if (result.tips_generales?.length) {
      checkSpace(20);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(t("generalTips"), 14, y);
      y += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      for (const tip of result.tips_generales) {
        checkSpace(8);
        const lines = doc.splitTextToSize(`- ${tip}`, pageWidth - 28);
        doc.text(lines, 18, y);
        y += lines.length * 4 + 2;
      }
      y += 4;
    }

    // Packing list
    if (result.que_llevar?.length) {
      checkSpace(20);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(t("whatToBring"), 14, y);
      y += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      for (const item of result.que_llevar) {
        checkSpace(6);
        doc.text(`- ${item}`, 18, y);
        y += 5;
      }
    }

    doc.save(`itinerario-${form.pais.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };

  const saveItinerary = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const res = await fetch("/api/ai/save-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId,
          pais: form.pais,
          duracion: form.duracion,
          estilo: form.estilo,
          intereses: form.intereses,
          presupuesto: form.presupuesto,
          tipo_grupo: form.tipo_grupo,
          num_viajeros: form.num_viajeros,
          itinerario: result,
          precio_estimado: result.precio_total_estimado,
        }),
      });
      if (res.ok) {
        setSaved(true);
        sileo.success({ title: t("saveSuccess") });
      } else {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || t("saveError"));
      }
    } catch (err: any) {
      sileo.error({ title: err.message || t("saveError") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="panel-card p-6">
        <div className="grid gap-6">
          {/* Country + Duration */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="panel-label">{t("country")}</label>
              <div className="relative">
                <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={form.pais}
                  onChange={(e) => setForm({ ...form, pais: e.target.value })}
                  className="panel-input w-full ps-10"
                  placeholder={t("countryPlaceholder")}
                />
              </div>
            </div>
            <div>
              <label className="panel-label">{t("duration")}</label>
              <div className="relative">
                <Clock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={form.duracion}
                  onChange={(e) => setForm({ ...form, duracion: Number(e.target.value) })}
                  className="panel-input w-full ps-10"
                />
              </div>
            </div>
          </div>

          {/* Travel style */}
          <div>
            <label className="panel-label">{t("style")}</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {ESTILOS.map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, estilo: value })}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                    form.estilo === value
                      ? "border-drb-turquoise-500 bg-drb-turquoise-50 dark:bg-drb-turquoise-500/10 text-drb-turquoise-600 dark:text-drb-turquoise-400"
                      : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 hover:border-gray-300 dark:hover:border-white/20"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{t(`styles.${value}`)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="panel-label">{t("interests")}</label>
            <div className="flex flex-wrap gap-2">
              {INTERESES.map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleInterest(value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-all ${
                    form.intereses.includes(value)
                      ? "border-drb-turquoise-500 bg-drb-turquoise-50 dark:bg-drb-turquoise-500/10 text-drb-turquoise-600 dark:text-drb-turquoise-400"
                      : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t(`interestLabels.${value}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Budget + Group type + Travelers */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="panel-label">{t("budget")}</label>
              <select
                value={form.presupuesto}
                onChange={(e) => setForm({ ...form, presupuesto: e.target.value })}
                className="panel-input w-full"
              >
                {PRESUPUESTOS.map((p) => (
                  <option key={p} value={p}>{t(`budgets.${p}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="panel-label">{t("groupType")}</label>
              <select
                value={form.tipo_grupo}
                onChange={(e) => setForm({ ...form, tipo_grupo: e.target.value })}
                className="panel-input w-full"
              >
                {TIPOS_GRUPO.map((g) => (
                  <option key={g} value={g}>{t(`groups.${g}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="panel-label">{t("travelers")}</label>
              <div className="relative">
                <Users className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.num_viajeros}
                  onChange={(e) => setForm({ ...form, num_viajeros: Number(e.target.value) })}
                  className="panel-input w-full ps-10"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="panel-label">{t("notes")}</label>
            <textarea
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              className="panel-input w-full min-h-[80px]"
              placeholder={t("notesPlaceholder")}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 py-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("generating")}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {t("generate")}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="panel-card p-6 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-white/10 rounded w-1/3 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="panel-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 dark:text-white/40">{t("estimatedPrice")}</p>
                {editMode ? (
                  <input value={result.precio_total_estimado} onChange={(e) => updateSummary("precio_total_estimado", e.target.value)} className="panel-input text-sm font-bold mt-0.5 w-full" />
                ) : (
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{result.precio_total_estimado}</p>
                )}
              </div>
            </div>
            <div className="panel-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/15 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 dark:text-white/40">{t("bestSeason")}</p>
                {editMode ? (
                  <input value={result.mejor_epoca} onChange={(e) => updateSummary("mejor_epoca", e.target.value)} className="panel-input text-sm mt-0.5 w-full" />
                ) : (
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{result.mejor_epoca}</p>
                )}
              </div>
            </div>
            <div className="panel-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 dark:text-white/40">{t("weather")}</p>
                {editMode ? (
                  <input value={result.clima} onChange={(e) => updateSummary("clima", e.target.value)} className="panel-input text-sm mt-0.5 w-full" />
                ) : (
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{result.clima}</p>
                )}
              </div>
            </div>
          </div>

          {/* Day-by-day timeline */}
          <div className="space-y-3">
            {result.dias.map((dia, idx) => (
              <div key={dia.dia} className="panel-card overflow-hidden">
                <button
                  onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-start"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center text-drb-turquoise-600 dark:text-drb-turquoise-400 font-bold text-sm">
                      {dia.dia}
                    </div>
                    <div className="flex-1 min-w-0">
                      {editMode ? (
                        <input
                          value={dia.titulo}
                          onChange={(e) => { e.stopPropagation(); updateDay(idx, "titulo", e.target.value); }}
                          onClick={(e) => e.stopPropagation()}
                          className="panel-input text-sm font-semibold w-full"
                        />
                      ) : (
                        <h3 className="font-semibold text-gray-900 dark:text-white">{dia.titulo}</h3>
                      )}
                      <p className="text-xs text-gray-400 dark:text-white/40">{t("dayLabel", { n: dia.dia })}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedDay === idx ? "rotate-180" : ""}`} />
                </button>

                {expandedDay === idx && (
                  <div className="px-4 pb-4 space-y-3 border-t border-gray-100 dark:border-white/[0.06] pt-4">
                    {/* Morning */}
                    <ActivityCard
                      period={t("morning")}
                      icon={<Sun className="w-4 h-4" />}
                      activity={dia.actividades.manana}
                      color="amber"
                      editMode={editMode}
                      onUpdate={(field, value) => updateActivity(idx, "manana", field, value)}
                    />
                    {/* Afternoon */}
                    <ActivityCard
                      period={t("afternoon")}
                      icon={<Sunset className="w-4 h-4" />}
                      activity={dia.actividades.tarde}
                      color="orange"
                      editMode={editMode}
                      onUpdate={(field, value) => updateActivity(idx, "tarde", field, value)}
                    />
                    {/* Night */}
                    <ActivityCard
                      period={t("night")}
                      icon={<Moon className="w-4 h-4" />}
                      activity={dia.actividades.noche}
                      color="indigo"
                      editMode={editMode}
                      onUpdate={(field, value) => updateActivity(idx, "noche", field, value)}
                    />
                    {/* Local tip */}
                    {(dia.tip_local || editMode) && (
                      <div className="flex items-start gap-2 mt-2 p-3 rounded-xl bg-drb-lime-50 dark:bg-drb-lime-500/10 border border-drb-lime-200 dark:border-drb-lime-500/20">
                        <Lightbulb className="w-4 h-4 text-drb-lime-600 dark:text-drb-lime-400 mt-0.5 shrink-0" />
                        {editMode ? (
                          <input value={dia.tip_local} onChange={(e) => updateDay(idx, "tip_local", e.target.value)} className="panel-input text-sm flex-1" />
                        ) : (
                          <p className="text-sm text-drb-lime-800 dark:text-drb-lime-300">{dia.tip_local}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tips and packing list */}
          {(result.tips_generales?.length > 0 || result.que_llevar?.length > 0) && (
            <div className="grid md:grid-cols-2 gap-4">
              {result.tips_generales?.length > 0 && (
                <div className="panel-card p-5">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-drb-turquoise-500" />
                    {t("generalTips")}
                  </h4>
                  <ul className="space-y-2">
                    {result.tips_generales.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-white/60">
                        <span className="text-drb-turquoise-500 mt-1 shrink-0">-</span>
                        {editMode ? (
                          <input value={tip} onChange={(e) => updateTip(i, e.target.value)} className="panel-input text-sm flex-1" />
                        ) : (
                          tip
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.que_llevar?.length > 0 && (
                <div className="panel-card p-5">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-drb-turquoise-500" />
                    {t("whatToBring")}
                  </h4>
                  <ul className="space-y-2">
                    {result.que_llevar.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-white/60">
                        <span className="text-drb-turquoise-500 mt-1 shrink-0">-</span>
                        {editMode ? (
                          <input value={item} onChange={(e) => updatePackItem(i, e.target.value)} className="panel-input text-sm flex-1" />
                        ) : (
                          item
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                editMode
                  ? "border-drb-turquoise-500 bg-drb-turquoise-50 dark:bg-drb-turquoise-500/10 text-drb-turquoise-600 dark:text-drb-turquoise-400"
                  : "border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/10"
              }`}
            >
              {editMode ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
              {editMode ? t("doneEditing") : t("editItinerary")}
            </button>
            <button
              onClick={saveItinerary}
              disabled={saving || saved}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saved ? t("saved") : t("saveItinerary")}
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              {t("downloadPdf")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityCard({
  period,
  icon,
  activity,
  color,
  editMode = false,
  onUpdate,
}: {
  period: string;
  icon: React.ReactNode;
  activity: Activity;
  color: string;
  editMode?: boolean;
  onUpdate?: (field: string, value: string) => void;
}) {
  const colorMap: Record<string, string> = {
    amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    orange: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
    indigo: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03]">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium ${colorMap[color]?.split(" ").slice(2).join(" ")}`}>{period}</span>
          {editMode ? (
            <input value={activity.duracion} onChange={(e) => onUpdate?.("duracion", e.target.value)} className="panel-input text-xs w-24" />
          ) : (
            activity.duracion && <span className="text-xs text-gray-400 dark:text-white/30">{activity.duracion}</span>
          )}
        </div>
        {editMode ? (
          <div className="space-y-1.5">
            <input value={activity.titulo} onChange={(e) => onUpdate?.("titulo", e.target.value)} className="panel-input text-sm font-semibold w-full" />
            <textarea value={activity.descripcion} onChange={(e) => onUpdate?.("descripcion", e.target.value)} className="panel-input text-xs w-full min-h-[40px]" />
            <input value={activity.precio_estimado} onChange={(e) => onUpdate?.("precio_estimado", e.target.value)} className="panel-input text-xs w-32" placeholder="Precio" />
          </div>
        ) : (
          <>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{activity.titulo}</h4>
            <p className="text-xs text-gray-500 dark:text-white/50 mt-0.5">{activity.descripcion}</p>
            {activity.precio_estimado && (
              <p className="text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 mt-1">
                ~{activity.precio_estimado}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
