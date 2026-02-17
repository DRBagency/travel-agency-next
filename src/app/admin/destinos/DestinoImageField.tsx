"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import UnsplashPicker from "@/app/admin/mi-web/UnsplashPicker";

interface DestinoImageFieldProps {
  defaultValue?: string;
  defaultQuery?: string;
}

export default function DestinoImageField({
  defaultValue = "",
  defaultQuery = "travel destination",
}: DestinoImageFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [unsplashOpen, setUnsplashOpen] = useState(false);

  return (
    <div>
      <label className="panel-label block mb-1">Imagen</label>
      <div className="flex gap-2">
        <input type="hidden" name="imagen_url" value={url} />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full flex-1 panel-input"
          placeholder="https://..."
        />
        <button
          type="button"
          onClick={() => setUnsplashOpen(true)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0"
          title="Buscar en Unsplash"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>
      {url && (
        <div className="mt-2 rounded-xl border border-gray-200 dark:border-white/20 overflow-hidden max-w-xs">
          <img
            src={url}
            alt="Preview"
            className="w-full h-32 object-cover"
          />
        </div>
      )}
      <UnsplashPicker
        open={unsplashOpen}
        onClose={() => setUnsplashOpen(false)}
        onSelect={(selected) => setUrl(selected)}
        defaultQuery={defaultQuery}
      />
    </div>
  );
}
