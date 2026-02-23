"use client";

import { useMemo } from "react";

interface FloatingShapesProps {
  count?: number;
  primaryColor?: string;
  className?: string;
}

interface Shape {
  id: number;
  type: "circle" | "ring" | "dot";
  size: number;
  left: string;
  top: string;
  delay: string;
  duration: string;
  opacity: number;
}

export default function FloatingShapes({
  count = 5,
  primaryColor = "#1CABB0",
  className = "",
}: FloatingShapesProps) {
  const shapes = useMemo<Shape[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        type: (["circle", "ring", "dot"] as const)[i % 3],
        size: 20 + Math.random() * 60,
        left: `${5 + Math.random() * 90}%`,
        top: `${5 + Math.random() * 90}%`,
        delay: `${Math.random() * 6}s`,
        duration: `${8 + Math.random() * 8}s`,
        opacity: 0.08 + Math.random() * 0.12,
      })),
    [count]
  );

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {shapes.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full animate-float"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
            opacity: s.opacity,
            ...(s.type === "circle"
              ? { backgroundColor: primaryColor }
              : s.type === "ring"
              ? { border: `2px solid ${primaryColor}`, backgroundColor: "transparent" }
              : { backgroundColor: primaryColor, width: s.size * 0.3, height: s.size * 0.3 }),
          }}
        />
      ))}
    </div>
  );
}
