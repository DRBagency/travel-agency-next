"use client";

const TAG_COLORS: Record<string, string> = {
  Relax: "#0ea5e9",
  "Fiesta y Nightlife": "#e879f9",
  "Naturaleza y Aventura": "#22c55e",
  "Ciudad y Culturas": "#f97316",
  "Monumentos e Historia": "#8b5cf6",
  "Gastronomía": "#ef4444",
};

export function TagChip({ label }: { label: string }) {
  const color = TAG_COLORS[label] || "#1CABB0";
  return (
    <span
      style={{
        padding: "6px 16px",
        borderRadius: 50,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "var(--font-syne), Syne, sans-serif",
        background: color + "12",
        color,
        border: "1px solid " + color + "22",
      }}
    >
      {label}
    </span>
  );
}
