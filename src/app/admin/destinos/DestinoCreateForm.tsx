"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { isAILocked } from "@/lib/plan-gating";
import DestinoAIGenerator from "./DestinoAIGenerator";
import DestinoDescriptionField from "./DestinoDescriptionField";
import DestinoPriceFieldWithAI from "./DestinoPriceFieldWithAI";
import DestinoImageField from "./DestinoImageField";
import ItineraryEditor from "./ItineraryEditor";
import SubmitButton from "@/components/admin/SubmitButton";

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

export default function DestinoCreateForm({
  action,
  clienteId,
  plan,
  labels,
}: DestinoCreateFormProps) {
  const t = useTranslations("admin.destinos");
  const aiAvailable = !isAILocked(plan);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [precioAdulto, setPrecioAdulto] = useState(0);
  const [precioNino, setPrecioNino] = useState(0);
  const [precioGrupo, setPrecioGrupo] = useState(0);
  const [imagenUrl, setImagenUrl] = useState("");
  const [itinerario, setItinerario] = useState<any>(null);
  const [activo, setActivo] = useState(true);
  const [coordenadas, setCoordenadas] = useState("");

  // Expanded AI fields
  const [descripcionLarga, setDescripcionLarga] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [badge, setBadge] = useState("");
  const [pais, setPais] = useState("");
  const [continente, setContinente] = useState("");
  const [categoria, setCategoria] = useState("");
  const [dificultad, setDificultad] = useState("");
  const [duracion, setDuracion] = useState("");
  const [esfuerzo, setEsfuerzo] = useState(0);
  const [grupoMax, setGrupoMax] = useState(0);
  const [edadMin, setEdadMin] = useState(0);
  const [edadMax, setEdadMax] = useState(0);
  const [precioOriginal, setPrecioOriginal] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [clima, setClima] = useState<any>(null);
  const [hotel, setHotel] = useState<any>(null);
  const [vuelos, setVuelos] = useState<any>(null);
  const [coordinador, setCoordinador] = useState<any>(null);
  const [incluido, setIncluido] = useState<string[]>([]);
  const [noIncluido, setNoIncluido] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

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
    setClima(data.clima);
    setHotel(data.hotel);
    setVuelos(data.vuelos);
    setCoordinador(data.coordinador);
    setIncluido(data.incluido);
    setNoIncluido(data.no_incluido);
    setFaqs(data.faqs);
  };

  const dias = itinerario?.dias || itinerario?.days || [];

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
        {aiAvailable && <DestinoAIGenerator clienteId={clienteId} onGenerated={handleAIGenerated} />}

        <form action={action} className="grid gap-4">
          {/* Hidden inputs for JSONB / complex fields */}
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

          {/* Name + Price */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="panel-label">{labels.name}</label>
              <input
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="panel-input w-full"
                placeholder={labels.namePlaceholder}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="panel-label">{labels.priceLabel}</label>
                <input
                  name="precio"
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
                  name="precio_original"
                  type="number"
                  min={0}
                  value={precioOriginal || ""}
                  onChange={(e) => setPrecioOriginal(Number(e.target.value) || 0)}
                  className="panel-input w-full"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Price per adult / child / group */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="panel-label">{t("pricePerAdult")}</label>
              <input
                name="precio_adulto"
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
                name="precio_nino"
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
                name="precio_grupo"
                type="number"
                min={0}
                value={precioGrupo || ""}
                onChange={(e) => setPrecioGrupo(Number(e.target.value) || 0)}
                className="panel-input w-full"
                placeholder="0"
              />
            </div>
          </div>

          {/* Subtitle, Tagline, Badge */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="panel-label">{t("subtitle")}</label>
              <input
                name="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="panel-input w-full"
                placeholder={t("subtitle")}
              />
            </div>
            <div>
              <label className="panel-label">{t("tagline")}</label>
              <input
                name="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="panel-input w-full"
                placeholder={t("tagline")}
              />
            </div>
            <div>
              <label className="panel-label">{t("badgeLabel")}</label>
              <input
                name="badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="panel-input w-full"
                placeholder={t("badgePlaceholder")}
              />
            </div>
          </div>

          {/* Pais, Continente, Categoria, Dificultad */}
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="panel-label">{t("aiDestination")}</label>
              <input
                name="pais"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                className="panel-input w-full"
                placeholder={t("namePlaceholder")}
              />
            </div>
            <div>
              <label className="panel-label">{t("continent")}</label>
              <input
                name="continente"
                value={continente}
                onChange={(e) => setContinente(e.target.value)}
                className="panel-input w-full"
                placeholder={t("continent")}
              />
            </div>
            <div>
              <label className="panel-label">{t("category")}</label>
              <input
                name="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="panel-input w-full"
                placeholder={t("category")}
              />
            </div>
            <div>
              <label className="panel-label">{t("difficulty")}</label>
              <select
                name="dificultad"
                value={dificultad}
                onChange={(e) => setDificultad(e.target.value)}
                className="panel-input w-full"
              >
                <option value="">—</option>
                <option value="easy">{t("difficultyEasy")}</option>
                <option value="moderate">{t("difficultyModerate")}</option>
                <option value="hard">{t("difficultyHard")}</option>
                <option value="extreme">{t("difficultyExtreme")}</option>
              </select>
            </div>
          </div>

          {/* Duracion, Esfuerzo, Grupo max, Edad min, Edad max */}
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="panel-label">{t("duration")}</label>
              <input
                name="duracion"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                className="panel-input w-full"
                placeholder={t("durationPlaceholder")}
              />
            </div>
            <div>
              <label className="panel-label">{t("effort")}</label>
              <input
                name="esfuerzo"
                type="number"
                min={1}
                max={5}
                value={esfuerzo || ""}
                onChange={(e) => setEsfuerzo(Number(e.target.value) || 0)}
                className="panel-input w-full"
                placeholder="1-5"
              />
            </div>
            <div>
              <label className="panel-label">{t("maxGroup")}</label>
              <input
                name="grupo_max"
                type="number"
                min={0}
                value={grupoMax || ""}
                onChange={(e) => setGrupoMax(Number(e.target.value) || 0)}
                className="panel-input w-full"
                placeholder="0"
              />
            </div>
            <div>
              <label className="panel-label">{t("minAge")}</label>
              <input
                name="edad_min"
                type="number"
                min={0}
                value={edadMin || ""}
                onChange={(e) => setEdadMin(Number(e.target.value) || 0)}
                className="panel-input w-full"
                placeholder="0"
              />
            </div>
            <div>
              <label className="panel-label">{t("maxAge")}</label>
              <input
                name="edad_max"
                type="number"
                min={0}
                value={edadMax || ""}
                onChange={(e) => setEdadMax(Number(e.target.value) || 0)}
                className="panel-input w-full"
                placeholder="0"
              />
            </div>
          </div>

          {/* Description (short) */}
          <div>
            <label className="panel-label">{labels.description}</label>
            <textarea
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="panel-input w-full min-h-[100px]"
              placeholder={labels.descriptionPlaceholder}
            />
          </div>

          {/* Long description */}
          <div>
            <label className="panel-label">{t("longDescription")}</label>
            <textarea
              name="descripcion_larga"
              value={descripcionLarga}
              onChange={(e) => setDescripcionLarga(e.target.value)}
              className="panel-input w-full min-h-[120px]"
              placeholder={t("longDescription")}
            />
          </div>

          {/* Image */}
          <div>
            <label className="panel-label block mb-1">{t("heroImage")}</label>
            <div className="flex gap-2">
              <input
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                className="w-full flex-1 panel-input"
                placeholder="https://..."
              />
            </div>
            {imagenUrl && (
              <div className="mt-2 rounded-xl border border-gray-200 dark:border-white/20 overflow-hidden max-w-xs">
                <img
                  src={imagenUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </div>

          {/* Coordinates (optional) */}
          <div>
            <label className="panel-label">{t("coordinates")}</label>
            <input
              name="coordenadas"
              type="text"
              value={coordenadas}
              onChange={(e) => setCoordenadas(e.target.value)}
              className="panel-input w-full"
              placeholder="40.4168, -3.7038"
            />
            <p className="text-xs text-gray-400 dark:text-white/30 mt-1">{t("coordinatesHelp")}</p>
            <input type="hidden" name="latitude" value={coordenadas.split(",")[0]?.trim() || ""} />
            <input type="hidden" name="longitude" value={coordenadas.split(",")[1]?.trim() || ""} />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60">
            <input
              type="checkbox"
              name="activo"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="rounded"
            />
            {labels.publishNow}
          </label>

          {/* Itinerary editor */}
          {itinerario && dias.length > 0 && (
            <ItineraryEditor
              itinerario={itinerario}
              onChange={(updated) => setItinerario(updated)}
            />
          )}

          <div className="flex justify-end">
            <SubmitButton className="btn-primary">
              {labels.saveDestination}
            </SubmitButton>
          </div>
        </form>
      </div>
    </details>
  );
}
