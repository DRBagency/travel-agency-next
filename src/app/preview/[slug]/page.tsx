import { supabaseAdmin } from "@/lib/supabase-server";
import { NextIntlClientProvider } from "next-intl";
import HomeClient from "../../HomeClient";
import { notFound } from "next/navigation";

const VALID_LOCALES = ["es", "en", "ar"] as const;

export const dynamic = "force-dynamic";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: client, error } = await supabaseAdmin
    .from("clientes")
    .select("*")
    .eq("slug", slug)
    .eq("activo", true)
    .single();

  if (error || !client) {
    notFound();
  }

  const clientLocale = VALID_LOCALES.includes(client.preferred_language as any)
    ? (client.preferred_language as string)
    : "es";

  // Load messages for all available languages
  const availLangs: string[] =
    Array.isArray(client.available_languages) && client.available_languages.length > 0
      ? client.available_languages
      : [clientLocale];

  const [{ data: opiniones }, { data: paginasLegales }, { data: blogPosts }, { data: allDestinos }, ...langMessages] =
    await Promise.all([
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
    <NextIntlClientProvider locale={clientLocale} messages={allMessages[clientLocale] || langMessages[0]}>
      <div dir={clientLocale === "ar" ? "rtl" : "ltr"}>
        <HomeClient
          client={client}
          opiniones={opiniones ?? []}
          paginasLegales={paginasLegales ?? []}
          blogPosts={blogPosts ?? []}
          allDestinos={allDestinos ?? []}
          lang={clientLocale}
          legalBasePath={`/preview/${slug}/legal`}
          allMessages={allMessages}
        />
      </div>
    </NextIntlClientProvider>
  );
}
