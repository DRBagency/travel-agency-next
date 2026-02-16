"use client"

import { ReactNode, useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  onClick?: () => void;
  gradient?: boolean;
  glowColor?: 'turquoise' | 'lime';
}

export default function DashboardCard({
  icon,
  title,
  onClick,
  gradient = false,
  glowColor = 'turquoise'
}: DashboardCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden rounded-3xl p-8
        cursor-pointer
        transition-all duration-300 ease-out
        ${gradient
          ? 'bg-gradient-to-br from-drb-turquoise-600 to-drb-turquoise-800'
          : 'bg-white/5 backdrop-blur-md border border-white/10'
        }
        ${isHovered ? 'scale-105 shadow-premium-lg' : 'shadow-premium'}
        ${glowColor === 'turquoise' && isHovered ? 'shadow-drb-turquoise-500/30' : ''}
        ${glowColor === 'lime' && isHovered ? 'shadow-drb-lime-500/30' : ''}
        group
      `}
    >
      {/* Gradient overlay animado */}
      <div className={`
        absolute inset-0 bg-gradient-to-br from-drb-turquoise-500/10 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
      `} />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
        {/* Icono con fondo */}
        <div className={`
          w-20 h-20 rounded-2xl flex items-center justify-center
          ${gradient ? 'bg-white/20' : 'bg-drb-turquoise-500/20'}
          transition-all duration-300
          ${isHovered ? 'scale-110 rotate-3' : ''}
        `}>
          <div className="text-4xl">
            {icon}
          </div>
        </div>

        {/* Título */}
        <h3 className="text-xl font-semibold text-white">
          {title}
        </h3>

        {/* Flecha indicadora */}
        <ChevronRight
          className={`
            w-6 h-6 text-white/60
            transition-all duration-300
            ${isHovered ? 'translate-x-1 text-white' : ''}
          `}
        />
      </div>

      {/* Borde brillante en hover */}
      <div className={`
        absolute inset-0 rounded-3xl
        transition-opacity duration-300
        ${isHovered ? 'opacity-100' : 'opacity-0'}
        bg-gradient-to-r from-drb-turquoise-500 via-drb-lime-500 to-drb-turquoise-500
        bg-[length:200%_100%]
        animate-pulse
        blur-xl
        -z-10
      `} />
    </div>
  );
}
