"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { isAILocked } from "@/lib/plan-gating";
import DestinoAIGenerator from "./DestinoAIGenerator";
import DestinoDescriptionField from "./DestinoDescriptionField";
import DestinoPriceFieldWithAI from "./DestinoPriceFieldWithAI";
import DestinoImageField from "./DestinoImageField";
import SubmitButton from "@/components/admin/SubmitButton";

interface DestinoCreateFormProps {
  action: (formData: FormData) => Promise<void>;
  clienteId: string;
  plan?: string;
  labels: {
    name: string;
    description: string;
    priceLabel: string;
    pricePlaceholder: string;
    descriptionPlaceholder: string;
    namePlaceholder: string;
    publishNow: string;
    saveDestination: string;
  };
}

export default function DestinoCreateForm({
  action,
  clienteId,
  plan,
  labels,
}: DestinoCreateFormProps) {
  const t = useTranslations("admin.destinos");
  const aiAvailable = !isAILocked(plan);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [imagenUrl, setImagenUrl] = useState("");
  const [itinerario, setItinerario] = useState<any>(null);
  const [activo, setActivo] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleAIGenerated = (data: {
    nombre: string;
    descripcion: string;
    precio: number;
    imagenUrl: string;
    itinerario: any;
  }) => {
    setNombre(data.nombre);
    setDescripcion(data.descripcion);
    setPrecio(data.precio);
    setImagenUrl(data.imagenUrl);
    setItinerario(data.itinerario);
  };

  const dias = itinerario?.dias || itinerario?.days || [];

  return (
    <details className="panel-card group">
      <summary className="flex items-center gap-3 p-6 cursor-pointer list-none">
        <div className="w-10 h-10 rounded-xl bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-drb-turquoise-600 dark:text-drb-turquoise-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {t("newDestination")}
          </h2>
          <p className="text-sm text-gray-400 dark:text-white/40">
            {t("clickToAdd")}
          </p>
        </div>
      </summary>

      <div className="px-6 pb-6 border-t border-gray-100 dark:border-white/[0.06] pt-6 space-y-5">
        {aiAvailable && <DestinoAIGenerator clienteId={clienteId} onGenerated={handleAIGenerated} />}

        <form action={action} className="grid gap-4">
          <input type="hidden" name="itinerario" value={itinerario ? JSON.stringify(itinerario) : ""} />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="panel-label">{labels.name}</label>
              <input
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="panel-input w-full"
                placeholder={labels.namePlaceholder}
              />
            </div>
            <div className="space-y-2">
              <div>
                <label className="panel-label">{labels.priceLabel}</label>
                <input
                  name="precio"
                  type="number"
                  min={0}
                  value={precio || ""}
                  onChange={(e) => setPrecio(Number(e.target.value) || 0)}
                  className="panel-input w-full"
                  placeholder={labels.pricePlaceholder}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="panel-label">{labels.description}</label>
            <textarea
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="panel-input w-full min-h-[100px]"
              placeholder={labels.descriptionPlaceholder}
            />
          </div>

          <div>
            <label className="panel-label block mb-1">Imagen</label>
            <div className="flex gap-2">
              <input type="hidden" name="imagen_url" value={imagenUrl} />
              <input
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                className="w-full flex-1 panel-input"
                placeholder="https://..."
              />
            </div>
            {imagenUrl && (
              <div className="mt-2 rounded-xl border border-gray-200 dark:border-white/20 overflow-hidden max-w-xs">
                <img
                  src={imagenUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60">
            <input
              type="checkbox"
              name="activo"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="rounded"
            />
            {labels.publishNow}
          </label>

          {/* Itinerary preview */}
          {itinerario && dias.length > 0 && (
            <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
              <button
                type="button"
                onClick={() => setPreviewOpen(!previewOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/[0.03] text-start"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-drb-turquoise-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/70">
                    {t("hasItinerary")} — {dias.length} {dias.length === 1 ? "día" : "días"}
                  </span>
                </div>
                {previewOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {previewOpen && (
                <div className="px-4 py-3 space-y-2 max-h-72 overflow-y-auto">
                  {dias.map((dia: any, i: number) => (
                    <div
                      key={i}
                      className="text-sm text-gray-600 dark:text-white/60 border-s-2 border-drb-turquoise-300 dark:border-drb-turquoise-500/40 ps-3 py-1"
                    >
                      <span className="font-medium text-gray-800 dark:text-white/80">
                        {t("dayLabel", { n: i + 1 })}:
                      </span>{" "}
                      {dia.titulo || dia.title || `Day ${i + 1}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <SubmitButton className="btn-primary">
              {labels.saveDestination}
            </SubmitButton>
          </div>
        </form>
      </div>
    </details>
  );
}
