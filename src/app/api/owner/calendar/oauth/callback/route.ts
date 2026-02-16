import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { google } from "googleapis";
import { getOAuth2Client, getOwnerRedirectUri } from "@/lib/google-calendar";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (error || !code || !state) {
    return NextResponse.redirect(new URL("/owner/calendario?error=oauth_denied", baseUrl));
  }

  // Validate state
  let stateData: { role: string; ts: number };
  try {
    stateData = JSON.parse(Buffer.from(state, "base64url").toString());
  } catch {
    return NextResponse.redirect(new URL("/owner/calendario?error=invalid_state", baseUrl));
  }

  if (stateData.role !== "owner") {
    return NextResponse.redirect(new URL("/owner/calendario?error=invalid_state", baseUrl));
  }

  // Verify owner session
  const cookieStore = await cookies();
  const owner = cookieStore.get("owner")?.value;

  if (!owner) {
    return NextResponse.redirect(new URL("/owner/login", baseUrl));
  }

  // Exchange code for tokens
  const redirectUri = getOwnerRedirectUri();
  const oauth2Client = getOAuth2Client(redirectUri);
  let tokens;
  try {
    const response = await oauth2Client.getToken(code);
    tokens = response.tokens;
  } catch {
    return NextResponse.redirect(new URL("/owner/calendario?error=token_exchange", baseUrl));
  }

  if (!tokens.refresh_token) {
    return NextResponse.redirect(new URL("/owner/calendario?error=no_refresh_token", baseUrl));
  }

  // Get user email
  oauth2Client.setCredentials(tokens);
  let email = "";
  try {
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    email = userInfo.data.email || "";
  } catch {
    // Non-critical
  }

  // Save to platform_settings (singleton)
  const { data: settings } = await supabaseAdmin
    .from("platform_settings")
    .select("id")
    .limit(1)
    .single();

  if (settings) {
    await supabaseAdmin
      .from("platform_settings")
      .update({
        google_calendar_refresh_token: tokens.refresh_token,
        google_calendar_connected: true,
        google_calendar_email: email,
      })
      .eq("id", settings.id);
  }

  return NextResponse.redirect(new URL("/owner/calendario?success=connected", baseUrl));
}
