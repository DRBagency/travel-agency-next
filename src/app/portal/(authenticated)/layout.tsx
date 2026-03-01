import { requireTraveler } from "@/lib/requireTraveler";
import { getMessages, getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { LandingThemeProvider } from "@/components/landing/LandingThemeProvider";
import { LandingGlobalStyles } from "@/components/landing/LandingGlobalStyles";
import PortalShell from "@/components/portal/PortalShell";

export const dynamic = "force-dynamic";

export default async function PortalAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email, client } = await requireTraveler();

  const locale = await getLocale();
  const messages = await getMessages();

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
