"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Bell, MessageSquare, CalendarCheck, AlertCircle } from "lucide-react";

interface Notification {
  id: string;
  type: "ticket" | "reserva" | "alerta";
  title: string;
  description: string;
  href: string;
  time: string;
}

function getMockNotifications(t: (key: string) => string): Notification[] {
  return [
    {
      id: "1",
      type: "ticket",
      title: t('newTicket'),
      description: t('ticketDesc'),
      href: "/admin/soporte",
      time: t('timeAgo5m'),
    },
    {
      id: "2",
      type: "reserva",
      title: t('newBooking'),
      description: t('bookingDesc'),
      href: "/admin/reservas",
      time: t('timeAgo15m'),
    },
    {
      id: "3",
      type: "alerta",
      title: t('pendingDoc'),
      description: t('docDesc'),
      href: "/admin/documentos",
      time: t('timeAgo1h'),
    },
  ];
}

const iconMap = {
  ticket: MessageSquare,
  reserva: CalendarCheck,
  alerta: AlertCircle,
};

const colorMap = {
  ticket: "text-drb-turquoise-500 bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15",
  reserva: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/15",
  alerta: "text-amber-500 bg-amber-50 dark:bg-amber-500/15",
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('notifications');
  const notifications = getMockNotifications(t);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-500 dark:text-white/60" />
        {notifications.length > 0 && (
          <span className="absolute top-1 end-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full mt-2 w-80 bg-white dark:bg-drb-turquoise-900 border border-gray-200 dark:border-white/[0.1] rounded-xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t('title')}
            </h3>
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-400 dark:text-white/40">
                {t('empty')}
              </p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = iconMap[n.type];
                return (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-drb-turquoise-50/50 dark:hover:bg-white/[0.04] transition-colors border-b border-gray-50 dark:border-white/[0.03] last:border-0"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${colorMap[n.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-white/50 mt-0.5 truncate">
                        {n.description}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-white/30 mt-1">
                        {n.time}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
