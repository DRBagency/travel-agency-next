import { cookies } from "next/headers";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { NextIntlClientProvider } from "next-intl";
import { LandingThemeProvider } from "@/components/landing/LandingThemeProvider";
import { LandingGlobalStyles } from "@/components/landing/LandingGlobalStyles";
import PortalLoginForm from "@/components/portal/PortalLoginForm";

export const dynamic = "force-dynamic";

const VALID_LOCALES = ["es", "en", "ar"] as const;

export default async function PortalLoginPage() {
  let client: any = null;
  try {
    client = await getClientByDomain();
  } catch {
    // Will show generic portal login
  }

  // Read LANDING_LOCALE first (set by the landing page), fallback to NEXT_LOCALE, then "es"
  const cookieStore = await cookies();
  const landingLocale = cookieStore.get("LANDING_LOCALE")?.value;
  const nextLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const raw = landingLocale || nextLocale || "es";
  const locale = VALID_LOCALES.includes(raw as any) ? raw : "es";
  const messages = (await import(`../../../../messages/${locale}.json`)).default;

  const availableLanguages = Array.isArray(client?.available_languages)
    ? client.available_languages
    : ["es"];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LandingThemeProvider
        primaryColor={client?.primary_color}
        darkModeEnabled={client?.dark_mode_enabled ?? true}
      >
        <LandingGlobalStyles />
        <div className="landing-wrap" style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
          <PortalLoginForm
            clientName={client?.nombre || "Portal del Viajero"}
            logoUrl={client?.logo_url}
            clienteId={client?.id}
            primaryColor={client?.primary_color}
            availableLanguages={availableLanguages}
            currentLang={locale}
          />
        </div>
      </LandingThemeProvider>
    </NextIntlClientProvider>
  );
}
