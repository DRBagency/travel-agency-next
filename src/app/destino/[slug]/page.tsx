import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { DestinationDetail } from "@/components/landing/destination/DestinationDetail";
import { LandingThemeProvider } from "@/components/landing/LandingThemeProvider";
import { LandingGlobalStyles } from "@/components/landing/LandingGlobalStyles";
import { BgMesh } from "@/components/landing/ui/BgMesh";

const VALID_LOCALES = ["es", "en", "ar"] as const;

export default async function DestinoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let client;
  try {
    client = await getClientByDomain();
  } catch {
    return notFound();
  }

  // Try slug first, then id
  let destino;
  const { data: bySlug } = await supabaseAdmin
    .from("destinos")
    .select("*")
    .eq("cliente_id", client.id)
    .eq("slug", slug)
    .eq("activo", true)
    .single();

  if (bySlug) {
    destino = bySlug;
  } else {
    const { data: byId } = await supabaseAdmin
      .from("destinos")
      .select("*")
      .eq("cliente_id", client.id)
      .eq("id", slug)
      .eq("activo", true)
      .single();
    if (byId) destino = byId;
  }

  if (!destino) return notFound();

  const clientLocale = VALID_LOCALES.includes(client.preferred_language as any)
    ? (client.preferred_language as string)
    : "es";

  // Read visitor's selected language from cookie
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("NEXT_LOCALE_LANDING")?.value;
  const initialLocale = cookieLang && VALID_LOCALES.includes(cookieLang as any)
    ? cookieLang
    : clientLocale;

  // Load messages for all available languages
  const availLangs: string[] =
    Array.isArray(client.available_languages) && client.available_languages.length > 0
      ? client.available_languages
      : [clientLocale];

  const [{ data: allDestinos }, { data: paginasLegales }, ...langMessages] =
    await Promise.all([
      supabaseAdmin
        .from("destinos")
        .select("id, slug, nombre")
        .eq("cliente_id", client.id)
        .eq("activo", true),
      supabaseAdmin
        .from("paginas_legales")
        .select("slug, titulo")
        .eq("cliente_id", client.id)
        .eq("activo", true),
      ...availLangs.map((l) =>
        import(`../../../../messages/${VALID_LOCALES.includes(l as any) ? l : "es"}.json`).then(
          (m) => m.default
        )
      ),
    ]);

  const allMessages: Record<string, any> = {};
  availLangs.forEach((l, i) => { allMessages[l] = langMessages[i]; });

  return (
    <NextIntlClientProvider locale={initialLocale} messages={allMessages[initialLocale] || langMessages[0]}>
      <LandingThemeProvider
        primaryColor={client.primary_color}
        darkModeEnabled={client.dark_mode_enabled ?? true}
      >
        <LandingGlobalStyles />
        <BgMesh />
        <DestinationDetail
          destino={destino}
          backUrl="/"
          lang={initialLocale}
          preferredLanguage={client.preferred_language || "es"}
          clientName={client.nombre || client.name || ""}
          logoUrl={client.logo_url}
          primaryColor={client.primary_color}
          darkModeEnabled={client.dark_mode_enabled ?? true}
          availableLanguages={
            Array.isArray(client.available_languages) && client.available_languages.length > 0
              ? client.available_languages
              : [initialLocale]
          }
          homeUrl="/"
          footerDescription={client.footer_description}
          allDestinos={allDestinos ?? []}
          paginasLegales={paginasLegales ?? []}
          legalBasePath="/legal"
          instagramUrl={client.instagram_url}
          facebookUrl={client.facebook_url}
          tiktokUrl={client.tiktok_url}
          allMessages={allMessages}
        />
      </LandingThemeProvider>
    </NextIntlClientProvider>
  );
}
