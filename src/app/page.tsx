import { headers } from "next/headers";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { supabaseAdmin } from "@/lib/supabase-server";
import { NextIntlClientProvider } from "next-intl";
import HomeClient from "./HomeClient";

const VALID_LOCALES = ["es", "en", "ar"] as const;

export default async function HomePage() {
  const host = (await headers()).get("host") ?? "localhost";
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

  const [{ data: opiniones }, { data: paginasLegales }, messages] = await Promise.all([
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
    import(`../../messages/${clientLocale}.json`).then((m) => m.default),
  ]);

  return (
    <NextIntlClientProvider locale={clientLocale} messages={messages}>
      <div dir={clientLocale === "ar" ? "rtl" : "ltr"}>
        <HomeClient
          client={client}
          opiniones={opiniones ?? []}
          paginasLegales={paginasLegales ?? []}
        />
      </div>
    </NextIntlClientProvider>
  );
}
