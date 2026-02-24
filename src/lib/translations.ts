/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Auto-translation utility — field maps and runtime helpers.
 *
 * `translations` column stores:
 *   { "en": { "hero_title": "...", "whyus_items": [...] }, "ar": { ... } }
 */

// ── Field type: "string" = plain text, "jsonb" = structured object/array ──

export type FieldType = "string" | "jsonb";

export const TRANSLATABLE_CLIENT_FIELDS: Record<string, FieldType> = {
  hero_title: "string",
  hero_subtitle: "string",
  hero_description: "string",
  hero_badge: "string",
  hero_cta_text: "string",
  hero_cta_text_secondary: "string",
  about_title: "string",
  about_text_1: "string",
  about_text_2: "string",
  cta_banner_title: "string",
  cta_banner_description: "string",
  cta_banner_cta_text: "string",
  footer_text: "string",
  footer_description: "string",
  meta_title: "string",
  meta_description: "string",
  whyus_items: "jsonb", // [{icon, title, desc}]
};

export const TRANSLATABLE_DESTINO_FIELDS: Record<string, FieldType> = {
  nombre: "string",
  subtitle: "string",
  tagline: "string",
  badge: "string",
  descripcion: "string",
  descripcion_larga: "string",
  duracion: "string",
  categoria: "string",
  pais: "string",
  continente: "string",
  dificultad: "string",
  itinerario: "jsonb",
  hotel: "jsonb",
  vuelos: "jsonb",
  coordinador: "jsonb",
  incluido: "jsonb",
  no_incluido: "jsonb",
  faqs: "jsonb",
  clima: "jsonb",
  highlights: "jsonb",
  tags: "jsonb",
};

export const TRANSLATABLE_OPINION_FIELDS: Record<string, FieldType> = {
  comentario: "string",
};

/**
 * Map from MiWeb section key → translatable fields in that section.
 * Used to extract which fields to translate after saving a section.
 */
export const MIWEB_SECTION_TRANSLATABLE_FIELDS: Record<string, string[]> = {
  hero: [
    "hero_title",
    "hero_subtitle",
    "hero_description",
    "hero_badge",
    "hero_cta_text",
    "hero_cta_text_secondary",
  ],
  whyus: ["whyus_items"],
  ctabanner: [
    "cta_banner_title",
    "cta_banner_description",
    "cta_banner_cta_text",
  ],
  about: ["about_title", "about_text_1", "about_text_2"],
  footer: ["footer_text", "footer_description"],
  global: ["meta_title", "meta_description"],
};

// ── Runtime helpers ──

/**
 * Get translated value for a field, falling back to original.
 */
export function tr(
  obj: any,
  field: string,
  lang: string,
  preferredLang?: string
): any {
  if (!obj) return undefined;

  // If viewing in original language, return original
  if (lang === preferredLang) return obj[field];

  // Try translation
  const translated = obj.translations?.[lang]?.[field];
  if (translated !== undefined && translated !== null && translated !== "") {
    return translated;
  }

  // Fallback to original
  return obj[field];
}

/**
 * Create a bound translation function for an object.
 * Usage: const t = makeTr(client, "en", "es"); t("hero_title")
 */
export function makeTr(
  obj: any,
  lang: string,
  preferredLang?: string
): (field: string) => any {
  return (field: string) => tr(obj, field, lang, preferredLang);
}
