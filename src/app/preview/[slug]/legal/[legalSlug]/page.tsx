import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getMessages, getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { LandingThemeProvider } from "@/components/landing/LandingThemeProvider";
import { LandingGlobalStyles } from "@/components/landing/LandingGlobalStyles";
import { BgMesh } from "@/components/landing/ui/BgMesh";
import Navbar from "@/components/landing/sections/Navbar";

export default async function PreviewLegalPage({
  params,
}: {
  params: Promise<{ slug: string; legalSlug: string }>;
}) {
  const { slug, legalSlug } = await params;

  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("*")
    .eq("slug", slug)
    .eq("activo", true)
    .single();

  if (!client) return notFound();

  const { data } = await supabaseAdmin
    .from("paginas_legales")
    .select("*")
    .eq("cliente_id", client.id)
    .eq("slug", legalSlug)
    .eq("activo", true)
    .single();

  if (!data) return notFound();

  const locale = client.preferred_language || (await getLocale());
  const messages = await getMessages();
  const title = data.titulo ?? data.title ?? legalSlug;
  const content = data.contenido ?? data.content ?? "";

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LandingThemeProvider
        primaryColor={client.primary_color}
        darkModeEnabled={client.dark_mode_enabled ?? true}
      >
        <LandingGlobalStyles />
        <BgMesh />
        <Navbar
          clientName={client.nombre || client.name || ""}
          logoUrl={client.logo_url}
          primaryColor={client.primary_color}
          darkModeEnabled={client.dark_mode_enabled ?? true}
        />
        <div
          style={{
            paddingTop: 100,
            paddingBottom: 80,
            maxWidth: 800,
            margin: "0 auto",
            padding: "100px 24px 80px",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-syne), Syne, sans-serif",
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 800,
              marginBottom: 24,
            }}
          >
            {title}
          </h1>
          {content && (
            <div
              style={{
                fontFamily: "var(--font-dm), DM Sans, sans-serif",
                fontSize: 15,
                lineHeight: 1.8,
                opacity: 0.85,
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </LandingThemeProvider>
    </NextIntlClientProvider>
  );
}
