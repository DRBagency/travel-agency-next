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
      <div className="absolute inset-0 bg-gradient-to-br from-drb-turquoise-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
        <div className={`
          w-20 h-20 rounded-2xl flex items-center justify-center
          ${gradient ? 'bg-white/20' : 'bg-drb-turquoise-500/25'}
          transition-all duration-300
          ${isHovered ? 'scale-110 rotate-3' : ''}
        `}>
          <div className="text-4xl">{icon}</div>
        </div>

        <h3 className="text-xl font-semibold text-white">{title}</h3>

        {subtitle && (
          <p className="text-sm text-white/50">{subtitle}</p>
        )}

        <ChevronRight className={`
          w-6 h-6 text-white/60 transition-all duration-300
          ${isHovered ? 'translate-x-1 text-white' : ''}
        `} />
      </div>

      {/* Borde brillante en hover */}
      <div className={`
        absolute inset-0 rounded-3xl transition-opacity duration-300
        ${isHovered ? 'opacity-100' : 'opacity-0'}
        bg-gradient-to-r from-drb-turquoise-500 via-drb-lime-500 to-drb-turquoise-500
        bg-[length:200%_100%] blur-xl -z-10
      `} />
    </>
  );

  const className = `
    relative overflow-hidden rounded-3xl p-8 cursor-pointer
    transition-all duration-300 ease-out
    ${gradient
      ? 'bg-gradient-to-br from-drb-turquoise-500/40 to-drb-lime-500/20 border border-drb-lime-500/30'
      : 'bg-gradient-to-br from-white/15 to-drb-turquoise-500/10 backdrop-blur-md border border-white/20'
    }
    ${isHovered ? 'scale-105 shadow-premium-lg' : 'shadow-premium'}
    ${glowColor === 'turquoise' && isHovered ? 'shadow-drb-turquoise-500/30' : ''}
    ${glowColor === 'lime' && isHovered ? 'shadow-drb-lime-500/30' : ''}
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
