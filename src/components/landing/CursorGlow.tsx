"use client";

import { useRef, useState, type ReactNode } from "react";

interface CursorGlowProps {
  children: ReactNode;
  color?: string;
  className?: string;
  size?: number;
}

export default function CursorGlow({
  children,
  color = "rgba(255,255,255,0.15)",
  className = "",
  size = 250,
}: CursorGlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering && (
        <div
          className="pointer-events-none absolute z-10 rounded-full transition-opacity duration-300"
          style={{
            width: size,
            height: size,
            left: pos.x - size / 2,
            top: pos.y - size / 2,
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}
