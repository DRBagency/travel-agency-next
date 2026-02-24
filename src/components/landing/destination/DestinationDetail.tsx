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
import { makeTr } from "@/lib/translations";

/* eslint-disable @typescript-eslint/no-explicit-any */

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface DestinationDetailProps {
  destino: any;
  backUrl?: string;
  lang?: string;
  preferredLanguage?: string;
}

export function DestinationDetail({ destino, backUrl = "/", lang, preferredLanguage }: DestinationDetailProps) {
  const T = useLandingTheme();
  const [tab, setTab] = useState("itinerary");
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [initialDeparture, setInitialDeparture] = useState<any>(null);

  // Translation helper
  const dTr = makeTr(destino, lang || preferredLanguage || "es", preferredLanguage);

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
      {/* ═══════════════════ SUB-NAV BAR (below main Navbar) ═══════════════════ */}
      <div
        style={{
          position: "fixed",
          top: 70,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "10px 28px",
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
          href={backUrl}
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
          {"←"} Volver
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
          {dTr("nombre")}
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
          Reservar ahora {"→"}
        </button>
      </div>

      <div style={{ paddingTop: 116 }}>
        {/* ═══════════════════ HERO SECTION ═══════════════════ */}
        <div style={{ position: "relative" }}>
          {/* Main image */}
          {gallery.length > 0 && (
            <div style={{ position: "relative", height: 420, overflow: "hidden", borderRadius: "0 0 24px 24px" }}>
              <Img
                src={gallery[galleryIndex]}
                alt={destino.nombre}
                isDark={T.mode === "dark"}
                style={{ width: "100%", height: "100%" }}
              />
              {/* Dark overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: T.darkOverlay,
                }}
              />

              {/* Price badge — solid dark background for readability */}
              {destino.precio && (
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 24,
                    padding: "10px 20px",
                    borderRadius: 14,
                    background: "rgba(15,23,42,.82)",
                    backdropFilter: "blur(12px)",
                    border: `1px solid rgba(255,255,255,.12)`,
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
                        color: "rgba(255,255,255,.55)",
                        textDecoration: "line-through",
                      }}
                    >
                      {destino.precio_original}{"€"}
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
                    {destino.precio}{"€"}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT2,
                      fontSize: 11,
                      color: "rgba(255,255,255,.6)",
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
                    {destino.continente ? `${destino.continente} · ` : ""}
                    {destino.pais}
                  </span>
                )}
                <h1
                  style={{
                    fontFamily: FONT,
                    fontSize: "clamp(28px, 4.5vw, 48px)",
                    color: "#fff",
                    margin: "4px 0",
                    fontWeight: 800,
                    textShadow: "0 2px 20px rgba(0,0,0,.4)",
                  }}
                >
                  {dTr("nombre")}
                </h1>
                {(dTr("tagline") || destino.tagline) && (
                  <p
                    style={{
                      fontFamily: FONT2,
                      color: "rgba(255,255,255,.75)",
                      fontSize: 16,
                      margin: 0,
                    }}
                  >
                    {dTr("tagline")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Thumbnail strip */}
          {gallery.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                padding: "12px 24px",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {gallery.map((url: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setGalleryIndex(i)}
                  style={{
                    flexShrink: 0,
                    width: 80,
                    height: 56,
                    borderRadius: 10,
                    overflow: "hidden",
                    border: galleryIndex === i
                      ? `2.5px solid ${T.accent}`
                      : `1.5px solid ${T.border}`,
                    cursor: "pointer",
                    opacity: galleryIndex === i ? 1 : 0.65,
                    transition: "all .25s",
                    padding: 0,
                    background: "none",
                  }}
                >
                  <Img
                    src={url}
                    alt={`${destino.nombre} ${i + 1}`}
                    isDark={T.mode === "dark"}
                    style={{ width: "100%", height: "100%", borderRadius: 0 }}
                  />
                </button>
              ))}
            </div>
          )}
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
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
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
          {(dTr("descripcion_larga") || dTr("descripcion") || destino.descripcion_larga || destino.descripcion_corta) && (
            <p
              style={{
                fontFamily: FONT2,
                color: T.sub,
                fontSize: 16,
                lineHeight: 1.8,
                marginBottom: 32,
              }}
            >
              {dTr("descripcion_larga") || dTr("descripcion") || destino.descripcion_larga || destino.descripcion_corta}
            </p>
          )}

          {/* ═══════════════════ TAB NAVIGATION ═══════════════════ */}
          {allTabs.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 28,
              }}
            >
              {allTabs.map((tb) => {
                const isActive = tab === tb.id;
                return (
                  <button
                    key={tb.id}
                    onClick={() => setTab(tb.id)}
                    style={{
                      padding: "9px 16px",
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
                      transition: "all .3s",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
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
                  {"¿"}Listo para {dTr("nombre")}?
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
                  Por persona {"·"}{" "}
                  <strong style={{ color: T.lime }}>
                    {destino.precio}
                    {destino.moneda || "€"}
                  </strong>{" "}
                  {"·"} {destino.duracion}
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
                  Reservar ahora {"→"}
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
