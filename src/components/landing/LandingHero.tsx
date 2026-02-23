"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLandingTheme } from "./LandingThemeProvider";
import { AnimateIn } from "./AnimateIn";
import { GlowOrb } from "./GlowOrb";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  ctaTextSecondary?: string | null;
  ctaLinkSecondary?: string | null;
  primaryColor?: string | null;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LandingHero({
  badge,
  title,
  subtitle,
  description,
  imageUrl,
  ctaText,
  ctaLink,
  ctaTextSecondary,
  ctaLinkSecondary,
  primaryColor,
}: Props) {
  const T = useLandingTheme();
  const t = useTranslations("landing");

  const accent = primaryColor || T.accent;

  /* ---- parallax scroll state ---- */
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const parallaxScale = 1 + scrollY * 0.0003;

  /* ---- safe image url ---- */
  const safeImageUrl = (() => {
    if (typeof imageUrl !== "string") return null;
    const cleaned = imageUrl.trim();
    if (!cleaned) return null;
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
    if (cleaned.startsWith("/")) return cleaned;
    return null;
  })();

  /* ---- resolved content (props > i18n fallbacks) ---- */
  const resolvedBadge = badge || t("hero.defaultSub");
  const resolvedTitle1 = title || t("hero.defaultTitle1");
  const resolvedTitle2 = subtitle || t("hero.defaultTitle2");
  const resolvedDesc = description || t("hero.defaultDesc");
  const resolvedCtaText = ctaText || t("hero.explore");
  const resolvedCtaLink = ctaLink || "#destinos";
  const resolvedCtaSecondary = ctaTextSecondary || t("hero.learnMore");
  const resolvedCtaLinkSecondary = ctaLinkSecondary || "#why";
  const scrollLabel = t("hero.scroll");

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ========================= Background image + parallax ========================= */}
      {safeImageUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <img
            src={safeImageUrl}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${parallaxScale})`,
              transformOrigin: "center center",
              transition: "transform .1s linear",
            }}
          />
        </div>
      )}

      {/* ========================= Theme overlay ========================= */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: T.heroOverlay,
        }}
      />

      {/* ========================= Glow orbs ========================= */}
      <GlowOrb
        color={accent}
        size={600}
        top="-10%"
        right="-8%"
        opacity={0.12}
      />
      <GlowOrb
        color={T.lime}
        size={400}
        bottom="-5%"
        left="-6%"
        opacity={0.10}
      />

      {/* ========================= Content ========================= */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "120px 24px 100px",
          textAlign: "center" as const,
        }}
      >
        {/* Badge / Subtitle */}
        <AnimateIn delay={0.1}>
          <span
            style={{
              display: "inline-block",
              color: accent,
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase" as const,
              letterSpacing: 3,
              marginBottom: 20,
              fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
            }}
          >
            {resolvedBadge}
          </span>
        </AnimateIn>

        {/* Title */}
        <AnimateIn delay={0.3}>
          <h1
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontSize: "clamp(40px, 8vw, 80px)",
              fontWeight: 800,
              lineHeight: 1.08,
              color: T.txt,
              margin: "0 auto 24px",
              maxWidth: 900,
            }}
          >
            {resolvedTitle1}
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${accent}, ${T.lime})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {resolvedTitle2}
            </span>
          </h1>
        </AnimateIn>

        {/* Description */}
        <AnimateIn delay={0.5}>
          <p
            style={{
              fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
              fontSize: 18,
              lineHeight: 1.7,
              color: T.sub,
              maxWidth: 620,
              margin: "0 auto 44px",
            }}
          >
            {resolvedDesc}
          </p>
        </AnimateIn>

        {/* CTA Buttons */}
        <AnimateIn delay={0.7}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              flexWrap: "wrap" as const,
            }}
          >
            {/* Primary CTA */}
            <a
              href={resolvedCtaLink}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 36px",
                borderRadius: 50,
                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                color: "#fff",
                fontFamily: "var(--font-syne), 'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                textDecoration: "none",
                boxShadow: `0 8px 32px ${accent}40`,
                transition: "transform .25s, box-shadow .25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow = `0 14px 40px ${accent}55`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${accent}40`;
              }}
            >
              {resolvedCtaText}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>

            {/* Secondary CTA */}
            <a
              href={resolvedCtaLinkSecondary}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 36px",
                borderRadius: 50,
                background: "transparent",
                color: T.txt,
                fontFamily: "var(--font-syne), 'Syne', sans-serif",
                fontWeight: 600,
                fontSize: 16,
                textDecoration: "none",
                border: `2px solid ${T.brd}`,
                transition: "border-color .3s, background .3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = accent;
                (e.currentTarget as HTMLElement).style.background = `${accent}0a`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = T.brd;
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {resolvedCtaSecondary}
            </a>
          </div>
        </AnimateIn>
      </div>

      {/* ========================= Scroll indicator ========================= */}
      <div
        className="hide-mobile"
        style={{
          position: "absolute",
          bottom: 36,
          insetInlineStart: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          animation: "float 3s ease-in-out infinite",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase" as const,
            color: T.mut,
            fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
          }}
        >
          {scrollLabel}
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={T.mut}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* ========================= Float keyframe (scoped) ========================= */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-12px); }
        }
      `}</style>
    </section>
  );
}
