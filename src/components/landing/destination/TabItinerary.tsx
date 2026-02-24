"use client";

import { useLandingTheme } from "../LandingThemeProvider";
import { ItineraryMap } from "../ui/ItineraryMap";
import { Img } from "../ui/Img";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface ItineraryDay {
  day: number;
  title: string;
  description?: string;
  image?: string;
}

interface TabItineraryProps {
  itinerary: ItineraryDay[];
  lang?: string;
}

export function TabItinerary({ itinerary, lang }: TabItineraryProps) {
  const T = useLandingTheme();

  const labels = {
    title: lang === "en" ? "Itinerary" : "Itinerario",
    dayByDay: lang === "en" ? "Day by day" : "Dia a dia",
    day: lang === "en" ? "Day" : "Dia",
  };

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
        {labels.title}{" "}
        <span
          style={{
            fontFamily: FONT2,
            fontSize: 14,
            fontWeight: 400,
            color: T.muted,
          }}
        >
          {" "}
          {labels.dayByDay}
        </span>
      </h3>

      {/* Visual map at top */}
      <ItineraryMap itinerary={itinerary} />

      {/* Day-by-day cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
        {itinerary.map((day, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 20,
              padding: 20,
              borderRadius: 18,
              background: T.bg2,
              border: `1.5px solid ${T.border}`,
              flexWrap: "wrap",
              transition: "box-shadow .3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 8px 32px ${T.shadow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Image (left side) */}
            {day.image && (
              <Img
                src={day.image}
                alt={day.title}
                isDark={T.mode === "dark"}
                style={{
                  width: 220,
                  height: 150,
                  borderRadius: 14,
                  flexShrink: 0,
                }}
              />
            )}

            {/* Text (right side) */}
            <div style={{ flex: 1, minWidth: 220 }}>
              {/* Day number badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${T.accent}, ${T.accent}bb)`,
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {day.day}
                </span>
                <h4
                  style={{
                    fontFamily: FONT,
                    fontSize: 17,
                    fontWeight: 700,
                    color: T.text,
                    margin: 0,
                  }}
                >
                  {day.title}
                </h4>
              </div>

              {day.description && (
                <p
                  style={{
                    fontFamily: FONT2,
                    fontSize: 14,
                    color: T.sub,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {day.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
