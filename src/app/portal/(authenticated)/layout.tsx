import { cookies } from "next/headers";
import { requireTraveler } from "@/lib/requireTraveler";
import { NextIntlClientProvider } from "next-intl";
import { LandingThemeProvider } from "@/components/landing/LandingThemeProvider";
import { LandingGlobalStyles } from "@/components/landing/LandingGlobalStyles";
import PortalShell from "@/components/portal/PortalShell";

export const dynamic = "force-dynamic";

const VALID_LOCALES = ["es", "en", "ar"] as const;

export default async function PortalAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email, client } = await requireTraveler();

  // Read LANDING_LOCALE first (set by the landing page), fallback to NEXT_LOCALE, then "es"
  const cookieStore = await cookies();
  const landingLocale = cookieStore.get("LANDING_LOCALE")?.value;
  const nextLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const raw = landingLocale || nextLocale || "es";
  const locale = VALID_LOCALES.includes(raw as any) ? raw : "es";
  const messages = (await import(`../../../../messages/${locale}.json`)).default;

  const availableLanguages = Array.isArray(client.available_languages)
    ? client.available_languages
    : ["es"];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LandingThemeProvider
        primaryColor={client.primary_color}
        darkModeEnabled={client.dark_mode_enabled ?? true}
      >
        <LandingGlobalStyles />
        <div className="landing-wrap" style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
          <PortalShell
            logoUrl={client.logo_url}
            clientName={client.nombre}
            email={email}
            availableLanguages={availableLanguages}
            currentLang={locale}
          >
            {children}
          </PortalShell>
        </div>
      </LandingThemeProvider>
    </NextIntlClientProvider>
  );
}
