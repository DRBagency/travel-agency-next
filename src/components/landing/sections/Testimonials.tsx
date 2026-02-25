"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useLandingTheme } from "../LandingThemeProvider";
import { AnimateIn } from "../ui/AnimateIn";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface Opinion {
  nombre: string;
  texto: string;
  destino?: string;
  rating: number;
  avatar_url?: string;
  color?: string;
}

interface TestimonialsProps {
  opiniones: Opinion[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  autoPlayInterval?: number;
}

const INITIAL_COLORS = [
  "#1CABB0",
  "#D4F24D",
  "#E91E63",
  "#FF9800",
  "#9C27B0",
  "#2196F3",
  "#4CAF50",
  "#F44336",
];

export default function Testimonials({
  opiniones,
  sectionTitle,
  sectionSubtitle,
  autoPlayInterval = 5000,
}: TestimonialsProps) {
  const t = useTranslations('landing.testimonials');
  const T = useLandingTheme();
  const resolvedTitle = sectionTitle || `${t('whatSay')} ${t('ourTravelers')}`;
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const count = opiniones.length;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + count) % count);
  }, [count]);

  // Auto-rotate
  useEffect(() => {
    if (count <= 1 || isHovered) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [count, next, autoPlayInterval, isHovered]);

  if (count === 0) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          color: i < rating ? "#facc15" : T.muted,
          fontSize: 16,
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <section id="testimonials" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Section heading */}
        <AnimateIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: "clamp(28px, 4vw, 42px)",
                color: T.text,
                margin: 0,
                marginBottom: 12,
                letterSpacing: "-0.5px",
              }}
            >
              {resolvedTitle}
            </h2>
            {sectionSubtitle && (
              <p
                style={{
                  fontFamily: FONT2,
                  fontSize: 17,
                  color: T.sub,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {sectionSubtitle}
              </p>
            )}
          </div>
        </AnimateIn>

        {/* Carousel */}
        <AnimateIn>
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Card container */}
            <div
              style={{
                overflow: "hidden",
                borderRadius: 22,
              }}
            >
              <div
                style={{
                  display: "flex",
                  transition: "transform .5s cubic-bezier(.16,1,.3,1)",
                  transform: `translateX(-${current * 100}%)`,
                }}
              >
                {opiniones.map((op, i) => {
                  const initial = op.nombre.charAt(0).toUpperCase();
                  const bgColor =
                    op.color || INITIAL_COLORS[i % INITIAL_COLORS.length];

                  return (
                    <div
                      key={i}
                      style={{
                        minWidth: "100%",
                        padding: "0 4px",
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          background: T.bg2,
                          border: `1px solid ${T.border}`,
                          borderRadius: 22,
                          padding: 32,
                          textAlign: "center",
                        }}
                      >
                        {/* Avatar / initial */}
                        {op.avatar_url ? (
                          <img
                            src={op.avatar_url}
                            alt={op.nombre}
                            style={{
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                              objectFit: "cover",
                              margin: "0 auto 16px",
                              display: "block",
                              border: `3px solid ${T.border}`,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                              background: bgColor,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 16px",
                              fontFamily: FONT,
                              fontWeight: 800,
                              fontSize: 26,
                              color: "#fff",
                            }}
                          >
                            {initial}
                          </div>
                        )}

                        {/* Stars */}
                        <div style={{ marginBottom: 16 }}>
                          {renderStars(op.rating)}
                        </div>

                        {/* Text */}
                        <p
                          style={{
                            fontFamily: FONT2,
                            fontSize: 16,
                            color: T.text,
                            lineHeight: 1.7,
                            margin: 0,
                            marginBottom: 20,
                            fontStyle: "italic",
                            maxWidth: 560,
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        >
                          &ldquo;{op.texto}&rdquo;
                        </p>

                        {/* Name */}
                        <div
                          style={{
                            fontFamily: FONT,
                            fontWeight: 700,
                            fontSize: 16,
                            color: T.text,
                            marginBottom: 4,
                          }}
                        >
                          {op.nombre}
                        </div>

                        {/* Trip info */}
                        {op.destino && (
                          <div
                            style={{
                              fontFamily: FONT2,
                              fontSize: 13,
                              color: T.muted,
                            }}
                          >
                            {t('tripTo', { destination: op.destino })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation arrows */}
            {count > 1 && (
              <>
                <button
                  onClick={prev}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: -16,
                    transform: "translateY(-50%)",
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: T.bg2,
                    border: `1px solid ${T.border}`,
                    boxShadow: `0 4px 16px ${T.shadow}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all .3s",
                    zIndex: 2,
                  }}
                  className="testimonial-nav-btn"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = T.accent;
                    e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.transform = "translateY(-50%)";
                  }}
                  aria-label="Previous testimonial"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={T.text}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <button
                  onClick={next}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: -16,
                    transform: "translateY(-50%)",
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: T.bg2,
                    border: `1px solid ${T.border}`,
                    boxShadow: `0 4px 16px ${T.shadow}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all .3s",
                    zIndex: 2,
                  }}
                  className="testimonial-nav-btn"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = T.accent;
                    e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.transform = "translateY(-50%)";
                  }}
                  aria-label="Next testimonial"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={T.text}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}

            {/* Dots */}
            {count > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 24,
                }}
              >
                {opiniones.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    style={{
                      width: i === current ? 28 : 10,
                      height: 10,
                      borderRadius: 5,
                      background: i === current ? T.accent : T.border,
                      border: "none",
                      cursor: "pointer",
                      transition: "all .3s",
                      padding: 0,
                    }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </AnimateIn>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .testimonial-nav-btn {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
