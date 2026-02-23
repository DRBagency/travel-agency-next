"use client";

const tagColors: Record<string, string> = {
  "Relax": "#0ea5e9",
  "Fiesta y Nightlife": "#e879f9",
  "Naturaleza y Aventura": "#22c55e",
  "Ciudad y Culturas": "#f97316",
  "Monumentos e Historia": "#8b5cf6",
  "Gastronomía": "#ef4444",
  // English variants
  "Nature & Adventure": "#22c55e",
  "City & Culture": "#f97316",
  "Monuments & History": "#8b5cf6",
  "Party & Nightlife": "#e879f9",
  "Gastronomy": "#ef4444",
};

export function TagChip({ label }: { label: string }) {
  const c = tagColors[label] || "#1CABB0";
  return (
    <span style={{
      padding: "6px 16px", borderRadius: 50, fontSize: 13, fontWeight: 600,
      fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
      background: `${c}14`, color: c, border: `1px solid ${c}28`,
    }}>
      {label}
    </span>
  );
}
