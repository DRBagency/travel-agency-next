"use client";

import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

interface KanbanCardProps {
  client: {
    id: string;
    nombre: string | null;
    plan: string | null;
    last_activity_at?: string | null;
  };
}

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

export default function KanbanCard({ client }: KanbanCardProps) {
  const router = useRouter();
  const t = useTranslations("owner.crm");
  const locale = useLocale();

  const relTime = getRelativeTime(client.last_activity_at, locale);

  return (
    <div
      draggable="true"
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", client.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => router.push(`/owner/clientes/${client.id}?tab=crm`)}
      className="panel-card p-3 cursor-grab active:cursor-grabbing hover:shadow-200 hover:-translate-y-0.5 transition-all select-none"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-7 h-7 rounded-full bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 text-drb-turquoise-600 dark:text-drb-turquoise-400 flex items-center justify-center text-xs font-semibold shrink-0">
          {(client.nombre || "?").charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {client.nombre || "—"}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        {client.plan && (
          <span className="badge-info text-[10px]">{client.plan}</span>
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
