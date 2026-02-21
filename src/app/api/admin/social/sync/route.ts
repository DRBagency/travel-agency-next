import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import type { SocialPlatform } from "@/lib/social/types";
import {
  fetchInstagramProfile,
  fetchInstagramMedia,
} from "@/lib/social/instagram";
import { fetchTikTokProfile, fetchTikTokVideos } from "@/lib/social/tiktok";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;

  if (!clienteId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { platform } = (await req.json()) as { platform: SocialPlatform };

  if (!platform || !["instagram", "tiktok"].includes(platform)) {
    return NextResponse.json(
      { error: "Invalid platform" },
      { status: 400 }
    );
  }

  // Get existing connection
  const { data: connection } = await supabaseAdmin
    .from("social_connections")
    .select("*")
    .eq("cliente_id", clienteId)
    .eq("platform", platform)
    .single();

  if (!connection) {
    return NextResponse.json(
      { error: "Not connected" },
      { status: 404 }
    );
  }

  try {
    let profile;
    let posts;

    if (platform === "instagram") {
      [profile, posts] = await Promise.all([
        fetchInstagramProfile(connection.access_token),
        fetchInstagramMedia(connection.access_token),
      ]);
    } else {
      [profile, posts] = await Promise.all([
        fetchTikTokProfile(connection.access_token),
        fetchTikTokVideos(connection.access_token),
      ]);
    }

    // Update DB
    const { error } = await supabaseAdmin
      .from("social_connections")
      .update({
        username: profile.username,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
        profile_url: profile.profile_url,
        followers_count: profile.followers_count,
        following_count: profile.following_count,
        posts_count: profile.posts_count,
        likes_count: profile.likes_count,
        recent_posts: posts,
        last_synced_at: new Date().toISOString(),
      })
      .eq("id", connection.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      ok: true,
      profile,
      posts,
    });
  } catch (err) {
    console.error(`Social sync error (${platform}):`, err);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}
