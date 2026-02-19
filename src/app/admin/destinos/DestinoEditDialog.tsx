"use client";

import { useState } from "react";
import { Pencil, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import SubmitButton from "@/components/admin/SubmitButton";

interface DestinoEditDialogProps {
  destino: {
    id: string;
    nombre: string | null;
    descripcion: string | null;
    precio: number | null;
    imagen_url: string | null;
    activo: boolean;
    itinerario: any | null;
  };
  action: (formData: FormData) => Promise<void> | void;
}

export default function DestinoEditDialog({ destino, action }: DestinoEditDialogProps) {
  const t = useTranslations("admin.destinos");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(destino.nombre ?? "");
  const [descripcion, setDescripcion] = useState(destino.descripcion ?? "");
  const [precio, setPrecio] = useState(destino.precio ?? 0);
  const [imagenUrl, setImagenUrl] = useState(destino.imagen_url ?? "");
  const [activo, setActivo] = useState(destino.activo);
  const [previewOpen, setPreviewOpen] = useState(false);

  const dias = destino.itinerario?.dias || destino.itinerario?.days || [];

  const handleSubmit = async (formData: FormData) => {
    await action(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/25 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5 inline-block me-1" />
          {tc("edit")}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("editDestination")}</DialogTitle>
          <DialogDescription>{t("editDestinationDesc")}</DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="grid gap-4">
          <input type="hidden" name="id" value={destino.id} />
          <input type="hidden" name="itinerario" value={destino.itinerario ? JSON.stringify(destino.itinerario) : ""} />

          <div>
            <label className="panel-label">{tc("name")}</label>
            <input
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="panel-input w-full"
            />
          </div>

          <div>
            <label className="panel-label">{tc("description")}</label>
            <textarea
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="panel-input w-full min-h-[80px]"
            />
          </div>

          <div>
            <label className="panel-label">{t("priceLabel")}</label>
            <input
              name="precio"
              type="number"
              min={0}
              value={precio || ""}
              onChange={(e) => setPrecio(Number(e.target.value) || 0)}
              className="panel-input w-full"
            />
          </div>

          <div>
            <label className="panel-label">Imagen</label>
            <input type="hidden" name="imagen_url" value={imagenUrl} />
            <input
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              className="panel-input w-full"
              placeholder="https://..."
            />
            {imagenUrl && (
              <div className="mt-2 rounded-xl border border-gray-200 dark:border-white/20 overflow-hidden max-w-xs">
                <img
                  src={imagenUrl}
                  alt="Preview"
                  className="w-full h-28 object-cover"
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
            {tc("active")}
          </label>

          {/* Itinerary preview */}
          {destino.itinerario && dias.length > 0 && (
            <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
              <button
                type="button"
                onClick={() => setPreviewOpen(!previewOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-white/[0.03] text-start"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-drb-turquoise-500" />
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
                <div className="px-4 py-3 space-y-1.5 max-h-48 overflow-y-auto">
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

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              {tc("cancel")}
            </button>
            <SubmitButton className="btn-primary">
              {tc("save")}
            </SubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
