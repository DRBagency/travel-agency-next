"use client"

import { ReactNode } from 'react';

interface PremiumButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PremiumButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = ''
}: PremiumButtonProps) {
  const baseStyles = "font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105",
    secondary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105",
    outline: "border-2 border-white/20 hover:border-blue-400 text-white hover:bg-white/5"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
