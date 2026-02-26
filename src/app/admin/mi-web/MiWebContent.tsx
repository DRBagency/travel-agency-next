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
  Languages,
  RefreshCw,
  AlertCircle,
  Settings,
  type LucideIcon,
} from "lucide-react";
import UnsplashPicker from "./UnsplashPicker";
import AIDescriptionButton from "@/components/ai/AIDescriptionButton";
import OpinionesManager from "./OpinionesManager";
import LegalesManager from "./LegalesManager";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { MIWEB_SECTION_TRANSLATABLE_FIELDS, TRANSLATABLE_CLIENT_FIELDS, TRANSLATABLE_DESTINO_FIELDS } from "@/lib/translations";

interface WhyUsItem {
  icon: string;
  title: string;
  description: string;
}

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
  hero_badge: string | null;
  hero_description: string | null;
  hero_cta_text_secondary: string | null;
  hero_cta_link_secondary: string | null;
  stats_destinations: string | null;
  stats_travelers: string | null;
  stats_rating: string | null;
  stats_repeat: string | null;
  whyus_items: WhyUsItem[] | string | null;
  cta_banner_title: string | null;
  cta_banner_description: string | null;
  cta_banner_cta_text: string | null;
  cta_banner_cta_link: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  footer_text: string | null;
  footer_description: string | null;
  dark_mode_enabled: boolean | null;
  meta_title: string | null;
  meta_description: string | null;
  preferred_language: string | null;
  available_languages: string[] | null;
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
  | "whyus"
  | "opiniones"
  | "ctabanner"
  | "contact"
  | "footer";

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

  const { translating, translationError, isEligible: translationEligible, translate: triggerTranslation } = useAutoTranslate({
    table: "clientes",
    recordId: client.id,
    sourceLang: client.preferred_language || "es",
    availableLangs: Array.isArray(client.available_languages) && client.available_languages.length > 0
      ? client.available_languages
      : ["es"],
    plan,
  });

  // Parse whyus_items from client data (could be JSON string or array)
  // Pre-fill with defaults matching the landing when empty
  const DEFAULT_WHYUS: WhyUsItem[] = [
    { icon: "🎯", title: "Coordinador local", description: "Un experto del destino te acompaña durante todo el viaje." },
    { icon: "👥", title: "Grupos reducidos", description: "Máximo 16 viajeros para experiencias auténticas e íntimas." },
    { icon: "🔄", title: "Cancelación flexible", description: "Cancela gratis hasta 30 días antes de la fecha de salida." },
    { icon: "🔒", title: "Pago 100% seguro", description: "Reserva tu plaza con solo 200€ de anticipo. Plataforma segura." },
  ];

  function normalizeItems(items: any[]): WhyUsItem[] {
    return items.map((item) => ({
      icon: item.icon || "",
      title: item.title || "",
      description: item.description || item.desc || "",
    }));
  }

  function parseWhyUsItems(data: WhyUsItem[] | string | null): WhyUsItem[] {
    if (!data) return DEFAULT_WHYUS;
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data) as any[];
        return parsed.length > 0 ? normalizeItems(parsed) : DEFAULT_WHYUS;
      } catch {
        return DEFAULT_WHYUS;
      }
    }
    return data.length > 0 ? normalizeItems(data) : DEFAULT_WHYUS;
  }

  const [fields, setFields] = useState({
    logo_url: client.logo_url ?? "",
    primary_color: client.primary_color ?? "#1CABB0",
    hero_title: client.hero_title ?? "",
    hero_subtitle: client.hero_subtitle ?? "",
    hero_cta_text: client.hero_cta_text ?? "",
    hero_cta_link: client.hero_cta_link ?? "",
    hero_image_url: client.hero_image_url ?? "",
    hero_badge: client.hero_badge ?? "",
    hero_description: client.hero_description ?? "",
    hero_cta_text_secondary: client.hero_cta_text_secondary ?? "",
    hero_cta_link_secondary: client.hero_cta_link_secondary ?? "",
    stats_destinations: client.stats_destinations ?? "",
    stats_travelers: client.stats_travelers ?? "",
    stats_rating: client.stats_rating ?? "",
    stats_repeat: client.stats_repeat ?? "",
    cta_banner_title: client.cta_banner_title ?? "",
    cta_banner_description: client.cta_banner_description ?? "",
    cta_banner_cta_text: client.cta_banner_cta_text ?? "",
    cta_banner_cta_link: client.cta_banner_cta_link ?? "",
    contact_email: client.contact_email ?? "",
    contact_phone: client.contact_phone ?? "",
    contact_address: client.contact_address ?? "",
    instagram_url: client.instagram_url ?? "",
    facebook_url: client.facebook_url ?? "",
    tiktok_url: client.tiktok_url ?? "",
    footer_text: client.footer_text ?? "",
    footer_description: client.footer_description ?? "",
    meta_title: client.meta_title ?? "",
    meta_description: client.meta_description ?? "",
    preferred_language: client.preferred_language ?? "es",
  });

  const [whyusItems, setWhyusItems] = useState<WhyUsItem[]>(parseWhyUsItems(client.whyus_items));
  const [darkModeEnabled, setDarkModeEnabled] = useState(client.dark_mode_enabled ?? false);
  const [availableLangs, setAvailableLangs] = useState<string[]>(
    Array.isArray(client.available_languages) && client.available_languages.length > 0
      ? client.available_languages
      : ["es"]
  );

  const [openSections, setOpenSections] = useState<Set<SectionKey>>(
    new Set()
  );
  const [saveStates, setSaveStates] = useState<Record<SectionKey, SaveState>>({
    domain: { loading: false, success: false, error: null },
    marca: { loading: false, success: false, error: null },
    hero: { loading: false, success: false, error: null },
    stats: { loading: false, success: false, error: null },
    whyus: { loading: false, success: false, error: null },
    opiniones: { loading: false, success: false, error: null },
    ctabanner: { loading: false, success: false, error: null },
    contact: { loading: false, success: false, error: null },
    footer: { loading: false, success: false, error: null },
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

  // Bulk translate all state
  const [bulkTranslating, setBulkTranslating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState("");
  const [bulkTranslateResult, setBulkTranslateResult] = useState<{
    success: boolean;
    translated: number;
    failed: number;
    total: number;
    details?: any[];
  } | null>(null);
  const [bulkTranslateError, setBulkTranslateError] = useState<string | null>(null);
  const [showTranslateConfirm, setShowTranslateConfirm] = useState(false);

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

  async function saveSection(section: SectionKey, fieldKeys: string[], extraPayload?: Record<string, unknown>) {
    setSaveStates((prev) => ({
      ...prev,
      [section]: { loading: true, success: false, error: null },
    }));

    const payload: Record<string, unknown> = {};
    for (const key of fieldKeys) {
      payload[key] = fields[key as keyof typeof fields];
    }
    if (extraPayload) {
      Object.assign(payload, extraPayload);
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

      // Fire-and-forget auto-translation
      if (translationEligible) {
        const sectionFields = MIWEB_SECTION_TRANSLATABLE_FIELDS[section];
        if (sectionFields && sectionFields.length > 0) {
          const translatablePayload: Record<string, unknown> = {};
          for (const f of sectionFields) {
            const fieldType = TRANSLATABLE_CLIENT_FIELDS[f];
            if (fieldType === "jsonb" && extraPayload && f in extraPayload) {
              translatablePayload[f] = extraPayload[f];
            } else if (f in fields) {
              translatablePayload[f] = fields[f as keyof typeof fields];
            }
          }
          triggerTranslation(translatablePayload);
        }
      }
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

  function renderSaveButton(section: SectionKey, fieldKeys: string[], extraPayload?: Record<string, unknown>) {
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
          onClick={() => saveSection(section, fieldKeys, extraPayload)}
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

  function SectionHeaderEmoji({
    sectionKey,
    emoji,
    title,
    subtitle,
  }: {
    sectionKey: SectionKey;
    emoji: string;
    title: string;
    subtitle: string;
  }) {
    const isOpen = openSections.has(sectionKey);
    return (
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center gap-2.5 text-start"
      >
        <div className="w-7 h-7 rounded-lg bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center text-sm">
          {emoji}
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

  // WhyUs items helpers
  function updateWhyUsItem(index: number, key: keyof WhyUsItem, value: string) {
    setWhyusItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  function removeWhyUsItem(index: number) {
    setWhyusItems((prev) => prev.filter((_, i) => i !== index));
  }

  function moveWhyUsItem(index: number, direction: "up" | "down") {
    setWhyusItems((prev) => {
      const next = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  function addWhyUsItem() {
    if (whyusItems.length >= 4) return;
    setWhyusItems((prev) => [...prev, { icon: "✨", title: "", description: "" }]);
  }

  async function handleBulkTranslateAll() {
    setBulkTranslating(true);
    setBulkTranslateResult(null);
    setBulkTranslateError(null);
    setBulkProgress("");

    const results: { table: string; name: string; success: boolean; error?: string }[] = [];

    try {
      // 1. Get list of all records to translate
      const listRes = await fetch("/api/admin/translate/list");
      if (!listRes.ok) throw new Error("Could not fetch record list");
      const list = await listRes.json();

      // Build queue: client first, then destinos, then opiniones
      const queue: { table: string; id: string; name: string }[] = [
        { table: "clientes", id: list.clientId, name: client.nombre || "Web" },
        ...(list.destinos || []).map((d: any) => ({ table: "destinos", id: d.id, name: d.nombre || "Destino" })),
        ...(list.opiniones || []).map((o: any) => ({ table: "opiniones", id: o.id, name: o.nombre || "Opinión" })),
      ];

      // Derive JSONB field names per table (each becomes its own API call)
      const JSONB_FIELDS: Record<string, string[]> = {
        clientes: Object.entries(TRANSLATABLE_CLIENT_FIELDS)
          .filter(([, type]) => type === "jsonb")
          .map(([key]) => key),
        destinos: Object.entries(TRANSLATABLE_DESTINO_FIELDS)
          .filter(([, type]) => type === "jsonb")
          .map(([key]) => key),
        opiniones: [],
      };

      // 2. Translate one record at a time, splitting by fieldGroup
      // Each fieldGroup = exactly 1 AI API call = stays within serverless timeout
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i];
        const jsonbFields = JSONB_FIELDS[item.table] || [];

        // Build fieldGroup list: tables with JSONB get "strings" + each JSONB field separately
        // Tables without JSONB (opiniones) get a single call with no fieldGroup
        const fieldGroups: (string | undefined)[] = jsonbFields.length > 0
          ? ["strings", ...jsonbFields]
          : [undefined];

        let recordSuccess = true;
        let recordError: string | undefined;

        for (let g = 0; g < fieldGroups.length; g++) {
          const fg = fieldGroups[g];
          const label = fg || "text";
          setBulkProgress(`${i + 1}/${queue.length} — ${item.name} (${label})...`);

          try {
            const res = await fetch("/api/admin/translate/record", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                table: item.table,
                recordId: item.id,
                ...(fg ? { fieldGroup: fg } : {}),
              }),
            });
            let data;
            try { data = await res.json(); } catch { data = { error: `HTTP ${res.status}` }; }
            if (!res.ok || data.success === false) {
              recordSuccess = false;
              recordError = `${label}: ${data.error || `HTTP ${res.status}`}`;
              break; // Stop remaining field groups for this record
            }
          } catch (err: any) {
            recordSuccess = false;
            recordError = `${label}: ${err?.message || "Network error"}`;
            break;
          }
        }

        results.push({ table: item.table, name: item.name, success: recordSuccess, error: recordError });
      }

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;
      setBulkTranslateResult({
        success: failCount === 0,
        translated: successCount,
        failed: failCount,
        total: results.length,
        details: results,
      });
    } catch (err) {
      setBulkTranslateError(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setBulkTranslating(false);
      setBulkProgress("");
    }
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

      {/* Translation status banners */}
      {translating && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-sm text-blue-700 dark:text-blue-300">
          <Loader2 className="w-4 h-4 animate-spin" />
          Translating content to other languages...
        </div>
      )}
      {translationError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-sm text-amber-700 dark:text-amber-300">
          <AlertCircle className="w-4 h-4" />
          Translation failed. Content saved successfully.
        </div>
      )}

      {/* Bulk Translate All button — shown when translation is eligible */}
      {translationEligible && (
        <div className="panel-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center shrink-0">
              <Languages className="w-4.5 h-4.5 text-drb-turquoise-600 dark:text-drb-turquoise-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {t("translateAllTitle")}
              </p>
              <p className="text-xs text-gray-500 dark:text-white/50">
                {t("translateAllDescription")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {bulkTranslateResult && (
              <div className="flex flex-col">
                {bulkTranslateResult.translated === 0 && bulkTranslateResult.failed === 0 ? (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">
                    {t("translateAllUpToDate")}
                  </span>
                ) : (
                  <>
                    <span className={`text-xs ${bulkTranslateResult.success ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                      {bulkTranslateResult.translated}/{bulkTranslateResult.total} {t("translateAllTranslated")}
                      {bulkTranslateResult.failed > 0 && ` · ${bulkTranslateResult.failed} ${t("translateAllFailed")}`}
                    </span>
                    {bulkTranslateResult.details?.filter((d: any) => !d.success).map((d: any, i: number) => (
                      <span key={i} className="text-[10px] text-red-500 dark:text-red-400 truncate max-w-xs">
                        {d.table}/{d.name || d.id}: {d.error}
                      </span>
                    ))}
                  </>
                )}
              </div>
            )}
            {bulkTranslateError && (
              <span className="text-xs text-red-600 dark:text-red-400">{bulkTranslateError}</span>
            )}
            <button
              onClick={() => setShowTranslateConfirm(true)}
              disabled={bulkTranslating}
              className="btn-primary disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {bulkTranslating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Languages className="w-4 h-4" />
              )}
              {bulkTranslating ? (bulkProgress || t("translateAllTranslating")) : t("translateAllButton")}
            </button>
          </div>
        </div>
      )}

      {/* Translate confirmation dialog */}
      {showTranslateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0c1f2b] rounded-2xl border border-gray-200 dark:border-white/15 shadow-xl max-w-md w-full mx-4 p-6 space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {t("translateConfirmTitle")}
              </h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-white/60">
              <p>{t("translateConfirmDesc")}</p>
              <ul className="space-y-1.5 ps-4">
                <li className="flex items-start gap-2">
                  <span className="text-drb-turquoise-500 mt-0.5">•</span>
                  {t("translateConfirmCheck1")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-drb-turquoise-500 mt-0.5">•</span>
                  {t("translateConfirmCheck2")}
                </li>
              </ul>
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-700 dark:text-emerald-400">
                {t("translateConfirmNote")}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={() => setShowTranslateConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                {tc("cancel")}
              </button>
              <button
                onClick={() => {
                  setShowTranslateConfirm(false);
                  handleBulkTranslateAll();
                }}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Languages className="w-4 h-4" />
                {t("translateAllButton")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dominio y Configuración */}
      <section className="panel-card p-5 space-y-3">
        <SectionHeader
          sectionKey="domain"
          icon={Globe}
          title={t("domainConfigSection")}
          subtitle={t("domainConfigSub")}
        />
        {openSections.has("domain") && (
          <div className="space-y-6 pt-2">
            {/* Dominio */}
            <div className="space-y-4">
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

              {/* Domain action buttons */}
              <div className="flex items-center gap-3 justify-end">
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

            {/* Configuración Meta */}
            <div className="space-y-4 border-t border-gray-200 dark:border-white/10 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-white/70 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {t("metaConfigTitle")}
              </h3>
              <div className="flex items-center gap-3">
                <label className="panel-label flex-1">
                  {t("darkModeToggle")}
                </label>
                <button
                  type="button"
                  onClick={() => setDarkModeEnabled((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    darkModeEnabled
                      ? "bg-drb-turquoise-600"
                      : "bg-gray-200 dark:bg-white/20"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      darkModeEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <div>
                <label className="panel-label block mb-1">
                  {t("metaTitle")}
                </label>
                <input
                  value={fields.meta_title}
                  onChange={(e) => updateField("meta_title", e.target.value)}
                  className="panel-input w-full"
                  placeholder={t("metaTitlePlaceholder")}
                />
              </div>
              <div>
                <label className="panel-label block mb-1">
                  {t("metaDescription")}
                </label>
                <textarea
                  value={fields.meta_description}
                  onChange={(e) => updateField("meta_description", e.target.value)}
                  className="panel-input w-full min-h-[80px]"
                  placeholder={t("metaDescriptionPlaceholder")}
                />
              </div>

              {renderSaveButton("domain", ["meta_title", "meta_description"], { dark_mode_enabled: darkModeEnabled })}
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

              <div>
                <label className="panel-label block mb-1">
                  Idiomas disponibles en la landing
                </label>
                <div className="flex flex-wrap gap-3 mt-1">
                  {[
                    { code: "es", label: "Español" },
                    { code: "en", label: "English" },
                    { code: "ar", label: "العربية" },
                  ].map((lang) => (
                    <label
                      key={lang.code}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={availableLangs.includes(lang.code)}
                        onChange={(e) => {
                          setAvailableLangs((prev) =>
                            e.target.checked
                              ? [...prev, lang.code]
                              : prev.filter((l) => l !== lang.code)
                          );
                        }}
                        className="rounded border-gray-300 dark:border-white/30 text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span className="text-sm text-gray-700 dark:text-white/70">
                        {lang.label}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-400 dark:text-white/40 mt-1">
                  El visitante podrá cambiar entre estos idiomas en la navbar.
                </p>
              </div>
            </div>

            {renderSaveButton("marca", ["logo_url", "primary_color", "preferred_language"], { available_languages: availableLangs })}
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

            <div>
              <label className="panel-label block mb-1">
                {t("heroDescription")}
              </label>
              <textarea
                value={fields.hero_description}
                onChange={(e) => updateField("hero_description", e.target.value)}
                className="panel-input w-full min-h-[80px]"
                placeholder="Experiencias a medida con hoteles excepcionales..."
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

            <div>
              <label className="panel-label block mb-1">
                {t("heroBadge")}
              </label>
              <input
                value={fields.hero_badge}
                onChange={(e) => updateField("hero_badge", e.target.value)}
                className="panel-input w-full"
                placeholder={t("heroBadgePlaceholder")}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label block mb-1">
                  {t("secondaryCtaText")}
                </label>
                <input
                  value={fields.hero_cta_text_secondary}
                  onChange={(e) => updateField("hero_cta_text_secondary", e.target.value)}
                  className="panel-input w-full"
                  placeholder={t("secondaryCtaTextPlaceholder")}
                />
              </div>
              <div>
                <label className="panel-label block mb-1">
                  {t("secondaryCtaLink")}
                </label>
                <input
                  value={fields.hero_cta_link_secondary}
                  onChange={(e) => updateField("hero_cta_link_secondary", e.target.value)}
                  className="panel-input w-full"
                  placeholder={t("secondaryCtaLinkPlaceholder")}
                />
              </div>
            </div>

            {renderSaveButton("hero", [
              "hero_title",
              "hero_subtitle",
              "hero_description",
              "hero_cta_text",
              "hero_cta_link",
              "hero_image_url",
              "hero_badge",
              "hero_cta_text_secondary",
              "hero_cta_link_secondary",
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
              <div>
                <label className="panel-label block mb-1">
                  {t("repeatRate")}
                </label>
                <input
                  value={fields.stats_repeat}
                  onChange={(e) => updateField("stats_repeat", e.target.value)}
                  className="panel-input w-full"
                  placeholder="Ej: 98%"
                />
              </div>
            </div>

            {renderSaveButton("stats", [
              "stats_destinations",
              "stats_travelers",
              "stats_rating",
              "stats_repeat",
            ])}
          </div>
        )}
      </section>

      {/* Por que nosotros */}
      <section className="panel-card p-5 space-y-3">
        <SectionHeaderEmoji
          sectionKey="whyus"
          emoji="✦"
          title={t("whyUsSection")}
          subtitle={t("whyUsSubtitle")}
        />
        {openSections.has("whyus") && (
          <div className="space-y-4 pt-2">
            {whyusItems.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/[0.04] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-white/50">
                    {t("whyUsSection")} #{index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveWhyUsItem(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-30 transition-colors text-sm"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveWhyUsItem(index, "down")}
                      disabled={index === whyusItems.length - 1}
                      className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-30 transition-colors text-sm"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeWhyUsItem(index)}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 transition-colors text-sm"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="grid md:grid-cols-[60px_1fr] gap-3">
                  <div>
                    <label className="panel-label block mb-1 text-xs">Icon</label>
                    <input
                      value={item.icon}
                      onChange={(e) => updateWhyUsItem(index, "icon", e.target.value)}
                      className="panel-input w-full text-center text-lg"
                      placeholder="✨"
                      maxLength={4}
                    />
                  </div>
                  <div>
                    <label className="panel-label block mb-1 text-xs">{tc("title")}</label>
                    <input
                      value={item.title}
                      onChange={(e) => updateWhyUsItem(index, "title", e.target.value)}
                      className="panel-input w-full"
                      placeholder={t("whyUsCardTitlePlaceholder")}
                    />
                  </div>
                </div>
                <div>
                  <label className="panel-label block mb-1 text-xs">{tc("description")}</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateWhyUsItem(index, "description", e.target.value)}
                    className="panel-input w-full min-h-[60px]"
                    placeholder={t("whyUsCardDescPlaceholder")}
                  />
                </div>
              </div>
            ))}

            {whyusItems.length < 4 && (
              <button
                type="button"
                onClick={addWhyUsItem}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 text-sm font-medium text-gray-500 dark:text-white/50 hover:border-drb-turquoise-400 hover:text-drb-turquoise-600 dark:hover:border-drb-turquoise-500 dark:hover:text-drb-turquoise-400 transition-colors"
              >
                + {t("addCard")}
              </button>
            )}

            {whyusItems.length >= 4 && (
              <p className="text-xs text-gray-400 dark:text-white/40 text-center">
                {t("maxCardsReached")}
              </p>
            )}

            {renderSaveButton("whyus", [], { whyus_items: whyusItems })}
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

      {/* Banner CTA */}
      <section className="panel-card p-5 space-y-3">
        <SectionHeaderEmoji
          sectionKey="ctabanner"
          emoji="📢"
          title={t("ctaBannerSection")}
          subtitle={t("ctaBannerSubtitle")}
        />
        {openSections.has("ctabanner") && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="panel-label block mb-1">
                {t("ctaBannerTitle")}
              </label>
              <input
                value={fields.cta_banner_title}
                onChange={(e) => updateField("cta_banner_title", e.target.value)}
                className="panel-input w-full"
                placeholder={t("ctaBannerTitlePlaceholder")}
              />
            </div>
            <div>
              <label className="panel-label block mb-1">
                {t("ctaBannerDescription")}
              </label>
              <textarea
                value={fields.cta_banner_description}
                onChange={(e) => updateField("cta_banner_description", e.target.value)}
                className="panel-input w-full min-h-[80px]"
                placeholder={t("ctaBannerDescriptionPlaceholder")}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="panel-label block mb-1">
                  {t("ctaBannerCtaText")}
                </label>
                <input
                  value={fields.cta_banner_cta_text}
                  onChange={(e) => updateField("cta_banner_cta_text", e.target.value)}
                  className="panel-input w-full"
                  placeholder={t("ctaBannerCtaTextPlaceholder")}
                />
              </div>
              <div>
                <label className="panel-label block mb-1">
                  {t("ctaBannerCtaLink")}
                </label>
                <input
                  value={fields.cta_banner_cta_link}
                  onChange={(e) => updateField("cta_banner_cta_link", e.target.value)}
                  className="panel-input w-full"
                  placeholder={t("ctaBannerCtaLinkPlaceholder")}
                />
              </div>
            </div>

            {renderSaveButton("ctabanner", [
              "cta_banner_title",
              "cta_banner_description",
              "cta_banner_cta_text",
              "cta_banner_cta_link",
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

      {/* Footer (texto + redes + legal) */}
      <section className="panel-card p-5 space-y-3">
        <SectionHeader
          sectionKey="footer"
          icon={FileText}
          title={t("footer")}
          subtitle={t("footerSub")}
        />
        {openSections.has("footer") && (
          <div className="space-y-6 pt-2">
            {/* Texto del footer */}
            <div className="space-y-4">
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
              <div>
                <label className="panel-label block mb-1">
                  {t("footerDescription")}
                </label>
                <textarea
                  value={fields.footer_description}
                  onChange={(e) => updateField("footer_description", e.target.value)}
                  className="panel-input w-full min-h-[80px]"
                  placeholder={t("footerDescPlaceholder")}
                />
              </div>
            </div>

            {/* Redes sociales */}
            <div className="space-y-3 border-t border-gray-200 dark:border-white/10 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-white/70 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                {t("socialMedia")}
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="panel-label block mb-1">Instagram</label>
                  <input
                    value={fields.instagram_url}
                    onChange={(e) => updateField("instagram_url", e.target.value)}
                    className="panel-input w-full"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="panel-label block mb-1">Facebook</label>
                  <input
                    value={fields.facebook_url}
                    onChange={(e) => updateField("facebook_url", e.target.value)}
                    className="panel-input w-full"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="panel-label block mb-1">TikTok</label>
                  <input
                    value={fields.tiktok_url}
                    onChange={(e) => updateField("tiktok_url", e.target.value)}
                    className="panel-input w-full"
                    placeholder="https://tiktok.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Páginas legales */}
            <div className="space-y-3 border-t border-gray-200 dark:border-white/10 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-white/70 flex items-center gap-2">
                <Scale className="w-4 h-4" />
                {t("legalSection")} · {counts.legales} {t("pages")}
              </h3>
              <LegalesManager
                legales={legales}
                clientId={client.id}
              />
            </div>

            {renderSaveButton("footer", [
              "footer_text",
              "footer_description",
              "instagram_url",
              "facebook_url",
              "tiktok_url",
            ])}
          </div>
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
