"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Instagram,
  Music2,
  Facebook,
  Users,
  Heart,
  ImageIcon,
  RefreshCw,
  Link2,
  Unlink,
  ExternalLink,
  Play,
  MessageCircle,
  Eye,
} from "lucide-react";
import { sileo } from "sileo";
import type { SocialConnection, RecentPost } from "@/lib/social/types";

interface Props {
  connections: SocialConnection[];
  facebookUrl: string | null;
  locale: string;
}

function formatNumber(n: number, locale: string): string {
  if (n >= 1_000_000) {
    return (n / 1_000_000).toLocaleString(locale, {
      maximumFractionDigits: 1,
    }) + "M";
  }
  if (n >= 1_000) {
    return (n / 1_000).toLocaleString(locale, {
      maximumFractionDigits: 1,
    }) + "K";
  }
  return n.toLocaleString(locale);
}

function timeAgo(date: string, locale: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return new Date(date).toLocaleDateString(locale);
}

export default function SocialContent({
  connections,
  facebookUrl,
  locale,
}: Props) {
  const t = useTranslations("admin.social");
  const tc = useTranslations("common");
  const router = useRouter();
  const [syncing, setSyncing] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "instagram" | "tiktok">(
    "all"
  );

  const instagram = connections.find((c) => c.platform === "instagram");
  const tiktok = connections.find((c) => c.platform === "tiktok");

  const handleSync = async (platform: "instagram" | "tiktok") => {
    setSyncing(platform);
    try {
      const res = await fetch("/api/admin/social/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      if (res.ok) {
        sileo.success({ title: t("syncSuccess") });
        router.refresh();
      } else {
        sileo.error({ title: t("syncError") });
      }
    } catch {
      sileo.error({ title: tc("error") });
    } finally {
      setSyncing(null);
    }
  };

  const handleDisconnect = async (platform: "instagram" | "tiktok") => {
    if (!confirm(t("disconnectConfirm"))) return;
    setDisconnecting(platform);
    try {
      const res = await fetch("/api/admin/social/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      if (res.ok) {
        sileo.success({ title: t("disconnected") });
        router.refresh();
      } else {
        sileo.error({ title: tc("error") });
      }
    } catch {
      sileo.error({ title: tc("error") });
    } finally {
      setDisconnecting(null);
    }
  };

  // Collect all recent posts for the grid
  const allPosts: (RecentPost & { platform: "instagram" | "tiktok" })[] =
    [];
  if (instagram?.recent_posts) {
    for (const p of instagram.recent_posts) {
      allPosts.push({ ...p, platform: "instagram" });
    }
  }
  if (tiktok?.recent_posts) {
    for (const p of tiktok.recent_posts) {
      allPosts.push({ ...p, platform: "tiktok" });
    }
  }
  allPosts.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredPosts =
    filter === "all"
      ? allPosts
      : allPosts.filter((p) => p.platform === filter);

  return (
    <div className="space-y-6">
      {/* Platform cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Instagram Card */}
        <PlatformCard
          platform="instagram"
          icon={
            <Instagram className="w-6 h-6 text-pink-500" />
          }
          color="pink"
          connection={instagram ?? null}
          locale={locale}
          syncing={syncing === "instagram"}
          disconnecting={disconnecting === "instagram"}
          onConnect={() =>
            (window.location.href =
              "/api/admin/social/oauth/instagram/start")
          }
          onSync={() => handleSync("instagram")}
          onDisconnect={() => handleDisconnect("instagram")}
          t={t}
        />

        {/* TikTok Card */}
        <PlatformCard
          platform="tiktok"
          icon={<Music2 className="w-6 h-6 text-black dark:text-white" />}
          color="gray"
          connection={tiktok ?? null}
          locale={locale}
          syncing={syncing === "tiktok"}
          disconnecting={disconnecting === "tiktok"}
          onConnect={() =>
            (window.location.href =
              "/api/admin/social/oauth/tiktok/start")
          }
          onSync={() => handleSync("tiktok")}
          onDisconnect={() => handleDisconnect("tiktok")}
          t={t}
        />

        {/* Facebook Card (URL only) */}
        <div className="panel-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Facebook className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Facebook
                </p>
                <p className="text-xs text-gray-400 dark:text-white/40">
                  {t("urlOnly")}
                </p>
              </div>
            </div>
          </div>

          {facebookUrl ? (
            <div className="space-y-2">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                {facebookUrl}
              </a>
              <p className="text-xs text-gray-400 dark:text-white/40">
                {t("facebookEditInMiWeb")}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-400 dark:text-white/40 mb-2">
                {t("notConnected")}
              </p>
              <a
                href="/admin/mi-web"
                className="text-sm text-drb-turquoise-600 hover:underline"
              >
                {t("facebookEditInMiWeb")}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Recent Posts Section */}
      {allPosts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("recentPosts")}
            </h2>
            <div className="flex gap-1">
              {(
                ["all", "instagram", "tiktok"] as const
              ).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === f
                      ? "bg-drb-turquoise-600 text-white"
                      : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/20"
                  }`}
                >
                  {f === "all"
                    ? t("all")
                    : f === "instagram"
                      ? "Instagram"
                      : "TikTok"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredPosts.map((post) => (
              <a
                key={`${post.platform}-${post.id}`}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5"
              >
                {post.thumbnail_url ? (
                  <img
                    src={post.thumbnail_url}
                    alt={post.caption || ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-300 dark:text-white/20" />
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-xs">
                  {post.media_type === "VIDEO" && (
                    <Play className="w-4 h-4 mb-1" />
                  )}
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {formatNumber(post.likes_count, locale)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {formatNumber(post.comments_count, locale)}
                    </span>
                  </div>
                  {post.views_count !== undefined && post.views_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatNumber(post.views_count, locale)}
                    </span>
                  )}
                  <span className="text-white/60 mt-1">
                    {timeAgo(post.timestamp, locale)}
                  </span>
                </div>

                {/* Platform badge */}
                <div className="absolute top-1.5 end-1.5">
                  {post.platform === "instagram" ? (
                    <Instagram className="w-3.5 h-3.5 text-white drop-shadow" />
                  ) : (
                    <Music2 className="w-3.5 h-3.5 text-white drop-shadow" />
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Platform Card Sub-component ─── */

function PlatformCard({
  platform,
  icon,
  color,
  connection,
  locale,
  syncing,
  disconnecting,
  onConnect,
  onSync,
  onDisconnect,
  t,
}: {
  platform: "instagram" | "tiktok";
  icon: React.ReactNode;
  color: string;
  connection: SocialConnection | null;
  locale: string;
  syncing: boolean;
  disconnecting: boolean;
  onConnect: () => void;
  onSync: () => void;
  onDisconnect: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const connected = !!connection;

  const bgMap: Record<string, string> = {
    pink: "bg-pink-100 dark:bg-pink-900/30",
    gray: "bg-gray-100 dark:bg-white/10",
  };

  return (
    <div className="panel-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${bgMap[color] || bgMap.gray} flex items-center justify-center`}
          >
            {icon}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white capitalize">
              {platform === "tiktok" ? "TikTok" : "Instagram"}
            </p>
            <span
              className={`text-xs ${
                connected
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-400 dark:text-white/40"
              }`}
            >
              {connected ? t("connected") : t("notConnected")}
            </span>
          </div>
        </div>
        {connected && (
          <button
            onClick={onSync}
            disabled={syncing}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            title={t("sync")}
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-500 dark:text-white/50 ${syncing ? "animate-spin" : ""}`}
            />
          </button>
        )}
      </div>

      {connected && connection ? (
        <>
          {/* Profile */}
          <div className="flex items-center gap-3">
            {connection.avatar_url ? (
              <img
                src={connection.avatar_url}
                alt={connection.username || ""}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {connection.display_name || connection.username}
              </p>
              {connection.username && (
                <a
                  href={connection.profile_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 dark:text-white/40 hover:underline truncate block"
                >
                  @{connection.username}
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatNumber(connection.followers_count, locale)}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-wide">
                {t("followers")}
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatNumber(connection.posts_count, locale)}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-wide">
                {t("posts")}
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatNumber(connection.likes_count, locale)}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-wide">
                {t("likes")}
              </p>
            </div>
          </div>

          {/* Last synced */}
          {connection.last_synced_at && (
            <p className="text-[10px] text-gray-400 dark:text-white/30 text-center">
              {t("lastSynced")}: {timeAgo(connection.last_synced_at, locale)}
            </p>
          )}

          {/* Disconnect */}
          <button
            onClick={onDisconnect}
            disabled={disconnecting}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <Unlink className="w-3.5 h-3.5" />
            {disconnecting ? "..." : t("disconnect")}
          </button>
        </>
      ) : (
        /* Connect button */
        <div className="text-center py-4">
          <p className="text-sm text-gray-400 dark:text-white/40 mb-3">
            {t("connectDescription")}
          </p>
          <button
            onClick={onConnect}
            className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
          >
            <Link2 className="w-4 h-4" />
            {t("connect")}
          </button>
        </div>
      )}
    </div>
  );
}

