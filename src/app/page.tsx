import { headers } from "next/headers";
import { cookies } from "next/headers";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { supabaseAdmin } from "@/lib/supabase-server";
import { NextIntlClientProvider } from "next-intl";
import HomeClient from "./HomeClient";
import CorporateLanding from "@/components/corporate/CorporateLanding";

const VALID_LOCALES = ["es", "en", "ar"] as const;

const PLATFORM_HOSTS = [
  "drb.agency",
  "www.drb.agency",
  "localhost:3000",
  "travel-agency-next-ten.vercel.app",
];

export default async function HomePage() {
  const host = (await headers()).get("host") ?? "localhost";
  const isPlatform = PLATFORM_HOSTS.some((h) => host.includes(h));

  if (isPlatform) {
    const cookieStore = await cookies();
    const locale = (cookieStore.get("NEXT_LOCALE")?.value ?? "es") as string;
    const safeLocale = VALID_LOCALES.includes(locale as any) ? locale : "es";
    const messages = await import(`../../messages/${safeLocale}.json`).then((m) => m.default);

    return (
      <NextIntlClientProvider locale={safeLocale} messages={messages}>
        <CorporateLanding />
      </NextIntlClientProvider>
    );
  }

  const client = await getClientByDomain();

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold">
          Cliente no encontrado ({host})
        </h1>
      </div>
    );
  }

  // Determine landing locale: cookie > client preference > "es"
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("LANDING_LOCALE")?.value;
  const clientLocale = VALID_LOCALES.includes(client.preferred_language as any)
    ? (client.preferred_language as string)
    : "es";
  const initialLocale = cookieLang && VALID_LOCALES.includes(cookieLang as any)
    ? cookieLang
    : clientLocale;

  // Load messages for all available languages
  const availLangs: string[] =
    Array.isArray(client.available_languages) && client.available_languages.length > 0
      ? client.available_languages
      : [clientLocale];

  const [{ data: opiniones }, { data: paginasLegales }, { data: allDestinos }, ...langMessages] = await Promise.all([
    supabaseAdmin
      .from("opiniones")
      .select("*")
      .eq("cliente_id", client.id)
      .eq("activo", true),
    supabaseAdmin
      .from("paginas_legales")
      .select("*")
      .eq("cliente_id", client.id)
      .eq("activo", true),
    supabaseAdmin
      .from("destinos")
      .select("*")
      .eq("cliente_id", client.id)
      .eq("activo", true),
    ...availLangs.map((l) =>
      import(`../../messages/${VALID_LOCALES.includes(l as any) ? l : "es"}.json`).then((m) => m.default)
    ),
  ]);

  const allMessages: Record<string, any> = {};
  availLangs.forEach((l, i) => { allMessages[l] = langMessages[i]; });

  return (
    <NextIntlClientProvider locale={initialLocale} messages={allMessages[initialLocale] || allMessages[clientLocale] || langMessages[0]}>
      <div dir={initialLocale === "ar" ? "rtl" : "ltr"}>
        <HomeClient
          client={client}
          opiniones={opiniones ?? []}
          paginasLegales={paginasLegales ?? []}
          allDestinos={allDestinos ?? []}
          allMessages={allMessages}
          lang={initialLocale}
        />
      </div>
    </NextIntlClientProvider>
  );
}
