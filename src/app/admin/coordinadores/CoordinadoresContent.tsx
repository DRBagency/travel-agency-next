"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import EmptyState from "@/components/ui/EmptyState";
import DeleteWithConfirm from "@/components/ui/DeleteWithConfirm";
import { Trash2 } from "lucide-react";

interface Coordinador {
  id: string;
  nombre: string;
  avatar: string;
  rol: string;
  descripcion: string;
  idiomas: string[];
  created_at: string;
}

export default function CoordinadoresContent() {
  const t = useTranslations("admin.coordinadores");
  const tc = useTranslations("common");

  const [coordinadores, setCoordinadores] = useState<Coordinador[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [nombre, setNombre] = useState("");
  const [avatar, setAvatar] = useState("");
  const [rol, setRol] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idiomas, setIdiomas] = useState<string[]>([]);
  const [newIdioma, setNewIdioma] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCoordinadores = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/coordinadores");
      if (res.ok) {
        const data = await res.json();
        setCoordinadores(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoordinadores();
  }, [fetchCoordinadores]);

  const resetForm = () => {
    setNombre("");
    setAvatar("");
    setRol("");
    setDescripcion("");
    setIdiomas([]);
    setNewIdioma("");
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (c: Coordinador) => {
    setNombre(c.nombre);
    setAvatar(c.avatar);
    setRol(c.rol);
    setDescripcion(c.descripcion);
    setIdiomas(c.idiomas || []);
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!nombre.trim()) return;
    setSaving(true);
    try {
      const payload = { nombre, avatar, rol, descripcion, idiomas };
      if (editingId) {
        await fetch(`/api/admin/coordinadores/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/coordinadores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      fetchCoordinadores();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/coordinadores/${id}`, { method: "DELETE" });
    fetchCoordinadores();
  };

  const addIdioma = () => {
    const trimmed = newIdioma.trim();
    if (trimmed && !idiomas.includes(trimmed)) {
      setIdiomas([...idiomas, trimmed]);
      setNewIdioma("");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="panel-card p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary px-4 py-2 rounded-lg text-sm font-medium"
        >
          + {t("addNew")}
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="panel-card p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {editingId ? t("edit") : t("addNew")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                {t("name")}
              </label>
              <input
                className="panel-input w-full px-3 py-2 rounded-lg"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder={t("namePlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                {t("role")}
              </label>
              <input
                className="panel-input w-full px-3 py-2 rounded-lg"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                placeholder={t("rolePlaceholder")}
              />
            </div>
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
              {t("avatar")}
            </label>
            <div className="flex items-center gap-3">
              {avatar && (
                <img
                  src={avatar}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover border-2 border-drb-turquoise-400/30"
                />
              )}
              <input
                className="panel-input flex-1 px-3 py-2 rounded-lg"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
              {t("description")}
            </label>
            <textarea
              className="panel-input w-full px-3 py-2 rounded-lg min-h-[80px]"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder={t("descriptionPlaceholder")}
            />
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
              {t("languages")}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {idiomas.map((lang, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-drb-turquoise-500/10 text-drb-turquoise-400 border border-drb-turquoise-400/20"
                >
                  {lang}
                  <button
                    onClick={() => setIdiomas(idiomas.filter((_, j) => j !== i))}
                    className="hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="panel-input flex-1 px-3 py-2 rounded-lg text-sm"
                value={newIdioma}
                onChange={(e) => setNewIdioma(e.target.value)}
                placeholder={t("languagePlaceholder")}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIdioma())}
              />
              <button
                onClick={addIdioma}
                className="px-3 py-2 rounded-lg text-sm border border-drb-turquoise-400/30 text-drb-turquoise-400 hover:bg-drb-turquoise-400/10 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !nombre.trim()}
              className="btn-primary px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {saving ? tc("saving") : tc("save")}
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded-lg text-sm text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              {tc("cancel")}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {coordinadores.length === 0 && !showForm ? (
        <EmptyState
          icon="👤"
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coordinadores.map((c) => (
            <div key={c.id} className="panel-card p-5 flex gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {c.avatar ? (
                  <img
                    src={c.avatar}
                    alt={c.nombre}
                    className="w-16 h-16 rounded-full object-cover border-2 border-drb-turquoise-400/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-drb-turquoise-500/10 flex items-center justify-center text-2xl">
                    👤
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                  {c.nombre}
                </h4>
                {c.rol && (
                  <p className="text-sm text-drb-turquoise-400">{c.rol}</p>
                )}
                {c.descripcion && (
                  <p className="text-sm text-gray-500 dark:text-white/50 mt-1 line-clamp-2">
                    {c.descripcion}
                  </p>
                )}
                {c.idiomas?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.idiomas.map((lang, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 text-[11px] rounded bg-drb-turquoise-500/10 text-drb-turquoise-400"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEdit(c)}
                    className="text-xs text-drb-turquoise-400 hover:underline"
                  >
                    {tc("edit")}
                  </button>
                  <DeleteWithConfirm
                    action={() => handleDelete(c.id)}
                    title={t("deleteTitle")}
                    description={t("deleteDescription")}
                    trigger={
                      <button className="text-xs text-red-400 hover:underline flex items-center gap-1">
                        <Trash2 className="w-3 h-3" />
                        {tc("delete")}
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
