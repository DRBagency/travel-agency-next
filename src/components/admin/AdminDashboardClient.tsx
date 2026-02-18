"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Plane,
} from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function StaggeredGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredItem({ children }: { children: ReactNode }) {
  return <motion.div variants={itemVariants}>{children}</motion.div>;
}

export function PremiumGreeting({
  greeting,
  clientName,
  dateStr,
}: {
  greeting: string;
  clientName: string;
  dateStr: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {greeting.split(clientName).length > 1 ? (
          <>
            {greeting.split(clientName)[0]}
            <span className="gradient-text">{clientName}</span>
            {greeting.split(clientName)[1]}
          </>
        ) : (
          greeting
        )}
      </h1>
      <div className="flex items-center gap-2 text-gray-400 dark:text-white/40">
        <Calendar className="w-4 h-4" />
        <p className="capitalize">{dateStr}</p>
      </div>
    </motion.div>
  );
}

const avatarGradients = [
  "from-drb-turquoise-400 to-drb-turquoise-600",
  "from-emerald-400 to-emerald-600",
  "from-purple-400 to-purple-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-cyan-400 to-cyan-600",
  "from-indigo-400 to-indigo-600",
];

function getAvatarGradient(name: string) {
  const index = name.charCodeAt(0) % avatarGradients.length;
  return avatarGradients[index];
}

interface BookingRow {
  id?: string;
  nombre?: string;
  destino?: string;
  created_at: string;
  precio: number;
  estado_pago: string;
}

export function LatestBookings({
  bookings,
  locale,
  labels,
}: {
  bookings: BookingRow[];
  locale: string;
  labels: {
    latestBookings: string;
    viewAll: string;
    noBookingsYet: string;
    booking: string;
    count: number;
  };
}) {
  const [animateRef] = useAutoAnimate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="panel-card"
    >
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 flex items-center justify-center">
            <CalendarCheck className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {labels.latestBookings}
          </h2>
          {labels.count > 0 && (
            <span className="badge-info badge-dot-info text-xs">
              {labels.count}
            </span>
          )}
        </div>
        <a href="/admin/reservas" className="btn-primary text-xs px-4 py-2">
          {labels.viewAll}
        </a>
      </div>
      <div className="px-6 pb-6">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Plane className="w-12 h-12 text-drb-turquoise-300 dark:text-drb-turquoise-600 mb-4" />
            </motion.div>
            <p className="text-gray-400 dark:text-white/40">{labels.noBookingsYet}</p>
          </div>
        ) : (
          <div ref={animateRef} className="space-y-3">
            {bookings.slice(0, 5).map((r, index) => {
              const initial = (r.nombre || "R").charAt(0).toUpperCase();
              const gradient = getAvatarGradient(initial);

              const rowContent = (
                <motion.div
                  key={r.id || r.created_at}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  {r.id ? (
                    <Link
                      href={`/admin/reserva/${r.id}`}
                      className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] px-4 py-3.5 hover:bg-drb-turquoise-50/50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-semibold shadow-sm`}
                        >
                          {initial}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white hover:text-drb-turquoise-600 dark:hover:text-drb-turquoise-400 transition-colors">
                            {r.nombre || labels.booking}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-white/40">
                            {r.destino || "—"} · {new Date(r.created_at).toLocaleDateString(locale)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {r.precio} €
                        </span>
                        <span
                          className={
                            r.estado_pago === "pagado"
                              ? "badge-success badge-dot-success"
                              : r.estado_pago === "pendiente"
                                ? "badge-warning badge-dot-warning"
                                : "badge-info badge-dot-info"
                          }
                        >
                          {r.estado_pago === "pagado" && (
                            <CheckCircle2 className="w-3 h-3 inline-block me-1" />
                          )}
                          {r.estado_pago === "pendiente" && (
                            <Clock className="w-3 h-3 inline-block me-1" />
                          )}
                          {r.estado_pago}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-semibold shadow-sm`}
                        >
                          {initial}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            {r.nombre || labels.booking}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-white/40">
                            {r.destino || "—"} · {new Date(r.created_at).toLocaleDateString(locale)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {r.precio} €
                        </span>
                        <span
                          className={
                            r.estado_pago === "pagado"
                              ? "badge-success badge-dot-success"
                              : r.estado_pago === "pendiente"
                                ? "badge-warning badge-dot-warning"
                                : "badge-info badge-dot-info"
                          }
                        >
                          {r.estado_pago}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
              return rowContent;
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
