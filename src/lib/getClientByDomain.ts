import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function getClientByDomain() {
  const headersList = await headers(); // 🔑 AQUÍ ESTÁ EL FIX
  const host = headersList.get("host");

  if (!host) return null;

  const domain = host.split(":")[0]; // elimina puerto en local

  const { data: client, error } = await supabaseAdmin
    .from("clientes")
    .select("*")
    .eq("domain", domain)
    .eq("activo", true)
    .single();

  if (error) {
    console.error("❌ Cliente no encontrado:", error.message);
    return null;
  }

  return client;
}