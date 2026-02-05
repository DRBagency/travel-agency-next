import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { OWNER_VERCEL_DOMAIN, normalizeHost } from "@/lib/getClientByDomain";

export async function requireValidApiDomain() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) {
    throw new Error("Dominio no autorizado");
  }

  const normalized = normalizeHost(host);

  if (normalized.endsWith(".vercel.app") && normalized !== OWNER_VERCEL_DOMAIN) {
    throw new Error("Dominio no autorizado");
  }

  if (normalized === OWNER_VERCEL_DOMAIN) {
    return;
  }

  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("id")
    .eq("domain", normalized)
    .eq("activo", true)
    .single();

  if (!client) {
    throw new Error("Dominio no autorizado");
  }
}
