"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Globe,
  Palette,
  CreditCard,
  Rocket,
  Building2,
  Clock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Zap,
  Link2,
} from "lucide-react";

interface OnboardingWizardProps {
  client: {
    id: string;
    nombre: string;
    email: string;
    contact_email?: string | null;
    contact_phone?: string | null;
    contact_address?: string | null;
    primary_color?: string | null;
    plan?: string | null;
    domain?: string | null;
    domain_verified?: boolean | null;
    hero_title?: string | null;
    hero_subtitle?: string | null;
    hero_cta_text?: string | null;
    about_title?: string | null;
    about_text_1?: string | null;
    onboarding_step?: number | null;
    stripe_subscription_id?: string | null;
    stripe_account_id?: string | null;
    stripe_charges_enabled?: boolean | null;
  };
  updateOnboardingData: (data: {
    plan?: string;
    domain?: string;
    onboarding_step?: number;
    onboarding_completed?: boolean;
  }) => Promise<void>;
}

const TOTAL_STEPS = 6;

const PLANS = [
  {
    id: "start",
    name: "Start",
    price: 29,
    commission: "5%",
    features: ["web", "bookings", "stripe", "email"],
  },
  {
    id: "grow",
    name: "Grow",
    price: 59,
    commission: "3%",
    features: ["web", "bookings", "stripe", "email", "ai", "crm"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    commission: "1%",
    features: ["web", "bookings", "stripe", "email", "ai", "crm", "priority"],
  },
];

export default function OnboardingWizard({
  client,
  updateOnboardingData,
}: OnboardingWizardProps) {
  const t = useTranslations("admin.onboarding");
  const router = useRouter();

  const [step, setStep] = useState(client.onboarding_step ?? 0);
  const [saving, setSaving] = useState(false);

  // Step 1 fields
  const [contactEmail, setContactEmail] = useState(client.contact_email ?? "");
  const [contactPhone, setContactPhone] = useState(client.contact_phone ?? "");
  const [contactAddress, setContactAddress] = useState(client.contact_address ?? "");
  const [primaryColor, setPrimaryColor] = useState(client.primary_color ?? "#1CABB0");

  // Step 2
  const [selectedPlan, setSelectedPlan] = useState(client.plan ?? "");

  // Step 3
  const [domain, setDomain] = useState(client.domain ?? "");

  // Step 3 — domain verification
  const [domainVerified, setDomainVerified] = useState(client.domain_verified ?? false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  // Step 4
  const [heroTitle, setHeroTitle] = useState(client.hero_title ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(client.hero_subtitle ?? "");
  const [heroCtaText, setHeroCtaText] = useState(client.hero_cta_text ?? "");
  const [aboutTitle, setAboutTitle] = useState(client.about_title ?? "");
  const [aboutText1, setAboutText1] = useState(client.about_text_1 ?? "");

  // Stripe state
  const [stripeLoading, setStripeLoading] = useState(false);

  const stepIcons = [Rocket, Building2, CreditCard, Globe, Palette, Check];
  const stepLabels = [
    t("welcome.title"),
    t("agency.title"),
    t("plan.title"),
    t("domain.title"),
    t("web.title"),
    t("done.title"),
  ];

  async function saveStep1() {
    setSaving(true);
    try {
      await fetch("/api/admin/mi-web/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_email: contactEmail,
          contact_phone: contactPhone,
          contact_address: contactAddress,
          primary_color: primaryColor,
        }),
      });
      await updateOnboardingData({ onboarding_step: 1 });
      setStep(2);
    } finally {
      setSaving(false);
    }
  }

  async function saveStep2() {
    setSaving(true);
    try {
      await updateOnboardingData({ plan: selectedPlan, onboarding_step: 2 });
      setStep(3);
    } finally {
      setSaving(false);
    }
  }

  async function verifyDomain() {
    if (!domain) return;
    setVerifying(true);
    setVerifyError("");
    try {
      const res = await fetch("/api/admin/domain/verify", { method: "POST" });
      const data = await res.json();
      if (data.verified) {
        setDomainVerified(true);
        setVerifyError("");
      } else if (data.error === "dns_not_found") {
        setVerifyError(t("domain.notFound"));
      } else {
        setVerifyError(t("domain.verifyError"));
      }
    } catch {
      setVerifyError(t("domain.verifyError"));
    } finally {
      setVerifying(false);
    }
  }

  async function saveStep3() {
    setSaving(true);
    try {
      await updateOnboardingData({ domain, onboarding_step: 3 });
      setStep(4);
    } finally {
      setSaving(false);
    }
  }

  async function saveStep4() {
    setSaving(true);
    try {
      await fetch("/api/admin/mi-web/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
          hero_cta_text: heroCtaText,
          about_title: aboutTitle,
          about_text_1: aboutText1,
        }),
      });
      await updateOnboardingData({ onboarding_step: 4 });
      setStep(5);
    } finally {
      setSaving(false);
    }
  }

  async function handleStripeCheckout() {
    setStripeLoading(true);
    try {
      const res = await fetch("/api/stripe/billing/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnTo: "/admin/onboarding" }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } finally {
      setStripeLoading(false);
    }
  }

  async function handleStripeConnect() {
    setStripeLoading(true);
    try {
      const res = await fetch("/api/stripe/connect/create-account", {
        method: "POST",
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } finally {
      setStripeLoading(false);
    }
  }

  async function finishOnboarding() {
    setSaving(true);
    try {
      await updateOnboardingData({ onboarding_completed: true, onboarding_step: 5 });
      router.push("/admin");
    } finally {
      setSaving(false);
    }
  }

  async function skipAll() {
    setSaving(true);
    try {
      await updateOnboardingData({ onboarding_step: step });
      router.push("/admin");
    } finally {
      setSaving(false);
    }
  }

  // --- Progress Bar (called as function, NOT as <Component />) ---
  function renderProgressBar() {
    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
          const Icon = stepIcons[i];
          const isActive = i === step;
          const isDone = i < step;
          return (
            <div key={i} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                  isActive
                    ? "bg-drb-turquoise-500 text-white shadow-lg shadow-drb-turquoise-500/30"
                    : isDone
                    ? "bg-drb-turquoise-100 dark:bg-drb-turquoise-500/20 text-drb-turquoise-600 dark:text-drb-turquoise-400 cursor-pointer"
                    : "bg-gray-100 dark:bg-white/[0.06] text-gray-400 dark:text-white/30"
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </button>
              {i < TOTAL_STEPS - 1 && (
                <div
                  className={`w-8 h-0.5 rounded-full ${
                    i < step
                      ? "bg-drb-turquoise-400 dark:bg-drb-turquoise-500/50"
                      : "bg-gray-200 dark:bg-white/[0.08]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // --- Step Content (called as function, NOT as <Component />) ---
  function renderStepContent() {
    switch (step) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 text-white mb-2">
              <Rocket className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("welcome.title")}
            </h2>
            <p className="text-gray-500 dark:text-white/60 max-w-md mx-auto">
              {t("welcome.subtitle")}
            </p>
            <button
              onClick={() => setStep(1)}
              className="btn-primary px-8 py-3 rounded-xl text-lg font-semibold"
            >
              {t("welcome.start")}
            </button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("agency.title")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-white/60">
                {t("agency.subtitle")}
              </p>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="panel-input w-full px-4 py-2.5 rounded-xl"
                  placeholder="info@tuagencia.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  {t("agency.phone")}
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="panel-input w-full px-4 py-2.5 rounded-xl"
                  placeholder="+34 600 000 000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  {t("agency.address")}
                </label>
                <input
                  type="text"
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  className="panel-input w-full px-4 py-2.5 rounded-xl"
                  placeholder="Calle Gran Vía 1, Madrid"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  {t("agency.color")}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onInput={(e) => setPrimaryColor((e.target as HTMLInputElement).value)}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 rounded-lg border border-gray-200 dark:border-white/10 cursor-pointer appearance-none bg-transparent [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="panel-input px-3 py-1.5 rounded-lg text-sm w-28 font-mono"
                    placeholder="#1CABB0"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("plan.title")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-white/60">
                {t("plan.subtitle")}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-5 rounded-2xl border-2 text-start transition-all ${
                    selectedPlan === plan.id
                      ? "border-drb-turquoise-500 bg-drb-turquoise-50 dark:bg-drb-turquoise-500/10 shadow-lg shadow-drb-turquoise-500/10"
                      : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                  }`}
                >
                  {selectedPlan === plan.id && (
                    <div className="absolute top-3 end-3 w-6 h-6 rounded-full bg-drb-turquoise-500 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className="font-bold text-lg text-gray-900 dark:text-white">
                    {plan.name}
                  </div>
                  <div className="mt-1">
                    <span className="text-2xl font-bold text-drb-turquoise-600 dark:text-drb-turquoise-400">
                      {plan.price}€
                    </span>
                    <span className="text-sm text-gray-500 dark:text-white/50">
                      {t("plan.month")}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-white/50">
                    {plan.commission} {t("plan.commission")}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-center text-gray-400 dark:text-white/40">
              {t("plan.activateLater")}
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("domain.title")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-white/60">
                {t("domain.subtitle")}
              </p>
            </div>
            <div className="rounded-xl bg-drb-turquoise-50 dark:bg-drb-turquoise-500/10 border border-drb-turquoise-200 dark:border-drb-turquoise-500/20 p-4 text-sm text-gray-700 dark:text-white/70">
              {t("domain.explanation")}
            </div>
            <div>
              <input
                type="text"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  setDomainVerified(false);
                  setVerifyError("");
                }}
                className="panel-input w-full px-4 py-2.5 rounded-xl"
                placeholder={t("domain.placeholder")}
              />
            </div>
            <div className="panel-card p-4 space-y-3">
              <p className="text-sm font-medium text-gray-700 dark:text-white/70">
                {t("domain.instructions")}
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

            {/* Domain verification */}
            {domain && (
              <div className="space-y-3">
                {domainVerified ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      {t("domain.verified")}
                    </span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={verifyDomain}
                      disabled={verifying}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-drb-turquoise-200 dark:border-drb-turquoise-500/20 text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:bg-drb-turquoise-50 dark:hover:bg-drb-turquoise-500/10 transition-colors text-sm font-medium"
                    >
                      <RefreshCw className={`w-4 h-4 ${verifying ? "animate-spin" : ""}`} />
                      {verifying ? t("domain.verifying") : t("domain.verify")}
                    </button>
                    {verifyError && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="text-sm text-amber-700 dark:text-amber-300">
                          {verifyError}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-center text-gray-400 dark:text-white/40">
                      {t("domain.verifyLater")}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("web.title")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-white/60">
                {t("web.subtitle")}
              </p>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  {t("web.heroTitle")}
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="panel-input w-full px-4 py-2.5 rounded-xl"
                  placeholder={t("web.heroTitlePlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  {t("web.heroSubtitle")}
                </label>
                <input
                  type="text"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="panel-input w-full px-4 py-2.5 rounded-xl"
                  placeholder={t("web.heroSubtitlePlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  {t("web.ctaText")}
                </label>
                <input
                  type="text"
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  className="panel-input w-full px-4 py-2.5 rounded-xl"
                  placeholder={t("web.ctaPlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  {t("web.aboutTitle")}
                </label>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  className="panel-input w-full px-4 py-2.5 rounded-xl"
                  placeholder={t("web.aboutTitlePlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                  {t("web.aboutText")}
                </label>
                <textarea
                  value={aboutText1}
                  onChange={(e) => setAboutText1(e.target.value)}
                  rows={3}
                  className="panel-input w-full px-4 py-2.5 rounded-xl resize-none"
                  placeholder={t("web.aboutTextPlaceholder")}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 text-white mb-2">
              <Check className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("done.title")}
            </h2>
            <p className="text-gray-500 dark:text-white/60 max-w-md mx-auto">
              {t("done.subtitle")}
            </p>

            {/* Summary checklist */}
            <div className="max-w-sm mx-auto text-start space-y-2">
              {renderSummaryItem(!!contactEmail || !!contactPhone, t("agency.title"))}
              {renderSummaryItem(!!selectedPlan, t("plan.title"))}
              {renderSummaryItem(!!domain, t("domain.title"))}
              {renderSummaryItem(!!heroTitle || !!aboutTitle, t("web.title"))}
              {renderSummaryItem(!!client.stripe_subscription_id, t("done.subscription"))}
              {renderSummaryItem(!!client.stripe_account_id, t("done.stripeConnect"))}
            </div>

            {/* Stripe Subscription CTA */}
            {selectedPlan && !client.stripe_subscription_id && (
              <div className="max-w-sm mx-auto panel-card p-4 space-y-3 border-drb-turquoise-200 dark:border-drb-turquoise-500/20">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-drb-turquoise-600 dark:text-drb-turquoise-400" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t("done.activateSubscription")}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-white/50 text-start">
                  {t("done.activateSubscriptionDesc", { plan: selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1) })}
                </p>
                <button
                  onClick={handleStripeCheckout}
                  disabled={stripeLoading}
                  className="w-full btn-primary py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  {stripeLoading ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      {t("done.activateNow")}
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 dark:text-white/30">
                  {t("done.activateLater")}
                </p>
              </div>
            )}

            {/* Stripe Connect CTA */}
            {!client.stripe_account_id && (
              <div className="max-w-sm mx-auto panel-card p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-drb-turquoise-600 dark:text-drb-turquoise-400" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t("done.connectStripe")}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-white/50 text-start">
                  {t("done.connectStripeDesc")}
                </p>
                <button
                  onClick={handleStripeConnect}
                  disabled={stripeLoading}
                  className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors text-sm font-medium text-gray-700 dark:text-white/70 flex items-center justify-center gap-2"
                >
                  {stripeLoading ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      {t("done.setupConnect")}
                    </>
                  )}
                </button>
              </div>
            )}

            {client.stripe_subscription_id && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                {t("done.subscriptionActive")}
              </p>
            )}

            <button
              onClick={finishOnboarding}
              disabled={saving}
              className="btn-primary px-8 py-3 rounded-xl text-lg font-semibold"
            >
              {saving ? <Clock className="w-5 h-5 animate-spin" /> : t("finish")}
            </button>
          </div>
        );

      default:
        return null;
    }
  }

  function renderSummaryItem(done: boolean, label: string) {
    return (
      <div className="flex items-center gap-3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            done
              ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-gray-100 dark:bg-white/[0.06] text-gray-400 dark:text-white/30"
          }`}
        >
          {done ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Clock className="w-3.5 h-3.5" />
          )}
        </div>
        <span
          className={`text-sm ${
            done
              ? "text-gray-900 dark:text-white"
              : "text-gray-400 dark:text-white/40"
          }`}
        >
          {label} — {done ? t("done.completed") : t("done.pending")}
        </span>
      </div>
    );
  }

  // --- Navigation Buttons ---
  const showPrevious = step > 0 && step < 5;
  const showNext = step >= 1 && step <= 4;

  const handleNext = () => {
    switch (step) {
      case 1:
        saveStep1();
        break;
      case 2:
        saveStep2();
        break;
      case 3:
        saveStep3();
        break;
      case 4:
        saveStep4();
        break;
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Skip all button */}
      {step < 5 && (
        <div className="w-full max-w-2xl flex justify-end mb-4">
          <button
            onClick={skipAll}
            className="text-xs text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/50 transition-colors"
          >
            {t("skipAll")}
          </button>
        </div>
      )}

      {/* Progress bar */}
      {renderProgressBar()}

      {/* Step label */}
      {step > 0 && step < 5 && (
        <p className="text-xs text-gray-400 dark:text-white/40 mb-4">
          {t("progress", { current: step, total: TOTAL_STEPS - 1 })}
        </p>
      )}

      {/* Content card */}
      <div className="w-full max-w-2xl panel-card p-8 rounded-2xl">
        {renderStepContent()}

        {/* Navigation */}
        {(showPrevious || showNext) && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-white/[0.06]">
            <div>
              {showPrevious && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t("previous")}
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(step + 1)}
                className="text-sm text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/50 transition-colors"
              >
                {t("skip")}
              </button>
              <button
                onClick={handleNext}
                disabled={saving || (step === 3 && !!domain && !domainVerified)}
                className="btn-primary px-6 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {t("next")}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
