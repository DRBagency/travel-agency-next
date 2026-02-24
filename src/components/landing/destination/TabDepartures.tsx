"use client";

import { useLandingTheme } from "../LandingThemeProvider";
import { StatusBadge } from "../ui/StatusBadge";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface Departure {
  date: string;
  status: string;
  price?: number;
  spots?: number;
}

interface TabDeparturesProps {
  departures: Departure[];
  onBook: (departure: Departure) => void;
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmado",
  lastSpots: "Ultimas plazas",
  soldOut: "Agotado",
};

export function TabDepartures({ departures, onBook }: TabDeparturesProps) {
  const T = useLandingTheme();

  return (
    <div
      style={{
        background: T.bg2,
        borderRadius: 22,
        border: `1.5px solid ${T.border}`,
        overflow: "hidden",
      }}
    >
      {/* Table header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.2fr",
          padding: "14px 24px",
          background: T.bg3,
          borderBottom: `1px solid ${T.border}`,
          fontFamily: FONT2,
          fontSize: 12,
          fontWeight: 600,
          color: T.muted,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        <span>Fecha</span>
        <span>Estado</span>
        <span>Plazas</span>
        <span>Precio</span>
        <span></span>
      </div>

      {/* Departure rows */}
      {departures.map((dep, i) => {
        const isSoldOut = dep.status === "soldOut";
        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.2fr",
              padding: "16px 24px",
              borderBottom:
                i < departures.length - 1
                  ? `1px solid ${T.border}`
                  : "none",
              alignItems: "center",
              opacity: isSoldOut ? 0.6 : 1,
              transition: "background .2s",
            }}
            onMouseEnter={(e) => {
              if (!isSoldOut) e.currentTarget.style.background = T.bg3 + "60";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            {/* Date */}
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 15,
                color: T.text,
              }}
            >
              {dep.date}
            </span>

            {/* Status badge */}
            <span>
              <StatusBadge
                status={dep.status || "confirmed"}
                label={STATUS_LABELS[dep.status] || dep.status}
              />
            </span>

            {/* Spots */}
            <span
              style={{
                fontFamily: FONT2,
                fontSize: 13,
                color: T.sub,
              }}
            >
              {dep.spots != null ? `${dep.spots} plazas` : "\u2014"}
            </span>

            {/* Price */}
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 16,
                color: T.accent,
              }}
            >
              {dep.price != null ? `${dep.price}\u20AC` : "\u2014"}
            </span>

            {/* Action button */}
            <div>
              {isSoldOut ? (
                <button
                  style={{
                    padding: "8px 20px",
                    borderRadius: 50,
                    border: `1.5px solid ${T.border}`,
                    background: T.bg2,
                    fontFamily: FONT2,
                    fontSize: 13,
                    fontWeight: 500,
                    color: T.sub,
                    cursor: "pointer",
                    transition: "all .3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = T.accent;
                    e.currentTarget.style.color = T.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.color = T.sub;
                  }}
                >
                  Avisame
                </button>
              ) : (
                <button
                  onClick={() => onBook(dep)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 50,
                    background: `linear-gradient(135deg, ${T.accent}, #0d8a8e)`,
                    color: "#fff",
                    border: "none",
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all .3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = `0 4px 16px ${T.accent}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Reservar
                  {dep.spots != null && dep.spots <= 3
                    ? ` (${dep.spots})`
                    : ""}
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 700px) {
          div[style*="grid-template-columns: 1.5fr 1fr 1fr 1fr 1.2fr"] {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
