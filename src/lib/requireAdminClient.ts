import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function requireAdminClient() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("cliente_id")?.value;

  if (!clientId) {
    redirect("/admin/login");
  }

  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("*")
    .eq("id", clientId)
    .single();

  if (!client) {
    redirect("/admin/login");
  }

  return client;
}
