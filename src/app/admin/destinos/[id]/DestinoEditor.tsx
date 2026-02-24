"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { sileo } from "sileo";
import {
  Save,
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ImageIcon,
  Globe,
  Tag,
  Mountain,
  Users,
  Plane,
  Hotel,
  Calendar,
  HelpCircle,
  User,
  Cloud,
  Check,
} from "lucide-react";
import ItineraryEditor from "../ItineraryEditor";
import UnsplashPicker from "@/app/admin/mi-web/UnsplashPicker";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { TRANSLATABLE_DESTINO_FIELDS } from "@/lib/translations";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  destino: any;
  plan?: string;
  preferredLanguage?: string;
  availableLanguages?: string[];
}

interface SalidaItem {
  fecha: string;
  estado: string;
  precio: number;
  plazas: number;
}

interface FaqItem {
  pregunta: string;
  respuesta: string;
}

interface HotelData {
  nombre: string;
  estrellas: number;
  imagen: string;
  descripcion: string;
  amenidades: string[];
  direccion: string;
}

interface VuelosData {
  aeropuerto_llegada: string;
  aeropuerto_regreso: string;
  nota: string;
}

interface CoordinadorData {
  nombre: string;
  avatar: string;
  rol: string;
  descripcion: string;
  idiomas: string[];
}

interface ClimaData {
  temp_avg: string;
  best_months: string;
  description: string;
}

/* ------------------------------------------------------------------ */
/*  Tab definitions                                                    */
/* ------------------------------------------------------------------ */

const TABS = [
  { key: "general", icon: Globe },
  { key: "pricing", icon: Tag },
  { key: "gallery", icon: ImageIcon },
  { key: "itinerary", icon: Mountain },
  { key: "hotel", icon: Hotel },
  { key: "flights", icon: Plane },
  { key: "included", icon: Check },
  { key: "departures", icon: Calendar },
  { key: "faqs", icon: HelpCircle },
  { key: "coordinator", icon: User },
  { key: "tags", icon: Cloud },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DestinoEditor({ destino, plan, preferredLanguage = "es", availableLanguages = ["es"] }: Props) {
  const t = useTranslations("admin.destinos");

  const { translating, translationError, isEligible: translationEligible, translate: triggerTranslation } = useAutoTranslate({
    table: "destinos",
    recordId: destino.id,
    sourceLang: preferredLanguage,
    availableLangs: availableLanguages,
    plan,
  });

  /* --- Active tab --- */
  const [tab, setTab] = useState<string>("general");

  /* --- Save state --- */
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /* --- Unsplash picker --- */
  const [unsplashOpen, setUnsplashOpen] = useState(false);
  const [unsplashField, setUnsplashField] = useState<string>("");

  /* ================================================================ */
  /*  All fields as state                                              */
  /* ================================================================ */

  // Strings
  const [nombre, setNombre] = useState<string>(destino.nombre ?? "");
  const [slug, setSlug] = useState<string>(destino.slug ?? "");
  const [subtitle, setSubtitle] = useState<string>(destino.subtitle ?? "");
  const [tagline, setTagline] = useState<string>(destino.tagline ?? "");
  const [badge, setBadge] = useState<string>(destino.badge ?? "");
  const [descripcion, setDescripcion] = useState<string>(destino.descripcion ?? "");
  const [descripcionLarga, setDescripcionLarga] = useState<string>(destino.descripcion_larga ?? "");
  const [categoria, setCategoria] = useState<string>(destino.categoria ?? "");
  const [continente, setContinente] = useState<string>(destino.continente ?? "");
  const [dificultad, setDificultad] = useState<string>(destino.dificultad ?? "");
  const [duracion, setDuracion] = useState<string>(destino.duracion ?? "");
  const [moneda, setMoneda] = useState<string>(destino.moneda ?? "EUR");
  const [pais, setPais] = useState<string>(destino.pais ?? "");
  const [imagenUrl, setImagenUrl] = useState<string>(destino.imagen_url ?? "");

  // Numbers
  const [reviews, setReviews] = useState<number>(destino.reviews ?? 0);
  const [esfuerzo, setEsfuerzo] = useState<number>(destino.esfuerzo ?? 1);
  const [grupoMax, setGrupoMax] = useState<number>(destino.grupo_max ?? 0);
  const [edadMin, setEdadMin] = useState<number>(destino.edad_min ?? 0);
  const [edadMax, setEdadMax] = useState<number>(destino.edad_max ?? 0);
  const [precio, setPrecio] = useState<number>(destino.precio ?? 0);
  const [precioOriginal, setPrecioOriginal] = useState<number>(destino.precio_original ?? 0);
  const [precioAdulto, setPrecioAdulto] = useState<number>(destino.precio_adulto ?? 0);
  const [precioNino, setPrecioNino] = useState<number>(destino.precio_nino ?? 0);
  const [precioGrupo, setPrecioGrupo] = useState<number>(destino.precio_grupo ?? 0);

  // Boolean
  const [activo, setActivo] = useState<boolean>(destino.activo ?? false);

  // JSONB
  const [galeria, setGaleria] = useState<string[]>(destino.galeria ?? []);
  const [itinerario, setItinerario] = useState<any>(destino.itinerario ?? null);
  const [hotel, setHotel] = useState<HotelData>(
    destino.hotel ?? { nombre: "", estrellas: 0, imagen: "", descripcion: "", amenidades: [], direccion: "" }
  );
  const [vuelos, setVuelos] = useState<VuelosData>(
    destino.vuelos ?? { aeropuerto_llegada: "", aeropuerto_regreso: "", nota: "" }
  );
  const [incluido, setIncluido] = useState<string[]>(destino.incluido ?? []);
  const [noIncluido, setNoIncluido] = useState<string[]>(destino.no_incluido ?? []);
  const [salidas, setSalidas] = useState<SalidaItem[]>(destino.salidas ?? []);
  const [faqs, setFaqs] = useState<FaqItem[]>(destino.faqs ?? []);
  const [coordinador, setCoordinador] = useState<CoordinadorData>(
    destino.coordinador ?? { nombre: "", avatar: "", rol: "", descripcion: "", idiomas: [] }
  );
  const [tags, setTags] = useState<string[]>(destino.tags ?? []);
  const [highlights, setHighlights] = useState<string[]>(destino.highlights ?? []);
  const [clima, setClima] = useState<ClimaData>(
    destino.clima ?? { temp_avg: "", best_months: "", description: "" }
  );

  /* ================================================================ */
  /*  Save handler                                                     */
  /* ================================================================ */

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/destinos/${destino.id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          slug,
          subtitle,
          tagline,
          badge,
          descripcion,
          descripcion_larga: descripcionLarga,
          categoria,
          continente,
          pais,
          dificultad,
          duracion,
          moneda,
          imagen_url: imagenUrl,
          reviews,
          esfuerzo,
          grupo_max: grupoMax,
          edad_min: edadMin,
          edad_max: edadMax,
          precio,
          precio_original: precioOriginal,
          precio_adulto: precioAdulto,
          precio_nino: precioNino,
          precio_grupo: precioGrupo,
          activo,
          galeria,
          itinerario,
          hotel,
          vuelos,
          incluido,
          no_incluido: noIncluido,
          salidas,
          faqs,
          coordinador,
          tags,
          highlights,
          clima,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaved(true);
      sileo.success({ title: "Guardado correctamente" });
      setTimeout(() => setSaved(false), 2500);

      // Fire-and-forget auto-translation
      if (translationEligible) {
        const allFields: Record<string, unknown> = {
          nombre, subtitle, tagline, badge, descripcion,
          descripcion_larga: descripcionLarga, categoria, continente, pais,
          dificultad, duracion, itinerario, hotel, vuelos, coordinador,
          incluido, no_incluido: noIncluido, faqs, clima, highlights, tags,
        };
        const translatablePayload: Record<string, unknown> = {};
        for (const key of Object.keys(TRANSLATABLE_DESTINO_FIELDS)) {
          const mappedKey = key === "descripcion_larga" ? "descripcion_larga" : key;
          if (mappedKey in allFields && allFields[mappedKey] != null && allFields[mappedKey] !== "") {
            translatablePayload[key] = allFields[mappedKey];
          }
        }
        triggerTranslation(translatablePayload);
      }
    } catch (err) {
      sileo.error({ title: err instanceof Error ? err.message : "Error al guardar" });
    } finally {
      setSaving(false);
    }
  }

  /* ================================================================ */
  /*  Unsplash helpers                                                 */
  /* ================================================================ */

  function openUnsplash(fieldKey: string) {
    setUnsplashField(fieldKey);
    setUnsplashOpen(true);
  }

  function handleUnsplashSelect(url: string) {
    switch (unsplashField) {
      case "imagen_url":
        setImagenUrl(url);
        break;
      case "hotel_imagen":
        setHotel((prev) => ({ ...prev, imagen: url }));
        break;
      case "coordinador_avatar":
        setCoordinador((prev) => ({ ...prev, avatar: url }));
        break;
      default:
        // Gallery item — field key is "galeria_<index>"
        if (unsplashField.startsWith("galeria_")) {
          const idx = Number(unsplashField.split("_")[1]);
          setGaleria((prev) => {
            const next = [...prev];
            next[idx] = url;
            return next;
          });
        }
        break;
    }
  }

  /* ================================================================ */
  /*  Save button (reusable)                                           */
  /* ================================================================ */

  function SaveButton({ className = "" }: { className?: string }) {
    return (
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={`btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium ${className}`}
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : saved ? (
          <Check className="w-4 h-4" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {saving ? "Guardando..." : saved ? "Guardado" : "Guardar"}
      </button>
    );
  }

  /* ================================================================ */
  /*  Tab label helper                                                 */
  /* ================================================================ */

  const TAB_I18N: Record<string, string> = {
    general: "tabGeneral",
    pricing: "tabPricing",
    gallery: "tabGallery",
    itinerary: "tabItinerary",
    hotel: "tabHotel",
    flights: "tabFlights",
    included: "tabIncluded",
    departures: "tabDepartures",
    faqs: "tabFaqs",
    coordinator: "tabCoordinator",
    tags: "tabTags",
  };

  function tabLabel(key: string): string {
    const i18nKey = TAB_I18N[key];
    if (i18nKey) return t(i18nKey as any);
    return key;
  }

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className="space-y-0">
      {/* ============================================================ */}
      {/*  TOP HEADER BAR                                               */}
      {/* ============================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <a
            href="/admin/destinos"
            className="shrink-0 p-2 rounded-lg text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {nombre || "Sin nombre"}
            </h1>
            <span
              className={`inline-block mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                activo
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                  : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-white/40"
              }`}
            >
              {activo ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
        <SaveButton />
      </div>

      {/* Translation status banners */}
      {translating && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-sm text-blue-700 dark:text-blue-300 mb-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          Translating content to other languages...
        </div>
      )}
      {translationError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-sm text-amber-700 dark:text-amber-300 mb-4">
          Translation failed. Content saved successfully.
        </div>
      )}

      {/* ============================================================ */}
      {/*  TAB BAR (horizontally scrollable)                            */}
      {/* ============================================================ */}
      <div className="overflow-x-auto -mx-1 px-1 mb-6">
        <div className="flex gap-1 min-w-max border-b border-gray-200 dark:border-white/10">
          {TABS.map(({ key, icon: Icon }) => {
            const isActive = tab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-sm whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? "border-drb-turquoise-500 text-drb-turquoise-600 dark:text-drb-turquoise-400 font-semibold"
                    : "border-transparent text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tabLabel(key)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  TAB CONTENT                                                  */}
      {/* ============================================================ */}
      <div className="panel-card p-6">
        {/* ------ GENERAL TAB ------ */}
        {tab === "general" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Informacion general
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* nombre */}
              <div>
                <label className="panel-label">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="panel-input w-full"
                />
              </div>
              {/* slug */}
              <div>
                <label className="panel-label">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="panel-input w-full"
                  placeholder="auto-generated if empty"
                />
              </div>
              {/* subtitle */}
              <div>
                <label className="panel-label">Subtitulo</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="panel-input w-full"
                />
              </div>
              {/* tagline */}
              <div>
                <label className="panel-label">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="panel-input w-full"
                />
              </div>
              {/* badge */}
              <div>
                <label className="panel-label">Badge</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="panel-input w-full"
                  placeholder="Ej: Mas vendido"
                />
              </div>
              {/* categoria */}
              <div>
                <label className="panel-label">Categoria</label>
                <input
                  type="text"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="panel-input w-full"
                />
              </div>
              {/* pais */}
              <div>
                <label className="panel-label">Pais</label>
                <input
                  type="text"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  className="panel-input w-full"
                  placeholder="Ej: Grecia"
                />
              </div>
              {/* continente */}
              <div>
                <label className="panel-label">Continente</label>
                <input
                  type="text"
                  value={continente}
                  onChange={(e) => setContinente(e.target.value)}
                  className="panel-input w-full"
                />
              </div>
              {/* reviews */}
              <div>
                <label className="panel-label">Reviews (opiniones)</label>
                <input
                  type="number"
                  min={0}
                  value={reviews}
                  onChange={(e) => setReviews(Number(e.target.value) || 0)}
                  className="panel-input w-full"
                  placeholder="Ej: 234"
                />
              </div>
              {/* dificultad */}
              <div>
                <label className="panel-label">Dificultad</label>
                <select
                  value={dificultad}
                  onChange={(e) => setDificultad(e.target.value)}
                  className="panel-input w-full"
                >
                  <option value="">— Seleccionar —</option>
                  <option value="facil">Facil</option>
                  <option value="moderado">Moderado</option>
                  <option value="dificil">Dificil</option>
                  <option value="extremo">Extremo</option>
                </select>
              </div>
              {/* esfuerzo */}
              <div>
                <label className="panel-label">Esfuerzo (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={esfuerzo}
                  onChange={(e) => setEsfuerzo(Number(e.target.value) || 1)}
                  className="panel-input w-full"
                />
              </div>
              {/* duracion */}
              <div>
                <label className="panel-label">Duracion</label>
                <input
                  type="text"
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  className="panel-input w-full"
                  placeholder="Ej: 7 dias / 6 noches"
                />
              </div>
              {/* grupo_max */}
              <div>
                <label className="panel-label">Grupo maximo</label>
                <input
                  type="number"
                  min={0}
                  value={grupoMax}
                  onChange={(e) => setGrupoMax(Number(e.target.value) || 0)}
                  className="panel-input w-full"
                />
              </div>
              {/* edad_min */}
              <div>
                <label className="panel-label">Edad minima</label>
                <input
                  type="number"
                  min={0}
                  value={edadMin}
                  onChange={(e) => setEdadMin(Number(e.target.value) || 0)}
                  className="panel-input w-full"
                />
              </div>
              {/* edad_max */}
              <div>
                <label className="panel-label">Edad maxima</label>
                <input
                  type="number"
                  min={0}
                  value={edadMax}
                  onChange={(e) => setEdadMax(Number(e.target.value) || 0)}
                  className="panel-input w-full"
                />
              </div>
              {/* activo */}
              <div className="flex items-center gap-3 md:col-span-2">
                <label className="panel-label flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={(e) => setActivo(e.target.checked)}
                    className="rounded border-gray-300 dark:border-white/20 text-drb-turquoise-500 focus:ring-drb-turquoise-500"
                  />
                  Destino activo (visible en la web)
                </label>
              </div>
            </div>
            {/* descripcion */}
            <div>
              <label className="panel-label">Descripcion corta</label>
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="panel-input w-full"
              />
            </div>
            {/* descripcion_larga */}
            <div>
              <label className="panel-label">Descripcion larga</label>
              <textarea
                rows={5}
                value={descripcionLarga}
                onChange={(e) => setDescripcionLarga(e.target.value)}
                className="panel-input w-full"
              />
            </div>
            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ PRICING TAB ------ */}
        {tab === "pricing" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Precios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label">Precio principal</label>
                <input
                  type="number"
                  min={0}
                  value={precio || ""}
                  onChange={(e) => setPrecio(Number(e.target.value) || 0)}
                  className="panel-input w-full"
                />
              </div>
              <div>
                <label className="panel-label">Precio original (tachado)</label>
                <input
                  type="number"
                  min={0}
                  value={precioOriginal || ""}
                  onChange={(e) => setPrecioOriginal(Number(e.target.value) || 0)}
                  className="panel-input w-full"
                />
              </div>
              <div>
                <label className="panel-label">Moneda</label>
                <select
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value)}
                  className="panel-input w-full"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div>
                <label className="panel-label">Precio adulto</label>
                <input
                  type="number"
                  min={0}
                  value={precioAdulto || ""}
                  onChange={(e) => setPrecioAdulto(Number(e.target.value) || 0)}
                  className="panel-input w-full"
                />
              </div>
              <div>
                <label className="panel-label">Precio nino</label>
                <input
                  type="number"
                  min={0}
                  value={precioNino || ""}
                  onChange={(e) => setPrecioNino(Number(e.target.value) || 0)}
                  className="panel-input w-full"
                />
              </div>
              <div>
                <label className="panel-label">Precio grupo</label>
                <input
                  type="number"
                  min={0}
                  value={precioGrupo || ""}
                  onChange={(e) => setPrecioGrupo(Number(e.target.value) || 0)}
                  className="panel-input w-full"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ GALLERY TAB ------ */}
        {tab === "gallery" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Imagen principal y galeria
            </h2>

            {/* Main image */}
            <div>
              <label className="panel-label">Imagen principal</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                  className="panel-input w-full flex-1"
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => openUnsplash("imagen_url")}
                  className="shrink-0 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
                  title="Buscar en Unsplash"
                >
                  <ImageIcon className="w-4 h-4 text-gray-500 dark:text-white/50" />
                </button>
              </div>
              {imagenUrl && (
                <div className="mt-2 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden max-w-xs">
                  <img src={imagenUrl} alt="Preview" className="w-full h-32 object-cover" />
                </div>
              )}
            </div>

            {/* Gallery grid */}
            <div>
              <label className="panel-label mb-3 block">Galeria de imagenes</label>
              {galeria.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-white/40 mb-3">
                  No hay imagenes en la galeria. Anade la primera.
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galeria.map((url, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden"
                  >
                    {url && (
                      <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-32 object-cover" />
                    )}
                    <div className="p-2 flex gap-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => {
                          const next = [...galeria];
                          next[idx] = e.target.value;
                          setGaleria(next);
                        }}
                        className="panel-input flex-1 text-sm"
                        placeholder="URL de imagen"
                      />
                      <button
                        type="button"
                        onClick={() => openUnsplash(`galeria_${idx}`)}
                        className="shrink-0 p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-gray-500 dark:text-white/50" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setGaleria((prev) => prev.filter((_, i) => i !== idx))}
                        className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setGaleria((prev) => [...prev, ""])}
                className="mt-3 flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
              >
                <Plus className="w-4 h-4" />
                Anadir imagen
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ ITINERARY TAB ------ */}
        {tab === "itinerary" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Itinerario</h2>
            {itinerario ? (
              <ItineraryEditor
                itinerario={itinerario}
                onChange={(updated) => setItinerario(updated)}
              />
            ) : (
              <div className="text-center py-12 text-gray-400 dark:text-white/40">
                <Mountain className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">
                  Este destino aun no tiene itinerario. Puedes generarlo desde la seccion de AI o
                  crearlo manualmente.
                </p>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ HOTEL TAB ------ */}
        {tab === "hotel" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Alojamiento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label">Nombre del hotel</label>
                <input
                  type="text"
                  value={hotel.nombre}
                  onChange={(e) => setHotel((p) => ({ ...p, nombre: e.target.value }))}
                  className="panel-input w-full"
                />
              </div>
              <div>
                <label className="panel-label">Estrellas (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={hotel.estrellas || ""}
                  onChange={(e) => setHotel((p) => ({ ...p, estrellas: Number(e.target.value) || 0 }))}
                  className="panel-input w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label className="panel-label">Imagen del hotel</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hotel.imagen}
                    onChange={(e) => setHotel((p) => ({ ...p, imagen: e.target.value }))}
                    className="panel-input w-full flex-1"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => openUnsplash("hotel_imagen")}
                    className="shrink-0 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-gray-500 dark:text-white/50" />
                  </button>
                </div>
                {hotel.imagen && (
                  <div className="mt-2 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden max-w-xs">
                    <img src={hotel.imagen} alt="Hotel" className="w-full h-28 object-cover" />
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="panel-label">Descripcion</label>
                <textarea
                  rows={3}
                  value={hotel.descripcion}
                  onChange={(e) => setHotel((p) => ({ ...p, descripcion: e.target.value }))}
                  className="panel-input w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label className="panel-label">Direccion / Google Maps</label>
                <input
                  type="text"
                  value={hotel.direccion || ""}
                  onChange={(e) => setHotel((p) => ({ ...p, direccion: e.target.value }))}
                  className="panel-input w-full"
                  placeholder="Ej: Calle Gran Via 1, Madrid, Espana o URL de Google Maps"
                />
                <p className="text-xs text-gray-400 dark:text-white/30 mt-1">
                  Introduce la direccion o un enlace de Google Maps para mostrar en la landing
                </p>
              </div>
            </div>

            {/* Amenidades */}
            <div>
              <label className="panel-label mb-2 block">Amenidades</label>
              <div className="space-y-2">
                {hotel.amenidades.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const next = [...hotel.amenidades];
                        next[idx] = e.target.value;
                        setHotel((p) => ({ ...p, amenidades: next }));
                      }}
                      className="panel-input flex-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setHotel((p) => ({
                          ...p,
                          amenidades: p.amenidades.filter((_, i) => i !== idx),
                        }))
                      }
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setHotel((p) => ({ ...p, amenidades: [...p.amenidades, ""] }))}
                className="mt-2 flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
              >
                <Plus className="w-4 h-4" />
                Anadir amenidad
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ FLIGHTS TAB ------ */}
        {tab === "flights" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vuelos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label">Aeropuerto de llegada</label>
                <input
                  type="text"
                  value={vuelos.aeropuerto_llegada}
                  onChange={(e) => setVuelos((p) => ({ ...p, aeropuerto_llegada: e.target.value }))}
                  className="panel-input w-full"
                  placeholder="Ej: Aeropuerto de Marrakech (RAK)"
                />
              </div>
              <div>
                <label className="panel-label">Aeropuerto de regreso</label>
                <input
                  type="text"
                  value={vuelos.aeropuerto_regreso}
                  onChange={(e) => setVuelos((p) => ({ ...p, aeropuerto_regreso: e.target.value }))}
                  className="panel-input w-full"
                  placeholder="Ej: Aeropuerto de Marrakech (RAK)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="panel-label">Notas sobre vuelos</label>
                <textarea
                  rows={3}
                  value={vuelos.nota}
                  onChange={(e) => setVuelos((p) => ({ ...p, nota: e.target.value }))}
                  className="panel-input w-full"
                  placeholder="Informacion adicional sobre los vuelos..."
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ INCLUDED / NOT INCLUDED TAB ------ */}
        {tab === "included" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Incluido / No incluido
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Incluido */}
              <div>
                <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Incluido
                </h3>
                <div className="space-y-2">
                  {incluido.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const next = [...incluido];
                          next[idx] = e.target.value;
                          setIncluido(next);
                        }}
                        className="panel-input flex-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setIncluido((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setIncluido((prev) => [...prev, ""])}
                  className="mt-2 flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  Anadir
                </button>
              </div>

              {/* No incluido */}
              <div>
                <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4" />
                  No incluido
                </h3>
                <div className="space-y-2">
                  {noIncluido.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const next = [...noIncluido];
                          next[idx] = e.target.value;
                          setNoIncluido(next);
                        }}
                        className="panel-input flex-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setNoIncluido((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setNoIncluido((prev) => [...prev, ""])}
                  className="mt-2 flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  Anadir
                </button>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ DEPARTURES TAB ------ */}
        {tab === "departures" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Salidas programadas
            </h2>
            {salidas.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-white/40">
                No hay salidas programadas. Anade la primera.
              </p>
            )}
            <div className="space-y-3">
              {salidas.map((s, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end p-4 rounded-xl border border-gray-200 dark:border-white/10"
                >
                  <div>
                    <label className="panel-label text-xs">Fecha</label>
                    <input
                      type="date"
                      value={s.fecha}
                      onChange={(e) => {
                        const next = [...salidas];
                        next[idx] = { ...next[idx], fecha: e.target.value };
                        setSalidas(next);
                      }}
                      className="panel-input w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="panel-label text-xs">Estado</label>
                    <select
                      value={s.estado}
                      onChange={(e) => {
                        const next = [...salidas];
                        next[idx] = { ...next[idx], estado: e.target.value };
                        setSalidas(next);
                      }}
                      className="panel-input w-full text-sm"
                    >
                      <option value="confirmed">Confirmado</option>
                      <option value="lastSpots">Ultimas plazas</option>
                      <option value="soldOut">Agotado</option>
                    </select>
                  </div>
                  <div>
                    <label className="panel-label text-xs">Precio</label>
                    <input
                      type="number"
                      min={0}
                      value={s.precio || ""}
                      onChange={(e) => {
                        const next = [...salidas];
                        next[idx] = { ...next[idx], precio: Number(e.target.value) || 0 };
                        setSalidas(next);
                      }}
                      className="panel-input w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="panel-label text-xs">Plazas</label>
                    <input
                      type="number"
                      min={0}
                      value={s.plazas || ""}
                      onChange={(e) => {
                        const next = [...salidas];
                        next[idx] = { ...next[idx], plazas: Number(e.target.value) || 0 };
                        setSalidas(next);
                      }}
                      className="panel-input w-full text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => setSalidas((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setSalidas((prev) => [
                  ...prev,
                  { fecha: "", estado: "confirmed", precio: 0, plazas: 0 },
                ])
              }
              className="flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
            >
              <Plus className="w-4 h-4" />
              Anadir salida
            </button>
            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ FAQS TAB ------ */}
        {tab === "faqs" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Preguntas frecuentes
            </h2>
            {faqs.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-white/40">
                No hay preguntas frecuentes. Anade la primera.
              </p>
            )}
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-gray-200 dark:border-white/10 space-y-3"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <label className="panel-label text-xs">Pregunta</label>
                      <input
                        type="text"
                        value={faq.pregunta}
                        onChange={(e) => {
                          const next = [...faqs];
                          next[idx] = { ...next[idx], pregunta: e.target.value };
                          setFaqs(next);
                        }}
                        className="panel-input w-full text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-1 pt-5 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const next = [...faqs];
                          [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                          setFaqs(next);
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === faqs.length - 1}
                        onClick={() => {
                          const next = [...faqs];
                          [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                          setFaqs(next);
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setFaqs((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="panel-label text-xs">Respuesta</label>
                    <textarea
                      rows={2}
                      value={faq.respuesta}
                      onChange={(e) => {
                        const next = [...faqs];
                        next[idx] = { ...next[idx], respuesta: e.target.value };
                        setFaqs(next);
                      }}
                      className="panel-input w-full text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setFaqs((prev) => [...prev, { pregunta: "", respuesta: "" }])}
              className="flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
            >
              <Plus className="w-4 h-4" />
              Anadir pregunta
            </button>
            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ COORDINATOR TAB ------ */}
        {tab === "coordinator" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Coordinador</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label">Nombre</label>
                <input
                  type="text"
                  value={coordinador.nombre}
                  onChange={(e) => setCoordinador((p) => ({ ...p, nombre: e.target.value }))}
                  className="panel-input w-full"
                />
              </div>
              <div>
                <label className="panel-label">Rol</label>
                <input
                  type="text"
                  value={coordinador.rol}
                  onChange={(e) => setCoordinador((p) => ({ ...p, rol: e.target.value }))}
                  className="panel-input w-full"
                  placeholder="Ej: Coordinador de grupo"
                />
              </div>
              <div className="md:col-span-2">
                <label className="panel-label">Avatar</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coordinador.avatar}
                    onChange={(e) => setCoordinador((p) => ({ ...p, avatar: e.target.value }))}
                    className="panel-input w-full flex-1"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => openUnsplash("coordinador_avatar")}
                    className="shrink-0 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-gray-500 dark:text-white/50" />
                  </button>
                </div>
                {coordinador.avatar && (
                  <div className="mt-2 rounded-full border border-gray-200 dark:border-white/10 overflow-hidden w-20 h-20">
                    <img
                      src={coordinador.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="panel-label">Descripcion</label>
                <textarea
                  rows={3}
                  value={coordinador.descripcion}
                  onChange={(e) => setCoordinador((p) => ({ ...p, descripcion: e.target.value }))}
                  className="panel-input w-full"
                />
              </div>
            </div>

            {/* Idiomas */}
            <div>
              <label className="panel-label mb-2 block">Idiomas</label>
              <div className="space-y-2">
                {coordinador.idiomas.map((lang, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={lang}
                      onChange={(e) => {
                        const next = [...coordinador.idiomas];
                        next[idx] = e.target.value;
                        setCoordinador((p) => ({ ...p, idiomas: next }));
                      }}
                      className="panel-input flex-1 text-sm"
                      placeholder="Ej: Espanol"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCoordinador((p) => ({
                          ...p,
                          idiomas: p.idiomas.filter((_, i) => i !== idx),
                        }))
                      }
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCoordinador((p) => ({ ...p, idiomas: [...p.idiomas, ""] }))}
                className="mt-2 flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
              >
                <Plus className="w-4 h-4" />
                Anadir idioma
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ TAGS & CLIMATE TAB ------ */}
        {tab === "tags" && (
          <div className="space-y-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tags, Highlights y Clima
            </h2>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-white/70 mb-3 flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                Tags
              </h3>
              <div className="space-y-2">
                {tags.map((tag, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => {
                        const next = [...tags];
                        next[idx] = e.target.value;
                        setTags(next);
                      }}
                      className="panel-input flex-1 text-sm"
                      placeholder="Ej: aventura, playa, cultura"
                    />
                    <button
                      type="button"
                      onClick={() => setTags((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setTags((prev) => [...prev, ""])}
                className="mt-2 flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
              >
                <Plus className="w-4 h-4" />
                Anadir tag
              </button>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-white/70 mb-3 flex items-center gap-1.5">
                <Mountain className="w-4 h-4" />
                Highlights
              </h3>
              <div className="space-y-2">
                {highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => {
                        const next = [...highlights];
                        next[idx] = e.target.value;
                        setHighlights(next);
                      }}
                      className="panel-input flex-1 text-sm"
                      placeholder="Ej: Visita al desierto del Sahara"
                    />
                    <button
                      type="button"
                      onClick={() => setHighlights((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setHighlights((prev) => [...prev, ""])}
                className="mt-2 flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
              >
                <Plus className="w-4 h-4" />
                Anadir highlight
              </button>
            </div>

            {/* Clima */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-white/70 mb-3 flex items-center gap-1.5">
                <Cloud className="w-4 h-4" />
                Clima
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="panel-label">Temperatura media</label>
                  <input
                    type="text"
                    value={clima.temp_avg}
                    onChange={(e) => setClima((p) => ({ ...p, temp_avg: e.target.value }))}
                    className="panel-input w-full"
                    placeholder="Ej: 25 C"
                  />
                </div>
                <div>
                  <label className="panel-label">Mejores meses</label>
                  <input
                    type="text"
                    value={clima.best_months}
                    onChange={(e) => setClima((p) => ({ ...p, best_months: e.target.value }))}
                    className="panel-input w-full"
                    placeholder="Ej: Marzo a Octubre"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="panel-label">Descripcion del clima</label>
                  <textarea
                    rows={2}
                    value={clima.description}
                    onChange={(e) => setClima((p) => ({ ...p, description: e.target.value }))}
                    className="panel-input w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/*  UNSPLASH PICKER (shared across all tabs)                     */}
      {/* ============================================================ */}
      <UnsplashPicker
        open={unsplashOpen}
        onClose={() => setUnsplashOpen(false)}
        onSelect={handleUnsplashSelect}
        defaultQuery={nombre}
      />
    </div>
  );
}
