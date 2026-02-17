"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Loader2,
  Check,
  ImageIcon,
  Palette,
  Image,
  BarChart3,
  Users,
  Phone,
  Share2,
  FileText,
  Link2,
  type LucideIcon,
} from "lucide-react";
import UnsplashPicker from "./UnsplashPicker";

interface ClientData {
  id: string;
  nombre: string;
  domain: string;
  logo_url: string | null;
  primary_color: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_cta_text: string | null;
  hero_cta_link: string | null;
  hero_image_url: string | null;
  stats_years: string | null;
  stats_destinations: string | null;
  stats_travelers: string | null;
  stats_rating: string | null;
  about_title: string | null;
  about_text_1: string | null;
  about_text_2: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  footer_text: string | null;
}

interface Counts {
  destinos: number;
  opiniones: number;
  legales: number;
}

interface MiWebContentProps {
  client: ClientData;
  counts: Counts;
}

type SectionKey =
  | "marca"
  | "hero"
  | "stats"
  | "about"
  | "contact"
  | "social"
  | "footer";

interface SaveState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

export default function MiWebContent({ client, counts }: MiWebContentProps) {
  const [fields, setFields] = useState({
    logo_url: client.logo_url ?? "",
    primary_color: client.primary_color ?? "#1CABB0",
    hero_title: client.hero_title ?? "",
    hero_subtitle: client.hero_subtitle ?? "",
    hero_cta_text: client.hero_cta_text ?? "",
    hero_cta_link: client.hero_cta_link ?? "",
    hero_image_url: client.hero_image_url ?? "",
    stats_years: client.stats_years ?? "",
    stats_destinations: client.stats_destinations ?? "",
    stats_travelers: client.stats_travelers ?? "",
    stats_rating: client.stats_rating ?? "",
    about_title: client.about_title ?? "",
    about_text_1: client.about_text_1 ?? "",
    about_text_2: client.about_text_2 ?? "",
    contact_email: client.contact_email ?? "",
    contact_phone: client.contact_phone ?? "",
    contact_address: client.contact_address ?? "",
    instagram_url: client.instagram_url ?? "",
    facebook_url: client.facebook_url ?? "",
    tiktok_url: client.tiktok_url ?? "",
    footer_text: client.footer_text ?? "",
  });

  const [openSections, setOpenSections] = useState<Set<SectionKey>>(
    new Set(["marca", "hero"])
  );
  const [saveStates, setSaveStates] = useState<Record<SectionKey, SaveState>>({
    marca: { loading: false, success: false, error: null },
    hero: { loading: false, success: false, error: null },
    stats: { loading: false, success: false, error: null },
    about: { loading: false, success: false, error: null },
    contact: { loading: false, success: false, error: null },
    social: { loading: false, success: false, error: null },
    footer: { loading: false, success: false, error: null },
  });

  const [unsplash, setUnsplash] = useState<{
    open: boolean;
    field: string;
    defaultQuery: string;
  }>({ open: false, field: "", defaultQuery: "" });

  function toggleSection(key: SectionKey) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function updateField(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function saveSection(section: SectionKey, fieldKeys: string[]) {
    setSaveStates((prev) => ({
      ...prev,
      [section]: { loading: true, success: false, error: null },
    }));

    const payload: Record<string, string> = {};
    for (const key of fieldKeys) {
      payload[key] = fields[key as keyof typeof fields];
    }

    try {
      const res = await fetch("/api/admin/mi-web/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");

      setSaveStates((prev) => ({
        ...prev,
        [section]: { loading: false, success: true, error: null },
      }));
      setTimeout(() => {
        setSaveStates((prev) => ({
          ...prev,
          [section]: { ...prev[section], success: false },
        }));
      }, 2500);
    } catch (err) {
      setSaveStates((prev) => ({
        ...prev,
        [section]: {
          loading: false,
          success: false,
          error: err instanceof Error ? err.message : "Error",
        },
      }));
    }
  }

  function openUnsplash(field: string, defaultQuery: string) {
    setUnsplash({ open: true, field, defaultQuery });
  }

  function handleUnsplashSelect(url: string) {
    updateField(unsplash.field, url);
  }

  function renderSaveButton(section: SectionKey, fieldKeys: string[]) {
    const state = saveStates[section];
    return (
      <div className="flex items-center gap-3 justify-end pt-2">
        {state.error && (
          <span className="text-sm text-red-600 dark:text-red-400">{state.error}</span>
        )}
        {state.success && (
          <span className="flex items-center gap-1 text-sm text-emerald-600 dark:text-green-400">
            <Check className="w-4 h-4" /> Guardado
          </span>
        )}
        <button
          onClick={() => saveSection(section, fieldKeys)}
          disabled={state.loading}
          className="btn-primary disabled:opacity-50 flex items-center gap-2"
        >
          {state.loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Guardar
        </button>
      </div>
    );
  }

  function SectionHeader({
    sectionKey,
    icon: Icon,
    title,
    subtitle,
  }: {
    sectionKey: SectionKey;
    icon: LucideIcon;
    title: string;
    subtitle: string;
  }) {
    const isOpen = openSections.has(sectionKey);
    return (
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center gap-3 text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center">
          <Icon className="w-5 h-5 text-drb-turquoise-600 dark:text-drb-turquoise-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-400 dark:text-white/50">{subtitle}</p>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-gray-400 dark:text-white/50" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 dark:text-white/50" />
        )}
      </button>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Mi Web</h1>
          <p className="text-gray-500 dark:text-white/60">
            Construye y personaliza tu pagina web. Todo lo que edites aqui se
            refleja en tu landing page al instante.
          </p>
        </div>
        <a
          href={`https://${client.domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10 text-sm font-medium text-gray-700 dark:text-white transition-colors shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
          Ver mi web
        </a>
      </div>

      {/* Marca y Estilo */}
      <section className="panel-card p-6 space-y-5">
        <SectionHeader
          sectionKey="marca"
          icon={Palette}
          title="Marca y Estilo"
          subtitle="Logo, color principal y nombre de tu agencia"
        />
        {openSections.has("marca") && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="panel-label block mb-1">
                Nombre de la agencia
              </label>
              <input
                value={client.nombre}
                readOnly
                className="w-full rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 px-3 py-2 text-gray-400 dark:text-white/50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 dark:text-white/40 mt-1">
                Solo lectura. Se modifica desde el panel del owner.
              </p>
            </div>

            <div>
              <label className="panel-label block mb-1">
                Logo (URL)
              </label>
              <input
                value={fields.logo_url}
                onChange={(e) => updateField("logo_url", e.target.value)}
                className="panel-input w-full"
                placeholder="https://..."
              />
              {fields.logo_url && (
                <div className="mt-2 inline-block rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 p-2">
                  <img
                    src={fields.logo_url}
                    alt="Logo preview"
                    className="h-12 w-auto object-contain"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="panel-label block mb-1">
                Color principal
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={fields.primary_color}
                  onChange={(e) => updateField("primary_color", e.target.value)}
                  className="h-10 w-14 rounded-lg border border-gray-200 dark:border-white/30 cursor-pointer bg-transparent"
                />
                <input
                  value={fields.primary_color}
                  onChange={(e) => updateField("primary_color", e.target.value)}
                  className="w-32 panel-input font-mono text-sm"
                  placeholder="#1CABB0"
                />
                <div
                  className="h-10 w-10 rounded-xl border border-gray-200 dark:border-white/20"
                  style={{ backgroundColor: fields.primary_color }}
                />
              </div>
            </div>

            {renderSaveButton("marca", ["logo_url", "primary_color"])}
          </div>
        )}
      </section>

      {/* Hero */}
      <section className="panel-card p-6 space-y-5">
        <SectionHeader
          sectionKey="hero"
          icon={Image}
          title="Hero (portada)"
          subtitle="Titulo, subtitulo, boton CTA e imagen de portada"
        />
        {openSections.has("hero") && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="panel-label block mb-1">
                Titulo principal
              </label>
              <input
                value={fields.hero_title}
                onChange={(e) => updateField("hero_title", e.target.value)}
                className="panel-input w-full"
                placeholder="Ej: Viaja a tu ritmo con una agencia premium"
              />
            </div>

            <div>
              <label className="panel-label block mb-1">
                Subtitulo
              </label>
              <textarea
                value={fields.hero_subtitle}
                onChange={(e) => updateField("hero_subtitle", e.target.value)}
                className="panel-input w-full min-h-[100px]"
                placeholder="Describe el valor principal de la agencia"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label block mb-1">
                  CTA - Texto
                </label>
                <input
                  value={fields.hero_cta_text}
                  onChange={(e) => updateField("hero_cta_text", e.target.value)}
                  className="panel-input w-full"
                  placeholder="Ej: Reservar ahora"
                />
              </div>
              <div>
                <label className="panel-label block mb-1">
                  CTA - Link
                </label>
                <input
                  value={fields.hero_cta_link}
                  onChange={(e) => updateField("hero_cta_link", e.target.value)}
                  className="panel-input w-full"
                  placeholder="https://"
                />
              </div>
            </div>

            <div>
              <label className="panel-label block mb-1">
                Imagen del hero (URL)
              </label>
              <div className="flex gap-2">
                <input
                  value={fields.hero_image_url}
                  onChange={(e) =>
                    updateField("hero_image_url", e.target.value)
                  }
                  className="panel-input w-full flex-1"
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => openUnsplash("hero_image_url", "travel")}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shrink-0"
                  title="Buscar en Unsplash"
                >
                  <ImageIcon className="w-4 h-4 text-gray-500 dark:text-white/70" />
                </button>
              </div>
              {fields.hero_image_url && (
                <div className="mt-2 rounded-xl border border-gray-200 dark:border-white/20 overflow-hidden max-w-sm">
                  <img
                    src={fields.hero_image_url}
                    alt="Hero preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
            </div>

            {renderSaveButton("hero", [
              "hero_title",
              "hero_subtitle",
              "hero_cta_text",
              "hero_cta_link",
              "hero_image_url",
            ])}
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="panel-card p-6 space-y-5">
        <SectionHeader
          sectionKey="stats"
          icon={BarChart3}
          title="Estadisticas"
          subtitle="Metricas que se muestran en Hero y Nosotros"
        />
        {openSections.has("stats") && (
          <div className="space-y-4 pt-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label block mb-1">
                  Anos de experiencia
                </label>
                <input
                  value={fields.stats_years}
                  onChange={(e) => updateField("stats_years", e.target.value)}
                  className="panel-input w-full"
                  placeholder="Ej: 15+"
                />
              </div>
              <div>
                <label className="panel-label block mb-1">
                  Destinos
                </label>
                <input
                  value={fields.stats_destinations}
                  onChange={(e) =>
                    updateField("stats_destinations", e.target.value)
                  }
                  className="panel-input w-full"
                  placeholder="Ej: 50+"
                />
              </div>
              <div>
                <label className="panel-label block mb-1">
                  Viajeros
                </label>
                <input
                  value={fields.stats_travelers}
                  onChange={(e) =>
                    updateField("stats_travelers", e.target.value)
                  }
                  className="panel-input w-full"
                  placeholder="Ej: 10K+"
                />
              </div>
              <div>
                <label className="panel-label block mb-1">
                  Rating
                </label>
                <input
                  value={fields.stats_rating}
                  onChange={(e) => updateField("stats_rating", e.target.value)}
                  className="panel-input w-full"
                  placeholder="Ej: 4.9"
                />
              </div>
            </div>

            {renderSaveButton("stats", [
              "stats_years",
              "stats_destinations",
              "stats_travelers",
              "stats_rating",
            ])}
          </div>
        )}
      </section>

      {/* Sobre nosotros */}
      <section className="panel-card p-6 space-y-5">
        <SectionHeader
          sectionKey="about"
          icon={Users}
          title="Sobre nosotros"
          subtitle="Texto principal y descripcion de la agencia"
        />
        {openSections.has("about") && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="panel-label block mb-1">
                Titulo
              </label>
              <input
                value={fields.about_title}
                onChange={(e) => updateField("about_title", e.target.value)}
                className="panel-input w-full"
                placeholder="Ej: Tu agencia de viajes de confianza"
              />
            </div>
            <div>
              <label className="panel-label block mb-1">
                Texto 1
              </label>
              <textarea
                value={fields.about_text_1}
                onChange={(e) => updateField("about_text_1", e.target.value)}
                className="panel-input w-full min-h-[100px]"
                placeholder="Describe la experiencia y propuesta de valor"
              />
            </div>
            <div>
              <label className="panel-label block mb-1">
                Texto 2
              </label>
              <textarea
                value={fields.about_text_2}
                onChange={(e) => updateField("about_text_2", e.target.value)}
                className="panel-input w-full min-h-[100px]"
                placeholder="Anade confianza, proceso, equipo o garantias"
              />
            </div>

            {renderSaveButton("about", [
              "about_title",
              "about_text_1",
              "about_text_2",
            ])}
          </div>
        )}
      </section>

      {/* Contacto */}
      <section className="panel-card p-6 space-y-5">
        <SectionHeader
          sectionKey="contact"
          icon={Phone}
          title="Contacto"
          subtitle="Datos de contacto que se muestran en la web"
        />
        {openSections.has("contact") && (
          <div className="space-y-4 pt-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label block mb-1">
                  Email
                </label>
                <input
                  value={fields.contact_email}
                  onChange={(e) =>
                    updateField("contact_email", e.target.value)
                  }
                  className="panel-input w-full"
                  placeholder="contacto@agencia.com"
                />
              </div>
              <div>
                <label className="panel-label block mb-1">
                  Telefono
                </label>
                <input
                  value={fields.contact_phone}
                  onChange={(e) =>
                    updateField("contact_phone", e.target.value)
                  }
                  className="panel-input w-full"
                  placeholder="+34 900 000 000"
                />
              </div>
            </div>
            <div>
              <label className="panel-label block mb-1">
                Direccion
              </label>
              <textarea
                value={fields.contact_address}
                onChange={(e) =>
                  updateField("contact_address", e.target.value)
                }
                className="panel-input w-full min-h-[100px]"
                placeholder="Calle, ciudad, pais"
              />
            </div>

            {renderSaveButton("contact", [
              "contact_email",
              "contact_phone",
              "contact_address",
            ])}
          </div>
        )}
      </section>

      {/* Redes sociales */}
      <section className="panel-card p-6 space-y-5">
        <SectionHeader
          sectionKey="social"
          icon={Share2}
          title="Redes sociales"
          subtitle="Enlaces a tus perfiles sociales"
        />
        {openSections.has("social") && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="panel-label block mb-1">
                Instagram
              </label>
              <input
                value={fields.instagram_url}
                onChange={(e) => updateField("instagram_url", e.target.value)}
                className="panel-input w-full"
                placeholder="https://instagram.com/tu-agencia"
              />
            </div>
            <div>
              <label className="panel-label block mb-1">
                Facebook
              </label>
              <input
                value={fields.facebook_url}
                onChange={(e) => updateField("facebook_url", e.target.value)}
                className="panel-input w-full"
                placeholder="https://facebook.com/tu-agencia"
              />
            </div>
            <div>
              <label className="panel-label block mb-1">
                TikTok
              </label>
              <input
                value={fields.tiktok_url}
                onChange={(e) => updateField("tiktok_url", e.target.value)}
                className="panel-input w-full"
                placeholder="https://tiktok.com/@tu-agencia"
              />
            </div>

            {renderSaveButton("social", [
              "instagram_url",
              "facebook_url",
              "tiktok_url",
            ])}
          </div>
        )}
      </section>

      {/* Footer */}
      <section className="panel-card p-6 space-y-5">
        <SectionHeader
          sectionKey="footer"
          icon={FileText}
          title="Footer"
          subtitle="Texto del pie de pagina"
        />
        {openSections.has("footer") && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="panel-label block mb-1">
                Texto del footer
              </label>
              <textarea
                value={fields.footer_text}
                onChange={(e) => updateField("footer_text", e.target.value)}
                className="panel-input w-full min-h-[100px]"
                placeholder="Ej: © 2026 Tu Agencia. Todos los derechos reservados."
              />
            </div>

            {renderSaveButton("footer", ["footer_text"])}
          </div>
        )}
      </section>

      {/* Enlaces rapidos */}
      <section className="panel-card p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-drb-turquoise-600 dark:text-drb-turquoise-400" />
            </div>
            Secciones relacionadas
          </h2>
          <p className="text-sm text-gray-400 dark:text-white/50 mt-1">
            Estas secciones se gestionan desde sus paginas propias
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <a
            href="/admin/destinos"
            className="rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 p-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900 dark:text-white/80 group-hover:text-drb-turquoise-600 dark:group-hover:text-white transition-colors">
                Destinos
              </span>
            </div>
            <p className="text-sm text-gray-400 dark:text-white/50">
              {counts.destinos} destino{counts.destinos !== 1 ? "s" : ""} activo
              {counts.destinos !== 1 ? "s" : ""}
            </p>
          </a>
          <a
            href="/admin/opiniones"
            className="rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 p-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900 dark:text-white/80 group-hover:text-drb-turquoise-600 dark:group-hover:text-white transition-colors">
                Opiniones
              </span>
            </div>
            <p className="text-sm text-gray-400 dark:text-white/50">
              {counts.opiniones} opinion{counts.opiniones !== 1 ? "es" : ""}{" "}
              publicada{counts.opiniones !== 1 ? "s" : ""}
            </p>
          </a>
          <a
            href="/admin/legales"
            className="rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 p-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900 dark:text-white/80 group-hover:text-drb-turquoise-600 dark:group-hover:text-white transition-colors">
                Legales
              </span>
            </div>
            <p className="text-sm text-gray-400 dark:text-white/50">
              {counts.legales} pagina{counts.legales !== 1 ? "s" : ""} legal
              {counts.legales !== 1 ? "es" : ""}
            </p>
          </a>
        </div>
      </section>

      {/* Unsplash Picker Modal */}
      <UnsplashPicker
        open={unsplash.open}
        onClose={() => setUnsplash((prev) => ({ ...prev, open: false }))}
        onSelect={handleUnsplashSelect}
        defaultQuery={unsplash.defaultQuery}
      />
    </div>
  );
}
