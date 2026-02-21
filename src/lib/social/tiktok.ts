import type { RecentPost, SocialProfile } from "./types";

const TIKTOK_AUTH = "https://www.tiktok.com/v2/auth/authorize";
const TIKTOK_TOKEN = "https://open.tiktokapis.com/v2/oauth/token/";
const TIKTOK_API = "https://open.tiktokapis.com/v2";

function getRedirectUri() {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://drb.agency";
  return `${base}/api/admin/social/oauth/tiktok/callback`;
}

/**
 * Generate TikTok OAuth authorization URL
 */
export function getTikTokAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY!,
    redirect_uri: getRedirectUri(),
    scope: "user.info.basic,user.info.stats,video.list",
    response_type: "code",
    state,
  });
  return `${TIKTOK_AUTH}/?${params}`;
}

/**
 * Exchange authorization code for tokens
 * access_token lasts 24h, refresh_token lasts 1 year
 */
export async function exchangeTikTokCode(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  token_expires_at: Date;
  open_id: string;
}> {
  const res = await fetch(TIKTOK_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: getRedirectUri(),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TikTok token exchange failed: ${err}`);
  }

  const data = await res.json();
  const expiresAt = new Date(Date.now() + data.expires_in * 1000);

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    token_expires_at: expiresAt,
    open_id: data.open_id,
  };
}

/**
 * Refresh TikTok access token using refresh token
 */
export async function refreshTikTokToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  token_expires_at: Date;
}> {
  const res = await fetch(TIKTOK_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TikTok token refresh failed: ${err}`);
  }

  const data = await res.json();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    token_expires_at: new Date(Date.now() + data.expires_in * 1000),
  };
}

/**
 * Fetch TikTok user profile
 */
export async function fetchTikTokProfile(
  token: string
): Promise<SocialProfile> {
  const res = await fetch(
    `${TIKTOK_API}/user/info/?fields=open_id,union_id,avatar_url,display_name,follower_count,following_count,likes_count,video_count`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TikTok profile fetch failed: ${err}`);
  }

  const json = await res.json();
  const data = json.data?.user || {};

  return {
    platform_user_id: data.open_id || "",
    username: data.display_name || "",
    display_name: data.display_name || "",
    avatar_url: data.avatar_url || "",
    profile_url: `https://tiktok.com/@${data.display_name}`,
    followers_count: data.follower_count || 0,
    following_count: data.following_count || 0,
    posts_count: data.video_count || 0,
    likes_count: data.likes_count || 0,
  };
}

/**
 * Fetch latest 12 TikTok videos
 */
export async function fetchTikTokVideos(
  token: string
): Promise<RecentPost[]> {
  const res = await fetch(
    `${TIKTOK_API}/video/list/?fields=id,title,cover_image_url,share_url,like_count,comment_count,view_count,create_time`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ max_count: 12 }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TikTok videos fetch failed: ${err}`);
  }

  const json = await res.json();
  const videos = json.data?.videos || [];

  return videos.map((v: Record<string, unknown>) => ({
    id: String(v.id),
    thumbnail_url: (v.cover_image_url as string) || "",
    permalink: (v.share_url as string) || "",
    caption: (v.title as string) || "",
    media_type: "VIDEO" as const,
    likes_count: (v.like_count as number) || 0,
    comments_count: (v.comment_count as number) || 0,
    views_count: (v.view_count as number) || 0,
    timestamp: v.create_time
      ? new Date((v.create_time as number) * 1000).toISOString()
      : "",
  }));
}
