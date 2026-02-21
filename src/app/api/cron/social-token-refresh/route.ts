import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { refreshInstagramToken } from "@/lib/social/instagram";
import { refreshTikTokToken } from "@/lib/social/tiktok";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const results = { instagram: 0, tiktok: 0, errors: 0 };

  try {
    // --- Instagram: refresh tokens expiring in <7 days ---
    const igCutoff = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: igConnections } = await supabaseAdmin
      .from("social_connections")
      .select("id, access_token, token_expires_at")
      .eq("platform", "instagram")
      .lt("token_expires_at", igCutoff);

    for (const conn of igConnections || []) {
      try {
        const { access_token, token_expires_at } =
          await refreshInstagramToken(conn.access_token);

        await supabaseAdmin
          .from("social_connections")
          .update({
            access_token,
            token_expires_at: token_expires_at.toISOString(),
          })
          .eq("id", conn.id);

        results.instagram++;
      } catch (err) {
        console.error(
          `Instagram token refresh failed for connection ${conn.id}:`,
          err
        );
        results.errors++;
      }
    }

    // --- TikTok: refresh access_tokens expiring in <6 hours ---
    const tkCutoff = new Date(
      Date.now() + 6 * 60 * 60 * 1000
    ).toISOString();

    const { data: tkConnections } = await supabaseAdmin
      .from("social_connections")
      .select("id, refresh_token, token_expires_at")
      .eq("platform", "tiktok")
      .lt("token_expires_at", tkCutoff)
      .not("refresh_token", "is", null);

    for (const conn of tkConnections || []) {
      try {
        const { access_token, refresh_token, token_expires_at } =
          await refreshTikTokToken(conn.refresh_token);

        await supabaseAdmin
          .from("social_connections")
          .update({
            access_token,
            refresh_token,
            token_expires_at: token_expires_at.toISOString(),
          })
          .eq("id", conn.id);

        results.tiktok++;
      } catch (err) {
        console.error(
          `TikTok token refresh failed for connection ${conn.id}:`,
          err
        );
        results.errors++;
      }
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error);
    console.error("Cron social-token-refresh error:", message);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  console.log(
    `Social token refresh: ${results.instagram} IG, ${results.tiktok} TK, ${results.errors} errors`
  );
  return NextResponse.json({ ok: true, ...results });
}
