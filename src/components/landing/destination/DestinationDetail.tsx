"use client";

import { useState, useEffect, Fragment } from "react";
import { useLandingTheme } from "../LandingThemeProvider";
import { Img } from "../ui/Img";
import { TagChip } from "../ui/TagChip";
import { EffortDots } from "../ui/EffortDots";
import { AnimateIn } from "../ui/AnimateIn";
import { TabItinerary } from "./TabItinerary";
import { TabHotel } from "./TabHotel";
import { TabFlight } from "./TabFlight";
import { TabGallery } from "./TabGallery";
import { TabIncluded } from "./TabIncluded";
import { TabDepartures } from "./TabDepartures";
import { TabCoordinator } from "./TabCoordinator";
import { TabFaqs } from "./TabFaqs";
import BookingModal from "../booking/BookingModal";

/* eslint-disable @typescript-eslint/no-explicit-any */

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface DestinationDetailProps {
  destino: any;
}

export function DestinationDetail({ destino }: DestinationDetailProps) {
  const T = useLandingTheme();
  const [tab, setTab] = useState("itinerary");
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [initialDeparture, setInitialDeparture] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ── Parse JSONB fields safely ── */
  const gallery: string[] =
    Array.isArray(destino.galeria) && destino.galeria.length > 0
      ? destino.galeria
      : destino.imagen_url
        ? [destino.imagen_url]
        : [];

  const itinerary: any[] = Array.isArray(destino.itinerario)
    ? destino.itinerario
    : [];

  const hotel: any = destino.hotel || null;
  const flights: any = destino.vuelos || null;
  const included: string[] = Array.isArray(destino.incluido)
    ? destino.incluido
    : [];
  const notIncluded: string[] = Array.isArray(destino.no_incluido)
    ? destino.no_incluido
    : [];
  const departures: any[] = Array.isArray(destino.salidas)
    ? destino.salidas
    : [];
  const coordinator: any = destino.coordinador || null;
  const faqs: any[] = Array.isArray(destino.faqs) ? destino.faqs : [];
  const tags: string[] = Array.isArray(destino.tags) ? destino.tags : [];

  /* ── Tabs config ── */
  const allTabs = [
    { id: "itinerary", label: "Itinerario", icon: "\uD83D\uDDFA\uFE0F", show: itinerary.length > 0 },
    { id: "hotel", label: "Hotel", icon: "\uD83C\uDFE8", show: !!hotel },
    { id: "flight", label: "Vuelos", icon: "\u2708\uFE0F", show: !!flights },
    { id: "gallery", label: "Galeria", icon: "\uD83D\uDDBC\uFE0F", show: gallery.length > 1 },
    { id: "included", label: "Incluido", icon: "\u2705", show: included.length > 0 || notIncluded.length > 0 },
    { id: "departures", label: "Salidas", icon: "\uD83D\uDCC5", show: departures.length > 0 },
    { id: "coordinator", label: "Coordinador", icon: "\uD83D\uDC64", show: !!coordinator },
    { id: "faq", label: "FAQ", icon: "\u2753", show: faqs.length > 0 },
  ].filter((t) => t.show);

  // Set initial tab to first available
  useEffect(() => {
    if (allTabs.length > 0 && !allTabs.find((t) => t.id === tab)) {
      setTab(allTabs[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Booking handlers ── */
  const openBooking = (departure?: any) => {
    setInitialDeparture(departure || null);
    setBookingOpen(true);
  };

  const closeBooking = () => {
    setBookingOpen(false);
    setInitialDeparture(null);
  };

  /* ── Effort dots for quick stats ── */
  const ratingStars =
    destino.rating != null
      ? `${"★".repeat(Math.round(destino.rating))}${"☆".repeat(5 - Math.round(destino.rating))}`
      : null;

  return (
    <div style={{ minHeight: "100vh", color: T.text }}>
      {/* ═══════════════════ TOP BAR ═══════════════════ */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "12px 28px",
          background: T.glass,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Back button */}
        <a
          href="/"
          style={{
            fontFamily: FONT2,
            color: T.sub,
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "color .3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = T.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = T.sub;
          }}
        >
          {"\u2190"} Volver
        </a>

        {/* Destination name (center) */}
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 15,
            color: T.text,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {destino.nombre}
        </span>

        {/* CTA button */}
        <button
          onClick={() => openBooking()}
          style={{
            padding: "8px 22px",
            borderRadius: 50,
            background: `linear-gradient(135deg, ${T.accent}, #0d8a8e)`,
            color: "#fff",
            border: "none",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            transition: "all .3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 4px 16px ${T.accent}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Reservar ahora {"\u2192"}
        </button>
      </div>

      <div style={{ paddingTop: 64 }}>
        {/* ═══════════════════ HERO SECTION ═══════════════════ */}
        <div style={{ position: "relative", height: "54vh", minHeight: 380 }}>
          {gallery.length > 0 && (
            <Img
              src={gallery[galleryIndex]}
              alt={destino.nombre}
              isDark={T.mode === "dark"}
              style={{ width: "100%", height: "100%" }}
            />
          )}

          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: T.darkOverlay,
            }}
          />

          {/* Gallery navigation */}
          {gallery.length > 1 && (
            <>
              {/* Dots */}
              <div
                style={{
                  position: "absolute",
                  bottom: 100,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 8,
                  zIndex: 2,
                }}
              >
                {gallery.map((_: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIndex(i)}
                    style={{
                      width: galleryIndex === i ? 32 : 10,
                      height: 10,
                      borderRadius: 5,
                      border: "none",
                      cursor: "pointer",
                      background:
                        galleryIndex === i
                          ? T.accent
                          : "rgba(255,255,255,.45)",
                      transition: "all .3s",
                    }}
                  />
                ))}
              </div>

              {/* Prev arrow */}
              <button
                onClick={() =>
                  setGalleryIndex((p) =>
                    p > 0 ? p - 1 : gallery.length - 1
                  )
                }
                style={{
                  position: "absolute",
                  left: 16,
                  top: "40%",
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: T.glass,
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${T.border}`,
                  cursor: "pointer",
                  fontSize: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: T.text,
                  transition: "all .3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.accent;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = T.glass;
                  e.currentTarget.style.color = T.text;
                }}
              >
                {"\u2039"}
              </button>

              {/* Next arrow */}
              <button
                onClick={() =>
                  setGalleryIndex((p) =>
                    p < gallery.length - 1 ? p + 1 : 0
                  )
                }
                style={{
                  position: "absolute",
                  right: 16,
                  top: "40%",
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: T.glass,
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${T.border}`,
                  cursor: "pointer",
                  fontSize: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: T.text,
                  transition: "all .3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.accent;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = T.glass;
                  e.currentTarget.style.color = T.text;
                }}
              >
                {"\u203A"}
              </button>
            </>
          )}

          {/* Price badge */}
          {destino.precio && (
            <div
              style={{
                position: "absolute",
                top: 80,
                right: 24,
                padding: "10px 20px",
                borderRadius: 14,
                background: T.glass,
                backdropFilter: "blur(12px)",
                border: `1px solid ${T.border}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              {destino.precio_original && destino.precio_original > destino.precio && (
                <span
                  style={{
                    fontFamily: FONT2,
                    fontSize: 13,
                    color: T.muted,
                    textDecoration: "line-through",
                  }}
                >
                  {destino.precio_original}
                  {destino.moneda || "\u20AC"}
                </span>
              )}
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 22,
                  color: T.lime,
                }}
              >
                {destino.precio}
                {destino.moneda || "\u20AC"}
              </span>
              <span
                style={{
                  fontFamily: FONT2,
                  fontSize: 11,
                  color: T.muted,
                }}
              >
                por persona
              </span>
            </div>
          )}

          {/* Title overlay at bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              padding: "0 36px",
              zIndex: 2,
            }}
          >
            {destino.pais && (
              <span
                style={{
                  fontFamily: FONT2,
                  color: T.accent,
                  fontSize: 13,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {destino.continente ? `${destino.continente} \u00B7 ` : ""}
                {destino.pais}
              </span>
            )}
            <h1
              style={{
                fontFamily: FONT,
                fontSize: "clamp(30px, 5vw, 52px)",
                color: "#fff",
                margin: "4px 0",
                fontWeight: 800,
                textShadow: "0 2px 20px rgba(0,0,0,.3)",
              }}
            >
              {destino.nombre}
            </h1>
            {destino.tagline && (
              <p
                style={{
                  fontFamily: FONT2,
                  color: "rgba(255,255,255,.75)",
                  fontSize: 16,
                  margin: 0,
                }}
              >
                {destino.tagline}
              </p>
            )}
          </div>
        </div>

        {/* ═══════════════════ MAIN CONTENT ═══════════════════ */}
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            padding: "20px 24px 80px",
          }}
        >
          {/* ── Quick Stats Row ── */}
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 24,
              padding: "18px 24px",
              borderRadius: 18,
              background: T.bg2,
              border: `1.5px solid ${T.border}`,
            }}
          >
            {[
              {
                value: destino.duracion || "",
                sub: "Duracion",
                icon: "\u23F1\uFE0F",
              },
              {
                value: ratingStars
                  ? `${destino.rating}`
                  : null,
                sub: destino.reviews
                  ? `${destino.reviews} opiniones`
                  : "Rating",
                icon: "\u2B50",
                color: "#f59e0b",
              },
              {
                value: destino.grupo_max
                  ? `${destino.grupo_max} max`
                  : null,
                sub: "Grupo",
                icon: "\uD83D\uDC65",
              },
              {
                value:
                  destino.edad_min != null && destino.edad_max != null
                    ? `${destino.edad_min}-${destino.edad_max}`
                    : null,
                sub: "Rango de edad",
                icon: "\uD83C\uDF82",
              },
            ]
              .filter((s) => s.value)
              .map((stat, i, arr) => (
                <Fragment key={i}>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 100,
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: FONT,
                        color: stat.color || T.text,
                        fontSize: 18,
                        fontWeight: 800,
                        margin: 0,
                      }}
                    >
                      {stat.icon}{" "}
                      {stat.value}
                    </p>
                    <p
                      style={{
                        fontFamily: FONT2,
                        color: T.muted,
                        fontSize: 11,
                        margin: "3px 0 0",
                      }}
                    >
                      {stat.sub}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      style={{
                        width: 1,
                        alignSelf: "stretch",
                        background: T.border,
                      }}
                    />
                  )}
                </Fragment>
              ))}

            {/* Effort dots inline */}
            {destino.esfuerzo && (
              <>
                <div
                  style={{
                    width: 1,
                    alignSelf: "stretch",
                    background: T.border,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    minWidth: 100,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <EffortDots level={destino.esfuerzo} />
                  <p
                    style={{
                      fontFamily: FONT2,
                      color: T.muted,
                      fontSize: 11,
                      margin: "5px 0 0",
                    }}
                  >
                    Esfuerzo fisico
                  </p>
                </div>
              </>
            )}
          </div>

          {/* ── Tags Row ── */}
          {tags.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              {tags.map((tag: string) => (
                <TagChip key={tag} label={tag} />
              ))}
            </div>
          )}

          {/* ── Description ── */}
          {(destino.descripcion_larga || destino.descripcion_corta) && (
            <p
              style={{
                fontFamily: FONT2,
                color: T.sub,
                fontSize: 16,
                lineHeight: 1.8,
                marginBottom: 32,
              }}
            >
              {destino.descripcion_larga || destino.descripcion_corta}
            </p>
          )}

          {/* ═══════════════════ TAB NAVIGATION ═══════════════════ */}
          {allTabs.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 28,
                overflowX: "auto",
                paddingBottom: 6,
                WebkitOverflowScrolling: "touch",
              }}
            >
              {allTabs.map((tb) => {
                const isActive = tab === tb.id;
                return (
                  <button
                    key={tb.id}
                    onClick={() => setTab(tb.id)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 50,
                      border: isActive
                        ? `2px solid ${T.accent}`
                        : `1.5px solid ${T.border}`,
                      background: isActive ? T.accent + "15" : T.bg2,
                      color: isActive ? T.accent : T.sub,
                      fontFamily: FONT,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      transition: "all .3s",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = T.accent + "60";
                        e.currentTarget.style.color = T.accent;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = T.border;
                        e.currentTarget.style.color = T.sub;
                      }
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{tb.icon}</span>
                    {tb.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* ═══════════════════ TAB CONTENT ═══════════════════ */}
          <div style={{ minHeight: 200 }}>
            {tab === "itinerary" && itinerary.length > 0 && (
              <TabItinerary itinerary={itinerary} />
            )}

            {tab === "hotel" && hotel && <TabHotel hotel={hotel} />}

            {tab === "flight" && flights && <TabFlight flights={flights} />}

            {tab === "gallery" && gallery.length > 1 && (
              <TabGallery
                gallery={gallery}
                destinationName={destino.nombre}
              />
            )}

            {tab === "included" &&
              (included.length > 0 || notIncluded.length > 0) && (
                <TabIncluded
                  included={included}
                  notIncluded={notIncluded}
                />
              )}

            {tab === "departures" && departures.length > 0 && (
              <TabDepartures
                departures={departures}
                onBook={(dep) => openBooking(dep)}
              />
            )}

            {tab === "coordinator" && coordinator && (
              <TabCoordinator coordinator={coordinator} />
            )}

            {tab === "faq" && faqs.length > 0 && <TabFaqs faqs={faqs} />}
          </div>

          {/* ═══════════════════ BOTTOM CTA ═══════════════════ */}
          <div style={{ marginTop: 48 }}>
            <AnimateIn from="scale">
              <div
                style={{
                  padding: 40,
                  borderRadius: 24,
                  background: `linear-gradient(135deg, ${T.accent}, #0d8a8e)`,
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Decorative circle */}
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 160,
                    height: 160,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,.08)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -30,
                    left: -30,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,.05)",
                  }}
                />

                <h2
                  style={{
                    fontFamily: FONT,
                    fontSize: "clamp(22px, 4vw, 36px)",
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: 10,
                    position: "relative",
                  }}
                >
                  {"\u00BF"}Listo para {destino.nombre}?
                </h2>
                <p
                  style={{
                    fontFamily: FONT2,
                    color: "rgba(255,255,255,.8)",
                    fontSize: 15,
                    marginBottom: 28,
                    position: "relative",
                  }}
                >
                  Por persona {"\u00B7"}{" "}
                  <strong style={{ color: T.lime }}>
                    {destino.precio}
                    {destino.moneda || "\u20AC"}
                  </strong>{" "}
                  {"\u00B7"} {destino.duracion}
                </p>
                <button
                  onClick={() => openBooking()}
                  style={{
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 16,
                    padding: "16px 48px",
                    borderRadius: 50,
                    background: T.lime,
                    color: "#0f172a",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 24px rgba(212,242,77,.4)",
                    transition: "all .3s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(212,242,77,.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow =
                      "0 4px 24px rgba(212,242,77,.4)";
                  }}
                >
                  Reservar ahora {"\u2192"}
                </button>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>

      {/* ═══════════════════ BOOKING MODAL ═══════════════════ */}
      {bookingOpen && (
        <BookingModal
          destination={destino}
          initialDeparture={initialDeparture}
          onClose={closeBooking}
        />
      )}

      {/* ═══════════════════ RESPONSIVE STYLES ═══════════════════ */}
      <style>{`
        @media (max-width: 768px) {
          /* Stack stats vertically on small screens */
          div[style*="flex-wrap: wrap"][style*="padding: 18px 24px"] {
            flex-direction: column;
            align-items: stretch;
          }
          div[style*="flex-wrap: wrap"][style*="padding: 18px 24px"] > div[style*="width: 1"] {
            width: 100% !important;
            height: 1px;
          }
        }
      `}</style>
    </div>
  );
}
