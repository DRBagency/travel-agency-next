"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Headphones, ArrowRight, Clock } from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  cliente_nombre?: string;
}

const STATUS_BADGE: Record<string, string> = {
  abierto: "badge-info",
  en_progreso: "badge-warning",
  cerrado: "badge-success",
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function OwnerSupportWidget({
  tickets,
  labels,
}: {
  tickets: SupportTicket[];
  labels: {
    title: string;
    viewAll: string;
    noTickets: string;
  };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="panel-card h-full overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Headphones className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {labels.title}
          </h2>
        </div>
        <Link
          href="/owner/soporte"
          className="text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-700 dark:hover:text-drb-turquoise-300 transition-colors flex items-center gap-1"
        >
          {labels.viewAll}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="px-4 pb-3">
        <div className="space-y-1.5">
          {tickets.slice(0, 3).map((ticket, i) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
              className="flex items-start gap-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] px-3 py-2 hover:bg-gray-100/80 dark:hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex flex-col items-center pt-1">
                <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {ticket.subject}
                  </span>
                  <span className={STATUS_BADGE[ticket.status] || "badge-info"}>
                    {ticket.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3 text-gray-400 dark:text-white/30" />
                  <span className="text-xs text-gray-400 dark:text-white/40">
                    {ticket.cliente_nombre && `${ticket.cliente_nombre} · `}
                    {timeAgo(ticket.created_at)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {Array.from({ length: Math.max(0, 3 - tickets.slice(0, 3).length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex items-center gap-2.5 rounded-xl bg-gray-50/50 dark:bg-white/[0.015] border border-dashed border-gray-200/60 dark:border-white/[0.04] px-3 py-2"
            >
              <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-gray-200 dark:bg-white/10" />
              <span className="text-xs text-gray-300 dark:text-white/15">{labels.noTickets}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
