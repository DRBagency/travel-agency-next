"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, Mail, ArrowRight } from "lucide-react";

interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  read: boolean;
  created_at: string;
}

function timeAgo(dateStr: string, locale: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return locale === "ar" ? "الآن" : locale === "en" ? "just now" : "ahora";
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return `${m}m`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return `${h}h`;
  }
  const d = Math.floor(diff / 86400);
  return `${d}d`;
}

export default function RecentMessagesWidget({
  messages,
  locale,
  labels,
}: {
  messages: ContactMessage[];
  locale: string;
  labels: {
    recentMessages: string;
    viewAllMessages: string;
    noMessages: string;
    unread: string;
  };
}) {
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="panel-card h-full overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {labels.recentMessages}
          </h2>
          {unreadCount > 0 && (
            <span className="badge-info text-[10px]">
              {unreadCount} {labels.unread}
            </span>
          )}
        </div>
        <Link
          href="/admin/mensajes"
          className="text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-700 dark:hover:text-drb-turquoise-300 transition-colors flex items-center gap-1"
        >
          {labels.viewAllMessages}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="px-4 pb-3">
        <div className="space-y-1.5">
          {/* Render actual messages (max 3) */}
          {messages.slice(0, 3).map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
              className={`flex items-start gap-2.5 rounded-xl px-3 py-2 border transition-colors ${
                msg.read
                  ? "bg-gray-50 dark:bg-white/[0.03] border-gray-100 dark:border-white/[0.06]"
                  : "bg-drb-turquoise-50/50 dark:bg-drb-turquoise-500/[0.06] border-drb-turquoise-200/50 dark:border-drb-turquoise-500/20"
              }`}
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-drb-turquoise-400 to-drb-turquoise-600 flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                {msg.sender_name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {msg.sender_name}
                  </span>
                  <span className="text-[11px] text-gray-400 dark:text-white/30 shrink-0">
                    {timeAgo(msg.created_at, locale)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-white/60 line-clamp-1 mt-0.5">
                  {msg.message}
                </p>
              </div>

              {/* Unread dot */}
              {!msg.read && (
                <div className="w-2 h-2 rounded-full bg-drb-turquoise-500 shrink-0 mt-2" />
              )}
            </motion.div>
          ))}

          {/* Fill remaining slots up to 3 with placeholder */}
          {Array.from({ length: Math.max(0, 3 - messages.slice(0, 3).length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex items-center gap-2.5 rounded-xl bg-gray-50/50 dark:bg-white/[0.015] border border-dashed border-gray-200/60 dark:border-white/[0.04] px-3 py-2"
            >
              <div className="w-7 h-7 rounded-full shrink-0 bg-gray-200 dark:bg-white/10" />
              <span className="text-xs text-gray-300 dark:text-white/15">{labels.noMessages}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
