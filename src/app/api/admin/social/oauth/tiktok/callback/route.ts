import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import {
  exchangeTikTokCode,
  fetchTikTokProfile,
  fetchTikTokVideos,
} from "@/lib/social/tiktok";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://drb.agency";

  if (error) {
    return NextResponse.redirect(
      `${baseUrl}/admin/social?error=access_denied`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${baseUrl}/admin/social?error=missing_params`
    );
  }

  let stateData: { cliente_id: string; ts: number };
  try {
    stateData = JSON.parse(Buffer.from(state, "base64url").toString());
  } catch {
    return NextResponse.redirect(
      `${baseUrl}/admin/social?error=invalid_state`
    );
  }

  const cookieStore = await cookies();
  const cookieClienteId = cookieStore.get("cliente_id")?.value;
  if (!cookieClienteId || cookieClienteId !== stateData.cliente_id) {
    return NextResponse.redirect(
      `${baseUrl}/admin/social?error=state_mismatch`
    );
  }

  if (Date.now() - stateData.ts > 10 * 60 * 1000) {
    return NextResponse.redirect(
      `${baseUrl}/admin/social?error=state_expired`
    );
  }

  try {
    const { access_token, refresh_token, token_expires_at, open_id } =
      await exchangeTikTokCode(code);

    const [profile, videos] = await Promise.all([
      fetchTikTokProfile(access_token),
      fetchTikTokVideos(access_token),
    ]);

    await supabaseAdmin.from("social_connections").upsert(
      {
        cliente_id: stateData.cliente_id,
        platform: "tiktok",
        access_token,
        refresh_token,
        token_expires_at: token_expires_at.toISOString(),
        platform_user_id: open_id,
        username: profile.username,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
        profile_url: profile.profile_url,
        followers_count: profile.followers_count,
        following_count: profile.following_count,
        posts_count: profile.posts_count,
        likes_count: profile.likes_count,
        recent_posts: videos,
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: "cliente_id,platform" }
    );

    return NextResponse.redirect(`${baseUrl}/admin/social?success=tiktok`);
  } catch (err) {
    console.error("TikTok OAuth callback error:", err);
    return NextResponse.redirect(
      `${baseUrl}/admin/social?error=tiktok_failed`
    );
  }
}
