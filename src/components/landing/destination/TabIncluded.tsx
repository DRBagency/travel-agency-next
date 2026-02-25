"use client";

import { useTranslations } from "next-intl";
import { useLandingTheme } from "../LandingThemeProvider";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface TabIncludedProps {
  included: string[];
  notIncluded: string[];
}

export function TabIncluded({ included, notIncluded }: TabIncludedProps) {
  const T = useLandingTheme();
  const t = useTranslations("landing.destino");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
      }}
    >
      {/* Included column */}
      {included.length > 0 && (
        <div
          style={{
            padding: 28,
            borderRadius: 20,
            background: T.greenBg,
            border: `1.5px solid ${T.greenBorder}`,
          }}
        >
          <h3
            style={{
              fontFamily: FONT,
              fontSize: 20,
              fontWeight: 700,
              color: T.greenText,
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: T.greenText + "18",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
              }}
            >
              {"\u2713"}
            </span>
            {t("included")}
          </h3>
          {included.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  color: T.greenText,
                  fontSize: 16,
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {"\u2713"}
              </span>
              <p
                style={{
                  fontFamily: FONT2,
                  color: T.greenText,
                  fontSize: 14,
                  margin: 0,
                  lineHeight: 1.5,
                  opacity: 0.85,
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Not included column */}
      {notIncluded.length > 0 && (
        <div
          style={{
            padding: 28,
            borderRadius: 20,
            background: T.redBg,
            border: `1.5px solid ${T.redBorder}`,
          }}
        >
          <h3
            style={{
              fontFamily: FONT,
              fontSize: 20,
              fontWeight: 700,
              color: T.redText,
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: T.redText + "18",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
              }}
            >
              {"\u2717"}
            </span>
            {t("notIncluded")}
          </h3>
          {notIncluded.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  color: T.redText,
                  fontSize: 16,
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {"\u2717"}
              </span>
              <p
                style={{
                  fontFamily: FONT2,
                  color: T.redText,
                  fontSize: 14,
                  margin: 0,
                  lineHeight: 1.5,
                  opacity: 0.85,
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Responsive: stack columns on mobile */}
      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
