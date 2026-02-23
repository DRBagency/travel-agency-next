"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { sileo } from "sileo";
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
  Star,
  Scale,
  MapPin,
  Globe,
  RefreshCw,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import UnsplashPicker from "./UnsplashPicker";
import AIDescriptionButton from "@/components/ai/AIDescriptionButton";
import OpinionesManager from "./OpinionesManager";
import LegalesManager from "./LegalesManager";

interface ClientData {
  id: string;
  nombre: string;
  slug: string;
  domain: string;
  domain_verified?: boolean | null;
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
  preferred_language: string | null;
}

interface Counts {
  destinos: number;
  opiniones: number;
  legales: number;
}

interface Opinion {
  id: string;
  nombre: string | null;
  ubicacion: string | null;
  comentario: string | null;
  rating: number;
  activo: boolean;
  created_at: string;
}

interface LegalPage {
  id: string;
  titulo: string | null;
  slug: string | null;
  contenido: string | null;
  activo: boolean;
  created_at: string;
}

interface MiWebContentProps {
  client: ClientData;
  counts: Counts;
  plan?: string;
  opiniones: Opinion[];
  legales: LegalPage[];
  locale: string;
}

type SectionKey =
  | "domain"
  | "marca"
  | "hero"
  | "stats"
  | "about"
  | "contact"
  | "social"
  | "footer"
  | "opiniones"
  | "legales";

interface SaveState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

export default function MiWebContent({ client, counts, plan, opiniones, legales, locale }: MiWebContentProps) {
  const aiLocked = !plan || plan === "start";
  const t = useTranslations('admin.miWeb');
  const tc = useTranslations('common');
  const tt = useTranslations("toast");

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
    preferred_language: client.preferred_language ?? "es",
  });

  const [openSections, setOpenSections] = useState<Set<SectionKey>>(
    new Set()
  );
  const [saveStates, setSaveStates] = useState<Record<SectionKey, SaveState>>({
    domain: { loading: false, success: false, error: null },
    marca: { loading: false, success: false, error: null },
    hero: { loading: false, success: false, error: null },
    stats: { loading: false, success: false, error: null },
    about: { loading: false, success: false, error: null },
    contact: { loading: false, success: false, error: null },
    social: { loading: false, success: false, error: null },
    footer: { loading: false, success: false, error: null },
    opiniones: { loading: false, success: false, error: null },
    legales: { loading: false, success: false, error: null },
  });

  // Domain state
  const [domainValue, setDomainValue] = useState(client.domain ?? "");
  const [domainVerified, setDomainVerified] = useState(Boolean(client.domain_verified));
  const [domainVerifying, setDomainVerifying] = useState(false);
  const [domainSaving, setDomainSaving] = useState(false);
  const [vercelVerification, setVercelVerification] = useState<Array<{type: string; domain: string; value: string}> | null>(null);

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
      if (!res.ok) throw new Error(data.error || t("errorSaving"));

      setSaveStates((prev) => ({
        ...prev,
        [section]: { loading: false, success: true, error: null },
      }));
      sileo.success({ title: tt("savedSuccessfully") });
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
          error: err instanceof Error ? err.message : tc("error"),
        },
      }));
      sileo.error({ title: tt("errorSaving") });
    }
  }

  function openUnsplash(field: string, defaultQuery: string) {
    setUnsplash({ open: true, field, defaultQuery });
  }

  function handleUnsplashSelect(url: string) {
    updateField(unsplash.field, url);
  }

  async function saveDomain() {
    if (!domainValue.trim()) return;
    setDomainSaving(true);
    try {
      const previousDomain = client.domain;
      // 1. Remove previous domain from Vercel if changed
      if (previousDomain && previousDomain !== domainValue.trim().toLowerCase()) {
        await fetch("/api/admin/domain/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain: previousDomain }),
        });
      }
      // 2. Save new domain to DB
      const saveRes = await fetch("/api/admin/domain/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainValue }),
      });
      const saveData = await saveRes.json();
      if (!saveData.saved) throw new Error("save_failed");

      // 3. Add to Vercel
      const addRes = await fetch("/api/admin/domain/add", { method: "POST" });
      const addData = await addRes.json();
      if (addData.verification?.length) {
        setVercelVerification(addData.verification);
      } else {
        setVercelVerification(null);
      }

      setDomainVerified(false);
      sileo.success({ title: tt("savedSuccessfully") });
    } catch {
      sileo.error({ title: tt("errorSaving") });
    } finally {
      setDomainSaving(false);
    }
  }

  async function handleVerifyDomain() {
    setDomainVerifying(true);
    try {
      const res = await fetch("/api/admin/domain/verify", { method: "POST" });
      const data = await res.json();
      if (data.verified) {
        setDomainVerified(true);
        setVercelVerification(null);
        sileo.success({ title: t("domainVerified") });
      } else {
        sileo.error({ title: t("domainPending") });
      }
    } catch {
      sileo.error({ title: tt("errorSaving") });
    } finally {
      setDomainVerifying(false);
    }
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
            <Check className="w-4 h-4" /> {tc("success")}
          </span>
        )}
        <button
          onClick={() => saveSection(section, fieldKeys)}
          disabled={state.loading}
          className="btn-primary disabled:opacity-50 flex items-center gap-2"
        >
          {state.loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {tc("save")}
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
        className="w-full flex items-center gap-2.5 text-start"
      >
        <div className="w-7 h-7 rounded-lg bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-drb-turquoise-600 dark:text-drb-turquoise-400" />
        </div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white flex-1">{title}</h2>
        {!isOpen && (
          <span className="text-xs text-gray-400 dark:text-white/40 hidden sm:block">{subtitle}</span>
        )}
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-white/50" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-white/50" />
        )}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{t("title")}</h1>
          <p className="text-gray-500 dark:text-white/60">
            {t("subtitle")}
          </p>
        </div>
        <a
          href={`/preview/${client.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10 text-sm font-medium text-gray-700 dark:text-white transition-colors shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
          {t("viewMyWeb")}
        </a>
      </div>

      {/* Dominio */}
      <section className="panel-card p-5 space-y-3">
        <SectionHeader
          sectionKey="domain"
          icon={Globe}
          title={t("domainSection")}
          subtitle={t("domainSectionSub")}
        />
        {openSections.has("domain") && (
          <div className="space-y-4 pt-2">
            {/* Current domain with badge */}
            {client.domain && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-white/80 font-mono">{client.domain}</span>
                {domainVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                    <Check className="w-3 h-3" />
                    {t("domainVerified")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
                    <AlertCircle className="w-3 h-3" />
                    {t("domainPending")}
                  </span>
                )}
              </div>
            )}

            {/* Input for new/change domain */}
            <div>
              <label className="panel-label block mb-1">{t("changeDomain")}</label>
              <input
                value={domainValue}
                onChange={(e) => setDomainValue(e.target.value)}
                className="panel-input w-full"
                placeholder={t("domainPlaceholder")}
              />
            </div>

            {/* CNAME instructions */}
            <div className="bg-gray-50 dark:bg-white/[0.04] rounded-xl p-4 text-sm space-y-2">
              <p className="text-gray-600 dark:text-white/60">
                {t("domainCnameInstructions")}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-start text-gray-500 dark:text-white/50 border-b border-gray-200 dark:border-white/10">
                      <th className="py-2 pe-4 font-medium text-start">Type</th>
                      <th className="py-2 pe-4 font-medium text-start">Name</th>
                      <th className="py-2 font-medium text-start">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-gray-900 dark:text-white">
                      <td className="py-2 pe-4 font-mono text-xs">CNAME</td>
                      <td className="py-2 pe-4 font-mono text-xs">@</td>
                      <td className="py-2 font-mono text-xs text-drb-turquoise-600 dark:text-drb-turquoise-400">
                        cname.vercel-dns.com
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vercel TXT verification if needed */}
            {vercelVerification && vercelVerification.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 text-sm space-y-2">
                <p className="font-medium text-amber-700 dark:text-amber-300">
                  {t("txtRecord")}
                </p>
                <p className="text-amber-600 dark:text-amber-400 text-xs">
                  {t("txtInstructions")}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-start text-gray-500 dark:text-white/50 border-b border-gray-200 dark:border-white/10">
                        <th className="py-2 pe-4 font-medium text-start">Type</th>
                        <th className="py-2 pe-4 font-medium text-start">Name</th>
                        <th className="py-2 font-medium text-start">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vercelVerification.map((v, i) => (
                        <tr key={i} className="text-gray-900 dark:text-white">
                          <td className="py-2 pe-4 font-mono text-xs">{v.type}</td>
                          <td className="py-2 pe-4 font-mono text-xs">{v.domain}</td>
                          <td className="py-2 font-mono text-xs text-drb-turquoise-600 dark:text-drb-turquoise-400 break-all">
                            {v.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 justify-end pt-2">
              <button
                onClick={saveDomain}
                disabled={domainSaving || !domainValue.trim()}
                className="btn-primary disabled:opacity-50 flex items-center gap-2"
              >
                {domainSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("saveDomain")}
              </button>
              {client.domain && (
                <button
                  onClick={handleVerifyDomain}
                  disabled={domainVerifying}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-drb-turquoise-200 dark:border-drb-turquoise-500/20 text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:bg-drb-turquoise-50 dark:hover:bg-drb-turquoise-500/10 transition-colors text-sm font-medium"
                >
                  <RefreshCw className={`w-4 h-4 ${domainVerifying ? "animate-spin" : ""}`} />
                  {t("verifyDomain")}
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Marca y Estilo */}
      <section className="panel-card p-5 space-y-3">
        <SectionHeader
          sectionKey="marca"
          icon={Palette}
          title={t("brandStyle")}
          subtitle={t("brandStyleSub")}
        />
        {openSections.has("marca") && (
          <div className="space-y-4 pt-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label block mb-1">
                  {t("agencyName")}
                </label>
                <input
                  value={client.nombre}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 px-3 py-2 text-gray-400 dark:text-white/50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 dark:text-white/40 mt-1">
                  {t("readOnly")}
                </p>
              </div>

              <div>
                <label className="panel-label block mb-1">
                  {t("logoUrl")}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    value={fields.logo_url}
                    onChange={(e) => updateField("logo_url", e.target.value)}
                    className="panel-input w-full"
                    placeholder="https://..."
                  />
                  {fields.logo_url && (
                    <div className="shrink-0 rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 p-1">
                      <img
                        src={fields.logo_url}
                        alt="Logo preview"
                        className="h-8 w-auto object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label block mb-1">
                  {t("primaryColor")}
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

              <div>
                <label className="panel-label block mb-1">
                  {t("landingLanguage")}
                </label>
                <select
                  value={fields.preferred_language}
                  onChange={(e) => updateField("preferred_language", e.target.value)}
                  className="panel-input w-full"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="ar">العربية (Arabic)</option>
                </select>
                <p className="text-xs text-gray-400 dark:text-white/40 mt-1">
                  {t("landingLanguageHint")}
                </p>
              </div>
            </div>

            {renderSaveButton("marca", ["logo_url", "primary_color", "preferred_language"])}
          </div>
        )}
      </section>

      {/* Hero */}
      <section className="panel-card p-5 space-y-3">
        <SectionHeader
          sectionKey="hero"
          icon={Image}
          title={t("hero")}
          subtitle={t("heroSub")}
        />
        {openSections.has("hero") && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="panel-label block mb-1">
                {t("heroTitle")}
              </label>
              <input
                value={fields.hero_title}
                onChange={(e) => updateField("hero_title", e.target.value)}
                className="panel-input w-full"
                placeholder={t("heroTitlePlaceholder")}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="panel-label">
                  {t("heroSubtitle")}
                </label>
                {!aiLocked && (
                  <AIDescriptionButton
                    context={`hero subtitle for travel agency "${client.nombre}"`}
                    fieldName="hero_subtitle"
                    onAccept={(text) => updateField("hero_subtitle", text)}
                    clienteId={client.id}
                  />
                )}
              </div>
              <textarea
                value={fields.hero_subtitle}
                onChange={(e) => updateField("hero_subtitle", e.target.value)}
                className="panel-input w-full min-h-[80px]"
                placeholder={t("heroSubtitlePlaceholder")}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label block mb-1">
                  {t("ctaText")}
                </label>
                <input
                  value={fields.hero_cta_text}
                  onChange={(e) => updateField("hero_cta_text", e.target.value)}
                  className="panel-input w-full"
                  placeholder={t("ctaTextPlaceholder")}
                />
              </div>
              <div>
                <label className="panel-label block mb-1">
                  {t("ctaLink")}
                </label>
                <input
                  value={fields.hero_cta_link}
                  onChange={(e) => updateField("hero_cta_link", e.target.value)}
                  className="panel-input w-full"
                  placeholder={t("ctaLinkPlaceholder")}
                />
              </div>
            </div>

            <div>
              <label className="panel-label block mb-1">
                {t("heroImage")}
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
                  title={t("searchUnsplash")}
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
      <section className="panel-card p-5 space-y-3">
        <SectionHeader
          sectionKey="stats"
          icon={BarChart3}
          title={t("stats")}
          subtitle={t("statsSub")}
        />
        {openSections.has("stats") && (
          <div className="space-y-4 pt-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label block mb-1">
                  {t("yearsExperience")}
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
                  {t("destinations")}
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
                  {t("travelers")}
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
                  {t("ratingLabel")}
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
      <section className="panel-card p-5 space-y-3">
        <SectionHeader
          sectionKey="about"
          icon={Users}
          title={t("aboutUs")}
          subtitle={t("aboutUsSub")}
        />
        {openSections.has("about") && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="panel-label block mb-1">
                {t("aboutTitle")}
              </label>
              <input
                value={fields.about_title}
                onChange={(e) => updateField("about_title", e.target.value)}
                className="panel-input w-full"
                placeholder={t("aboutTitlePlaceholder")}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="panel-label">
                  {t("aboutText")}
                </label>
                {!aiLocked && (
                  <AIDescriptionButton
                    context={`about us section for travel agency "${client.nombre}"`}
                    fieldName="about_text_1"
                    onAccept={(text) => updateField("about_text_1", text)}
                    clienteId={client.id}
                  />
                )}
              </div>
              <textarea
                value={fields.about_text_1}
                onChange={(e) => updateField("about_text_1", e.target.value)}
                className="panel-input w-full min-h-[80px]"
                placeholder={t("aboutTextPlaceholder")}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="panel-label">
                  {t("aboutVision")}
                </label>
                {!aiLocked && (
                  <AIDescriptionButton
                    context={`company vision statement for travel agency "${client.nombre}"`}
                    fieldName="about_text_2"
                    onAccept={(text) => updateField("about_text_2", text)}
                    clienteId={client.id}
                  />
                )}
              </div>
              <textarea
                value={fields.about_text_2}
                onChange={(e) => updateField("about_text_2", e.target.value)}
                className="panel-input w-full min-h-[80px]"
                placeholder={t("aboutVisionPlaceholder")}
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
      <section className="panel-card p-5 space-y-3">
        <SectionHeader
          sectionKey="contact"
          icon={Phone}
          title={t("contact")}
          subtitle={t("contactSub")}
        />
        {openSections.has("contact") && (
          <div className="space-y-4 pt-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label block mb-1">
                  {tc("email")}
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
                  {t("phone")}
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
                {t("address")}
              </label>
              <textarea
                value={fields.contact_address}
                onChange={(e) =>
                  updateField("contact_address", e.target.value)
                }
                className="panel-input w-full min-h-[80px]"
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
      <section className="panel-card p-5 space-y-3">
        <SectionHeader
          sectionKey="social"
          icon={Share2}
          title={t("socialMedia")}
          subtitle={t("socialMediaSub")}
        />
        {openSections.has("social") && (
          <div className="space-y-4 pt-2">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="panel-label block mb-1">
                  Instagram
                </label>
                <input
                  value={fields.instagram_url}
                  onChange={(e) => updateField("instagram_url", e.target.value)}
                  className="panel-input w-full"
                  placeholder="https://instagram.com/..."
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
                  placeholder="https://facebook.com/..."
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
                  placeholder="https://tiktok.com/..."
                />
              </div>
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
      <section className="panel-card p-5 space-y-3">
        <SectionHeader
          sectionKey="footer"
          icon={FileText}
          title={t("footer")}
          subtitle={t("footerSub")}
        />
        {openSections.has("footer") && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="panel-label block mb-1">
                {t("footerTextLabel")}
              </label>
              <textarea
                value={fields.footer_text}
                onChange={(e) => updateField("footer_text", e.target.value)}
                className="panel-input w-full min-h-[80px]"
                placeholder={t("footerTextPlaceholder")}
              />
            </div>

            {renderSaveButton("footer", ["footer_text"])}
          </div>
        )}
      </section>

      {/* Opiniones */}
      <section className="panel-card p-5 space-y-3">
        <SectionHeader
          sectionKey="opiniones"
          icon={Star}
          title={t("reviewsSection")}
          subtitle={`${counts.opiniones} ${t("publishedF")}`}
        />
        {openSections.has("opiniones") && (
          <OpinionesManager
            opiniones={opiniones}
            clientId={client.id}
            locale={locale}
          />
        )}
      </section>

      {/* Legales */}
      <section className="panel-card p-5 space-y-3">
        <SectionHeader
          sectionKey="legales"
          icon={Scale}
          title={t("legalSection")}
          subtitle={`${counts.legales} ${t("pages")}`}
        />
        {openSections.has("legales") && (
          <LegalesManager
            legales={legales}
            clientId={client.id}
          />
        )}
      </section>

      {/* Enlace a destinos */}
      <section className="panel-card p-5 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-drb-turquoise-600 dark:text-drb-turquoise-400" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white flex-1">{t("relatedSections")}</h2>
        </div>
        <a
          href="/admin/destinos"
          className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 p-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
        >
          <div>
            <span className="font-semibold text-gray-900 dark:text-white/80 group-hover:text-drb-turquoise-600 dark:group-hover:text-white transition-colors">
              {t("destinationsSection")}
            </span>
            <p className="text-sm text-gray-400 dark:text-white/50">
              {counts.destinos} {t("published")}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-white/40" />
        </a>
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
