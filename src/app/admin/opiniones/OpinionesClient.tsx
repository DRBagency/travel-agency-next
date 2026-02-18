"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('admin.opiniones');
  const tf = useTranslations('admin.opiniones.form');
  const tc = useTranslations('common');
  const [rating, setRating] = useState(5);

  return (
    <form action={createAction} className="grid gap-4">
      <input type="hidden" name="client_id" value={clientId} />

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="panel-label">{tc('name')}</label>
          <input
            name="nombre"
            className="panel-input w-full"
            placeholder={tf('namePlaceholder')}
          />
        </div>
        <div>
          <label className="panel-label">{t('location')}</label>
          <input
            name="ubicacion"
            className="panel-input w-full"
            placeholder={tf('locationPlaceholder')}
          />
        </div>
      </div>

      <div>
        <label className="panel-label">{t('comment')}</label>
        <textarea
          name="comentario"
          className="panel-input w-full min-h-[100px]"
          placeholder={tf('commentPlaceholder')}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="panel-label">{t('rating')}</label>
          <div className="flex items-center gap-3 mt-1">
            <StarRating value={rating} onChange={setRating} size="lg" name="rating" />
            <span className="text-sm text-gray-500 dark:text-white/50 font-medium">{rating}/5</span>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60">
          <input type="checkbox" name="activo" defaultChecked className="rounded" />
          {tc('publishNow')}
        </label>
      </div>

      <div className="flex justify-end">
        <SubmitButton className="btn-primary">
          {tf('saveReview')}
        </SubmitButton>
      </div>
    </form>
  );
}
