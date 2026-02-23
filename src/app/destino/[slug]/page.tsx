import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { DestinoDetail } from "./DestinoDetail";

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

  const locale = client.preferred_language || (await getLocale());
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DestinoDetail
        destino={destino}
        client={client}
      />
    </NextIntlClientProvider>
  );
}
