"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useLandingTheme } from "./LandingThemeProvider";
import { AnimateIn } from "./AnimateIn";
import { GlowOrb } from "./GlowOrb";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Opinion {
  id: string;
  nombre: string;
  ciudad?: string | null;
  texto: string;
  rating: number;
  avatar_url?: string | null;
  fecha_display?: string | null;
}

interface Props {
  opiniones: Opinion[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const AVATAR_COLORS = [
  "linear-gradient(135deg,#1CABB0,#0d8a8e)",
  "linear-gradient(135deg,#E91E63,#c2185b)",
  "linear-gradient(135deg,#8B5CF6,#6d28d9)",
  "linear-gradient(135deg,#F59E0B,#d97706)",
  "linear-gradient(135deg,#10B981,#059669)",
];

function avatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LandingTestimonials({ opiniones }: Props) {
  const T = useLandingTheme();
  const t = useTranslations("landing");

  const [active, setActive] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const count = opiniones.length;

  const goTo = useCallback(
    (idx: number) => {
      if (idx === active) return;
      setOpacity(0);
      setTimeout(() => {
        setActive(idx);
        setOpacity(1);
      }, 300);
    },
    [active],
  );

  /* auto-advance every 5 s */
  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      goTo((active + 1) % count);
    }, 5000);
    return () => clearInterval(id);
  }, [active, count, goTo]);

  if (!opiniones || opiniones.length === 0) return null;

  const op = opiniones[active];

  return (
    <section
      id="test"
      style={{
        padding: "88px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* glow */}
      <GlowOrb color={T.lime} size={340} bottom="-80px" right="-80px" opacity={0.12} />

      <AnimateIn>
        {/* header */}
        <h2
          style={{
            fontFamily: "var(--font-syne), 'Syne', sans-serif",
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 700,
            textAlign: "center",
            color: T.txt,
            marginBottom: 48,
          }}
        >
          {t("testimonials.whatSay")}{" "}
          <span style={{ color: T.accent }}>{t("testimonials.ourTravelers")}</span>
        </h2>

        {/* card */}
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            background: T.bg2,
            borderRadius: 24,
            border: `1.5px solid ${T.brd}`,
            boxShadow: `0 8px 32px ${T.shadow}`,
            padding: 36,
            opacity,
            transition: "opacity .3s ease",
          }}
        >
          {/* big quote mark */}
          <div
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontSize: 72,
              lineHeight: 1,
              color: T.accent,
              opacity: 0.15,
              userSelect: "none",
              marginBottom: -20,
            }}
            aria-hidden="true"
          >
            &ldquo;
          </div>

          {/* stars */}
          <div style={{ marginBottom: 12, fontSize: 20, color: "#facc15" }}>
            {"★".repeat(Math.max(0, Math.min(5, Math.round(op.rating))))}
          </div>

          {/* quote text */}
          <p
            style={{
              fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
              fontStyle: "italic",
              fontSize: 17,
              lineHeight: 1.7,
              color: T.sub,
              marginBottom: 24,
            }}
          >
            {op.texto}
          </p>

          {/* author row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* avatar */}
            {op.avatar_url ? (
              <img
                src={op.avatar_url}
                alt={op.nombre}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: avatarGradient(op.nombre),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 17,
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                }}
              >
                {op.nombre.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <div
                style={{
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  color: T.txt,
                }}
              >
                {op.nombre}
              </div>
              {op.ciudad && (
                <div
                  style={{
                    fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                    fontSize: 13,
                    color: T.mut,
                  }}
                >
                  {op.ciudad}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* dots */}
        {count > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 28,
            }}
          >
            {opiniones.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === active ? 28 : 10,
                  height: 10,
                  borderRadius: 5,
                  border: "none",
                  cursor: "pointer",
                  background: i === active ? T.accent : T.brd,
                  transition: "all .3s ease",
                }}
              />
            ))}
          </div>
        )}
      </AnimateIn>
    </section>
  );
}
