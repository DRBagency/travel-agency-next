import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

const OWNER_VERCEL_DOMAIN = "travel-agency-next-ten.vercel.app";

export async function getClientByDomain() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) {
    throw new Error("Dominio no autorizado");
  }

  const normalized = host
    .replace(/^https?:\/\//i, "")
    .split(":")[0]
    .toLowerCase();

  if (normalized.endsWith(".vercel.app") && normalized !== OWNER_VERCEL_DOMAIN) {
    throw new Error("Dominio no autorizado");
  }

  const { data: client, error } = await supabaseAdmin
    .from("clientes")
    .select("*")
    .eq("domain", normalized)
    .eq("activo", true)
    .single();

  if (error || !client) {
    throw new Error("Dominio no autorizado");
  }

  return client;
}
