"use client"

import { ReactNode, useState } from 'react';
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
}

export default function DashboardCard({
  icon,
  title,
  subtitle,
  href,
  onClick,
  gradient = false,
  glowColor = 'turquoise'
}: DashboardCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <>
      {/* Gradient overlay animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-drb-turquoise-500/5 dark:from-drb-turquoise-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          ${gradient
            ? 'bg-drb-turquoise-50 dark:bg-white/20'
            : 'bg-drb-turquoise-50 dark:bg-drb-turquoise-500/25'
          }
          transition-all duration-300
          ${isHovered ? 'scale-110 rotate-3' : ''}
        `}>
          <div className="text-3xl text-drb-turquoise-600 dark:text-drb-turquoise-300">{icon}</div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>

        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-white/50">{subtitle}</p>
        )}

        <ChevronRight className={`
          w-5 h-5 text-gray-400 dark:text-white/60 transition-all duration-300
          ${isHovered ? 'translate-x-1 text-drb-turquoise-500 dark:text-white' : ''}
        `} />
      </div>

      {/* Borde brillante en hover (dark only) */}
      <div className={`
        absolute inset-0 rounded-2xl transition-opacity duration-300 hidden dark:block
        ${isHovered ? 'opacity-100' : 'opacity-0'}
        bg-gradient-to-r from-drb-turquoise-500 via-drb-lime-500 to-drb-turquoise-500
        bg-[length:200%_100%] blur-xl -z-10
      `} />
    </>
  );

  const className = `
    relative overflow-hidden rounded-2xl p-6 cursor-pointer
    transition-all duration-300 ease-out
    bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15
    backdrop-blur-md
    ${isHovered ? 'scale-[1.03] shadow-premium-lg dark:shadow-premium-lg' : 'shadow-card dark:shadow-premium'}
    group
  `;

  if (href) {
    return (
      <Link
        href={href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
    >
      {content}
    </div>
  );
}
