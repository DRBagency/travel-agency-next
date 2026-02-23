"use client";

const statusStyles: Record<string, { bg: string; color: string; border: string }> = {
  confirmed: { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" },
  lastSpots: { bg: "#fef3c7", color: "#b45309", border: "#fde68a" },
  soldOut:   { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" },
};

export function StatusBadge({ status, label }: { status: string; label: string }) {
  const s = statusStyles[status] ?? statusStyles.confirmed;
  return (
    <span style={{
      padding: "4px 14px", borderRadius: 50, fontSize: 12, fontWeight: 600,
      fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {label}
    </span>
  );
}
