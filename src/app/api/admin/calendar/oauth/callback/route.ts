import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { google } from "googleapis";
import { getOAuth2Client } from "@/lib/google-calendar";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = new URL(req.url).origin;

  if (error || !code || !state) {
    return NextResponse.redirect(new URL("/admin/calendario?error=oauth_denied", baseUrl));
  }

  // Validate state
  let stateData: { cliente_id: string; ts: number };
  try {
    stateData = JSON.parse(Buffer.from(state, "base64url").toString());
  } catch {
    return NextResponse.redirect(new URL("/admin/calendario?error=invalid_state", baseUrl));
  }

  // Verify the session cookie matches the state
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;

  if (!clienteId || clienteId !== stateData.cliente_id) {
    return NextResponse.redirect(new URL("/admin/calendario?error=session_mismatch", baseUrl));
  }

  // Exchange code for tokens
  const oauth2Client = getOAuth2Client();
  let tokens;
  try {
    const response = await oauth2Client.getToken(code);
    tokens = response.tokens;
  } catch {
    return NextResponse.redirect(new URL("/admin/calendario?error=token_exchange", baseUrl));
  }

  if (!tokens.refresh_token) {
    return NextResponse.redirect(new URL("/admin/calendario?error=no_refresh_token", baseUrl));
  }

  // Get user email
  oauth2Client.setCredentials(tokens);
  let email = "";
  try {
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    email = userInfo.data.email || "";
  } catch {
    // Non-critical, continue without email
  }

  // Save to database
  await supabaseAdmin
    .from("clientes")
    .update({
      google_calendar_refresh_token: tokens.refresh_token,
      google_calendar_connected: true,
      google_calendar_email: email,
    })
    .eq("id", clienteId);

  return NextResponse.redirect(new URL("/admin/calendario?success=connected", baseUrl));
}
