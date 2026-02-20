"use client";

import { useState } from "react";
import { Pencil, ImageIcon } from "lucide-react";
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
import ItineraryEditor from "./ItineraryEditor";
import UnsplashPicker from "@/app/admin/mi-web/UnsplashPicker";

interface DestinoEditDialogProps {
  destino: {
    id: string;
    nombre: string | null;
    descripcion: string | null;
    precio: number | null;
    imagen_url: string | null;
    activo: boolean;
    itinerario: any | null;
    latitude?: number | null;
    longitude?: number | null;
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
  const [itinerario, setItinerario] = useState(destino.itinerario);
  const [coordenadas, setCoordenadas] = useState(
    destino.latitude && destino.longitude
      ? `${destino.latitude}, ${destino.longitude}`
      : ""
  );
  const [unsplashOpen, setUnsplashOpen] = useState(false);

  const dias = itinerario?.dias || itinerario?.days || [];

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("editDestination")}</DialogTitle>
          <DialogDescription>{t("editDestinationDesc")}</DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="grid gap-4">
          <input type="hidden" name="id" value={destino.id} />
          <input type="hidden" name="itinerario" value={itinerario ? JSON.stringify(itinerario) : ""} />

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
            <div className="flex gap-2">
              <input
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                className="panel-input w-full flex-1"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={() => setUnsplashOpen(true)}
                className="shrink-0 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
                title={t("searchUnsplash")}
              >
                <ImageIcon className="w-4 h-4 text-gray-500 dark:text-white/50" />
              </button>
            </div>
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

          {/* Coordinates (single field for easy copy/paste) */}
          <div>
            <label className="panel-label">{t("coordinates")}</label>
            <input
              name="coordenadas"
              type="text"
              value={coordenadas}
              onChange={(e) => setCoordenadas(e.target.value)}
              className="panel-input w-full"
              placeholder="40.4168, -3.7038"
            />
            <p className="text-xs text-gray-400 dark:text-white/30 mt-1">{t("coordinatesHelp")}</p>
            <input type="hidden" name="latitude" value={coordenadas.split(",")[0]?.trim() || ""} />
            <input type="hidden" name="longitude" value={coordenadas.split(",")[1]?.trim() || ""} />
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

          {/* Itinerary editor */}
          {itinerario && dias.length > 0 && (
            <ItineraryEditor
              itinerario={itinerario}
              onChange={(updated) => setItinerario(updated)}
            />
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

      <UnsplashPicker
        open={unsplashOpen}
        onClose={() => setUnsplashOpen(false)}
        onSelect={(url) => setImagenUrl(url)}
        defaultQuery={nombre}
      />
    </Dialog>
  );
}
