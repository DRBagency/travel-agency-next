"use client"

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

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

const iconColors = [
  'text-blue-500 bg-blue-50 dark:bg-blue-500/15',
  'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/15',
  'text-amber-500 bg-amber-50 dark:bg-amber-500/15',
  'text-purple-500 bg-purple-50 dark:bg-purple-500/15',
  'text-rose-500 bg-rose-50 dark:bg-rose-500/15',
  'text-cyan-500 bg-cyan-50 dark:bg-cyan-500/15',
  'text-orange-500 bg-orange-50 dark:bg-orange-500/15',
  'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/15',
];

export default function DashboardCard({
  icon,
  title,
  subtitle,
  href,
  onClick,
  iconColor,
}: DashboardCardProps) {
  // Generate stable color from title
  const colorIndex = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % iconColors.length;
  const colorClasses = iconColor || iconColors[colorIndex];

  const content = (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClasses}`}>
        <div className="w-6 h-6">{icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">{subtitle}</p>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-white/20 shrink-0 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
    </div>
  );

  const cardClass = "group panel-card p-4 cursor-pointer";

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
