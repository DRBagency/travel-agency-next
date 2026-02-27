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

interface HabitacionData {
  tipo: string;
  descripcion: string;
  suplemento: number;
  capacidad: number;
  imagen: string;
}

interface HotelData {
  nombre: string;
  estrellas: number;
  imagen: string;
  descripcion: string;
  amenidades: string[];
  direccion: string;
  desayuno_incluido: boolean;
  regimen: string;
  suplemento: number;
  habitaciones: HabitacionData[];
}

function normalizeHotels(raw: any): HotelData[] {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr.map((h: any) => ({
    nombre: h.nombre || h.name || "",
    estrellas: h.estrellas ?? h.stars ?? 0,
    imagen: h.imagen || h.image || "",
    descripcion: h.descripcion || h.description || "",
    amenidades: h.amenidades || h.amenities || [],
    direccion: h.direccion || h.address || "",
    desayuno_incluido: h.desayuno_incluido ?? false,
    regimen: h.regimen || "solo_alojamiento",
    suplemento: h.suplemento ?? 0,
    habitaciones: (h.habitaciones || []).map((r: any) => ({
      tipo: r.tipo || "",
      descripcion: r.descripcion || "",
      suplemento: r.suplemento ?? 0,
      capacidad: r.capacidad ?? 2,
      imagen: r.imagen || "",
    })),
  }));
}

const EMPTY_HOTEL: HotelData = {
  nombre: "", estrellas: 0, imagen: "", descripcion: "", amenidades: [], direccion: "",
  desayuno_incluido: false, regimen: "solo_alojamiento", suplemento: 0, habitaciones: [],
};

const EMPTY_ROOM: HabitacionData = {
  tipo: "", descripcion: "", suplemento: 0, capacidad: 2, imagen: "",
};

interface FlightSegment {
  fecha: string;
  hora_salida: string;
  hora_llegada: string;
  llegada_dia_siguiente: boolean;
  origen_codigo: string;
  origen_ciudad: string;
  destino_codigo: string;
  destino_ciudad: string;
  duracion: string;
  escalas: string;
  aerolinea: string;
  numero_vuelo: string;
  clase: string;
  equipaje: string;
  estado: string;
}

interface VuelosData {
  segmentos: FlightSegment[];
  nota: string;
}

const EMPTY_SEGMENT: FlightSegment = {
  fecha: "", hora_salida: "", hora_llegada: "", llegada_dia_siguiente: false,
  origen_codigo: "", origen_ciudad: "", destino_codigo: "", destino_ciudad: "",
  duracion: "", escalas: "Directo", aerolinea: "", numero_vuelo: "",
  clase: "Turista", equipaje: "", estado: "OK",
};

function normalizeVuelos(raw: any): VuelosData {
  if (!raw) return { segmentos: [], nota: "" };
  // New format already
  if (Array.isArray(raw.segmentos)) return raw;
  // Old format: { aeropuerto_llegada, aeropuerto_regreso, nota }
  if (raw.aeropuerto_llegada || raw.aeropuerto_regreso || raw.arrival || raw.returnAirport) {
    return { segmentos: [], nota: raw.nota || raw.notes || "" };
  }
  return { segmentos: [], nota: raw.nota || "" };
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
  const [expandedHotel, setExpandedHotel] = useState<number>(0);
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
  const [hoteles, setHoteles] = useState<HotelData[]>(() => normalizeHotels(destino.hotel));
  const [vuelos, setVuelos] = useState<VuelosData>(() => normalizeVuelos(destino.vuelos));
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
          hotel: hoteles,
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
          dificultad, duracion, itinerario, hotel: hoteles, vuelos, coordinador,
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
      case "coordinador_avatar":
        setCoordinador((prev) => ({ ...prev, avatar: url }));
        break;
      default:
        // Hotel image — field key is "hotel_imagen_<hotelIndex>"
        if (unsplashField.startsWith("hotel_imagen_")) {
          const hIdx = Number(unsplashField.split("_")[2]);
          setHoteles((prev) => prev.map((h, i) => i === hIdx ? { ...h, imagen: url } : h));
        }
        // Room image — field key is "room_imagen_<hotelIndex>_<roomIndex>"
        if (unsplashField.startsWith("room_imagen_")) {
          const parts = unsplashField.split("_");
          const hIdx = Number(parts[2]);
          const rIdx = Number(parts[3]);
          setHoteles((prev) => prev.map((h, i) => {
            if (i !== hIdx) return h;
            return { ...h, habitaciones: h.habitaciones.map((r, j) => j === rIdx ? { ...r, imagen: url } : r) };
          }));
        }
        // Itinerary day image — field key is "itinerary_day_<index>"
        if (unsplashField.startsWith("itinerary_day_")) {
          const idx = Number(unsplashField.split("_")[2]);
          setItinerario((prev: any) => {
            if (!prev) return prev;
            const updated = JSON.parse(JSON.stringify(prev));
            const dias = updated.dias || updated.days || [];
            if (dias[idx]) {
              dias[idx].imagen = url;
            }
            return updated;
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
                className={`flex items-center gap-2 px-4 py-3 text-[15px] whitespace-nowrap transition-colors border-b-2 ${
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Información general
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
                <label className="panel-label">Subtítulo</label>
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
                  placeholder="Ej: Más vendido"
                />
              </div>
              {/* categoria */}
              <div>
                <label className="panel-label">Categoría</label>
                <input
                  type="text"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="panel-input w-full"
                />
              </div>
              {/* pais */}
              <div>
                <label className="panel-label">País</label>
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
                  <option value="facil">Fácil</option>
                  <option value="moderado">Moderado</option>
                  <option value="dificil">Difícil</option>
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
                <label className="panel-label">Duración</label>
                <input
                  type="text"
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  className="panel-input w-full"
                  placeholder="Ej: 7 días / 6 noches"
                />
              </div>
              {/* grupo_max */}
              <div>
                <label className="panel-label">Grupo máximo</label>
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
                <label className="panel-label">Edad mínima</label>
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
                <label className="panel-label">Edad máxima</label>
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
              <label className="panel-label">Descripción corta</label>
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="panel-input w-full"
              />
            </div>
            {/* descripcion_larga */}
            <div>
              <label className="panel-label">Descripción larga</label>
              <textarea
                rows={5}
                value={descripcionLarga}
                onChange={(e) => setDescripcionLarga(e.target.value)}
                className="panel-input w-full"
              />
            </div>
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
            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ PRICING TAB ------ */}
        {tab === "pricing" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Precios</h2>
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
                <label className="panel-label">Precio niño</label>
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

        {/* ------ ITINERARY TAB ------ */}
        {tab === "itinerary" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Itinerario</h2>
            {itinerario ? (
              <ItineraryEditor
                itinerario={itinerario}
                onChange={(updated) => setItinerario(updated)}
                onOpenUnsplash={openUnsplash}
              />
            ) : (
              <div className="text-center py-12 text-gray-400 dark:text-white/40">
                <Mountain className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm mb-4">
                  Este destino aún no tiene itinerario. Puedes generarlo desde la sección de AI o
                  crearlo manualmente.
                </p>
                <button
                  type="button"
                  onClick={() => setItinerario({
                    dias: [{ dia: 1, titulo: "", actividades: { manana: { titulo: "", descripcion: "", precio_estimado: "", duracion: "" }, tarde: { titulo: "", descripcion: "", precio_estimado: "", duracion: "" }, noche: { titulo: "", descripcion: "", precio_estimado: "", duracion: "" } }, tip_local: "", imagen: "" }],
                    tips_generales: [],
                    mejor_epoca: "",
                    clima: "",
                    que_llevar: [],
                  })}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-drb-turquoise-500 text-white text-sm font-medium hover:bg-drb-turquoise-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Crear itinerario manualmente
                </button>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ HOTEL TAB ------ */}
        {tab === "hotel" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('hotel')}</h2>
              <button
                type="button"
                onClick={() => { setHoteles((prev) => [...prev, { ...EMPTY_HOTEL }]); setExpandedHotel(hoteles.length); }}
                className="flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
              >
                <Plus className="w-4 h-4" />
                {t('addHotel')}
              </button>
            </div>

            {hoteles.length === 0 && (
              <div className="text-center py-10 text-gray-400 dark:text-white/30 text-sm">
                {t('noHotelsYet')}
              </div>
            )}

            {hoteles.map((htl, hIdx) => {
              const updateHotel = (patch: Partial<HotelData>) =>
                setHoteles((prev) => prev.map((h, i) => (i === hIdx ? { ...h, ...patch } : h)));

              const isExpanded = expandedHotel === hIdx;

              return (
                <div key={hIdx} className="panel-card overflow-hidden">
                  {/* Hotel header — clickable to toggle */}
                  <button
                    type="button"
                    onClick={() => setExpandedHotel(isExpanded ? -1 : hIdx)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors text-start"
                  >
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Hotel className="w-4 h-4 text-drb-turquoise-500" />
                      {htl.nombre || t('hotelNumber', { n: hIdx + 1 })}
                      {htl.estrellas > 0 && (
                        <span className="text-amber-500 text-sm">{"★".repeat(htl.estrellas)}</span>
                      )}
                      {htl.suplemento > 0 && (
                        <span className="text-xs font-medium text-gray-400 dark:text-white/40">+{htl.suplemento}€</span>
                      )}
                      {htl.habitaciones.length > 0 && (
                        <span className="text-xs font-medium text-gray-400 dark:text-white/30">{htl.habitaciones.length} hab.</span>
                      )}
                    </h3>
                    <div className="flex items-center gap-1">
                      {hIdx > 0 && (
                        <span role="button" onClick={(e) => { e.stopPropagation(); setHoteles((prev) => { const c = [...prev]; [c[hIdx - 1], c[hIdx]] = [c[hIdx], c[hIdx - 1]]; return c; }); setExpandedHotel(hIdx - 1); }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors">
                          <ChevronUp className="w-4 h-4" />
                        </span>
                      )}
                      {hIdx < hoteles.length - 1 && (
                        <span role="button" onClick={(e) => { e.stopPropagation(); setHoteles((prev) => { const c = [...prev]; [c[hIdx], c[hIdx + 1]] = [c[hIdx + 1], c[hIdx]]; return c; }); setExpandedHotel(hIdx + 1); }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors">
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      )}
                      <span role="button" onClick={(e) => { e.stopPropagation(); setHoteles((prev) => prev.filter((_, i) => i !== hIdx)); if (expandedHotel >= hoteles.length - 1) setExpandedHotel(Math.max(0, hoteles.length - 2)); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  {/* Collapsible body */}
                  {isExpanded && (
                  <div className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-white/[0.06]">
                  {/* Basic info */}
                  <p className="text-sm font-semibold text-gray-500 dark:text-white/50 pt-4">{t('hotelBasicInfo')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="panel-label">{t('hotelName')}</label>
                      <input type="text" value={htl.nombre} onChange={(e) => updateHotel({ nombre: e.target.value })} className="panel-input w-full" />
                    </div>
                    <div>
                      <label className="panel-label">{t('hotelStars')}</label>
                      <input type="number" min={1} max={5} value={htl.estrellas || ""} onChange={(e) => updateHotel({ estrellas: Number(e.target.value) || 0 })} className="panel-input w-full" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="panel-label">{t('hotelImage')}</label>
                      <div className="flex gap-2">
                        <input type="text" value={htl.imagen} onChange={(e) => updateHotel({ imagen: e.target.value })} className="panel-input w-full flex-1" placeholder="https://..." />
                        <button type="button" onClick={() => openUnsplash(`hotel_imagen_${hIdx}`)}
                          className="shrink-0 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors">
                          <ImageIcon className="w-4 h-4 text-gray-500 dark:text-white/50" />
                        </button>
                      </div>
                      {htl.imagen && (
                        <div className="mt-2 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden max-w-xs">
                          <img src={htl.imagen} alt="Hotel" className="w-full h-28 object-cover" />
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="panel-label">{t('hotelDescription')}</label>
                      <textarea rows={3} value={htl.descripcion} onChange={(e) => updateHotel({ descripcion: e.target.value })} className="panel-input w-full" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="panel-label">{t('hotelAddress')}</label>
                      <input type="text" value={htl.direccion} onChange={(e) => updateHotel({ direccion: e.target.value })} className="panel-input w-full" placeholder="Calle o URL de Google Maps" />
                    </div>
                  </div>

                  {/* Regimen & supplement */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="panel-label">{t('regimen')}</label>
                      <select value={htl.regimen} onChange={(e) => updateHotel({ regimen: e.target.value })} className="panel-input w-full">
                        <option value="solo_alojamiento">{t('regimenRoomOnly')}</option>
                        <option value="desayuno">{t('regimenBreakfast')}</option>
                        <option value="media_pension">{t('regimenHalfBoard')}</option>
                        <option value="pension_completa">{t('regimenFullBoard')}</option>
                        <option value="todo_incluido">{t('regimenAllInclusive')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="panel-label">{t('hotelSupplement')}</label>
                      <input type="number" min={0} value={htl.suplemento || ""} onChange={(e) => updateHotel({ suplemento: Number(e.target.value) || 0 })} className="panel-input w-full" placeholder="0" />
                      <p className="text-xs text-gray-400 dark:text-white/30 mt-1">{t('hotelSupplementHint')}</p>
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={htl.desayuno_incluido} onChange={(e) => updateHotel({ desayuno_incluido: e.target.checked })} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 dark:bg-white/10 peer-checked:bg-drb-turquoise-500 rounded-full peer-focus:ring-2 peer-focus:ring-drb-turquoise-500/30 transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full" />
                      </label>
                      <span className="text-sm text-gray-700 dark:text-white/70">{t('breakfastIncluded')}</span>
                    </div>
                  </div>

                  {/* Amenidades */}
                  <div>
                    <label className="panel-label mb-2 block">{t('amenities')}</label>
                    <div className="space-y-2">
                      {htl.amenidades.map((item, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-2">
                          <input type="text" value={item}
                            onChange={(e) => { const next = [...htl.amenidades]; next[aIdx] = e.target.value; updateHotel({ amenidades: next }); }}
                            className="panel-input flex-1" />
                          <button type="button" onClick={() => updateHotel({ amenidades: htl.amenidades.filter((_, i) => i !== aIdx) })}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => updateHotel({ amenidades: [...htl.amenidades, ""] })}
                      className="mt-2 flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline">
                      <Plus className="w-4 h-4" />
                      {t('addAmenity')}
                    </button>
                  </div>

                  {/* Habitaciones */}
                  <div className="border-t border-gray-200 dark:border-white/10 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-gray-500 dark:text-white/50">{t('hotelRoomsAndPricing')}</p>
                      <button type="button" onClick={() => updateHotel({ habitaciones: [...htl.habitaciones, { ...EMPTY_ROOM }] })}
                        className="flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline">
                        <Plus className="w-4 h-4" />
                        {t('addRoom')}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {htl.habitaciones.map((room, rIdx) => {
                        const updateRoom = (patch: Partial<HabitacionData>) =>
                          updateHotel({
                            habitaciones: htl.habitaciones.map((r, i) => (i === rIdx ? { ...r, ...patch } : r)),
                          });
                        return (
                          <div key={rIdx} className="rounded-xl border border-gray-200 dark:border-white/10 p-4 space-y-3 bg-gray-50/50 dark:bg-white/[0.02]">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700 dark:text-white/70">
                                {room.tipo || `${t('roomType')} ${rIdx + 1}`}
                              </span>
                              <button type="button" onClick={() => updateHotel({ habitaciones: htl.habitaciones.filter((_, i) => i !== rIdx) })}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="panel-label">{t('roomType')}</label>
                                <input type="text" value={room.tipo} onChange={(e) => updateRoom({ tipo: e.target.value })} className="panel-input w-full" placeholder={t('roomTypePlaceholder')} />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="panel-label">{t('roomSupplement')}</label>
                                  <input type="number" min={0} value={room.suplemento || ""} onChange={(e) => updateRoom({ suplemento: Number(e.target.value) || 0 })} className="panel-input w-full" placeholder="0" />
                                </div>
                                <div>
                                  <label className="panel-label">{t('roomCapacity')}</label>
                                  <input type="number" min={1} max={10} value={room.capacidad || ""} onChange={(e) => updateRoom({ capacidad: Number(e.target.value) || 1 })} className="panel-input w-full" />
                                </div>
                              </div>
                              <div className="md:col-span-2">
                                <label className="panel-label">{t('roomDescription')}</label>
                                <input type="text" value={room.descripcion} onChange={(e) => updateRoom({ descripcion: e.target.value })} className="panel-input w-full" />
                              </div>
                              <div className="md:col-span-2">
                                <label className="panel-label">{t('roomImage')}</label>
                                <div className="flex gap-2">
                                  <input type="text" value={room.imagen} onChange={(e) => updateRoom({ imagen: e.target.value })} className="panel-input w-full flex-1" placeholder="https://..." />
                                  <button type="button" onClick={() => openUnsplash(`room_imagen_${hIdx}_${rIdx}`)}
                                    className="shrink-0 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors">
                                    <ImageIcon className="w-4 h-4 text-gray-500 dark:text-white/50" />
                                  </button>
                                </div>
                                {room.imagen && (
                                  <div className="mt-2 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden max-w-[200px]">
                                    <img src={room.imagen} alt={room.tipo} className="w-full h-20 object-cover" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  </div>
                  )}
                </div>
              );
            })}

            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ FLIGHTS TAB ------ */}
        {tab === "flights" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('flights')}</h2>
              <button
                type="button"
                onClick={() => setVuelos((p) => ({ ...p, segmentos: [...p.segmentos, { ...EMPTY_SEGMENT }] }))}
                className="flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
              >
                <Plus className="w-4 h-4" />
                {t('addFlight')}
              </button>
            </div>

            {vuelos.segmentos.length === 0 && (
              <div className="text-center py-10 text-gray-400 dark:text-white/30 text-sm">
                {t('noFlightsYet')}
              </div>
            )}

            {vuelos.segmentos.map((seg, sIdx) => {
              const updateSeg = (patch: Partial<FlightSegment>) =>
                setVuelos((p) => ({ ...p, segmentos: p.segmentos.map((s, i) => (i === sIdx ? { ...s, ...patch } : s)) }));
              const label = sIdx === 0 ? t('outbound') : sIdx === 1 ? t('returnFlight') : t('flightSegment', { n: sIdx + 1 });

              return (
                <div key={sIdx} className="panel-card p-5 space-y-4">
                  {/* Segment header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Plane className={`w-4 h-4 text-drb-turquoise-500 ${sIdx > 0 ? "rotate-180" : ""}`} />
                      {label}
                      {seg.origen_codigo && seg.destino_codigo && (
                        <span className="text-sm font-medium text-gray-400 dark:text-white/40">
                          {seg.origen_codigo} → {seg.destino_codigo}
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-1">
                      {sIdx > 0 && (
                        <button type="button" onClick={() => setVuelos((p) => { const c = [...p.segmentos]; [c[sIdx - 1], c[sIdx]] = [c[sIdx], c[sIdx - 1]]; return { ...p, segmentos: c }; })}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors">
                          <ChevronUp className="w-4 h-4" />
                        </button>
                      )}
                      {sIdx < vuelos.segmentos.length - 1 && (
                        <button type="button" onClick={() => setVuelos((p) => { const c = [...p.segmentos]; [c[sIdx], c[sIdx + 1]] = [c[sIdx + 1], c[sIdx]]; return { ...p, segmentos: c }; })}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors">
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      )}
                      <button type="button" onClick={() => setVuelos((p) => ({ ...p, segmentos: p.segmentos.filter((_, i) => i !== sIdx) }))}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Row 1: Date, departure, arrival, duration */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="panel-label">{t('flightDate')}</label>
                      <input type="date" value={seg.fecha} onChange={(e) => updateSeg({ fecha: e.target.value })} className="panel-input w-full" />
                    </div>
                    <div>
                      <label className="panel-label">{t('departureTime')}</label>
                      <input type="time" value={seg.hora_salida} onChange={(e) => updateSeg({ hora_salida: e.target.value })} className="panel-input w-full" />
                    </div>
                    <div>
                      <label className="panel-label">{t('arrivalTime')}</label>
                      <div className="flex gap-2">
                        <input type="time" value={seg.hora_llegada} onChange={(e) => updateSeg({ hora_llegada: e.target.value })} className="panel-input w-full" />
                      </div>
                      <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                        <input type="checkbox" checked={seg.llegada_dia_siguiente} onChange={(e) => updateSeg({ llegada_dia_siguiente: e.target.checked })}
                          className="w-3.5 h-3.5 rounded border-gray-300 dark:border-white/20 text-drb-turquoise-500 focus:ring-drb-turquoise-500" />
                        <span className="text-xs text-gray-500 dark:text-white/40">{t('nextDay')}</span>
                      </label>
                    </div>
                    <div>
                      <label className="panel-label">{t('flightDuration')}</label>
                      <input type="text" value={seg.duracion} onChange={(e) => updateSeg({ duracion: e.target.value })} className="panel-input w-full" placeholder="9h 15min" />
                    </div>
                  </div>

                  {/* Row 2: Origin & Destination */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="panel-label">{t('originCode')}</label>
                      <input type="text" value={seg.origen_codigo} onChange={(e) => updateSeg({ origen_codigo: e.target.value.toUpperCase() })} className="panel-input w-full" placeholder="MAD" maxLength={4} />
                    </div>
                    <div>
                      <label className="panel-label">{t('originCity')}</label>
                      <input type="text" value={seg.origen_ciudad} onChange={(e) => updateSeg({ origen_ciudad: e.target.value })} className="panel-input w-full" placeholder="Madrid" />
                    </div>
                    <div>
                      <label className="panel-label">{t('destinationCode')}</label>
                      <input type="text" value={seg.destino_codigo} onChange={(e) => updateSeg({ destino_codigo: e.target.value.toUpperCase() })} className="panel-input w-full" placeholder="SDQ" maxLength={4} />
                    </div>
                    <div>
                      <label className="panel-label">{t('destinationCity')}</label>
                      <input type="text" value={seg.destino_ciudad} onChange={(e) => updateSeg({ destino_ciudad: e.target.value })} className="panel-input w-full" placeholder="Santo Domingo" />
                    </div>
                  </div>

                  {/* Row 3: Airline, flight number, class, stops */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="panel-label">{t('airline')}</label>
                      <input type="text" value={seg.aerolinea} onChange={(e) => updateSeg({ aerolinea: e.target.value })} className="panel-input w-full" placeholder="World 2 Fly" />
                    </div>
                    <div>
                      <label className="panel-label">{t('flightNumber')}</label>
                      <input type="text" value={seg.numero_vuelo} onChange={(e) => updateSeg({ numero_vuelo: e.target.value })} className="panel-input w-full" placeholder="2W-3409" />
                    </div>
                    <div>
                      <label className="panel-label">{t('flightClass')}</label>
                      <select value={seg.clase} onChange={(e) => updateSeg({ clase: e.target.value })} className="panel-input w-full">
                        <option value="Turista">{t('classTourist')}</option>
                        <option value="Premium Economy">{t('classPremium')}</option>
                        <option value="Business">{t('classBusiness')}</option>
                        <option value="Primera">{t('classFirst')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="panel-label">{t('stops')}</label>
                      <input type="text" value={seg.escalas} onChange={(e) => updateSeg({ escalas: e.target.value })} className="panel-input w-full" placeholder={t('direct')} />
                    </div>
                  </div>

                  {/* Row 4: Baggage, status */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="panel-label">{t('baggage')}</label>
                      <input type="text" value={seg.equipaje} onChange={(e) => updateSeg({ equipaje: e.target.value })} className="panel-input w-full" placeholder="Equipaje facturado 1PC" />
                    </div>
                    <div>
                      <label className="panel-label">{t('flightStatus')}</label>
                      <input type="text" value={seg.estado} onChange={(e) => updateSeg({ estado: e.target.value })} className="panel-input w-full" placeholder="OK" />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Notes */}
            <div>
              <label className="panel-label">{t('flightNotes')}</label>
              <textarea
                rows={2}
                value={vuelos.nota}
                onChange={(e) => setVuelos((p) => ({ ...p, nota: e.target.value }))}
                className="panel-input w-full"
                placeholder="Información adicional sobre los vuelos..."
              />
            </div>

            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ INCLUDED / NOT INCLUDED TAB ------ */}
        {tab === "included" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Incluido / No incluido
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Incluido */}
              <div>
                <h3 className="text-base font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
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
                        className="panel-input flex-1"
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
                  Añadir
                </button>
              </div>

              {/* No incluido */}
              <div>
                <h3 className="text-base font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
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
                        className="panel-input flex-1"
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
                  Añadir
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Salidas programadas
            </h2>
            {salidas.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-white/40">
                No hay salidas programadas. Añade la primera.
              </p>
            )}
            <div className="space-y-3">
              {salidas.map((s, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end p-5 rounded-xl border border-gray-200 dark:border-white/10"
                >
                  <div>
                    <label className="panel-label">Fecha</label>
                    <input
                      type="date"
                      value={s.fecha}
                      onChange={(e) => {
                        const next = [...salidas];
                        next[idx] = { ...next[idx], fecha: e.target.value };
                        setSalidas(next);
                      }}
                      className="panel-input w-full"
                    />
                  </div>
                  <div>
                    <label className="panel-label">Estado</label>
                    <select
                      value={s.estado}
                      onChange={(e) => {
                        const next = [...salidas];
                        next[idx] = { ...next[idx], estado: e.target.value };
                        setSalidas(next);
                      }}
                      className="panel-input w-full"
                    >
                      <option value="confirmed">Confirmado</option>
                      <option value="lastSpots">Últimas plazas</option>
                      <option value="soldOut">Agotado</option>
                    </select>
                  </div>
                  <div>
                    <label className="panel-label">Precio</label>
                    <input
                      type="number"
                      min={0}
                      value={s.precio || ""}
                      onChange={(e) => {
                        const next = [...salidas];
                        next[idx] = { ...next[idx], precio: Number(e.target.value) || 0 };
                        setSalidas(next);
                      }}
                      className="panel-input w-full"
                    />
                  </div>
                  <div>
                    <label className="panel-label">Plazas</label>
                    <input
                      type="number"
                      min={0}
                      value={s.plazas || ""}
                      onChange={(e) => {
                        const next = [...salidas];
                        next[idx] = { ...next[idx], plazas: Number(e.target.value) || 0 };
                        setSalidas(next);
                      }}
                      className="panel-input w-full"
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
              Añadir salida
            </button>
            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ FAQS TAB ------ */}
        {tab === "faqs" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Preguntas frecuentes
            </h2>
            {faqs.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-white/40">
                No hay preguntas frecuentes. Añade la primera.
              </p>
            )}
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-gray-200 dark:border-white/10 space-y-4"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <label className="panel-label">Pregunta</label>
                      <input
                        type="text"
                        value={faq.pregunta}
                        onChange={(e) => {
                          const next = [...faqs];
                          next[idx] = { ...next[idx], pregunta: e.target.value };
                          setFaqs(next);
                        }}
                        className="panel-input w-full"
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
                    <label className="panel-label">Respuesta</label>
                    <textarea
                      rows={2}
                      value={faq.respuesta}
                      onChange={(e) => {
                        const next = [...faqs];
                        next[idx] = { ...next[idx], respuesta: e.target.value };
                        setFaqs(next);
                      }}
                      className="panel-input w-full"
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
              Añadir pregunta
            </button>
            <div className="flex justify-end pt-2">
              <SaveButton />
            </div>
          </div>
        )}

        {/* ------ COORDINATOR TAB ------ */}
        {tab === "coordinator" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Coordinador</h2>
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
                <label className="panel-label">Descripción</label>
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
                      className="panel-input flex-1"
                      placeholder="Ej: Español"
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
                Añadir idioma
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Tags, Highlights y Clima
            </h2>

            {/* Tags */}
            <div>
              <h3 className="text-base font-semibold text-gray-700 dark:text-white/70 mb-3 flex items-center gap-2">
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
                      className="panel-input flex-1"
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
                Añadir tag
              </button>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="text-base font-semibold text-gray-700 dark:text-white/70 mb-3 flex items-center gap-2">
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
                      className="panel-input flex-1"
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
                Añadir highlight
              </button>
            </div>

            {/* Clima */}
            <div>
              <h3 className="text-base font-semibold text-gray-700 dark:text-white/70 mb-3 flex items-center gap-2">
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
                    placeholder="Ej: 25 °C"
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
                  <label className="panel-label">Descripción del clima</label>
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
