"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  StickyNote,
  Phone,
  Mail,
  Calendar,
  ArrowRightLeft,
} from "lucide-react";

interface Activity {
  id: string;
  client_id: string;
  type: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const TYPE_CONFIG: Record<string, { icon: typeof StickyNote; color: string; dot: string }> = {
  note: {
    icon: StickyNote,
    color: "text-blue-500 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  call: {
    icon: Phone,
    color: "text-emerald-500 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  email: {
    icon: Mail,
    color: "text-purple-500 dark:text-purple-400",
    dot: "bg-purple-500",
  },
  meeting: {
    icon: Calendar,
    color: "text-amber-500 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  status_change: {
    icon: ArrowRightLeft,
    color: "text-gray-500 dark:text-gray-400",
    dot: "bg-gray-500",
  },
};

function getRelativeTime(dateStr: string, locale: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (locale === "ar") {
    if (diffMin < 1) return "الآن";
    if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
    if (diffH < 24) return `منذ ${diffH} ساعة`;
    if (diffD < 30) return `منذ ${diffD} يوم`;
    return date.toLocaleDateString(locale);
  }

  if (locale === "en") {
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffH < 24) return `${diffH}h ago`;
    if (diffD < 30) return `${diffD}d ago`;
    return date.toLocaleDateString(locale);
  }

  // es
  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin}m`;
  if (diffH < 24) return `hace ${diffH}h`;
  if (diffD < 30) return `hace ${diffD}d`;
  return date.toLocaleDateString(locale);
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const t = useTranslations("owner.crm");
  const locale = useLocale();

  if (activities.length === 0) {
    return (
      <p className="text-sm text-gray-400 dark:text-white/40 py-4">
        {t("noActivities")}
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute start-3 top-2 bottom-2 w-px bg-gray-200 dark:bg-white/[0.08]" />

      <div className="space-y-4">
        {activities.map((activity) => {
          const config = TYPE_CONFIG[activity.type] || TYPE_CONFIG.note;
          const Icon = config.icon;

          return (
            <div key={activity.id} className="relative flex items-start gap-3 ps-0">
              {/* Dot on the line */}
              <div className="relative z-10 flex items-center justify-center w-6 h-6 shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 -mt-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Icon className={`w-3.5 h-3.5 ${config.color} shrink-0`} />
                  <span className="text-xs font-medium text-gray-500 dark:text-white/50">
                    {t(`types.${activity.type}`)}
                  </span>
                  <span className="text-xs text-gray-300 dark:text-white/20">
                    {getRelativeTime(activity.created_at, locale)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-white/70 mt-0.5 break-words">
                  {activity.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
