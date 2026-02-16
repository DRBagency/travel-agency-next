import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOAuth2ClientWithRefreshToken } from "@/lib/google-calendar";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST() {
  const cookieStore = await cookies();
  const owner = cookieStore.get("owner")?.value;

  if (!owner) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Get current refresh token to revoke
  const { data: settings } = await supabaseAdmin
    .from("platform_settings")
    .select("id, google_calendar_refresh_token")
    .limit(1)
    .single();

  if (settings?.google_calendar_refresh_token) {
    try {
      const oauth2Client = getOAuth2ClientWithRefreshToken(settings.google_calendar_refresh_token);
      await oauth2Client.revokeToken(settings.google_calendar_refresh_token);
    } catch {
      // Best effort
    }
  }

  if (settings) {
    await supabaseAdmin
      .from("platform_settings")
      .update({
        google_calendar_refresh_token: null,
        google_calendar_connected: false,
        google_calendar_email: null,
      })
      .eq("id", settings.id);
  }

  return NextResponse.json({ success: true });
}
