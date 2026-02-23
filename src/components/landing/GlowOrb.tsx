"use client";

export function GlowOrb({
  color, size, top, left, right, bottom, opacity = 0.15, className = "",
}: {
  color: string;
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      className={`glow ${className}`}
      style={{
        width: size, height: size, background: color, opacity,
        top, left, right, bottom,
      }}
    />
  );
}
