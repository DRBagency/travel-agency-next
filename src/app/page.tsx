import { headers } from "next/headers";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { supabaseAdmin } from "@/lib/supabase-server";
import HomeClient from "./HomeClient";

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

  const [{ data: opiniones }, { data: paginasLegales }] = await Promise.all([
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
  ]);

  return (
    <HomeClient
      client={client}
      opiniones={opiniones ?? []}
      paginasLegales={paginasLegales ?? []}
    />
  );
}
