import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import {
  StickyNote,
  Phone,
  Mail,
  Calendar,
  ArrowRightLeft,
  ShoppingBag,
} from "lucide-react";

interface Activity {
  id: string;
  customer_id: string;
  type: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
  customer_name?: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const TYPE_ICONS: Record<string, typeof StickyNote> = {
  note: StickyNote,
  call: Phone,
  email: Mail,
  meeting: Calendar,
  status_change: ArrowRightLeft,
  booking: ShoppingBag,
};

const TYPE_COLORS: Record<string, string> = {
  note: "text-blue-500 dark:text-blue-400",
  call: "text-emerald-500 dark:text-emerald-400",
  email: "text-purple-500 dark:text-purple-400",
  meeting: "text-amber-500 dark:text-amber-400",
  status_change: "text-gray-500 dark:text-gray-400",
  booking: "text-drb-turquoise-500 dark:text-drb-turquoise-400",
};

const TYPE_DOTS: Record<string, string> = {
  note: "bg-blue-500",
  call: "bg-emerald-500",
  email: "bg-purple-500",
  meeting: "bg-amber-500",
  status_change: "bg-gray-500",
  booking: "bg-drb-turquoise-500",
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
  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin}m`;
  if (diffH < 24) return `hace ${diffH}h`;
  if (diffD < 30) return `hace ${diffD}d`;
  return date.toLocaleDateString(locale);
}

export default async function RecentActivities({ activities }: RecentActivitiesProps) {
  const t = await getTranslations("admin.crm");
  const locale = await getLocale();

  if (activities.length === 0) {
    return (
      <div className="panel-card p-6 text-center">
        <p className="text-sm text-gray-400 dark:text-white/40">{t("noActivities")}</p>
      </div>
    );
  }

  return (
    <div className="panel-card p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        {t("recentActivity")}
      </h3>
      <div className="relative">
        <div className="absolute start-3 top-2 bottom-2 w-px bg-gray-200 dark:bg-white/[0.08]" />
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = TYPE_ICONS[activity.type] || StickyNote;
            const color = TYPE_COLORS[activity.type] || TYPE_COLORS.note;
            const dot = TYPE_DOTS[activity.type] || TYPE_DOTS.note;

            return (
              <div key={activity.id} className="relative flex items-start gap-3">
                <div className="relative z-10 flex items-center justify-center w-6 h-6 shrink-0">
                  <div className={`w-2 h-2 rounded-full ${dot}`} />
                </div>
                <div className="flex-1 min-w-0 -mt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Icon className={`w-3.5 h-3.5 ${color} shrink-0`} />
                    {activity.customer_name && (
                      <Link
                        href={`/admin/crm/${activity.customer_id}`}
                        className="text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:underline"
                      >
                        {activity.customer_name}
                      </Link>
                    )}
                    <span className="text-xs text-gray-300 dark:text-white/20">
                      {getRelativeTime(activity.created_at, locale)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-white/60 mt-0.5 truncate">
                    {activity.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
