import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOAuth2ClientWithRefreshToken } from "@/lib/google-calendar";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");
  const clienteId = cookieStore.get("cliente_id")?.value;

  if (!sessionCookie || !clienteId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Get current refresh token to revoke
  const { data: cliente } = await supabaseAdmin
    .from("clientes")
    .select("google_calendar_refresh_token")
    .eq("id", clienteId)
    .single();

  // Revoke token in Google (best effort)
  if (cliente?.google_calendar_refresh_token) {
    try {
      const oauth2Client = getOAuth2ClientWithRefreshToken(cliente.google_calendar_refresh_token);
      await oauth2Client.revokeToken(cliente.google_calendar_refresh_token);
    } catch {
      // Best effort - continue even if revoke fails
    }
  }

  // Clear Google Calendar columns
  await supabaseAdmin
    .from("clientes")
    .update({
      google_calendar_refresh_token: null,
      google_calendar_connected: false,
      google_calendar_email: null,
    })
    .eq("id", clienteId);

  return NextResponse.json({ success: true });
}
