"use client";

import { useLandingTheme } from "../LandingThemeProvider";
import { AnimateIn } from "../ui/AnimateIn";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface CtaBannerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function CtaBanner({
  title = "¿Listo para tu proxima aventura?",
  description = "Reserva hoy y asegura tu plaza en los mejores destinos del mundo. Plazas limitadas, experiencias ilimitadas.",
  ctaText = "Reservar ahora",
  ctaLink = "#contact",
}: CtaBannerProps) {
  const T = useLandingTheme();

  const handleClick = () => {
    if (ctaLink.startsWith("#")) {
      const el = document.querySelector(ctaLink);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = ctaLink;
    }
  };

  return (
    <section style={{ padding: "40px 24px" }}>
      <AnimateIn from="scale">
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            background: `linear-gradient(135deg, ${T.accent}, ${T.accent}cc, ${T.accent}aa)`,
            borderRadius: 24,
            padding: "60px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,.08)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -40,
              left: -40,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "rgba(255,255,255,.06)",
              pointerEvents: "none",
            }}
          />

          <h2
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: "clamp(26px, 4vw, 38px)",
              color: "#fff",
              margin: 0,
              marginBottom: 16,
              letterSpacing: "-0.5px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {title}
          </h2>

          <p
            style={{
              fontFamily: FONT2,
              fontSize: 17,
              color: "rgba(255,255,255,.8)",
              margin: 0,
              marginBottom: 32,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.7,
              position: "relative",
              zIndex: 1,
            }}
          >
            {description}
          </p>

          <button
            onClick={handleClick}
            style={{
              background: T.lime,
              color: "#0f172a",
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 16,
              padding: "16px 40px",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              transition: "all .3s",
              boxShadow: "0 4px 20px rgba(0,0,0,.15)",
              letterSpacing: ".3px",
              position: "relative",
              zIndex: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.15)";
            }}
          >
            {ctaText}
          </button>
        </div>
      </AnimateIn>
    </section>
  );
}
