import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { DestinationDetail } from "@/components/landing/destination/DestinationDetail";
import { LandingThemeProvider } from "@/components/landing/LandingThemeProvider";
import { LandingGlobalStyles } from "@/components/landing/LandingGlobalStyles";
import { BgMesh } from "@/components/landing/ui/BgMesh";

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

  const locale = client.preferred_language || "es";
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LandingThemeProvider
        primaryColor={client.primary_color}
        darkModeEnabled={client.dark_mode_enabled ?? true}
      >
        <LandingGlobalStyles />
        <BgMesh />
        <DestinationDetail destino={destino} />
      </LandingThemeProvider>
    </NextIntlClientProvider>
  );
}
