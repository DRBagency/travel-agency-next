import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function requireTraveler() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("traveler_session")?.value;
  const email = cookieStore.get("traveler_email")?.value;

  if (!sessionId || !email) {
    redirect("/portal/login");
  }

  const { data: session } = await supabaseAdmin
    .from("traveler_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (!session || !session.used_at || session.email !== email) {
    redirect("/portal/login");
  }

  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("*")
    .eq("id", session.cliente_id)
    .eq("activo", true)
    .single();

  if (!client) {
    redirect("/portal/login");
  }

  return { email: session.email, clienteId: session.cliente_id, client };
}
