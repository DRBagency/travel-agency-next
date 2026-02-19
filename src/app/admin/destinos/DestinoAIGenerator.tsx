"use client";

import { useState } from "react";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface GeneratedData {
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  itinerario: any;
}

interface DestinoAIGeneratorProps {
  onGenerated: (data: GeneratedData) => void;
}

export default function DestinoAIGenerator({ onGenerated }: DestinoAIGeneratorProps) {
  const t = useTranslations("admin.destinos");
  const [open, setOpen] = useState(false);
  const [destino, setDestino] = useState("");
  const [duracion, setDuracion] = useState(5);
  const [estilo, setEstilo] = useState("cultural");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!destino.trim()) return;
    setLoading(true);

    try {
      const [itineraryResult, imageResult] = await Promise.allSettled([
        fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "generate-itinerary",
            country: destino,
            duration: duracion,
            style: estilo,
            budget: "medio",
            groupType: "pareja",
            travelers: 2,
          }),
        }).then((r) => r.json()),
        fetch(`/api/admin/unsplash/search?q=${encodeURIComponent(destino + " travel")}`).then((r) =>
          r.json()
        ),
      ]);

      const itinerary =
        itineraryResult.status === "fulfilled" ? itineraryResult.value : null;
      const images =
        imageResult.status === "fulfilled" ? imageResult.value : null;

      const priceStr = itinerary?.precio_total_estimado || itinerary?.estimated_price || "";
      const precio = parseFloat(String(priceStr).replace(/[^0-9.]/g, "")) || 0;

      const bestSeason = itinerary?.mejor_epoca || itinerary?.best_season || "";
      const clima = itinerary?.clima || itinerary?.weather || "";
      const tips = itinerary?.tips_generales || itinerary?.general_tips || [];
      const firstTip = Array.isArray(tips) ? tips[0] || "" : String(tips);

      const descripcionParts = [bestSeason, clima, firstTip].filter(Boolean);
      const descripcion =
        descripcionParts.length > 0
          ? descripcionParts.join(". ").slice(0, 300)
          : "";

      const imagenUrl = images?.photos?.[0]?.url_regular || "";

      onGenerated({
        nombre: destino,
        descripcion,
        precio,
        imagenUrl,
        itinerario: itinerary,
      });

      setOpen(false);
    } catch {
      // silently fail
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
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="panel-label">{t("aiDestination")}</label>
              <input
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="panel-input w-full"
                placeholder="Valencia, Japón, Maldivas..."
              />
            </div>
            <div>
              <label className="panel-label">{t("aiDuration")}</label>
              <input
                type="number"
                min={1}
                max={30}
                value={duracion}
                onChange={(e) => setDuracion(Number(e.target.value) || 5)}
                className="panel-input w-full"
              />
            </div>
            <div>
              <label className="panel-label">{t("aiStyle")}</label>
              <select
                value={estilo}
                onChange={(e) => setEstilo(e.target.value)}
                className="panel-input w-full"
              >
                <option value="relax">{t("styleRelax")}</option>
                <option value="cultural">{t("styleCultural")}</option>
                <option value="aventura">{t("styleAdventure")}</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !destino.trim()}
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
