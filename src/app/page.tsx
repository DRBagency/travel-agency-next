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

  // Determine landing locale from client's preferred_language
  const clientLocale = VALID_LOCALES.includes(client.preferred_language as any)
    ? (client.preferred_language as string)
    : "es";

  const [{ data: opiniones }, { data: paginasLegales }, { data: blogPosts }, { data: featuredDestinos }, messages] = await Promise.all([
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
      .from("blog_posts")
      .select("*")
      .eq("cliente_id", client.id)
      .eq("publicado", true)
      .order("published_at", { ascending: false })
      .limit(4),
    supabaseAdmin
      .from("destinos")
      .select("*")
      .eq("cliente_id", client.id)
      .eq("activo", true)
      .eq("destacado", true)
      .limit(4),
    import(`../../messages/${clientLocale}.json`).then((m) => m.default),
  ]);

  return (
    <NextIntlClientProvider locale={clientLocale} messages={messages}>
      <div dir={clientLocale === "ar" ? "rtl" : "ltr"}>
        <HomeClient
          client={client}
          opiniones={opiniones ?? []}
          paginasLegales={paginasLegales ?? []}
          blogPosts={blogPosts ?? []}
          featuredDestinos={featuredDestinos ?? []}
        />
      </div>
    </NextIntlClientProvider>
  );
}
