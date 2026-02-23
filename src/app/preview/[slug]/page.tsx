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

  const [{ data: opiniones }, { data: paginasLegales }, { data: blogPosts }, { data: featuredDestinos }, messages] =
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
        .eq("activo", true)
        .eq("destacado", true)
        .limit(4),
      import(`../../../../messages/${clientLocale}.json`).then(
        (m) => m.default
      ),
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
