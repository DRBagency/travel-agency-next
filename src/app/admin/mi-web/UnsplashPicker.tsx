"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, Loader2 } from "lucide-react";

interface UnsplashPhoto {
  id: string;
  url_small: string;
  url_regular: string;
  url_full: string;
  alt: string;
  author: string;
}

interface UnsplashPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  defaultQuery?: string;
}

export default function UnsplashPicker({
  open,
  onClose,
  onSelect,
  defaultQuery = "",
}: UnsplashPickerProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open && defaultQuery) {
      setQuery(defaultQuery);
      searchPhotos(defaultQuery, 1);
    }
    if (!open) {
      setPhotos([]);
      setQuery(defaultQuery);
      setPage(1);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultQuery]);

  async function searchPhotos(q: string, p: number) {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/unsplash/search?q=${encodeURIComponent(q)}&page=${p}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al buscar");
        setPhotos([]);
        return;
      }
      setPhotos(data.photos);
      setTotalPages(data.total_pages);
      setPage(p);
    } catch {
      setError("Error de conexion");
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim().length >= 2) {
        searchPhotos(value, 1);
      }
    }, 500);
  }

  function handleSelect(photo: UnsplashPhoto) {
    onSelect(photo.url_regular);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/20 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Buscar en Unsplash
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-white/70" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100 dark:border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Buscar fotos... ej: playa, montaña, ciudad"
              className="w-full pl-10 pr-4 py-2.5 panel-input"
              autoFocus
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400 dark:text-white/50" />
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && photos.length === 0 && query.trim() && (
            <div className="text-center py-12 text-gray-400 dark:text-white/50 text-sm">
              No se encontraron fotos para &quot;{query}&quot;
            </div>
          )}

          {!loading && !error && photos.length === 0 && !query.trim() && (
            <div className="text-center py-12 text-gray-400 dark:text-white/50 text-sm">
              Escribe para buscar fotos gratuitas en Unsplash
            </div>
          )}

          {!loading && photos.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => handleSelect(photo)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/40 transition-all hover:scale-[1.02]"
                  >
                    <img
                      src={photo.url_small}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[11px] text-white/80 truncate">
                        Foto de {photo.author} en Unsplash
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button
                    onClick={() => searchPhotos(query, page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-400 dark:text-white/50">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => searchPhotos(query, page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer attribution */}
        <div className="p-3 border-t border-gray-100 dark:border-white/10 text-center">
          <p className="text-[11px] text-gray-400 dark:text-white/40">
            Fotos proporcionadas por{" "}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 dark:hover:text-white/60"
            >
              Unsplash
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
