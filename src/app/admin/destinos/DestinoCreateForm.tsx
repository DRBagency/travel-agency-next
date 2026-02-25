"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ImageIcon,
  Globe,
  Tag,
  Mountain,
  Plane,
  Hotel,
  Calendar,
  HelpCircle,
  User,
  Cloud,
  Check,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { isAILocked } from "@/lib/plan-gating";
import DestinoAIGenerator from "./DestinoAIGenerator";
import ItineraryEditor from "./ItineraryEditor";
import SubmitButton from "@/components/admin/SubmitButton";
import UnsplashPicker from "@/app/admin/mi-web/UnsplashPicker";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DestinoCreateFormProps {
  action: (formData: FormData) => Promise<void>;
  clienteId: string;
  plan?: string;
  labels: {
    name: string;
    description: string;
    priceLabel: string;
    pricePlaceholder: string;
    descriptionPlaceholder: string;
    namePlaceholder: string;
    publishNow: string;
    saveDestination: string;
  };
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

export default function DestinoCreateForm({
  action,
  clienteId,
  plan,
  labels,
}: DestinoCreateFormProps) {
  const t = useTranslations("admin.destinos");
  const aiAvailable = !isAILocked(plan);

  /* --- Active tab --- */
  const [tab, setTab] = useState<string>("general");

  /* --- Unsplash picker --- */
  const [unsplashOpen, setUnsplashOpen] = useState(false);
  const [unsplashField, setUnsplashField] = useState<string>("");

  /* ================================================================ */
  /*  All fields as state                                              */
  /* ================================================================ */

  // Strings
  const [nombre, setNombre] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [badge, setBadge] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [descripcionLarga, setDescripcionLarga] = useState("");
  const [categoria, setCategoria] = useState("");
  const [continente, setContinente] = useState("");
  const [dificultad, setDificultad] = useState("");
  const [duracion, setDuracion] = useState("");
  const [moneda, setMoneda] = useState("EUR");
  const [pais, setPais] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [coordenadas, setCoordenadas] = useState("");

  // Numbers
  const [reviews, setReviews] = useState(0);
  const [esfuerzo, setEsfuerzo] = useState(0);
  const [grupoMax, setGrupoMax] = useState(0);
  const [edadMin, setEdadMin] = useState(0);
  const [edadMax, setEdadMax] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [precioOriginal, setPrecioOriginal] = useState(0);
  const [precioAdulto, setPrecioAdulto] = useState(0);
  const [precioNino, setPrecioNino] = useState(0);
  const [precioGrupo, setPrecioGrupo] = useState(0);

  // Boolean
  const [activo, setActivo] = useState(true);

  // JSONB
  const [galeria, setGaleria] = useState<string[]>([]);
  const [itinerario, setItinerario] = useState<any>(null);
  const [hotel, setHotel] = useState<HotelData>({
    nombre: "",
    estrellas: 0,
    imagen: "",
    descripcion: "",
    amenidades: [],
    direccion: "",
  });
  const [vuelos, setVuelos] = useState<VuelosData>({
    aeropuerto_llegada: "",
    aeropuerto_regreso: "",
    nota: "",
  });
  const [incluido, setIncluido] = useState<string[]>([]);
  const [noIncluido, setNoIncluido] = useState<string[]>([]);
  const [salidas, setSalidas] = useState<SalidaItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [coordinador, setCoordinador] = useState<CoordinadorData>({
    nombre: "",
    avatar: "",
    rol: "",
    descripcion: "",
    idiomas: [],
  });
  const [tags, setTags] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [clima, setClima] = useState<ClimaData>({
    temp_avg: "",
    best_months: "",
    description: "",
  });

  /* ================================================================ */
  /*  AI handler                                                       */
  /* ================================================================ */

  const handleAIGenerated = (data: {
    nombre: string;
    descripcion: string;
    descripcion_larga: string;
    subtitle: string;
    tagline: string;
    badge: string;
    pais: string;
    continente: string;
    categoria: string;
    dificultad: string;
    duracion: string;
    esfuerzo: number;
    grupo_max: number;
    edad_min: number;
    edad_max: number;
    precio: number;
    precio_original: number;
    imagenUrl: string;
    tags: string[];
    highlights: string[];
    clima: any;
    hotel: any;
    vuelos: any;
    coordinador: any;
    incluido: string[];
    no_incluido: string[];
    faqs: any[];
    itinerario: any;
  }) => {
    setNombre(data.nombre);
    setDescripcion(data.descripcion);
    setPrecio(data.precio);
    setImagenUrl(data.imagenUrl);
    setItinerario(data.itinerario);
    setDescripcionLarga(data.descripcion_larga);
    setSubtitle(data.subtitle);
    setTagline(data.tagline);
    setBadge(data.badge);
    setPais(data.pais);
    setContinente(data.continente);
    setCategoria(data.categoria);
    setDificultad(data.dificultad);
    setDuracion(data.duracion);
    setEsfuerzo(data.esfuerzo);
    setGrupoMax(data.grupo_max);
    setEdadMin(data.edad_min);
    setEdadMax(data.edad_max);
    setPrecioOriginal(data.precio_original);
    setTags(data.tags);
    setHighlights(data.highlights);
    if (data.clima) setClima(data.clima);
    if (data.hotel) setHotel(data.hotel);
    if (data.vuelos) setVuelos(data.vuelos);
    if (data.coordinador) setCoordinador(data.coordinador);
    setIncluido(data.incluido);
    setNoIncluido(data.no_incluido);
    setFaqs(data.faqs);
  };

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
    <details className="panel-card group">
      <summary className="flex items-center gap-3 p-6 cursor-pointer list-none">
        <div className="w-10 h-10 rounded-xl bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-drb-turquoise-600 dark:text-drb-turquoise-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {t("newDestination")}
          </h2>
          <p className="text-sm text-gray-400 dark:text-white/40">
            {t("clickToAdd")}
          </p>
        </div>
      </summary>

      <div className="px-6 pb-6 border-t border-gray-100 dark:border-white/[0.06] pt-6 space-y-5">
        {/* ============================================================ */}
        {/*  AI GENERATOR                                                 */}
        {/* ============================================================ */}
        {aiAvailable && (
          <DestinoAIGenerator
            clienteId={clienteId}
            onGenerated={handleAIGenerated}
          />
        )}

        {/* Hidden form with ALL fields — submitted via server action */}
        <form action={action} className="space-y-0">
          {/* Hidden inputs for all fields */}
          <input type="hidden" name="itinerario" value={itinerario ? JSON.stringify(itinerario) : ""} />
          <input type="hidden" name="tags" value={JSON.stringify(tags)} />
          <input type="hidden" name="highlights" value={JSON.stringify(highlights)} />
          <input type="hidden" name="clima" value={clima ? JSON.stringify(clima) : ""} />
          <input type="hidden" name="hotel" value={hotel ? JSON.stringify(hotel) : ""} />
          <input type="hidden" name="vuelos" value={vuelos ? JSON.stringify(vuelos) : ""} />
          <input type="hidden" name="coordinador" value={coordinador ? JSON.stringify(coordinador) : ""} />
          <input type="hidden" name="incluido" value={JSON.stringify(incluido)} />
          <input type="hidden" name="no_incluido" value={JSON.stringify(noIncluido)} />
          <input type="hidden" name="faqs" value={JSON.stringify(faqs)} />
          <input type="hidden" name="imagen_url" value={imagenUrl} />
          <input type="hidden" name="galeria" value={JSON.stringify(galeria)} />
          <input type="hidden" name="salidas" value={JSON.stringify(salidas)} />
          <input type="hidden" name="moneda" value={moneda} />
          <input type="hidden" name="reviews" value={String(reviews)} />
          <input type="hidden" name="nombre" value={nombre} />
          <input type="hidden" name="subtitle" value={subtitle} />
          <input type="hidden" name="tagline" value={tagline} />
          <input type="hidden" name="badge" value={badge} />
          <input type="hidden" name="descripcion" value={descripcion} />
          <input type="hidden" name="descripcion_larga" value={descripcionLarga} />
          <input type="hidden" name="categoria" value={categoria} />
          <input type="hidden" name="continente" value={continente} />
          <input type="hidden" name="dificultad" value={dificultad} />
          <input type="hidden" name="duracion" value={duracion} />
          <input type="hidden" name="pais" value={pais} />
          <input type="hidden" name="precio" value={String(precio)} />
          <input type="hidden" name="precio_original" value={String(precioOriginal)} />
          <input type="hidden" name="precio_adulto" value={String(precioAdulto)} />
          <input type="hidden" name="precio_nino" value={String(precioNino)} />
          <input type="hidden" name="precio_grupo" value={String(precioGrupo)} />
          <input type="hidden" name="esfuerzo" value={String(esfuerzo)} />
          <input type="hidden" name="grupo_max" value={String(grupoMax)} />
          <input type="hidden" name="edad_min" value={String(edadMin)} />
          <input type="hidden" name="edad_max" value={String(edadMax)} />
          <input type="hidden" name="activo" value={activo ? "true" : "false"} />
          <input type="hidden" name="coordenadas" value={coordenadas} />
          <input type="hidden" name="latitude" value={coordenadas.split(",")[0]?.trim() || ""} />
          <input type="hidden" name="longitude" value={coordenadas.split(",")[1]?.trim() || ""} />

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
                  {t("tabGeneral" as any)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* nombre */}
                  <div>
                    <label className="panel-label">{labels.name}</label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="panel-input w-full"
                      placeholder={labels.namePlaceholder}
                    />
                  </div>
                  {/* subtitle */}
                  <div>
                    <label className="panel-label">{t("subtitle")}</label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="panel-input w-full"
                      placeholder={t("subtitle")}
                    />
                  </div>
                  {/* tagline */}
                  <div>
                    <label className="panel-label">{t("tagline")}</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="panel-input w-full"
                      placeholder={t("tagline")}
                    />
                  </div>
                  {/* badge */}
                  <div>
                    <label className="panel-label">{t("badgeLabel")}</label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="panel-input w-full"
                      placeholder={t("badgePlaceholder")}
                    />
                  </div>
                  {/* categoria */}
                  <div>
                    <label className="panel-label">{t("category")}</label>
                    <input
                      type="text"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="panel-input w-full"
                      placeholder={t("category")}
                    />
                  </div>
                  {/* pais */}
                  <div>
                    <label className="panel-label">{t("aiDestination")}</label>
                    <input
                      type="text"
                      value={pais}
                      onChange={(e) => setPais(e.target.value)}
                      className="panel-input w-full"
                      placeholder={t("namePlaceholder")}
                    />
                  </div>
                  {/* continente */}
                  <div>
                    <label className="panel-label">{t("continent")}</label>
                    <input
                      type="text"
                      value={continente}
                      onChange={(e) => setContinente(e.target.value)}
                      className="panel-input w-full"
                      placeholder={t("continent")}
                    />
                  </div>
                  {/* dificultad */}
                  <div>
                    <label className="panel-label">{t("difficulty")}</label>
                    <select
                      value={dificultad}
                      onChange={(e) => setDificultad(e.target.value)}
                      className="panel-input w-full"
                    >
                      <option value="">--</option>
                      <option value="facil">{t("difficultyEasy")}</option>
                      <option value="moderado">{t("difficultyModerate")}</option>
                      <option value="dificil">{t("difficultyHard")}</option>
                      <option value="extremo">{t("difficultyExtreme")}</option>
                    </select>
                  </div>
                  {/* esfuerzo */}
                  <div>
                    <label className="panel-label">{t("effort")}</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={esfuerzo || ""}
                      onChange={(e) => setEsfuerzo(Number(e.target.value) || 0)}
                      className="panel-input w-full"
                      placeholder="1-5"
                    />
                  </div>
                  {/* duracion */}
                  <div>
                    <label className="panel-label">{t("duration")}</label>
                    <input
                      type="text"
                      value={duracion}
                      onChange={(e) => setDuracion(e.target.value)}
                      className="panel-input w-full"
                      placeholder={t("durationPlaceholder")}
                    />
                  </div>
                  {/* grupo_max */}
                  <div>
                    <label className="panel-label">{t("maxGroup")}</label>
                    <input
                      type="number"
                      min={0}
                      value={grupoMax || ""}
                      onChange={(e) => setGrupoMax(Number(e.target.value) || 0)}
                      className="panel-input w-full"
                      placeholder="0"
                    />
                  </div>
                  {/* edad_min */}
                  <div>
                    <label className="panel-label">{t("minAge")}</label>
                    <input
                      type="number"
                      min={0}
                      value={edadMin || ""}
                      onChange={(e) => setEdadMin(Number(e.target.value) || 0)}
                      className="panel-input w-full"
                      placeholder="0"
                    />
                  </div>
                  {/* edad_max */}
                  <div>
                    <label className="panel-label">{t("maxAge")}</label>
                    <input
                      type="number"
                      min={0}
                      value={edadMax || ""}
                      onChange={(e) => setEdadMax(Number(e.target.value) || 0)}
                      className="panel-input w-full"
                      placeholder="0"
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
                      {labels.publishNow}
                    </label>
                  </div>
                </div>
                {/* descripcion */}
                <div>
                  <label className="panel-label">{labels.description}</label>
                  <textarea
                    rows={3}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="panel-input w-full"
                    placeholder={labels.descriptionPlaceholder}
                  />
                </div>
                {/* descripcion_larga */}
                <div>
                  <label className="panel-label">{t("longDescription")}</label>
                  <textarea
                    rows={5}
                    value={descripcionLarga}
                    onChange={(e) => setDescripcionLarga(e.target.value)}
                    className="panel-input w-full"
                    placeholder={t("longDescription")}
                  />
                </div>
                {/* Main image */}
                <div>
                  <label className="panel-label">{t("heroImage")}</label>
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
                  <SubmitButton className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium">
                    {labels.saveDestination}
                  </SubmitButton>
                </div>
              </div>
            )}

            {/* ------ PRICING TAB ------ */}
            {tab === "pricing" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("tabPricing" as any)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="panel-label">{labels.priceLabel}</label>
                    <input
                      type="number"
                      min={0}
                      value={precio || ""}
                      onChange={(e) => setPrecio(Number(e.target.value) || 0)}
                      className="panel-input w-full"
                      placeholder={labels.pricePlaceholder}
                    />
                  </div>
                  <div>
                    <label className="panel-label">{t("originalPrice")}</label>
                    <input
                      type="number"
                      min={0}
                      value={precioOriginal || ""}
                      onChange={(e) => setPrecioOriginal(Number(e.target.value) || 0)}
                      className="panel-input w-full"
                      placeholder="0"
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
                    <label className="panel-label">{t("pricePerAdult")}</label>
                    <input
                      type="number"
                      min={0}
                      value={precioAdulto || ""}
                      onChange={(e) => setPrecioAdulto(Number(e.target.value) || 0)}
                      className="panel-input w-full"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="panel-label">{t("pricePerChild")}</label>
                    <input
                      type="number"
                      min={0}
                      value={precioNino || ""}
                      onChange={(e) => setPrecioNino(Number(e.target.value) || 0)}
                      className="panel-input w-full"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="panel-label">{t("pricePerGroup")}</label>
                    <input
                      type="number"
                      min={0}
                      value={precioGrupo || ""}
                      onChange={(e) => setPrecioGrupo(Number(e.target.value) || 0)}
                      className="panel-input w-full"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <SubmitButton className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium">
                    {labels.saveDestination}
                  </SubmitButton>
                </div>
              </div>
            )}

            {/* ------ ITINERARY TAB ------ */}
            {tab === "itinerary" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("tabItinerary" as any)}
                </h2>
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
                      Este destino aun no tiene itinerario. Puedes generarlo desde la seccion de AI o
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
                  <SubmitButton className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium">
                    {labels.saveDestination}
                  </SubmitButton>
                </div>
              </div>
            )}

            {/* ------ HOTEL TAB ------ */}
            {tab === "hotel" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("tabHotel" as any)}
                </h2>
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
                      onChange={(e) =>
                        setHotel((p) => ({ ...p, estrellas: Number(e.target.value) || 0 }))
                      }
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
                        <img
                          src={hotel.imagen}
                          alt="Hotel"
                          className="w-full h-28 object-cover"
                        />
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
                    onClick={() =>
                      setHotel((p) => ({ ...p, amenidades: [...p.amenidades, ""] }))
                    }
                    className="mt-2 flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    Anadir amenidad
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <SubmitButton className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium">
                    {labels.saveDestination}
                  </SubmitButton>
                </div>
              </div>
            )}

            {/* ------ FLIGHTS TAB ------ */}
            {tab === "flights" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("tabFlights" as any)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="panel-label">Aeropuerto de llegada</label>
                    <input
                      type="text"
                      value={vuelos.aeropuerto_llegada}
                      onChange={(e) =>
                        setVuelos((p) => ({ ...p, aeropuerto_llegada: e.target.value }))
                      }
                      className="panel-input w-full"
                      placeholder="Ej: Aeropuerto de Marrakech (RAK)"
                    />
                  </div>
                  <div>
                    <label className="panel-label">Aeropuerto de regreso</label>
                    <input
                      type="text"
                      value={vuelos.aeropuerto_regreso}
                      onChange={(e) =>
                        setVuelos((p) => ({ ...p, aeropuerto_regreso: e.target.value }))
                      }
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
                  <SubmitButton className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium">
                    {labels.saveDestination}
                  </SubmitButton>
                </div>
              </div>
            )}

            {/* ------ INCLUDED / NOT INCLUDED TAB ------ */}
            {tab === "included" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("tabIncluded" as any)}
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
                            onClick={() =>
                              setIncluido((prev) => prev.filter((_, i) => i !== idx))
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
                            onClick={() =>
                              setNoIncluido((prev) => prev.filter((_, i) => i !== idx))
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
                      onClick={() => setNoIncluido((prev) => [...prev, ""])}
                      className="mt-2 flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
                    >
                      <Plus className="w-4 h-4" />
                      Anadir
                    </button>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <SubmitButton className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium">
                    {labels.saveDestination}
                  </SubmitButton>
                </div>
              </div>
            )}

            {/* ------ DEPARTURES TAB ------ */}
            {tab === "departures" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("tabDepartures" as any)}
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
                            next[idx] = {
                              ...next[idx],
                              precio: Number(e.target.value) || 0,
                            };
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
                            next[idx] = {
                              ...next[idx],
                              plazas: Number(e.target.value) || 0,
                            };
                            setSalidas(next);
                          }}
                          className="panel-input w-full text-sm"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() =>
                            setSalidas((prev) => prev.filter((_, i) => i !== idx))
                          }
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
                  <SubmitButton className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium">
                    {labels.saveDestination}
                  </SubmitButton>
                </div>
              </div>
            )}

            {/* ------ FAQS TAB ------ */}
            {tab === "faqs" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("tabFaqs" as any)}
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
                            onClick={() =>
                              setFaqs((prev) => prev.filter((_, i) => i !== idx))
                            }
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
                  onClick={() =>
                    setFaqs((prev) => [...prev, { pregunta: "", respuesta: "" }])
                  }
                  className="flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  Anadir pregunta
                </button>
                <div className="flex justify-end pt-2">
                  <SubmitButton className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium">
                    {labels.saveDestination}
                  </SubmitButton>
                </div>
              </div>
            )}

            {/* ------ COORDINATOR TAB ------ */}
            {tab === "coordinator" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("tabCoordinator" as any)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="panel-label">Nombre</label>
                    <input
                      type="text"
                      value={coordinador.nombre}
                      onChange={(e) =>
                        setCoordinador((p) => ({ ...p, nombre: e.target.value }))
                      }
                      className="panel-input w-full"
                    />
                  </div>
                  <div>
                    <label className="panel-label">Rol</label>
                    <input
                      type="text"
                      value={coordinador.rol}
                      onChange={(e) =>
                        setCoordinador((p) => ({ ...p, rol: e.target.value }))
                      }
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
                        onChange={(e) =>
                          setCoordinador((p) => ({ ...p, avatar: e.target.value }))
                        }
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
                      onChange={(e) =>
                        setCoordinador((p) => ({ ...p, descripcion: e.target.value }))
                      }
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
                    onClick={() =>
                      setCoordinador((p) => ({ ...p, idiomas: [...p.idiomas, ""] }))
                    }
                    className="mt-2 flex items-center gap-1.5 text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    Anadir idioma
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <SubmitButton className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium">
                    {labels.saveDestination}
                  </SubmitButton>
                </div>
              </div>
            )}

            {/* ------ TAGS & CLIMATE TAB ------ */}
            {tab === "tags" && (
              <div className="space-y-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("tabTags" as any)}
                </h2>

                {/* Tags */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-white/70 mb-3 flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    Tags
                  </h3>
                  <div className="space-y-2">
                    {tags.map((tagItem, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tagItem}
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
                          onClick={() =>
                            setTags((prev) => prev.filter((_, i) => i !== idx))
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
                          onClick={() =>
                            setHighlights((prev) => prev.filter((_, i) => i !== idx))
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
                        onChange={(e) =>
                          setClima((p) => ({ ...p, temp_avg: e.target.value }))
                        }
                        className="panel-input w-full"
                        placeholder="Ej: 25 C"
                      />
                    </div>
                    <div>
                      <label className="panel-label">Mejores meses</label>
                      <input
                        type="text"
                        value={clima.best_months}
                        onChange={(e) =>
                          setClima((p) => ({ ...p, best_months: e.target.value }))
                        }
                        className="panel-input w-full"
                        placeholder="Ej: Marzo a Octubre"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="panel-label">Descripcion del clima</label>
                      <textarea
                        rows={2}
                        value={clima.description}
                        onChange={(e) =>
                          setClima((p) => ({ ...p, description: e.target.value }))
                        }
                        className="panel-input w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <SubmitButton className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium">
                    {labels.saveDestination}
                  </SubmitButton>
                </div>
              </div>
            )}
          </div>
        </form>
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
    </details>
  );
}
