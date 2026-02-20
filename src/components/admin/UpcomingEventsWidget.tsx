"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time?: string | null;
  all_day: boolean;
  event_type?: string | null;
  color?: string | null;
}

const EVENT_COLORS: Record<string, string> = {
  lime: "#D4F24D",
  turquoise: "#1CABB0",
  blue: "#3B82F6",
  violet: "#8B5CF6",
  pink: "#EC4899",
  orange: "#F97316",
  red: "#EF4444",
  green: "#22C55E",
};

function getEventColor(color?: string | null): string {
  if (!color) return "#1CABB0";
  return EVENT_COLORS[color] || color;
}

function formatEventTime(startTime: string, allDay: boolean, locale: string): string {
  const date = new Date(startTime);
  if (allDay) {
    return date.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
  }
  return date.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" }) +
    " · " +
    date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

function isTomorrow(dateStr: string): boolean {
  const d = new Date(dateStr);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return d.getFullYear() === tomorrow.getFullYear() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getDate() === tomorrow.getDate();
}

export default function UpcomingEventsWidget({
  events,
  locale,
  labels,
}: {
  events: CalendarEvent[];
  locale: string;
  labels: {
    upcomingEvents: string;
    viewCalendar: string;
    noUpcomingEvents: string;
    today: string;
    tomorrow: string;
    allDay: string;
  };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="panel-card"
    >
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {labels.upcomingEvents}
          </h2>
        </div>
        <Link
          href="/admin/calendario"
          className="text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-700 dark:hover:text-drb-turquoise-300 transition-colors flex items-center gap-1"
        >
          {labels.viewCalendar}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="px-5 pb-5">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Calendar className="w-10 h-10 text-purple-300 dark:text-purple-600 mb-3" />
            </motion.div>
            <p className="text-sm text-gray-400 dark:text-white/40">{labels.noUpcomingEvents}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((event, i) => {
              const color = getEventColor(event.color);
              const todayEvent = isToday(event.start_time);
              const tomorrowEvent = isTomorrow(event.start_time);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                  className="flex items-start gap-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] px-3.5 py-3 hover:bg-gray-100/80 dark:hover:bg-white/[0.05] transition-colors"
                >
                  {/* Color dot + line */}
                  <div className="flex flex-col items-center pt-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    {i < events.length - 1 && (
                      <div className="w-px h-full mt-1 bg-gray-200 dark:bg-white/10" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {event.title}
                      </span>
                      {todayEvent && (
                        <span className="badge-info text-[10px] px-1.5 py-0.5">{labels.today}</span>
                      )}
                      {tomorrowEvent && (
                        <span className="badge-warning text-[10px] px-1.5 py-0.5">{labels.tomorrow}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400 dark:text-white/30" />
                      <span className="text-xs text-gray-400 dark:text-white/40">
                        {event.all_day
                          ? `${formatEventTime(event.start_time, true, locale)} · ${labels.allDay}`
                          : formatEventTime(event.start_time, false, locale)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
