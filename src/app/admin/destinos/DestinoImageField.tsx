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
      <label className="block text-sm text-white/70 mb-1">Imagen</label>
      <div className="flex gap-2">
        <input type="hidden" name="imagen_url" value={url} />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full flex-1 rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
          placeholder="https://..."
        />
        <button
          type="button"
          onClick={() => setUnsplashOpen(true)}
          className="px-3 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-colors shrink-0"
          title="Buscar en Unsplash"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>
      {url && (
        <div className="mt-2 rounded-xl border border-white/20 overflow-hidden max-w-xs">
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
