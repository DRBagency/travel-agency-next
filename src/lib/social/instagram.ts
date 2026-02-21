import type { RecentPost, SocialProfile } from "./types";

const INSTAGRAM_API = "https://graph.instagram.com";
const INSTAGRAM_OAUTH = "https://api.instagram.com/oauth";

function getRedirectUri() {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://drb.agency";
  return `${base}/api/admin/social/oauth/instagram/callback`;
}

/**
 * Generate Instagram OAuth authorization URL
 */
export function getInstagramAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_CLIENT_ID!,
    redirect_uri: getRedirectUri(),
    scope: "instagram_business_basic,instagram_business_manage_insights",
    response_type: "code",
    state,
  });
  return `${INSTAGRAM_OAUTH}/authorize?${params}`;
}

/**
 * Exchange authorization code for a short-lived token, then swap for long-lived (60 days)
 */
export async function exchangeInstagramCode(code: string): Promise<{
  access_token: string;
  token_expires_at: Date;
  user_id: string;
}> {
  // Step 1: Short-lived token
  const shortRes = await fetch(`${INSTAGRAM_OAUTH}/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.INSTAGRAM_CLIENT_ID!,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
      grant_type: "authorization_code",
      redirect_uri: getRedirectUri(),
      code,
    }),
  });

  if (!shortRes.ok) {
    const err = await shortRes.text();
    throw new Error(`Instagram token exchange failed: ${err}`);
  }

  const shortData = await shortRes.json();
  const shortToken = shortData.access_token;
  const userId = String(shortData.user_id);

  // Step 2: Exchange for long-lived token (60 days)
  const longRes = await fetch(
    `${INSTAGRAM_API}/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET!}&access_token=${shortToken}`
  );

  if (!longRes.ok) {
    const err = await longRes.text();
    throw new Error(`Instagram long-lived token exchange failed: ${err}`);
  }

  const longData = await longRes.json();
  const expiresAt = new Date(Date.now() + longData.expires_in * 1000);

  return {
    access_token: longData.access_token,
    token_expires_at: expiresAt,
    user_id: userId,
  };
}

/**
 * Refresh a long-lived Instagram token (before it expires)
 */
export async function refreshInstagramToken(token: string): Promise<{
  access_token: string;
  token_expires_at: Date;
}> {
  const res = await fetch(
    `${INSTAGRAM_API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Instagram token refresh failed: ${err}`);
  }

  const data = await res.json();
  return {
    access_token: data.access_token,
    token_expires_at: new Date(Date.now() + data.expires_in * 1000),
  };
}

/**
 * Fetch Instagram user profile
 */
export async function fetchInstagramProfile(
  token: string
): Promise<SocialProfile> {
  const res = await fetch(
    `${INSTAGRAM_API}/me?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count&access_token=${token}`
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Instagram profile fetch failed: ${err}`);
  }

  const data = await res.json();
  return {
    platform_user_id: String(data.id),
    username: data.username || "",
    display_name: data.name || data.username || "",
    avatar_url: data.profile_picture_url || "",
    profile_url: `https://instagram.com/${data.username}`,
    followers_count: data.followers_count || 0,
    following_count: data.follows_count || 0,
    posts_count: data.media_count || 0,
    likes_count: 0,
  };
}

/**
 * Fetch latest 12 Instagram media posts
 */
export async function fetchInstagramMedia(
  token: string
): Promise<RecentPost[]> {
  const res = await fetch(
    `${INSTAGRAM_API}/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=12&access_token=${token}`
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Instagram media fetch failed: ${err}`);
  }

  const data = await res.json();
  const posts: RecentPost[] = (data.data || []).map(
    (item: Record<string, unknown>) => ({
      id: String(item.id),
      thumbnail_url:
        (item.thumbnail_url as string) ||
        (item.media_url as string) ||
        "",
      permalink: (item.permalink as string) || "",
      caption: (item.caption as string) || "",
      media_type: item.media_type as RecentPost["media_type"],
      likes_count: (item.like_count as number) || 0,
      comments_count: (item.comments_count as number) || 0,
      timestamp: (item.timestamp as string) || "",
    })
  );

  return posts;
}
