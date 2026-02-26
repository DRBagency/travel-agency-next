"use client";

import { useTranslations } from "next-intl";
import { useLandingTheme } from "../LandingThemeProvider";
import { AnimateIn } from "../ui/AnimateIn";
import Link from "next/link";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface Destino {
  id: string;
  slug: string;
  nombre: string;
  pais: string;
  precio: number;
  duracion: string;
  rating: number;
  imagen_url: string;
  badge?: string;
  tags?: string[];
}

interface DestinationsGridProps {
  destinos: Destino[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  destinationBasePath?: string;
}

export default function DestinationsGrid({
  destinos,
  sectionTitle,
  sectionSubtitle,
  destinationBasePath = "/destino",
}: DestinationsGridProps) {
  const T = useLandingTheme();
  const t = useTranslations('landing.destinations');

  return (
    <section id="destinos" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
              {sectionTitle || t('exclusiveDests')}
            </h2>
            <p
              style={{
                fontFamily: FONT2,
                fontSize: 17,
                color: T.sub,
                margin: 0,
                maxWidth: 500,
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: 1.6,
              }}
            >
              {sectionSubtitle || `${t('nextAdventure')} ${t('awaitsYou')}`}
            </p>
          </div>
        </AnimateIn>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
          className="destinations-grid"
        >
          {destinos.map((dest, i) => (
            <AnimateIn key={dest.id} delay={i * 0.1}>
              <Link
                href={`${destinationBasePath}/${dest.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="dest-card"
                  style={{
                    position: "relative",
                    borderRadius: 22,
                    overflow: "hidden",
                    cursor: "pointer",
                    height: 380,
                    transition: "all .5s cubic-bezier(.16,1,.3,1)",
                    boxShadow: `0 2px 12px ${T.shadow}`,
                  }}
                >
                  {/* Image */}
                  <img
                    src={dest.imagen_url}
                    alt={dest.nombre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform .6s",
                    }}
                  />

                  {/* Overlay gradient */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.25) 40%, transparent 70%)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Badge */}
                  {dest.badge && (
                    <div
                      style={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        background: `${T.accent}dd`,
                        color: "#fff",
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: 12,
                        padding: "5px 12px",
                        borderRadius: 8,
                        letterSpacing: ".3px",
                      }}
                    >
                      {dest.badge}
                    </div>
                  )}

                  {/* Price badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: T.lime,
                      color: "#0f172a",
                      fontFamily: FONT,
                      fontWeight: 800,
                      fontSize: 15,
                      padding: "6px 14px",
                      borderRadius: 10,
                      letterSpacing: "-.2px",
                    }}
                  >
                    {dest.precio.toLocaleString("es-ES")}€
                  </div>

                  {/* Bottom content */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "20px 22px",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: FONT,
                        fontWeight: 800,
                        fontSize: 22,
                        color: "#fff",
                        margin: 0,
                        marginBottom: 4,
                        letterSpacing: "-.3px",
                      }}
                    >
                      {dest.nombre}
                    </h3>
                    <p
                      style={{
                        fontFamily: FONT2,
                        fontSize: 14,
                        color: "rgba(255,255,255,.75)",
                        margin: 0,
                        marginBottom: 10,
                      }}
                    >
                      {dest.pais}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT2,
                          fontSize: 13,
                          color: "rgba(255,255,255,.7)",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        🕐 {dest.duracion}
                      </span>
                      <span
                        style={{
                          fontFamily: FONT2,
                          fontSize: 13,
                          color: "rgba(255,255,255,.7)",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        ⭐ {dest.rating}
                      </span>
                      {dest.tags && dest.tags.length > 0 && (
                        <span
                          style={{
                            fontFamily: FONT2,
                            fontSize: 11,
                            color: "rgba(255,255,255,.6)",
                            background: "rgba(255,255,255,.15)",
                            padding: "3px 8px",
                            borderRadius: 6,
                          }}
                        >
                          {dest.tags[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </div>

      <style>{`
        .destinations-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 1100px) {
          .destinations-grid {
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)) !important;
          }
          .destinations-grid .dest-card {
            height: 420px !important;
          }
        }
        @media (max-width: 640px) {
          .destinations-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
