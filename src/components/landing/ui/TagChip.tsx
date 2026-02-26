"use client";

const TAG_COLORS: Record<string, string> = {
  // Spanish
  Relax: "#0ea5e9",
  "Fiesta y Nightlife": "#e879f9",
  "Naturaleza y Aventura": "#22c55e",
  "Ciudad y Culturas": "#f97316",
  "Monumentos e Historia": "#8b5cf6",
  "Gastronomía": "#ef4444",
  // English
  "Party and Nightlife": "#e879f9",
  "Nature and Adventure": "#22c55e",
  "City and Cultures": "#f97316",
  "Monuments and History": "#8b5cf6",
  Gastronomy: "#ef4444",
  // Arabic
  "استرخاء": "#0ea5e9",
  "حفلات وحياة ليلية": "#e879f9",
  "طبيعة ومغامرة": "#22c55e",
  "مدينة وثقافات": "#f97316",
  "معالم وتاريخ": "#8b5cf6",
  "فن الطهي": "#ef4444",
};

/** Stable palette for tags that don't match the known map */
const PALETTE = ["#0ea5e9", "#e879f9", "#22c55e", "#f97316", "#8b5cf6", "#ef4444"];

export function TagChip({ label, index }: { label: string; index?: number }) {
  const color = TAG_COLORS[label] || (index !== undefined ? PALETTE[index % PALETTE.length] : "#1CABB0");
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
