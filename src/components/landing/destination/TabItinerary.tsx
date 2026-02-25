"use client";

import { useTranslations } from "next-intl";
import { useLandingTheme } from "../LandingThemeProvider";
import { ItineraryMap } from "../ui/ItineraryMap";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

const PERIOD_CONFIG = [
  { key: "manana", icon: "☀️", color: "#f59e0b" },
  { key: "tarde", icon: "🌅", color: "#f97316" },
  { key: "noche", icon: "🌙", color: "#818cf8" },
] as const;

interface TabItineraryProps {
  rawItinerario: any;
  lang?: string;
}

export function TabItinerary({ rawItinerario }: TabItineraryProps) {
  const T = useLandingTheme();
  const t = useTranslations("landing.destino");

  // Normalize: handle both flat array and rich { dias: [...] } format
  const isRich =
    !Array.isArray(rawItinerario) && Array.isArray(rawItinerario?.dias);
  const dias: any[] = isRich
    ? rawItinerario.dias
    : Array.isArray(rawItinerario)
      ? rawItinerario
      : [];
  const tipsGenerales: string[] = isRich
    ? rawItinerario.tips_generales || rawItinerario.general_tips || []
    : [];
  const queLlevar: string[] = isRich
    ? rawItinerario.que_llevar || []
    : [];
  const mejorEpoca: string = isRich
    ? rawItinerario.mejor_epoca || ""
    : "";
  const climaText: string = isRich ? rawItinerario.clima || "" : "";

  // Build simplified data for the visual map
  const mapData = dias.map((d: any, i: number) => ({
    day: d.dia || d.day || i + 1,
    title: d.titulo || d.title || "",
  }));

  function periodLabel(key: string) {
    if (key === "manana") return t("morning");
    if (key === "tarde") return t("afternoon");
    return t("night");
  }

  return (
    <div>
      <h3
        style={{
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 800,
          marginBottom: 8,
          color: T.text,
        }}
      >
        {t("tabItinerary")}{" "}
        <span
          style={{
            fontFamily: FONT2,
            fontSize: 14,
            fontWeight: 400,
            color: T.muted,
          }}
        >
          {t("dayByDay")}
        </span>
      </h3>

      {/* Visual map at top */}
      <ItineraryMap itinerary={mapData} />

      {/* Summary row: best season + climate */}
      {(mejorEpoca || climaText) && (
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            marginBottom: 20,
            padding: "14px 20px",
            borderRadius: 14,
            background: T.bg2,
            border: `1.5px solid ${T.border}`,
          }}
        >
          {mejorEpoca && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>📅</span>
              <div>
                <div
                  style={{
                    fontFamily: FONT2,
                    fontSize: 11,
                    color: T.muted,
                    textTransform: "uppercase",
                    letterSpacing: ".5px",
                  }}
                >
                  {t("bestSeason")}
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 14,
                    fontWeight: 700,
                    color: T.text,
                  }}
                >
                  {mejorEpoca}
                </div>
              </div>
            </div>
          )}
          {climaText && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>🌤️</span>
              <div>
                <div
                  style={{
                    fontFamily: FONT2,
                    fontSize: 11,
                    color: T.muted,
                    textTransform: "uppercase",
                    letterSpacing: ".5px",
                  }}
                >
                  {t("climate")}
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 14,
                    fontWeight: 700,
                    color: T.text,
                  }}
                >
                  {climaText}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Day-by-day cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginTop: 12,
        }}
      >
        {dias.map((dia: any, i: number) => {
          const dayNum = dia.dia || dia.day || i + 1;
          const dayTitle = dia.titulo || dia.title || "";
          const actividades = dia.actividades || dia.activities || {};
          const tipLocal = dia.tip_local || "";
          const hasActivities = Object.keys(actividades).some(
            (k) => actividades[k]?.titulo || actividades[k]?.descripcion
          );
          // Flat format fallback
          const flatDesc = dia.description || dia.descripcion || "";

          return (
            <div
              key={i}
              style={{
                borderRadius: 20,
                background: T.bg2,
                border: `1.5px solid ${T.border}`,
                overflow: "hidden",
                transition: "box-shadow .3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 32px ${T.shadow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Day header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "18px 22px",
                  borderBottom: hasActivities
                    ? `1px solid ${T.border}`
                    : "none",
                }}
              >
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${T.accent}, ${T.accent}bb)`,
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 15,
                    flexShrink: 0,
                  }}
                >
                  {dayNum}
                </span>
                <h4
                  style={{
                    fontFamily: FONT,
                    fontSize: 18,
                    fontWeight: 700,
                    color: T.text,
                    margin: 0,
                  }}
                >
                  {dayTitle}
                </h4>
              </div>

              {/* Activities: morning / afternoon / night */}
              {hasActivities ? (
                <div style={{ padding: "16px 22px 8px" }}>
                  {PERIOD_CONFIG.map(({ key, icon, color }) => {
                    const act = actividades[key];
                    if (!act || (!act.titulo && !act.descripcion)) return null;
                    return (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          gap: 14,
                          marginBottom: 16,
                        }}
                      >
                        {/* Period icon + line */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flexShrink: 0,
                            width: 36,
                          }}
                        >
                          <span style={{ fontSize: 20 }}>{icon}</span>
                          <div
                            style={{
                              flex: 1,
                              width: 2,
                              background: `${color}30`,
                              marginTop: 6,
                              borderRadius: 1,
                            }}
                          />
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: 8,
                              flexWrap: "wrap",
                              marginBottom: 4,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: FONT2,
                                fontSize: 11,
                                fontWeight: 600,
                                color: color,
                                textTransform: "uppercase",
                                letterSpacing: ".5px",
                              }}
                            >
                              {periodLabel(key)}
                            </span>
                            {act.duracion && (
                              <span
                                style={{
                                  fontFamily: FONT2,
                                  fontSize: 11,
                                  color: T.muted,
                                }}
                              >
                                ⏱ {act.duracion}
                              </span>
                            )}
                            {act.precio_estimado && (
                              <span
                                style={{
                                  fontFamily: FONT,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: T.accent,
                                }}
                              >
                                {act.precio_estimado}
                              </span>
                            )}
                          </div>

                          {act.titulo && (
                            <div
                              style={{
                                fontFamily: FONT,
                                fontSize: 15,
                                fontWeight: 700,
                                color: T.text,
                                marginBottom: 3,
                              }}
                            >
                              {act.titulo}
                            </div>
                          )}

                          {act.descripcion && (
                            <p
                              style={{
                                fontFamily: FONT2,
                                fontSize: 13.5,
                                color: T.sub,
                                lineHeight: 1.6,
                                margin: 0,
                              }}
                            >
                              {act.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : flatDesc ? (
                <div style={{ padding: "14px 22px" }}>
                  <p
                    style={{
                      fontFamily: FONT2,
                      fontSize: 14,
                      color: T.sub,
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {flatDesc}
                  </p>
                </div>
              ) : null}

              {/* Local tip */}
              {tipLocal && (
                <div
                  style={{
                    margin: "0 22px 18px",
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: `${T.accent}0a`,
                    border: `1px solid ${T.accent}20`,
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
                    💡
                  </span>
                  <p
                    style={{
                      fontFamily: FONT2,
                      fontSize: 13,
                      color: T.sub,
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    <strong
                      style={{ color: T.accent, fontWeight: 600 }}
                    >
                      Tip:
                    </strong>{" "}
                    {tipLocal}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* General tips section */}
      {tipsGenerales.length > 0 && (
        <div
          style={{
            marginTop: 28,
            padding: "22px 24px",
            borderRadius: 18,
            background: T.bg2,
            border: `1.5px solid ${T.border}`,
          }}
        >
          <h4
            style={{
              fontFamily: FONT,
              fontSize: 17,
              fontWeight: 700,
              color: T.text,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 20 }}>📋</span>
            {t("generalTips")}
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {tipsGenerales.map((tip: string, i: number) => (
              <li
                key={i}
                style={{
                  fontFamily: FONT2,
                  fontSize: 14,
                  color: T.sub,
                  lineHeight: 1.6,
                  padding: "8px 0",
                  borderBottom:
                    i < tipsGenerales.length - 1
                      ? `1px solid ${T.border}`
                      : "none",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: T.accent, fontWeight: 700 }}>
                  {i + 1}.
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What to pack */}
      {queLlevar.length > 0 && (
        <div
          style={{
            marginTop: 16,
            padding: "22px 24px",
            borderRadius: 18,
            background: T.bg2,
            border: `1.5px solid ${T.border}`,
          }}
        >
          <h4
            style={{
              fontFamily: FONT,
              fontSize: 17,
              fontWeight: 700,
              color: T.text,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 20 }}>🎒</span>
            {t("whatToPack")}
          </h4>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {queLlevar.map((item: string, i: number) => (
              <span
                key={i}
                style={{
                  fontFamily: FONT2,
                  fontSize: 13,
                  color: T.sub,
                  padding: "6px 14px",
                  borderRadius: 50,
                  background: `${T.accent}10`,
                  border: `1px solid ${T.accent}20`,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
