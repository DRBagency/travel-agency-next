"use client";

import { useState } from "react";
import StarRating from "@/components/ui/StarRating";
import SubmitButton from "@/components/admin/SubmitButton";

interface OpinionesClientProps {
  clientId: string;
  createAction: (formData: FormData) => Promise<void>;
  mode: "create";
}

export default function OpinionesClient({
  clientId,
  createAction,
}: OpinionesClientProps) {
  const [rating, setRating] = useState(5);

  return (
    <form action={createAction} className="grid gap-4">
      <input type="hidden" name="client_id" value={clientId} />

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="panel-label">Nombre</label>
          <input
            name="nombre"
            className="panel-input w-full"
            placeholder="Ej: Ana Martínez"
          />
        </div>
        <div>
          <label className="panel-label">Ubicación</label>
          <input
            name="ubicacion"
            className="panel-input w-full"
            placeholder="Ej: Madrid"
          />
        </div>
      </div>

      <div>
        <label className="panel-label">Comentario</label>
        <textarea
          name="comentario"
          className="panel-input w-full min-h-[100px]"
          placeholder="Cuéntanos la experiencia del cliente"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="panel-label">Rating</label>
          <div className="flex items-center gap-3 mt-1">
            <StarRating value={rating} onChange={setRating} size="lg" name="rating" />
            <span className="text-sm text-gray-500 dark:text-white/50 font-medium">{rating}/5</span>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60">
          <input type="checkbox" name="activo" defaultChecked className="rounded" />
          Publicar ahora
        </label>
      </div>

      <div className="flex justify-end">
        <SubmitButton className="btn-primary">
          Guardar opinión
        </SubmitButton>
      </div>
    </form>
  );
}
