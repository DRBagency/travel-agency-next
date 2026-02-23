"use client";

import { useTranslations } from "next-intl";
import { useLandingTheme } from "./LandingThemeProvider";
import { AnimateIn } from "./AnimateIn";
import { GlowOrb } from "./GlowOrb";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  title?: string | null;
  description?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LandingCTABanner({
  title,
  description,
  ctaText,
  ctaLink,
}: Props) {
  const T = useLandingTheme();
  const t = useTranslations("landing");

  const resolvedTitle = title || t("ctaBanner.readyNext");
  const resolvedDescription = description || t("ctaBanner.tellUs");
  const resolvedCtaText = ctaText || t("ctaBanner.getQuote");
  const resolvedCtaLink = ctaLink || "#contact";

  return (
    <section style={{ padding: "40px 40px 0" }}>
      <AnimateIn from="scale">
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            borderRadius: 28,
            padding: "64px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            background: `linear-gradient(135deg, ${T.accent}, #0d8a8e, #0a6f72)`,
          }}
        >
          {/* glow orb */}
          <GlowOrb
            color={T.lime}
            size={260}
            top="-60px"
            right="-60px"
            opacity={0.18}
          />

          {/* title */}
          <h2
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontSize: "clamp(24px, 4vw, 40px)",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 16,
              position: "relative",
              zIndex: 1,
            }}
          >
            {resolvedTitle}
          </h2>

          {/* description */}
          <p
            style={{
              fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
              fontSize: 17,
              color: "rgba(255,255,255,.8)",
              maxWidth: 560,
              margin: "0 auto 32px",
              lineHeight: 1.6,
              position: "relative",
              zIndex: 1,
            }}
          >
            {resolvedDescription}
          </p>

          {/* CTA button */}
          <a
            href={resolvedCtaLink}
            style={{
              display: "inline-block",
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              background: T.lime,
              color: "#0c0f1a",
              padding: "14px 36px",
              borderRadius: 50,
              textDecoration: "none",
              transition: "transform .25s ease, box-shadow .25s ease",
              position: "relative",
              zIndex: 1,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(212,242,77,.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            {resolvedCtaText}
          </a>
        </div>
      </AnimateIn>
    </section>
  );
}
