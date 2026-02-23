"use client";

import { useTranslations } from "next-intl";
import { useLandingTheme } from "./LandingThemeProvider";
import { AnimateIn } from "./AnimateIn";

interface LandingStatsProps {
  statsYears?: number;
  statsDestinations?: number;
  statsTravelers?: number;
  statsRating?: number;
}

export function LandingStats({
  statsTravelers,
  statsDestinations,
  statsRating,
}: LandingStatsProps) {
  const T = useLandingTheme();
  const t = useTranslations("landing");

  const stats = [
    {
      icon: "\uD83C\uDF0D",
      value: statsTravelers
        ? `${Math.round(statsTravelers / 1000)}K+`
        : "15K+",
      label: t("stats.travelers"),
    },
    {
      icon: "\uD83D\uDCCD",
      value: statsDestinations?.toString() || "48",
      label: t("stats.uniqueDests"),
    },
    {
      icon: "\u2B50",
      value: statsRating?.toString() || "4.9",
      label: t("stats.avgRating"),
    },
    {
      icon: "\uD83D\uDC9A",
      value: "98%",
      label: t("stats.repeat"),
    },
  ];

  return (
    <section
      style={{
        background: T.bg2,
        borderBottom: `1px solid ${T.brd}`,
        padding: "52px 40px",
      }}
    >
      <div
        className="flex-responsive"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        {stats.map((s, i) => (
          <AnimateIn key={i} delay={i * 0.1} from="bottom">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                flex: 1,
              }}
            >
              <span style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</span>
              <span
                style={{
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                  fontSize: 30,
                  fontWeight: 700,
                  color: T.txt,
                  lineHeight: 1.2,
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                  fontSize: 13,
                  color: T.mut,
                  marginTop: 4,
                }}
              >
                {s.label}
              </span>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
