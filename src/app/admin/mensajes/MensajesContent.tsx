"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Mail,
  Clock,
  CheckCircle2,
  Circle,
  Eye,
  Reply,
  Send,
  Loader2,
} from "lucide-react";
import { sileo } from "sileo";
import EmptyState from "@/components/ui/EmptyState";

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  read: boolean;
  replied: boolean | null;
  reply_message: string | null;
  replied_at: string | null;
  created_at: string;
}

export default function MensajesContent({
  messages,
  locale,
  unreadCount,
}: {
  messages: Message[];
  locale: string;
  unreadCount: number;
}) {
  const t = useTranslations("admin.mensajes");
  const tc = useTranslations("common");
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [markingRead, setMarkingRead] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const handleMarkRead = async (id: string) => {
    setMarkingRead(id);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        sileo.success({ title: t("read") });
        router.refresh();
      }
    } catch {
      sileo.error({ title: tc("error") });
    } finally {
      setMarkingRead(null);
    }
  };

  const handleSendReply = async (messageId: string) => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      const res = await fetch("/api/admin/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, replyText: replyText.trim() }),
      });
      if (res.ok) {
        sileo.success({ title: t("replySent") });
        setReplyingTo(null);
        setReplyText("");
        router.refresh();
      } else {
        sileo.error({ title: t("replyError") });
      }
    } catch {
      sileo.error({ title: tc("error") });
    } finally {
      setSendingReply(false);
    }
  };

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={<Mail />}
        title={t("noMessages")}
        description={t("noMessagesDesc")}
      />
    );
  }

  return (
    <div className="space-y-3">
      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-500 dark:text-white/50">
          {messages.length} {t("message").toLowerCase()}s
        </span>
        {unreadCount > 0 && (
          <span className="badge-info badge-dot-info text-xs">
            {unreadCount} {t("unread").toLowerCase()}
          </span>
        )}
      </div>

      {/* Messages list */}
      <div className="space-y-2">
        {messages.map((msg, i) => {
          const isExpanded = expandedId === msg.id;
          const isReplying = replyingTo === msg.id;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.03 * Math.min(i, 10) }}
            >
              <div
                className={`panel-card overflow-hidden transition-all ${
                  !msg.read
                    ? "border-s-4 border-s-drb-turquoise-500"
                    : ""
                }`}
              >
                {/* Header row — clickable */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                  className="w-full flex items-center gap-4 p-4 text-start hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-drb-turquoise-400 to-drb-turquoise-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                    {msg.sender_name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium truncate ${
                        msg.read
                          ? "text-gray-700 dark:text-white/70"
                          : "text-gray-900 dark:text-white"
                      }`}>
                        {msg.sender_name}
                      </span>
                      {!msg.read && (
                        <Circle className="w-2 h-2 fill-drb-turquoise-500 text-drb-turquoise-500 shrink-0" />
                      )}
                      {msg.replied && (
                        <span className="text-[10px] badge-success">{t("replied")}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-white/40 truncate">
                      {msg.sender_email}
                    </p>
                  </div>

                  {/* Message preview */}
                  <div className="hidden md:block flex-1 min-w-0">
                    <p className={`text-sm truncate ${
                      msg.read
                        ? "text-gray-400 dark:text-white/30"
                        : "text-gray-600 dark:text-white/60"
                    }`}>
                      {msg.message}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-white/30 shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.created_at).toLocaleDateString(locale, {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  {/* Status icon */}
                  {msg.replied ? (
                    <Reply className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : msg.read ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <MessageCircle className="w-4 h-4 text-drb-turquoise-500 shrink-0" />
                  )}
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-100 dark:border-white/[0.06]"
                  >
                    <div className="p-4 space-y-3">
                      {/* Full message */}
                      <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-4">
                        <p className="text-sm text-gray-700 dark:text-white/70 whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>

                      {/* Previous reply if exists */}
                      {msg.replied && msg.reply_message && (
                        <div className="bg-drb-turquoise-50 dark:bg-drb-turquoise-500/5 border border-drb-turquoise-200 dark:border-drb-turquoise-500/15 rounded-xl p-4">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Reply className="w-3.5 h-3.5 text-drb-turquoise-500" />
                            <span className="text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400">
                              {t("yourReply")}
                              {msg.replied_at && (
                                <span className="text-gray-400 dark:text-white/30 ms-2 font-normal">
                                  {new Date(msg.replied_at).toLocaleDateString(locale, {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-white/70 whitespace-pre-wrap">
                            {msg.reply_message}
                          </p>
                        </div>
                      )}

                      {/* Reply form */}
                      {isReplying && (
                        <div className="space-y-2">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={t("replyPlaceholder")}
                            rows={4}
                            className="w-full panel-input resize-y"
                            autoFocus
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSendReply(msg.id)}
                              disabled={sendingReply || !replyText.trim()}
                              className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5"
                            >
                              {sendingReply ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Send className="w-3.5 h-3.5" />
                              )}
                              {t("sendReply")}
                            </button>
                            <button
                              type="button"
                              onClick={() => { setReplyingTo(null); setReplyText(""); }}
                              className="text-xs text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/60 transition-colors px-3 py-1.5"
                            >
                              {tc("cancel")}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {!msg.read && (
                          <button
                            type="button"
                            onClick={() => handleMarkRead(msg.id)}
                            disabled={markingRead === msg.id}
                            className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {t("markAsRead")}
                          </button>
                        )}
                        {!isReplying && (
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(msg.id);
                              setReplyText("");
                            }}
                            className="text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline flex items-center gap-1"
                          >
                            <Reply className="w-3.5 h-3.5" />
                            {t("reply")}
                          </button>
                        )}
                        <a
                          href={`mailto:${msg.sender_email}`}
                          className="text-xs font-medium text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/60 hover:underline flex items-center gap-1 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {msg.sender_email}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
