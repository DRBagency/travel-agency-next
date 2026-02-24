"use client";

const BADGE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  confirmed: { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" },
  lastSpots: { bg: "#fef9c3", color: "#a16207", border: "#fde68a" },
  soldOut: { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" },
};

export function StatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  const s = BADGE_STYLES[status] || BADGE_STYLES.confirmed;
  return (
    <span
      style={{
        padding: "5px 14px",
        borderRadius: 50,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "var(--font-syne), Syne, sans-serif",
        background: s.bg,
        color: s.color,
        border: "1px solid " + s.border,
      }}
    >
      {label}
    </span>
  );
}
