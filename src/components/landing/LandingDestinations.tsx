"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLandingTheme } from "./LandingThemeProvider";
import { AnimateIn } from "./AnimateIn";
import { Img } from "./Img";
import { GlowOrb } from "./GlowOrb";
import { TagChip } from "./TagChip";

interface Destino {
  id: string;
  slug?: string | null;
  nombre: string;
  ubicacion_corta?: string | null;
  categoria?: string | null;
  precio: number;
  duracion?: string | null;
  imagen_url?: string | null;
  tags?: string[];
}

interface LandingDestinationsProps {
  destinos: Destino[];
}

export function LandingDestinations({ destinos }: LandingDestinationsProps) {
  const T = useLandingTheme();
  const t = useTranslations("landing");

  if (!destinos.length) return null;

  return (
    <section
      id="destinations"
      style={{
        position: "relative",
        padding: "80px 24px",
        overflow: "hidden",
      }}
    >
      {/* Accent glow orb */}
      <GlowOrb
        color={T.accent}
        size={400}
        top="-100px"
        left="-120px"
        opacity={0.1}
      />

      {/* Section header */}
      <AnimateIn from="bottom">
        <div
          style={{
            textAlign: "center",
            maxWidth: 700,
            margin: "0 auto 48px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontSize: 38,
              fontWeight: 700,
              color: T.txt,
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            {t("destinations.exclusiveDests")}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
              fontSize: 17,
              color: T.sub,
              lineHeight: 1.6,
            }}
          >
            {t("destinations.nextAdventure")}{" "}
            <span style={{ color: T.accent, fontWeight: 600 }}>
              {t("destinations.awaitsYou")}
            </span>
          </p>
        </div>
      </AnimateIn>

      {/* Destination grid */}
      <div
        className="grid-responsive"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
          gap: 22,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {destinos.map((d, i) => {
          const cardHeight = i === 0 || i === 3 ? 460 : 400;
          const rating = "4.8";

          return (
            <AnimateIn key={d.id} delay={i * 0.08} from="bottom">
              <Link
                href={`/destino/${d.slug || d.id}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  className="dcard"
                  style={{
                    height: cardHeight,
                    position: "relative",
                    borderRadius: 24,
                    overflow: "hidden",
                  }}
                >
                  {/* Image */}
                  <Img
                    src={d.imagen_url}
                    alt={d.nombre}
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      inset: 0,
                    }}
                  />

                  {/* Overlay gradient */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: T.destOverlay,
                      zIndex: 1,
                    }}
                  />

                  {/* Rating badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      insetInlineEnd: 16,
                      zIndex: 2,
                      background: "rgba(0,0,0,.45)",
                      backdropFilter: "blur(10px)",
                      padding: "6px 12px",
                      borderRadius: 50,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#fff",
                      fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                    }}
                  >
                    <span style={{ color: "#facc15" }}>{"\u2605"}</span>
                    {rating}
                  </div>

                  {/* Tags */}
                  {d.tags && d.tags.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 16,
                        insetInlineStart: 16,
                        zIndex: 2,
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      {d.tags.slice(0, 2).map((tag) => (
                        <TagChip key={tag} label={tag} />
                      ))}
                    </div>
                  )}

                  {/* Bottom info */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      zIndex: 2,
                      padding: "20px 20px 22px",
                    }}
                  >
                    {/* Location */}
                    {d.ubicacion_corta && (
                      <p
                        style={{
                          fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                          fontSize: 12,
                          color: "rgba(255,255,255,.65)",
                          marginBottom: 4,
                          fontWeight: 500,
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                        }}
                      >
                        {"\uD83D\uDCCD"} {d.ubicacion_corta}
                      </p>
                    )}

                    {/* Name */}
                    <h3
                      style={{
                        fontFamily: "var(--font-syne), 'Syne', sans-serif",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#fff",
                        marginBottom: 10,
                        lineHeight: 1.25,
                      }}
                    >
                      {d.nombre}
                    </h3>

                    {/* Price + Duration row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                          fontSize: 15,
                          color: "#fff",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,.55)",
                          }}
                        >
                          {t("destinations.from")}{" "}
                        </span>
                        <span style={{ fontWeight: 700, color: T.accent }}>
                          {d.precio.toLocaleString()}&euro;
                        </span>
                      </span>

                      {d.duracion && (
                        <span
                          style={{
                            fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                            fontSize: 12,
                            color: "rgba(255,255,255,.55)",
                            background: "rgba(255,255,255,.1)",
                            padding: "4px 10px",
                            borderRadius: 50,
                          }}
                        >
                          {d.duracion}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </AnimateIn>
          );
        })}
      </div>
    </section>
  );
}
