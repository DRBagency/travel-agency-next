export type SocialPlatform = "instagram" | "tiktok";

export interface RecentPost {
  id: string;
  thumbnail_url: string;
  permalink: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  likes_count: number;
  comments_count: number;
  views_count?: number;
  timestamp: string;
}

export interface PlatformStats {
  followers_count: number;
  following_count: number;
  posts_count: number;
  likes_count: number;
}

export interface SocialConnection {
  id: string;
  cliente_id: string;
  platform: SocialPlatform;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string | null;
  platform_user_id: string | null;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  profile_url: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  likes_count: number;
  recent_posts: RecentPost[];
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialProfile {
  platform_user_id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  profile_url: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  likes_count: number;
}
