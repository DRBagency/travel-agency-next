"use client"

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  href?: string;
  onClick?: () => void;
  gradient?: boolean;
  glowColor?: 'turquoise' | 'lime';
  iconColor?: string;
}

const iconGradients = [
  { text: 'text-white', bg: 'from-drb-turquoise-500 to-drb-turquoise-600' },
  { text: 'text-white', bg: 'from-emerald-500 to-emerald-600' },
  { text: 'text-white', bg: 'from-amber-500 to-amber-600' },
  { text: 'text-white', bg: 'from-purple-500 to-purple-600' },
  { text: 'text-white', bg: 'from-rose-500 to-rose-600' },
  { text: 'text-white', bg: 'from-cyan-500 to-cyan-600' },
  { text: 'text-white', bg: 'from-orange-500 to-orange-600' },
  { text: 'text-white', bg: 'from-indigo-500 to-indigo-600' },
];

export default function DashboardCard({
  icon,
  title,
  subtitle,
  href,
  onClick,
  iconColor,
}: DashboardCardProps) {
  const colorIndex = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % iconGradients.length;
  const gradient = iconGradients[colorIndex];

  const content = (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconColor || gradient.bg} flex items-center justify-center shrink-0 shadow-md`}>
        <div className="text-white [&>svg]:w-5 [&>svg]:h-5">{icon}</div>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-white/20 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 rtl:rotate-180" />
    </div>
  );

  const cardClass = "group panel-card p-4 cursor-pointer hover:border-drb-turquoise-400/50 dark:hover:border-drb-turquoise-500/40";

  if (href) {
    return (
      <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
        <Link href={href} className={cardClass}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cardClass}
    >
      {content}
    </motion.div>
  );
}
