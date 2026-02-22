import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST() {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;

  if (!clienteId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Best-effort: try to revoke the Google token (non-critical)
  const { data: cliente } = await supabaseAdmin
    .from("clientes")
    .select("google_calendar_refresh_token")
    .eq("id", clienteId)
    .single();

  if (cliente?.google_calendar_refresh_token) {
    try {
      await fetch(
        `https://oauth2.googleapis.com/revoke?token=${cliente.google_calendar_refresh_token}`,
        { method: "POST" }
      );
    } catch {
      // Best effort - continue even if revoke fails
    }
  }

  // Clear Google Calendar columns
  const { error } = await supabaseAdmin
    .from("clientes")
    .update({
      google_calendar_refresh_token: null,
      google_calendar_connected: false,
      google_calendar_email: null,
    })
    .eq("id", clienteId);

  if (error) {
    return NextResponse.json({ error: "Error updating" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
