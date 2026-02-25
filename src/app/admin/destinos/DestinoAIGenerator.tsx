"use client";

import { useState } from "react";
import { sileo } from "sileo";
import {
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Users,
  Waves,
  Mountain,
  Landmark,
  Compass,
  Building,
  UtensilsCrossed,
  BookOpen,
  ShoppingBag,
  Camera,
  Music,
} from "lucide-react";
import { useTranslations } from "next-intl";

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

interface GeneratedData {
  nombre: string;
  descripcion: string;
  descripcion_larga: string;
  subtitle: string;
  tagline: string;
  badge: string;
  pais: string;
  continente: string;
  categoria: string;
  dificultad: string;
  duracion: string;
  esfuerzo: number;
  grupo_max: number;
  edad_min: number;
  edad_max: number;
  precio: number;
  precio_original: number;
  imagenUrl: string;
  tags: string[];
  highlights: string[];
  clima: any;
  hotel: any;
  vuelos: any;
  coordinador: any;
  incluido: string[];
  no_incluido: string[];
  faqs: any[];
  itinerario: any;
}

interface DestinoAIGeneratorProps {
  clienteId: string;
  onGenerated: (data: GeneratedData) => void;
}

export default function DestinoAIGenerator({ clienteId, onGenerated }: DestinoAIGeneratorProps) {
  const t = useTranslations("admin.destinos");
  const ti = useTranslations("ai.itinerarios");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      intereses: prev.intereses.includes(interest)
        ? prev.intereses.filter((i) => i !== interest)
        : [...prev.intereses, interest],
    }));
  };

  const handleGenerate = async () => {
    if (!form.pais.trim()) return;
    setLoading(true);

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

      const [itineraryResult, imageResult] = await Promise.allSettled([
        fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "generate-itinerary",
            data: { prompt },
            clienteId,
          }),
        }).then(async (r) => {
          const json = await r.json();
          if (!r.ok) throw new Error(json.error || "AI request failed");
          let raw = json.result;
          const fenceMatch = raw.trim().match(/^```(?:json|JSON)?\s*\n?([\s\S]*?)\n?\s*```$/);
          if (fenceMatch) raw = fenceMatch[1].trim();
          return JSON.parse(raw);
        }),
        fetch(`/api/admin/unsplash/search?q=${encodeURIComponent(form.pais + " travel")}`).then((r) =>
          r.json()
        ),
      ]);

      const itinerary =
        itineraryResult.status === "fulfilled" ? itineraryResult.value : null;
      const images =
        imageResult.status === "fulfilled" ? imageResult.value : null;

      const priceStr = itinerary?.precio_total_estimado || itinerary?.estimated_price || "";
      const precio = parseFloat(String(priceStr).replace(/[^0-9.]/g, "")) || 0;

      const precioOriginalStr = itinerary?.precio_original || "";
      const precioOriginal = parseFloat(String(precioOriginalStr).replace(/[^0-9.]/g, "")) || 0;

      const imagenUrl = images?.photos?.[0]?.url_regular || "";

      onGenerated({
        nombre: itinerary?.nombre || form.pais,
        descripcion: itinerary?.descripcion || "",
        descripcion_larga: itinerary?.descripcion_larga || "",
        subtitle: itinerary?.subtitle || "",
        tagline: itinerary?.tagline || "",
        badge: itinerary?.badge || "",
        pais: itinerary?.pais || form.pais,
        continente: itinerary?.continente || "",
        categoria: itinerary?.categoria || "",
        dificultad: itinerary?.dificultad || "",
        duracion: itinerary?.duracion || `${form.duracion} noches`,
        esfuerzo: Number(itinerary?.esfuerzo) || 0,
        grupo_max: Number(itinerary?.grupo_max) || 0,
        edad_min: Number(itinerary?.edad_min) || 0,
        edad_max: Number(itinerary?.edad_max) || 0,
        precio,
        precio_original: precioOriginal,
        imagenUrl,
        tags: Array.isArray(itinerary?.tags) ? itinerary.tags : [],
        highlights: Array.isArray(itinerary?.highlights) ? itinerary.highlights : [],
        clima: itinerary?.clima || null,
        hotel: itinerary?.hotel || null,
        vuelos: itinerary?.vuelos || null,
        coordinador: itinerary?.coordinador || null,
        incluido: Array.isArray(itinerary?.incluido) ? itinerary.incluido : [],
        no_incluido: Array.isArray(itinerary?.no_incluido) ? itinerary.no_incluido : [],
        faqs: Array.isArray(itinerary?.faqs) ? itinerary.faqs : [],
        itinerario: itinerary?.itinerario || itinerary,
      });

      sileo.success({ title: t("aiGenerated") });
      setOpen(false);
    } catch {
      sileo.error({ title: ti("errorGeneric") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-dashed border-drb-turquoise-300 dark:border-drb-turquoise-500/30 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 text-start hover:bg-drb-turquoise-50/50 dark:hover:bg-drb-turquoise-500/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-drb-turquoise-500" />
          <span className="text-sm font-semibold text-drb-turquoise-700 dark:text-drb-turquoise-400">
            {t("generateWithAI")}
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-drb-turquoise-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-drb-turquoise-500" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 pt-2 border-t border-dashed border-drb-turquoise-200 dark:border-drb-turquoise-500/20 space-y-4">
          {/* Country + Duration */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="panel-label">{ti("country")}</label>
              <div className="relative">
                <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={form.pais}
                  onChange={(e) => setForm({ ...form, pais: e.target.value })}
                  className="panel-input w-full ps-10"
                  placeholder={ti("countryPlaceholder")}
                />
              </div>
            </div>
            <div>
              <label className="panel-label">{ti("duration")}</label>
              <div className="relative">
                <Clock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={form.duracion}
                  onChange={(e) => setForm({ ...form, duracion: Number(e.target.value) || 5 })}
                  className="panel-input w-full ps-10"
                />
              </div>
            </div>
          </div>

          {/* Travel style - icon button grid */}
          <div>
            <label className="panel-label">{ti("style")}</label>
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
                  <span className="text-xs font-medium">{ti(`styles.${value}`)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interests - multi-select toggles */}
          <div>
            <label className="panel-label">{ti("interests")}</label>
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
                  {ti(`interestLabels.${value}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Budget + Group type + Travelers */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="panel-label">{ti("budget")}</label>
              <select
                value={form.presupuesto}
                onChange={(e) => setForm({ ...form, presupuesto: e.target.value })}
                className="panel-input w-full"
              >
                {PRESUPUESTOS.map((p) => (
                  <option key={p} value={p}>{ti(`budgets.${p}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="panel-label">{ti("groupType")}</label>
              <select
                value={form.tipo_grupo}
                onChange={(e) => setForm({ ...form, tipo_grupo: e.target.value })}
                className="panel-input w-full"
              >
                {TIPOS_GRUPO.map((g) => (
                  <option key={g} value={g}>{ti(`groups.${g}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="panel-label">{ti("travelers")}</label>
              <div className="relative">
                <Users className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.num_viajeros}
                  onChange={(e) => setForm({ ...form, num_viajeros: Number(e.target.value) || 2 })}
                  className="panel-input w-full ps-10"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="panel-label">{ti("notes")}</label>
            <textarea
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              className="panel-input w-full min-h-[80px]"
              placeholder={ti("notesPlaceholder")}
            />
          </div>

          {/* Generate button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !form.pais.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-drb-turquoise-500 to-drb-turquoise-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("aiGenerating")}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {t("generateAll")}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
