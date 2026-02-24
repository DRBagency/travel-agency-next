"use client";

import { useLandingTheme } from "../LandingThemeProvider";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface Flights {
  arrival?: string;
  returnAirport?: string;
  notes?: string;
}

interface TabFlightProps {
  flights: Flights;
}

export function TabFlight({ flights }: TabFlightProps) {
  const T = useLandingTheme();

  return (
    <div
      style={{
        borderRadius: 22,
        padding: 36,
        background: T.bg2,
        border: `1.5px solid ${T.border}`,
      }}
    >
      {/* Airport cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* Arrival */}
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            background: T.bg,
            border: `1px solid ${T.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{"✈️"}</span>
            <p
              style={{
                fontFamily: FONT2,
                color: T.muted,
                fontSize: 12,
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                fontWeight: 600,
              }}
            >
              Aeropuerto de llegada
            </p>
          </div>
          <p
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 17,
              color: T.text,
              margin: 0,
            }}
          >
            {flights.arrival || "\u2014"}
          </p>
        </div>

        {/* Return */}
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            background: T.bg,
            border: `1px solid ${T.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20, display: "inline-block", transform: "scaleX(-1)" }}>
              {"✈️"}
            </span>
            <p
              style={{
                fontFamily: FONT2,
                color: T.muted,
                fontSize: 12,
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                fontWeight: 600,
              }}
            >
              Aeropuerto de regreso
            </p>
          </div>
          <p
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 17,
              color: T.text,
              margin: 0,
            }}
          >
            {flights.returnAirport || "\u2014"}
          </p>
        </div>
      </div>

      {/* Notes */}
      {flights.notes && (
        <p
          style={{
            fontFamily: FONT2,
            color: T.sub,
            fontSize: 14,
            lineHeight: 1.7,
            marginBottom: 24,
            padding: "14px 18px",
            borderRadius: 12,
            background: T.accent + "08",
            borderLeft: `3px solid ${T.accent}`,
          }}
        >
          {flights.notes}
        </p>
      )}

      {/* Search flight button */}
      <button
        style={{
          padding: "12px 28px",
          borderRadius: 50,
          background: T.bg2,
          border: `1.5px solid ${T.accent}`,
          color: T.accent,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          transition: "all .3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = T.accent;
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = T.bg2;
          e.currentTarget.style.color = T.accent;
        }}
      >
        {"🔍"} Buscar vuelo
      </button>
    </div>
  );
}
