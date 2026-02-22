"use client";

import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

interface KanbanCardProps {
  customer: {
    id: string;
    nombre: string;
    email: string | null;
    total_bookings: number;
    tags?: string[];
    last_activity_at?: string | null;
  };
}

const TAG_COLORS: Record<string, string> = {
  VIP: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400",
  Repetidor: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
  Corporativo: "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400",
  Grupo: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  Urgente: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
};

function getRelativeTime(dateStr: string | null | undefined, locale: string): string | null {
  if (!dateStr) return null;
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (locale === "ar") {
    if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
    if (diffH < 24) return `منذ ${diffH} ساعة`;
    if (diffD < 30) return `منذ ${diffD} يوم`;
    return date.toLocaleDateString(locale);
  }
  if (locale === "en") {
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffH < 24) return `${diffH}h ago`;
    if (diffD < 30) return `${diffD}d ago`;
    return date.toLocaleDateString(locale);
  }
  if (diffMin < 60) return `hace ${diffMin}m`;
  if (diffH < 24) return `hace ${diffH}h`;
  if (diffD < 30) return `hace ${diffD}d`;
  return date.toLocaleDateString(locale);
}

export default function KanbanCard({ customer }: KanbanCardProps) {
  const router = useRouter();
  const t = useTranslations("admin.crm");
  const locale = useLocale();

  const relTime = getRelativeTime(customer.last_activity_at, locale);

  return (
    <div
      draggable="true"
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", customer.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => router.push(`/admin/crm/${customer.id}`)}
      className="panel-card p-3 cursor-grab active:cursor-grabbing hover:shadow-200 hover:-translate-y-0.5 transition-all select-none"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-7 h-7 rounded-full bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 text-drb-turquoise-600 dark:text-drb-turquoise-400 flex items-center justify-center text-xs font-semibold shrink-0">
          {customer.nombre.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {customer.nombre}
        </span>
      </div>
      {customer.tags && customer.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {customer.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
                TAG_COLORS[tag] || "bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-white/50"
              }`}
            >
              {tag}
            </span>
          ))}
          {customer.tags.length > 2 && (
            <span className="text-[9px] text-gray-400 dark:text-white/30">
              +{customer.tags.length - 2}
            </span>
          )}
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        {customer.total_bookings > 0 && (
          <span className="badge-info text-[10px]">
            {customer.total_bookings} {t("totalBookings")}
          </span>
        )}
        {relTime && (
          <span className="text-[10px] text-gray-400 dark:text-white/30 truncate">
            {relTime}
          </span>
        )}
      </div>
    </div>
  );
}
