"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useLandingTheme } from "./LandingThemeProvider";
import { AnimateIn } from "./AnimateIn";

interface WhyUsItem {
  icon: string;
  title: string;
  desc: string;
}

interface LandingWhyUsProps {
  items?: WhyUsItem[];
}

export function LandingWhyUs({ items }: LandingWhyUsProps) {
  const T = useLandingTheme();
  const t = useTranslations("landing");

  const defaultItems: WhyUsItem[] = [
    {
      icon: "\uD83D\uDC65",
      title: t("whyus.card1Title"),
      desc: t("whyus.card1Desc"),
    },
    {
      icon: "\uD83D\uDD04",
      title: t("whyus.card2Title"),
      desc: t("whyus.card2Desc"),
    },
    {
      icon: "\uD83D\uDCB0",
      title: t("whyus.card3Title"),
      desc: t("whyus.card3Desc"),
    },
    {
      icon: "\uD83D\uDDFA\uFE0F",
      title: t("whyus.card4Title"),
      desc: t("whyus.card4Desc"),
    },
    {
      icon: "\uD83D\uDD12",
      title: t("whyus.card5Title"),
      desc: t("whyus.card5Desc"),
    },
    {
      icon: "\uD83D\uDCDE",
      title: t("whyus.card6Title"),
      desc: t("whyus.card6Desc"),
    },
  ];

  const cards = items && items.length > 0 ? items : defaultItems;

  return (
    <section
      id="why"
      style={{
        background: T.bg2,
        padding: "80px 24px",
        position: "relative",
      }}
    >
      {/* Section header */}
      <AnimateIn from="bottom">
        <div
          style={{
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto 48px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: T.accent,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              marginBottom: 12,
              display: "inline-block",
              background: `${T.accent}14`,
              padding: "6px 18px",
              borderRadius: 50,
              border: `1px solid ${T.accent}28`,
            }}
          >
            {t("whyus.badge")}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontSize: 38,
              fontWeight: 700,
              color: T.txt,
              lineHeight: 1.2,
              marginTop: 16,
            }}
          >
            {t("whyus.title")}{" "}
            <span style={{ color: T.accent }}>{t("whyus.titleHighlight")}</span>
          </h2>
        </div>
      </AnimateIn>

      {/* Cards grid */}
      <div
        className="grid-responsive"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {cards.map((card, i) => (
          <AnimateIn key={i} delay={i * 0.07} from="bottom">
            <WhyUsCard card={card} theme={T} />
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Card with hover effect (inline styles via onMouseEnter/onMouseLeave) */
/* ------------------------------------------------------------------ */

interface CardTheme {
  bg3: string;
  brd: string;
  txt: string;
  sub: string;
  accent: string;
  shadowHover: string;
}

function WhyUsCard({
  card,
  theme: T,
}: {
  card: WhyUsItem;
  theme: CardTheme;
}) {
  const [hovered, setHovered] = useState(false);

  const onEnter = useCallback(() => setHovered(true), []);
  const onLeave = useCallback(() => setHovered(false), []);

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        background: T.bg3,
        border: `1.5px solid ${hovered ? T.accent : T.brd}`,
        borderRadius: 20,
        padding: 26,
        transition: "all .4s cubic-bezier(.16,1,.3,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 20px 40px ${T.shadowHover}`
          : "0 2px 8px rgba(0,0,0,.04)",
        cursor: "default",
      }}
    >
      <div
        style={{
          fontSize: 32,
          marginBottom: 14,
          transition: "transform .3s",
          transform: hovered ? "scale(1.15)" : "scale(1)",
        }}
      >
        {card.icon}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-syne), 'Syne', sans-serif",
          fontSize: 17,
          fontWeight: 700,
          color: T.txt,
          marginBottom: 8,
          lineHeight: 1.3,
        }}
      >
        {card.title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
          fontSize: 13,
          color: T.sub,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {card.desc}
      </p>
    </div>
  );
}
