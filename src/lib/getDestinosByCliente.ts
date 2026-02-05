import { supabaseAdmin } from "@/lib/supabase-server";

export async function getDestinosByCliente(clienteId: string) {
  const { data: destinos, error } = await supabaseAdmin
    .from("destinos")
    .select("*")
    .eq("cliente_id", clienteId);

  if (error) {
    console.error("Error cargando destinos:", error);
    return [];
  }

  return destinos;
}