"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { sileo } from "sileo";
import { Plus, Loader2, Trash2, ChevronDown, ChevronRight } from "lucide-react";

interface LegalPage {
  id: string;
  titulo: string | null;
  slug: string | null;
  contenido: string | null;
  activo: boolean;
  created_at: string;
}

export default function LegalesManager({
  legales: initialLegales,
  clientId,
}: {
  legales: LegalPage[];
  clientId: string;
}) {
  const router = useRouter();
  const t = useTranslations("admin.legales");
  const tc = useTranslations("common");
  const tt = useTranslations("toast");
  const [legales, setLegales] = useState(initialLegales);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Form state
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [contenido, setContenido] = useState("");
  const [activo, setActivo] = useState(true);

  // Edit state
  const [editTitulo, setEditTitulo] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editContenido, setEditContenido] = useState("");
  const [editActivo, setEditActivo] = useState(true);

  const activeCount = legales.filter((l) => l.activo).length;

  async function handleCreate() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/legales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, slug, contenido, activo }),
      });
      if (!res.ok) throw new Error();
      sileo.success({ title: tt("savedSuccessfully") });
      setTitulo("");
      setSlug("");
      setContenido("");
      setActivo(true);
      setShowForm(false);
      router.refresh();
    } catch {
      sileo.error({ title: tt("errorSaving") });
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: LegalPage) {
    if (editingId === item.id) {
      setEditingId(null);
      return;
    }
    setEditingId(item.id);
    setEditTitulo(item.titulo ?? "");
    setEditSlug(item.slug ?? "");
    setEditContenido(item.contenido ?? "");
    setEditActivo(Boolean(item.activo));
  }

  async function handleUpdate(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/legales/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: editTitulo,
          slug: editSlug,
          contenido: editContenido,
          activo: editActivo,
        }),
      });
      if (!res.ok) throw new Error();
      setLegales((prev) =>
        prev.map((l) =>
          l.id === id
            ? { ...l, titulo: editTitulo, slug: editSlug, contenido: editContenido, activo: editActivo }
            : l
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

  async function handleDelete(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/legales/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setLegales((prev) => prev.filter((l) => l.id !== id));
      sileo.success({ title: tt("deletedSuccessfully") });
    } catch {
      sileo.error({ title: tt("errorSaving") });
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-3 pt-2">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 dark:text-white/40">
          {legales.length} {t("list").toLowerCase()} · {activeCount} {tc("active").toLowerCase()}
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {t("newPage")}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02] p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="panel-label block mb-1">{t("titleLabel")}</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="panel-input w-full"
                placeholder={t("titlePlaceholder")}
              />
            </div>
            <div>
              <label className="panel-label block mb-1">{t("slug")}</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="panel-input w-full"
                placeholder={t("slugPlaceholder")}
              />
            </div>
          </div>
          <div>
            <label className="panel-label block mb-1">{t("contentLabel")}</label>
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="panel-input w-full min-h-[80px]"
              placeholder="<h2>...</h2><p>...</p>"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-white/60">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="rounded"
              />
              {tc("publishNow")}
            </label>
            <button
              onClick={handleCreate}
              disabled={saving}
              className="btn-primary text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {t("savePage")}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {legales.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-white/40 text-center py-4">
          {t("noPages")}
        </p>
      ) : (
        <div className="space-y-1.5">
          {legales.map((item) => {
            const isEditing = editingId === item.id;
            const loading = actionLoading === item.id;

            return (
              <div
                key={item.id}
                className="rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] overflow-hidden"
              >
                {/* Header row */}
                <button
                  onClick={() => startEdit(item)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-start hover:bg-gray-100/50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  {isEditing ? (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1">
                    {item.titulo || "—"}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-white/30">/{item.slug || "..."}</span>
                  {item.activo ? (
                    <span className="badge-success text-[10px] px-1.5 py-0.5">{tc("active")}</span>
                  ) : (
                    <span className="badge-warning text-[10px] px-1.5 py-0.5">{tc("inactive")}</span>
                  )}
                </button>

                {/* Edit form */}
                {isEditing && (
                  <div className="px-3 pb-3 pt-1 space-y-3 border-t border-gray-100 dark:border-white/[0.06]">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="panel-label block mb-1">{t("titleLabel")}</label>
                        <input
                          value={editTitulo}
                          onChange={(e) => setEditTitulo(e.target.value)}
                          className="panel-input w-full"
                        />
                      </div>
                      <div>
                        <label className="panel-label block mb-1">{t("slug")}</label>
                        <input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="panel-input w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="panel-label block mb-1">{t("contentLabel")}</label>
                      <textarea
                        value={editContenido}
                        onChange={(e) => setEditContenido(e.target.value)}
                        className="panel-input w-full min-h-[80px]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-white/60">
                        <input
                          type="checkbox"
                          checked={editActivo}
                          onChange={(e) => setEditActivo(e.target.checked)}
                          className="rounded"
                        />
                        {t("activeOnWeb")}
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={loading}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleUpdate(item.id)}
                          disabled={loading}
                          className="btn-primary text-sm disabled:opacity-50 flex items-center gap-2"
                        >
                          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          {tc("saveChanges")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
