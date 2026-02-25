"use client";

import { useState, useEffect, Fragment } from "react";
import { useTranslations, NextIntlClientProvider } from "next-intl";
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
import Footer from "../sections/Footer";
import Navbar from "../sections/Navbar";
import { makeTr } from "@/lib/translations";

/* eslint-disable @typescript-eslint/no-explicit-any */

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface DestinationDetailProps {
  destino: any;
  backUrl?: string;
  lang?: string;
  preferredLanguage?: string;
  clientName?: string;
  logoUrl?: string | null;
  primaryColor?: string;
  darkModeEnabled?: boolean;
  availableLanguages?: string[];
  homeUrl?: string;
  footerDescription?: string;
  allDestinos?: any[];
  paginasLegales?: any[];
  legalBasePath?: string;
  destinationBasePath?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  allMessages?: Record<string, any>;
}

export function DestinationDetail(props: DestinationDetailProps) {
  const {
    lang,
    preferredLanguage,
    allMessages,
  } = props;

  const [currentLang, setCurrentLang] = useState<string>(lang || preferredLanguage || "es");

  // Dynamic i18n provider for language switching
  const currentMessages = allMessages?.[currentLang] || allMessages?.[lang || "es"] || undefined;

  const handleLangChange = (l: string) => {
    const newLang = l.toLowerCase();
    setCurrentLang(newLang);
    document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;
  };

  // Wrap in provider so inner component reads correct locale
  if (currentMessages) {
    return (
      <NextIntlClientProvider locale={currentLang} messages={currentMessages} key={currentLang}>
        <DestinationDetailInner {...props} currentLang={currentLang} onLangChange={handleLangChange} />
      </NextIntlClientProvider>
    );
  }

  return <DestinationDetailInner {...props} currentLang={currentLang} onLangChange={handleLangChange} />;
}

function DestinationDetailInner({
  destino,
  backUrl = "/",
  preferredLanguage,
  clientName,
  logoUrl,
  primaryColor,
  darkModeEnabled = true,
  availableLanguages = [],
  homeUrl = "/",
  footerDescription,
  allDestinos = [],
  paginasLegales = [],
  legalBasePath = "/legal",
  destinationBasePath = "/destino",
  instagramUrl,
  facebookUrl,
  tiktokUrl,
  currentLang,
  onLangChange,
}: DestinationDetailProps & { currentLang: string; onLangChange: (l: string) => void }) {
  const T = useLandingTheme();
  const t = useTranslations('landing.destino');
  const [tab, setTab] = useState("itinerary");
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [initialDeparture, setInitialDeparture] = useState<any>(null);

  // Translation helper
  const dTr = makeTr(destino, currentLang, preferredLanguage);

  /* ── Parse JSONB fields safely ── */
  const gallery: string[] =
    Array.isArray(destino.galeria) && destino.galeria.length > 0
      ? destino.galeria
      : destino.imagen_url
        ? [destino.imagen_url]
        : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-rotate gallery every 4 seconds
  useEffect(() => {
    if (!autoRotate || gallery.length <= 1) return;
    const timer = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % gallery.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [autoRotate, gallery.length]);

  // Raw itinerary data (pass full object to TabItinerary)
  const rawItinerario = destino.itinerario;
  // Simplified array for ItineraryMap and tab visibility check
  const itinerary: any[] = Array.isArray(rawItinerario)
    ? rawItinerario
    : Array.isArray(rawItinerario?.dias)
      ? rawItinerario.dias.map((d: any, i: number) => ({
          day: d.dia || i + 1,
          title: d.titulo || d.title || "",
        }))
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
    { id: "itinerary", label: t('tabItinerary'), icon: "\uD83D\uDDFA\uFE0F", show: itinerary.length > 0 },
    { id: "hotel", label: t('tabHotel'), icon: "\uD83C\uDFE8", show: !!hotel },
    { id: "flight", label: t('tabFlight'), icon: "\u2708\uFE0F", show: !!flights },
    { id: "gallery", label: t('tabGallery'), icon: "\uD83D\uDDBC\uFE0F", show: gallery.length > 1 },
    { id: "included", label: t('tabIncluded'), icon: "\u2705", show: included.length > 0 || notIncluded.length > 0 },
    { id: "departures", label: t('tabDepartures'), icon: "\uD83D\uDCC5", show: departures.length > 0 },
    { id: "coordinator", label: t('tabCoordinator'), icon: "\uD83D\uDC64", show: !!coordinator },
    { id: "faq", label: t('tabFAQ'), icon: "\u2753", show: faqs.length > 0 },
  ].filter((tb) => tb.show);

  // Set initial tab to first available
  useEffect(() => {
    if (allTabs.length > 0 && !allTabs.find((tb) => tb.id === tab)) {
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
    <div style={{ minHeight: "100vh", color: T.text }} dir={currentLang === "ar" ? "rtl" : "ltr"}>
      {/* ═══════════════════ MAIN NAVBAR ═══════════════════ */}
      {clientName && (
        <Navbar
          clientName={clientName}
          logoUrl={logoUrl}
          primaryColor={primaryColor}
          darkModeEnabled={darkModeEnabled}
          lang={currentLang}
          availableLanguages={availableLanguages.length > 0 ? availableLanguages : [currentLang]}
          onLangChange={onLangChange}
          homeUrl={homeUrl}
        />
      )}

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
          {`← ${t('back')}`}
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
          {t('bookNow')} {"→"}
        </button>
      </div>

      <div style={{ paddingTop: 116 }}>
        {/* ═══════════════════ HERO SECTION (split layout like main Hero) ═══════════════════ */}
        <section
          style={{
            paddingTop: 40,
            paddingBottom: 60,
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
              background: `radial-gradient(circle, ${T.accent}15, transparent 70%)`,
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
            className="destino-hero-grid"
          >
            {/* LEFT — Text content */}
            <div>
              <AnimateIn delay={0}>
                {destino.pais && (
                  <span
                    style={{
                      display: "inline-block",
                      background: `${T.accent}18`,
                      color: T.accent,
                      fontFamily: FONT,
                      fontWeight: 700,
                      fontSize: 13,
                      padding: "6px 16px",
                      borderRadius: 30,
                      letterSpacing: ".5px",
                      marginBottom: 20,
                      border: `1px solid ${T.accent}30`,
                    }}
                  >
                    {destino.continente ? `${destino.continente} · ` : ""}{destino.pais}
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
                    marginBottom: 12,
                    letterSpacing: "-1px",
                  }}
                >
                  {dTr("nombre")}
                </h1>
              </AnimateIn>

              {(dTr("tagline") || destino.tagline) && (
                <AnimateIn delay={0.15}>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontWeight: 600,
                      fontSize: "clamp(18px, 2.5vw, 24px)",
                      color: T.accent,
                      margin: 0,
                      marginBottom: 16,
                      lineHeight: 1.3,
                    }}
                  >
                    {dTr("tagline")}
                  </p>
                </AnimateIn>
              )}

              {(dTr("descripcion_larga") || dTr("descripcion") || destino.descripcion_larga || destino.descripcion_corta) && (
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
                    {dTr("descripcion_larga") || dTr("descripcion") || destino.descripcion_larga || destino.descripcion_corta}
                  </p>
                </AnimateIn>
              )}

              <AnimateIn delay={0.3}>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {/* Primary CTA — Reservar */}
                  <button
                    onClick={() => openBooking()}
                    style={{
                      background: `linear-gradient(135deg, ${T.accent}, ${T.accent}cc)`,
                      color: "#fff",
                      fontFamily: FONT,
                      fontWeight: 700,
                      fontSize: 15,
                      padding: "14px 32px",
                      borderRadius: 14,
                      border: "none",
                      cursor: "pointer",
                      transition: "all .3s",
                      boxShadow: `0 4px 20px ${T.accent}33`,
                      letterSpacing: ".3px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = `0 8px 30px ${T.accent}44`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = `0 4px 20px ${T.accent}33`;
                    }}
                  >
                    {t('bookNow')}
                  </button>

                  {/* Secondary CTA — Volver */}
                  <a
                    href={backUrl}
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
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = T.accent;
                      e.currentTarget.style.color = T.accent;
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.color = T.text;
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    {`← ${t('back')}`}
                  </a>
                </div>
              </AnimateIn>
            </div>

            {/* RIGHT — Hero image with floating badges */}
            <AnimateIn delay={0.2} from="right">
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    borderRadius: 28,
                    overflow: "hidden",
                    boxShadow: `0 20px 60px ${T.shadow}`,
                    aspectRatio: "4/5",
                    maxHeight: 560,
                    cursor: gallery.length > 1 ? "pointer" : undefined,
                  }}
                  onClick={() => {
                    if (gallery.length > 1) {
                      setAutoRotate(false);
                      setGalleryIndex((prev) => (prev + 1) % gallery.length);
                    }
                  }}
                >
                  <img
                    src={gallery[galleryIndex] || destino.imagen_url}
                    alt={dTr("nombre")}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                {/* Gallery dots */}
                {gallery.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 6,
                      marginTop: 12,
                    }}
                  >
                    {gallery.map((_: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => {
                          setAutoRotate(false);
                          setGalleryIndex(i);
                        }}
                        style={{
                          width: galleryIndex === i ? 20 : 8,
                          height: 8,
                          borderRadius: 4,
                          background: galleryIndex === i ? T.accent : `${T.muted}44`,
                          border: "none",
                          cursor: "pointer",
                          transition: "all .3s",
                          padding: 0,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Floating price badge (top-right) */}
                {destino.precio && (
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
                    className="destino-hero-floating-card"
                  >
                    <span style={{ fontSize: 24 }}>💰</span>
                    <div>
                      {destino.precio_original && destino.precio_original > destino.precio && (
                        <div
                          style={{
                            fontFamily: FONT2,
                            fontSize: 13,
                            color: T.muted,
                            textDecoration: "line-through",
                            textDecorationColor: "rgba(255,100,100,.7)",
                            lineHeight: 1,
                          }}
                        >
                          {destino.precio_original}{"€"}
                        </div>
                      )}
                      <div
                        style={{
                          fontFamily: FONT,
                          fontWeight: 800,
                          fontSize: 20,
                          color: T.text,
                          lineHeight: 1,
                        }}
                      >
                        {destino.precio}{"€"}
                      </div>
                      <div
                        style={{
                          fontFamily: FONT2,
                          fontSize: 12,
                          color: T.muted,
                          marginTop: 2,
                        }}
                      >
                        {t('perPerson')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating urgency badge (bottom-left) */}
                <div
                  style={{
                    position: "absolute",
                    bottom: gallery.length > 1 ? 52 : 40,
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
                  className="destino-hero-floating-card"
                >
                  <span style={{ fontSize: 24 }}>{destino.badge ? "🏷️" : "🔥"}</span>
                  <div>
                    <div
                      style={{
                        fontFamily: FONT,
                        fontWeight: 800,
                        fontSize: 16,
                        color: T.text,
                        lineHeight: 1.2,
                      }}
                    >
                      {destino.badge || "No te lo pierdas"}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT2,
                        fontSize: 12,
                        color: T.muted,
                        marginTop: 2,
                      }}
                    >
                      {destino.duracion || "Experiencia unica"}
                    </div>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>

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
                sub: t('duration'),
                icon: "\u23F1\uFE0F",
              },
              {
                value: ratingStars
                  ? `${destino.rating}`
                  : null,
                sub: destino.reviews
                  ? `${destino.reviews} ${t('reviews')}`
                  : "Rating",
                icon: "\u2B50",
                color: "#f59e0b",
              },
              {
                value: destino.grupo_max
                  ? `${destino.grupo_max} max`
                  : null,
                sub: t('group'),
                icon: "\uD83D\uDC65",
              },
              {
                value:
                  destino.edad_min != null && destino.edad_max != null
                    ? `${destino.edad_min}-${destino.edad_max}`
                    : null,
                sub: t('ageRange'),
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
                    justifyContent: "center",
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
                    {t('physicalEffort')}
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
              <TabItinerary rawItinerario={rawItinerario} />
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
                  {`${t('readyFor')} ${dTr("nombre")}?`}
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
                  {t('perPerson')} {"·"}{" "}
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
                  {t('bookNow')} {"→"}
                </button>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      {clientName && (
        <Footer
          clientName={clientName}
          logoUrl={logoUrl}
          footerDescription={footerDescription}
          destinos={allDestinos.map((d: any) => ({ slug: d.slug || d.id, nombre: d.nombre }))}
          paginasLegales={paginasLegales.map((p: any) => ({ slug: p.slug, titulo: p.titulo }))}
          legalBasePath={legalBasePath}
          destinationBasePath={destinationBasePath}
          instagramUrl={instagramUrl}
          facebookUrl={facebookUrl}
          tiktokUrl={tiktokUrl}
        />
      )}

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
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 30px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .destino-hero-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 868px) {
          .destino-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }
          .destino-hero-grid > div:first-child { order: 1; }
          .destino-hero-grid > div:last-child { order: 0; }
          .destino-hero-floating-card {
            display: none !important;
          }
        }
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
