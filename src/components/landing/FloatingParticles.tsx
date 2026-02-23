"use client";

import { useMemo } from "react";

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  className?: string;
}

export default function FloatingParticles({
  count = 25,
  color = "white",
  className = "",
}: FloatingParticlesProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 3,
        delay: `${Math.random() * 8}s`,
        duration: `${6 + Math.random() * 6}s`,
        opacity: 0.2 + Math.random() * 0.4,
      })),
    [count]
  );

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
