"use client";

import { useTranslations } from "next-intl";
import { useLandingTheme } from "../LandingThemeProvider";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface FlightSegment {
  fecha?: string;
  hora_salida?: string;
  hora_llegada?: string;
  llegada_dia_siguiente?: boolean;
  origen_codigo?: string;
  origen_ciudad?: string;
  destino_codigo?: string;
  destino_ciudad?: string;
  duracion?: string;
  escalas?: string;
  aerolinea?: string;
  numero_vuelo?: string;
  clase?: string;
  equipaje?: string;
  estado?: string;
}

interface FlightsData {
  segmentos?: FlightSegment[];
  nota?: string;
  /* backward compat */
  aeropuerto_llegada?: string;
  aeropuerto_regreso?: string;
  arrival?: string;
  returnAirport?: string;
  notes?: string;
}

/** Normalize old or new vuelos format into segments array + nota */
export function normalizeFlights(raw: any): { segmentos: FlightSegment[]; nota: string } {
  if (!raw) return { segmentos: [], nota: "" };
  if (Array.isArray(raw.segmentos)) return { segmentos: raw.segmentos, nota: raw.nota || "" };
  // old format
  return { segmentos: [], nota: raw.nota || raw.notes || "" };
}

interface TabFlightProps {
  flights: FlightsData;
}

export function TabFlight({ flights }: TabFlightProps) {
  const T = useLandingTheme();
  const t = useTranslations("landing.destino");

  const { segmentos, nota } = normalizeFlights(flights);

  // Backward compat: if no segments but old fields, show old layout
  const arrival = flights?.aeropuerto_llegada || flights?.arrival;
  const returnAirport = flights?.aeropuerto_regreso || flights?.returnAirport;

  if (segmentos.length === 0 && !arrival && !returnAirport && !nota) return null;

  // Old format fallback
  if (segmentos.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <h3 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 800, color: T.text, margin: 0 }}>
          {"✈️"} {t("tabFlight")}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {arrival && (
            <div style={{ padding: 20, borderRadius: 16, background: T.bg2, border: `1.5px solid ${T.border}` }}>
              <p style={{ fontFamily: FONT2, color: T.muted, fontSize: 12, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>
                {t("arrivalAirport")}
              </p>
              <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 17, color: T.text, margin: 0 }}>
                {arrival}
              </p>
            </div>
          )}
          {returnAirport && (
            <div style={{ padding: 20, borderRadius: 16, background: T.bg2, border: `1.5px solid ${T.border}` }}>
              <p style={{ fontFamily: FONT2, color: T.muted, fontSize: 12, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>
                {t("returnAirport")}
              </p>
              <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 17, color: T.text, margin: 0 }}>
                {returnAirport}
              </p>
            </div>
          )}
        </div>
        {nota && (
          <p style={{
            fontFamily: FONT2, color: T.sub, fontSize: 14, lineHeight: 1.7, margin: 0,
            padding: "14px 18px", borderRadius: 12, background: T.accent + "08",
            borderLeft: `3px solid ${T.accent}`,
          }}>
            {nota}
          </p>
        )}
      </div>
    );
  }

  // New format: flight segment cards
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h3 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 800, color: T.text, margin: 0 }}>
        {"✈️"} {t("tabFlight")}
      </h3>

      {segmentos.map((seg, idx) => {
        const label = idx === 0 ? t("flightOutbound") : idx === 1 ? t("flightReturn") : `${t("tabFlight")} ${idx + 1}`;
        const isDirect = !seg.escalas || seg.escalas === "Directo" || seg.escalas === "Direct";

        return (
          <div
            key={idx}
            style={{
              borderRadius: 22,
              overflow: "hidden",
              border: `1.5px solid ${T.border}`,
              background: T.bg2,
            }}
          >
            {/* Header bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 24px",
                background: idx === 0 ? `${T.accent}12` : `${T.accent}08`,
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{idx === 0 ? "🛫" : "🛬"}</span>
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: T.text }}>
                  {label}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {seg.fecha && (
                  <span style={{ fontFamily: FONT2, fontSize: 13, fontWeight: 600, color: T.sub }}>
                    {seg.fecha}
                  </span>
                )}
                {seg.estado && seg.estado !== "OK" && (
                  <span style={{
                    padding: "3px 10px", borderRadius: 50, fontSize: 11, fontWeight: 700,
                    fontFamily: FONT2, background: "#f59e0b20", color: "#f59e0b",
                    border: "1px solid #f59e0b30",
                  }}>
                    {seg.estado}
                  </span>
                )}
              </div>
            </div>

            {/* Main flight card */}
            <div style={{ padding: 24 }}>
              {/* Route: Origin → Destination */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                {/* Origin */}
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 800, color: T.text, lineHeight: 1 }}>
                    {seg.origen_codigo || "---"}
                  </div>
                  <div style={{ fontFamily: FONT2, fontSize: 13, color: T.sub, marginTop: 4 }}>
                    {seg.origen_ciudad || ""}
                  </div>
                  {seg.hora_salida && (
                    <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: T.text, marginTop: 8 }}>
                      {seg.hora_salida}
                    </div>
                  )}
                </div>

                {/* Flight line */}
                <div style={{ flex: 1.5, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  {seg.duracion && (
                    <span style={{ fontFamily: FONT2, fontSize: 12, fontWeight: 600, color: T.muted }}>
                      {seg.duracion}
                    </span>
                  )}
                  <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, flexShrink: 0 }} />
                    <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${T.accent}, ${T.accent}60)`, position: "relative" }}>
                      <span style={{
                        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                        fontSize: 16,
                      }}>
                        {"✈️"}
                      </span>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, flexShrink: 0 }} />
                  </div>
                  <span style={{
                    fontFamily: FONT2, fontSize: 11, fontWeight: 600,
                    color: isDirect ? "#10b981" : "#f59e0b",
                  }}>
                    {isDirect ? t("flightDirect") : seg.escalas}
                  </span>
                </div>

                {/* Destination */}
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 800, color: T.text, lineHeight: 1 }}>
                    {seg.destino_codigo || "---"}
                  </div>
                  <div style={{ fontFamily: FONT2, fontSize: 13, color: T.sub, marginTop: 4 }}>
                    {seg.destino_ciudad || ""}
                  </div>
                  {seg.hora_llegada && (
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginTop: 8 }}>
                      <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: T.text }}>
                        {seg.hora_llegada}
                      </span>
                      {seg.llegada_dia_siguiente && (
                        <span style={{ fontFamily: FONT2, fontSize: 11, fontWeight: 700, color: "#f59e0b" }}>
                          +1
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Info badges row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {seg.aerolinea && (
                  <InfoBadge T={T} icon="🏢" label={seg.aerolinea} />
                )}
                {seg.numero_vuelo && (
                  <InfoBadge T={T} icon="🔢" label={seg.numero_vuelo} />
                )}
                {seg.clase && (
                  <InfoBadge T={T} icon="💺" label={seg.clase} />
                )}
                {seg.equipaje && (
                  <InfoBadge T={T} icon="🧳" label={seg.equipaje} />
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Notes */}
      {nota && (
        <p style={{
          fontFamily: FONT2, color: T.sub, fontSize: 14, lineHeight: 1.7, margin: 0,
          padding: "14px 18px", borderRadius: 12, background: T.accent + "08",
          borderLeft: `3px solid ${T.accent}`,
        }}>
          {nota}
        </p>
      )}
    </div>
  );
}

/* Small reusable info badge */
function InfoBadge({ T, icon, label }: { T: any; icon: string; label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 14px",
        borderRadius: 50,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: `var(--font-dm), DM Sans, sans-serif`,
        background: `${T.accent}10`,
        color: T.accent,
        border: `1px solid ${T.accent}18`,
      }}
    >
      <span style={{ fontSize: 13 }}>{icon}</span>
      {label}
    </span>
  );
}
