import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { DestinoDetail } from "@/app/destino/[slug]/DestinoDetail";

export default async function PreviewDestinoPage({
  params,
}: {
  params: Promise<{ slug: string; destinoSlug: string }>;
}) {
  const { slug, destinoSlug } = await params;

  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("*")
    .eq("slug", slug)
    .eq("activo", true)
    .single();

  if (!client) return notFound();

  // Try destino by slug first, then by id
  let destino;
  const { data: bySlug } = await supabaseAdmin
    .from("destinos")
    .select("*")
    .eq("cliente_id", client.id)
    .eq("slug", destinoSlug)
    .eq("activo", true)
    .single();

  if (bySlug) {
    destino = bySlug;
  } else {
    const { data: byId } = await supabaseAdmin
      .from("destinos")
      .select("*")
      .eq("cliente_id", client.id)
      .eq("id", destinoSlug)
      .eq("activo", true)
      .single();
    if (byId) destino = byId;
  }

  if (!destino) return notFound();

  const locale = client.preferred_language || (await getLocale());
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DestinoDetail destino={destino} client={client} />
    </NextIntlClientProvider>
  );
}
