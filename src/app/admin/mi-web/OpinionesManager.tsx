"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { sileo } from "sileo";
import { Plus, Loader2, Trash2, Pencil, X, Check, MapPin } from "lucide-react";
import StarRating from "@/components/ui/StarRating";

interface Opinion {
  id: string;
  nombre: string | null;
  ubicacion: string | null;
  comentario: string | null;
  rating: number;
  activo: boolean;
  created_at: string;
}

interface Destino {
  id: string;
  nombre: string;
}

export default function OpinionesManager({
  opiniones: initialOpiniones,
  destinos = [],
  clientId,
  locale,
}: {
  opiniones: Opinion[];
  destinos?: Destino[];
  clientId: string;
  locale: string;
}) {
  const router = useRouter();
  const t = useTranslations("admin.opiniones");
  const tc = useTranslations("common");
  const tt = useTranslations("toast");
  const [opiniones, setOpiniones] = useState(initialOpiniones);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Create form state
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [comentario, setComentario] = useState("");
  const [rating, setRating] = useState(5);
  const [activo, setActivo] = useState(true);

  // Edit form state
  const [editNombre, setEditNombre] = useState("");
  const [editUbicacion, setEditUbicacion] = useState("");
  const [editComentario, setEditComentario] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [editActivo, setEditActivo] = useState(true);

  const avatarColors = ["bg-drb-turquoise-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"];

  function startEditing(op: Opinion) {
    setEditingId(op.id);
    setEditNombre(op.nombre || "");
    setEditUbicacion(op.ubicacion || "");
    setEditComentario(op.comentario || "");
    setEditRating(op.rating ?? 5);
    setEditActivo(op.activo);
    setShowForm(false);
  }

  function cancelEditing() {
    setEditingId(null);
  }

  async function handleCreate() {
    if (!comentario.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/opiniones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre || null,
          ubicacion: ubicacion || null,
          comentario: comentario,
          rating,
          activo,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error");
      }
      sileo.success({ title: tt("savedSuccessfully") });
      setNombre("");
      setUbicacion("");
      setComentario("");
      setRating(5);
      setActivo(true);
      setShowForm(false);
      router.refresh();
    } catch {
      sileo.error({ title: tt("errorSaving") });
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(op: Opinion) {
    if (!editComentario.trim()) return;
    setActionLoading(op.id);
    try {
      const res = await fetch(`/api/admin/opiniones/${op.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: editNombre || null,
          ubicacion: editUbicacion || null,
          comentario: editComentario,
          rating: editRating,
          activo: editActivo,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error");
      }
      setOpiniones((prev) =>
        prev.map((o) =>
          o.id === op.id
            ? {
                ...o,
                nombre: editNombre || null,
                ubicacion: editUbicacion || null,
                comentario: editComentario,
                rating: editRating,
                activo: editActivo,
              }
            : o
        )
      );
      setEditingId(null);
      sileo.success({ title: tt("savedSuccessfully") });
    } catch {
      sileo.error({ title: tt("errorSaving") });
    } finally {
      setActionLoading(null);
    }
  }

  async function togglePublish(op: Opinion) {
    setActionLoading(op.id);
    try {
      const res = await fetch(`/api/admin/opiniones/${op.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !op.activo }),
      });
      if (!res.ok) throw new Error();
      setOpiniones((prev) =>
        prev.map((o) => (o.id === op.id ? { ...o, activo: !o.activo } : o))
      );
    } catch {
      sileo.error({ title: tt("errorSaving") });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/opiniones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setOpiniones((prev) => prev.filter((o) => o.id !== id));
      sileo.success({ title: tt("deletedSuccessfully") });
    } catch {
      sileo.error({ title: tt("errorSaving") });
    } finally {
      setActionLoading(null);
    }
  }

  // Destination dropdown component
  const DestinoSelect = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="panel-input w-full"
    >
      <option value="">{t("selectDestination")}</option>
      {destinos.map((d) => (
        <option key={d.id} value={d.nombre}>
          {d.nombre}
        </option>
      ))}
    </select>
  );

  const activeCount = opiniones.filter((o) => o.activo).length;

  return (
    <div className="space-y-3 pt-2">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 dark:text-white/40">
          {opiniones.length} {t("reviews")} · {activeCount} {t("published").toLowerCase()}
        </p>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); }}
          className="flex items-center gap-1.5 text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {t("newReview")}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02] p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="panel-label block mb-1">{tc("name")}</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="panel-input w-full"
                placeholder={t("form.namePlaceholder")}
              />
            </div>
            <div>
              <label className="panel-label block mb-1">{t("destination")}</label>
              <DestinoSelect value={ubicacion} onChange={setUbicacion} />
            </div>
          </div>
          <div>
            <label className="panel-label block mb-1">{t("comment")}</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="panel-input w-full min-h-[80px]"
              placeholder={t("form.commentPlaceholder")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StarRating value={rating} onChange={setRating} size="md" />
              <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-white/60">
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="rounded"
                />
                {tc("publishNow")}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="text-xs px-3 py-1.5 rounded-lg text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
              >
                {tc("cancel")}
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !comentario.trim()}
                className="btn-primary text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {tc("save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {opiniones.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-white/40 text-center py-4">
          {t("noReviews")}
        </p>
      ) : (
        <div className="space-y-1.5">
          {opiniones.map((op) => {
            const initial = (op.nombre || "?").charAt(0).toUpperCase();
            const colorIdx = op.nombre ? op.nombre.charCodeAt(0) % avatarColors.length : 0;
            const loading = actionLoading === op.id;
            const isEditing = editingId === op.id;

            /* ---- EDIT MODE ---- */
            if (isEditing) {
              return (
                <div
                  key={op.id}
                  className="rounded-xl border border-drb-turquoise-300 dark:border-drb-turquoise-500/30 bg-gray-50 dark:bg-white/[0.03] p-4 space-y-3"
                >
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="panel-label block mb-1">{tc("name")}</label>
                      <input
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        className="panel-input w-full"
                        placeholder={t("form.namePlaceholder")}
                      />
                    </div>
                    <div>
                      <label className="panel-label block mb-1">{t("destination")}</label>
                      <DestinoSelect value={editUbicacion} onChange={setEditUbicacion} />
                    </div>
                  </div>
                  <div>
                    <label className="panel-label block mb-1">{t("comment")}</label>
                    <textarea
                      value={editComentario}
                      onChange={(e) => setEditComentario(e.target.value)}
                      className="panel-input w-full min-h-[80px]"
                      placeholder={t("form.commentPlaceholder")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StarRating value={editRating} onChange={setEditRating} size="md" />
                      <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-white/60">
                        <input
                          type="checkbox"
                          checked={editActivo}
                          onChange={(e) => setEditActivo(e.target.checked)}
                          className="rounded"
                        />
                        {t("published")}
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={cancelEditing}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
                      >
                        <X className="w-3 h-3" />
                        {tc("cancel")}
                      </button>
                      <button
                        onClick={() => handleEdit(op)}
                        disabled={loading || !editComentario.trim()}
                        className="btn-primary text-sm disabled:opacity-50 flex items-center gap-2"
                      >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <Check className="w-3.5 h-3.5" />
                        {tc("save")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            /* ---- VIEW MODE ---- */
            return (
              <div
                key={op.id}
                className="flex items-start gap-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] px-3 py-2.5 group"
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full ${avatarColors[colorIdx]} flex items-center justify-center text-white text-[11px] font-semibold shrink-0 mt-0.5`}
                >
                  {initial}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Name + rating + badge */}
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {op.nombre || t("anonymous")}
                    </span>
                    <StarRating value={op.rating ?? 0} readonly size="sm" />
                    {op.activo ? (
                      <span className="badge-success text-[10px] px-1.5 py-0.5">{t("published")}</span>
                    ) : (
                      <span className="badge-warning text-[10px] px-1.5 py-0.5">{t("draft")}</span>
                    )}
                  </div>

                  {/* Comment text */}
                  {op.comentario && (
                    <p className="text-xs text-gray-600 dark:text-white/60 line-clamp-2 mb-0.5">
                      {op.comentario}
                    </p>
                  )}

                  {/* Destination */}
                  {op.ubicacion && (
                    <p className="text-[10px] text-gray-400 dark:text-white/30 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {op.ubicacion}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEditing(op)}
                    disabled={loading}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 hover:text-drb-turquoise-500 transition-colors disabled:opacity-50"
                    title={tc("edit")}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => togglePublish(op)}
                    disabled={loading}
                    className="text-[11px] px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-500 dark:text-white/50 transition-colors disabled:opacity-50"
                  >
                    {op.activo ? tc("unpublish") : tc("publish")}
                  </button>
                  <button
                    onClick={() => handleDelete(op.id)}
                    disabled={loading}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
