"use client";

import { Fragment } from "react";
import { useLandingTheme } from "../LandingThemeProvider";

interface ItineraryDay {
  day: number;
  title: string;
  description?: string;
  image?: string;
}

export function ItineraryMap({ itinerary }: { itinerary: ItineraryDay[] }) {
  const T = useLandingTheme();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 0,
        overflowX: "auto",
        padding: "18px 0 28px",
      }}
    >
      {itinerary.map((day, i) => (
        <Fragment key={i}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 100,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${T.accent}, ${T.accent}bb)`,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-syne), Syne, sans-serif",
                fontWeight: 800,
                fontSize: 16,
                boxShadow: `0 2px 10px ${T.accent}35`,
              }}
            >
              {day.day}
            </div>
            <p
              style={{
                fontFamily: "var(--font-dm), DM Sans, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: T.sub,
                marginTop: 8,
                textAlign: "center",
                maxWidth: 100,
                lineHeight: 1.3,
              }}
            >
              {day.title}
            </p>
          </div>
          {i < itinerary.length - 1 && (
            <div
              style={{
                flex: "0 0 36px",
                height: 2,
                background: `linear-gradient(90deg, ${T.accent}, ${T.accent}30)`,
                marginTop: 21,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: -3,
                  top: -3.5,
                  width: 0,
                  height: 0,
                  borderTop: "5px solid transparent",
                  borderBottom: "5px solid transparent",
                  borderLeft: `7px solid ${T.accent}`,
                }}
              />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
