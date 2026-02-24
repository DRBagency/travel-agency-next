"use client";

import { useLandingTheme } from "../LandingThemeProvider";
import { AnimateIn } from "../ui/AnimateIn";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface HeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaTextSecondary?: string;
  ctaLinkSecondary?: string;
  primaryColor?: string;
  stats?: {
    travelers?: string;
    rating?: string;
  };
}

export default function Hero({
  badge = "Agencia Premium",
  title,
  subtitle,
  description,
  imageUrl = "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
  ctaText = "Reservar ahora",
  ctaLink = "#contact",
  ctaTextSecondary = "Ver destinos",
  ctaLinkSecondary = "#destinos",
  primaryColor,
  stats,
}: HeroProps) {
  const T = useLandingTheme();
  const accent = primaryColor || T.accent;

  const handleClick = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  };

  return (
    <section
      style={{
        paddingTop: 120,
        paddingBottom: 80,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative orbs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "-5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}15, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
          animation: "orbFloat1 12s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "-8%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${T.lime}12, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
          animation: "orbFloat2 15s ease-in-out infinite",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* LEFT */}
        <div>
          <AnimateIn delay={0}>
            {badge && (
              <span
                style={{
                  display: "inline-block",
                  background: `${accent}18`,
                  color: accent,
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 13,
                  padding: "6px 16px",
                  borderRadius: 30,
                  letterSpacing: ".5px",
                  marginBottom: 20,
                  border: `1px solid ${accent}30`,
                }}
              >
                {badge}
              </span>
            )}
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <h1
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: "clamp(34px, 5vw, 56px)",
                lineHeight: 1.08,
                color: T.text,
                margin: 0,
                marginBottom: subtitle ? 12 : 20,
                letterSpacing: "-1px",
              }}
            >
              {title}
            </h1>
          </AnimateIn>

          {subtitle && (
            <AnimateIn delay={0.15}>
              <p
                style={{
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  color: accent,
                  margin: 0,
                  marginBottom: 16,
                  lineHeight: 1.3,
                }}
              >
                {subtitle}
              </p>
            </AnimateIn>
          )}

          {description && (
            <AnimateIn delay={0.2}>
              <p
                style={{
                  fontFamily: FONT2,
                  fontWeight: 400,
                  fontSize: 17,
                  color: T.sub,
                  margin: 0,
                  marginBottom: 32,
                  lineHeight: 1.7,
                  maxWidth: 480,
                }}
              >
                {description}
              </p>
            </AnimateIn>
          )}

          <AnimateIn delay={0.3}>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {/* Primary CTA */}
              <button
                onClick={() => handleClick(ctaLink)}
                style={{
                  background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                  color: "#fff",
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "14px 32px",
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  transition: "all .3s",
                  boxShadow: `0 4px 20px ${accent}33`,
                  letterSpacing: ".3px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 8px 30px ${accent}44`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = `0 4px 20px ${accent}33`;
                }}
              >
                {ctaText}
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => handleClick(ctaLinkSecondary)}
                style={{
                  background: "transparent",
                  color: T.text,
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "14px 32px",
                  borderRadius: 14,
                  border: `2px solid ${T.border}`,
                  cursor: "pointer",
                  transition: "all .3s",
                  letterSpacing: ".3px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.color = accent;
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.color = T.text;
                  e.currentTarget.style.transform = "none";
                }}
              >
                {ctaTextSecondary}
              </button>
            </div>
          </AnimateIn>
        </div>

        {/* RIGHT - Hero Image with floating cards */}
        <AnimateIn delay={0.2} from="right">
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: 28,
                overflow: "hidden",
                boxShadow: `0 20px 60px ${T.shadow}`,
                aspectRatio: "4/5",
                maxHeight: 560,
              }}
            >
              <img
                src={imageUrl}
                alt="Hero destination"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            {/* Floating rating card */}
            {stats?.rating && (
              <div
                style={{
                  position: "absolute",
                  top: 28,
                  right: -20,
                  background: T.bg2,
                  borderRadius: 16,
                  padding: "14px 20px",
                  boxShadow: `0 8px 32px ${T.shadow}`,
                  border: `1px solid ${T.border}`,
                  animation: "float 4s ease-in-out infinite",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  zIndex: 2,
                }}
                className="hero-floating-card"
              >
                <span style={{ fontSize: 24 }}>⭐</span>
                <div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontWeight: 800,
                      fontSize: 20,
                      color: T.text,
                      lineHeight: 1,
                    }}
                  >
                    {stats.rating}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT2,
                      fontSize: 12,
                      color: T.muted,
                      marginTop: 2,
                    }}
                  >
                    Valoracion
                  </div>
                </div>
              </div>
            )}

            {/* Floating travelers card */}
            {stats?.travelers && (
              <div
                style={{
                  position: "absolute",
                  bottom: 40,
                  left: -20,
                  background: T.bg2,
                  borderRadius: 16,
                  padding: "14px 20px",
                  boxShadow: `0 8px 32px ${T.shadow}`,
                  border: `1px solid ${T.border}`,
                  animation: "float 5s ease-in-out infinite 1s",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  zIndex: 2,
                }}
                className="hero-floating-card"
              >
                <span style={{ fontSize: 24 }}>🌍</span>
                <div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontWeight: 800,
                      fontSize: 20,
                      color: T.text,
                      lineHeight: 1,
                    }}
                  >
                    {stats.travelers}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT2,
                      fontSize: 12,
                      color: T.muted,
                      marginTop: 2,
                    }}
                  >
                    Viajeros felices
                  </div>
                </div>
              </div>
            )}
          </div>
        </AnimateIn>
      </div>

      {/* Responsive styles */}
      <style>{`
        .hero-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 868px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }
          .hero-grid > div:first-child { order: 1; }
          .hero-grid > div:last-child { order: 0; }
          .hero-floating-card {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
