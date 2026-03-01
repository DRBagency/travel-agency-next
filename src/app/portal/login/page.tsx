import { getClientByDomain } from "@/lib/getClientByDomain";
import { getMessages, getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { LandingThemeProvider } from "@/components/landing/LandingThemeProvider";
import { LandingGlobalStyles } from "@/components/landing/LandingGlobalStyles";
import PortalLoginForm from "@/components/portal/PortalLoginForm";

export const dynamic = "force-dynamic";

export default async function PortalLoginPage() {
  let client: any = null;
  try {
    client = await getClientByDomain();
  } catch {
    // Will show generic portal login
  }

  const locale = await getLocale();
  const messages = await getMessages();

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
          />
        </div>
      </LandingThemeProvider>
    </NextIntlClientProvider>
  );
}
