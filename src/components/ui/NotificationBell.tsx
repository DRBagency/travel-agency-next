"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Bell,
  MessageSquare,
  CalendarCheck,
  AlertCircle,
  CreditCard,
  UserPlus,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: string;
  title: string;
  description: string | null;
  href: string | null;
  read: boolean;
  created_at: string;
}

interface Props {
  clienteId?: string;
  isOwner?: boolean;
}

const iconMap: Record<string, typeof Bell> = {
  ticket: MessageSquare,
  reserva: CalendarCheck,
  alerta: AlertCircle,
  pago: CreditCard,
  nuevo_cliente: UserPlus,
};

const colorMap: Record<string, string> = {
  ticket: "text-drb-turquoise-500 bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15",
  reserva: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/15",
  alerta: "text-amber-500 bg-amber-50 dark:bg-amber-500/15",
  pago: "text-blue-500 bg-blue-50 dark:bg-blue-500/15",
  nuevo_cliente: "text-purple-500 bg-purple-50 dark:bg-purple-500/15",
};

function timeAgo(dateStr: string, t: (key: string, values?: Record<string, any>) => string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("timeAgoNow");
  if (mins < 60) return t("timeAgoMinutes", { n: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("timeAgoHours", { n: hours });
  const days = Math.floor(hours / 24);
  return t("timeAgoDays", { n: days });
}

export default function NotificationBell({ clienteId, isOwner }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [prevCount, setPrevCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("notifications");

  const apiUrl = isOwner ? "/api/owner/notifications" : "/api/notifications";

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) return;
      const data = await res.json();
      const newNotifs: Notification[] = data.notifications || [];

      setNotifications((prev) => {
        if (newNotifs.length > prev.length && prev.length > 0) {
          const newest = newNotifs[0];
          if (newest) {
            toast.info(newest.title, {
              description: newest.description || undefined,
            });
          }
        }
        return newNotifs;
      });
    } catch {
      // silent
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (ids: string[]) => {
    try {
      await fetch(apiUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
    } catch {
      // silent
    }
  };

  const markAllRead = async () => {
    try {
      await fetch(apiUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications([]);
    } catch {
      // silent
    }
  };

  const unreadCount = notifications.length;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-500 dark:text-white/60" />
        {unreadCount > 0 && (
          <span className="absolute top-1 end-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full mt-2 w-80 bg-white dark:bg-drb-turquoise-900 border border-gray-200 dark:border-white/[0.1] rounded-xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("title")}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-700 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                {t("markAllRead")}
              </button>
            )}
          </div>

          {unreadCount === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-400 dark:text-white/40">
                {t("empty")}
              </p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = iconMap[n.type] || Bell;
                const color =
                  colorMap[n.type] ||
                  "text-gray-500 bg-gray-50 dark:bg-white/10";

                const content = (
                  <div className="flex items-start gap-3 px-4 py-3 hover:bg-drb-turquoise-50/50 dark:hover:bg-white/[0.04] transition-colors border-b border-gray-50 dark:border-white/[0.03] last:border-0 cursor-pointer">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {n.title}
                      </p>
                      {n.description && (
                        <p className="text-xs text-gray-500 dark:text-white/50 mt-0.5 truncate">
                          {n.description}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-400 dark:text-white/30 mt-1">
                        {timeAgo(n.created_at, t)}
                      </p>
                    </div>
                  </div>
                );

                if (n.href) {
                  return (
                    <Link
                      key={n.id}
                      href={n.href}
                      onClick={() => {
                        markAsRead([n.id]);
                        setIsOpen(false);
                      }}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <div
                    key={n.id}
                    onClick={() => markAsRead([n.id])}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
