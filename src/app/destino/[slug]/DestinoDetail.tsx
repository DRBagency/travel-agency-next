"use client";

import { useState, useEffect, Fragment } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { LandingThemeProvider, useLandingTheme } from "@/components/landing/LandingThemeProvider";
import { AnimateIn } from "@/components/landing/AnimateIn";
import { Img } from "@/components/landing/Img";
import { Accordion } from "@/components/landing/Accordion";
import { TagChip } from "@/components/landing/TagChip";
import { StatusBadge } from "@/components/landing/StatusBadge";
import { EffortDots } from "@/components/landing/EffortDots";
import BookingModal from "@/components/BookingModal";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  destino: any;
  client: any;
}

export function DestinoDetail({ destino, client }: Props) {
  return (
    <LandingThemeProvider
      primaryColor={client.primary_color}
      darkModeEnabled={client.dark_mode_enabled ?? true}
    >
      <DestinoInner destino={destino} client={client} />
    </LandingThemeProvider>
  );
}

function DestinoInner({ destino, client }: Props) {
  const T = useLandingTheme();
  const t = useTranslations("landing.destino");
  const [tab, setTab] = useState("itinerary");
  const [gi, setGi] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const gallery: string[] = Array.isArray(destino.galeria) && destino.galeria.length > 0
    ? destino.galeria
    : destino.imagen_url ? [destino.imagen_url] : [];

  const itinerary: any[] = Array.isArray(destino.itinerario) ? destino.itinerario : [];
  const hotel: any = destino.hotel || null;
  const flights: any = destino.vuelos || null;
  const included: string[] = Array.isArray(destino.incluido) ? destino.incluido : [];
  const notIncluded: string[] = Array.isArray(destino.no_incluido) ? destino.no_incluido : [];
  const departures: any[] = Array.isArray(destino.salidas) ? destino.salidas : [];
  const coordinator: any = destino.coordinador || null;
  const faqs: any[] = Array.isArray(destino.faqs) ? destino.faqs : [];
  const tags: string[] = Array.isArray(destino.tags) ? destino.tags : [];
  const weather: any = destino.clima || null;

  const statusLabels: Record<string, string> = {
    confirmed: t("confirmed"),
    lastSpots: t("lastSpots"),
    soldOut: t("soldOut"),
  };

  const allTabs = [
    { id: "itinerary", label: t("tabItinerary"), show: itinerary.length > 0 },
    { id: "hotel", label: t("tabHotel"), show: !!hotel },
    { id: "flight", label: t("tabFlight"), show: !!flights },
    { id: "gallery", label: t("tabGallery"), show: gallery.length > 1 },
    { id: "included", label: t("tabIncluded"), show: included.length > 0 || notIncluded.length > 0 },
    { id: "calendar", label: t("tabDepartures"), show: departures.length > 0 },
    { id: "coordinator", label: t("tabCoordinator"), show: !!coordinator },
    { id: "faq", label: t("tabFAQ"), show: faqs.length > 0 },
  ].filter(tb => tb.show);

  // Set initial tab to first available
  useEffect(() => {
    if (allTabs.length > 0 && !allTabs.find(tb => tb.id === tab)) {
      setTab(allTabs[0].id);
    }
  }, []);

  const syne = "var(--font-syne), 'Syne', sans-serif";
  const dm = "var(--font-dm), 'DM Sans', sans-serif";

  return (
    <div style={{ minHeight: "100vh", color: T.txt }}>
      {/* Top bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "12px 28px", background: T.glass, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.glassBorder}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: dm, color: T.sub, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
          {"←"} {t("back")}
        </Link>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setBookingOpen(true)} style={{
            padding: "8px 22px", borderRadius: 50,
            background: `linear-gradient(135deg,${T.accent},#0d8a8e)`,
            color: "#fff", border: "none", fontFamily: syne, fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>{t("bookNow")} {"→"}</button>
        </div>
      </div>

      <div style={{ paddingTop: 64 }}>
        {/* Hero gallery */}
        <div style={{ position: "relative", height: "52vh", minHeight: 360 }}>
          {gallery.length > 0 && (
            <Img src={gallery[gi]} alt={destino.nombre} style={{ width: "100%", height: "100%" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: T.fadeBottom }} />

          {/* Gallery dots */}
          {gallery.length > 1 && (
            <>
              <div style={{ position: "absolute", bottom: 90, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 2 }}>
                {gallery.map((_: string, i: number) => (
                  <button key={i} onClick={() => setGi(i)} style={{
                    width: gi === i ? 32 : 10, height: 10, borderRadius: 5, border: "none", cursor: "pointer",
                    background: gi === i ? T.accent : "rgba(255,255,255,.5)", transition: "all .3s",
                  }} />
                ))}
              </div>
              <button onClick={() => setGi(p => p > 0 ? p - 1 : gallery.length - 1)} style={{
                position: "absolute", left: 16, top: "38%", width: 44, height: 44, borderRadius: "50%",
                background: T.glass, backdropFilter: "blur(8px)", border: `1px solid ${T.brd}`,
                cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: T.txt,
              }}>{"‹"}</button>
              <button onClick={() => setGi(p => p < gallery.length - 1 ? p + 1 : 0)} style={{
                position: "absolute", right: 16, top: "38%", width: 44, height: 44, borderRadius: "50%",
                background: T.glass, backdropFilter: "blur(8px)", border: `1px solid ${T.brd}`,
                cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: T.txt,
              }}>{"›"}</button>
            </>
          )}

          {/* Weather widget */}
          {weather && (
            <div style={{
              position: "absolute", top: 76, right: 20, padding: "10px 18px", borderRadius: 14,
              background: T.glass, backdropFilter: "blur(12px)", border: `1px solid ${T.brd}`,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 22 }}>{weather.icon}</span>
              <div>
                <p style={{ fontFamily: syne, fontWeight: 700, fontSize: 16, margin: 0, color: T.txt }}>{weather.temp}</p>
                <p style={{ fontFamily: dm, fontSize: 11, color: T.mut, margin: 0 }}>{weather.label}</p>
              </div>
            </div>
          )}

          {/* Title overlay */}
          <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, padding: "0 36px" }}>
            <span style={{ fontFamily: dm, color: T.accent, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600 }}>
              {destino.ubicacion_corta || destino.continente || ""}
            </span>
            <h1 style={{ fontFamily: syne, fontSize: "clamp(30px,5vw,50px)", color: T.txt, margin: "4px 0", fontWeight: 800 }}>{destino.nombre}</h1>
            {destino.tagline && <p style={{ fontFamily: dm, color: T.sub, fontSize: 16 }}>{destino.tagline}</p>}
          </div>
        </div>

        <div style={{ maxWidth: 1020, margin: "0 auto", padding: "16px 24px 80px" }}>
          {/* Quick stats bar */}
          <div style={{
            display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24,
            padding: "18px 22px", borderRadius: 18, background: T.bg2,
            border: `1.5px solid ${T.brd}`,
          }}>
            {[
              { v: `${destino.precio}\u20AC`, s: t("perPerson"), c: T.accent },
              { v: destino.duracion || "", s: t("duration") },
              { v: `${destino.grupo_max || "—"}`, s: t("group") },
              { v: destino.edad_min && destino.edad_max ? `${destino.edad_min}-${destino.edad_max}` : "—", s: t("ageRange") },
            ].filter(s => s.v).map((s, i, arr) => (
              <Fragment key={i}>
                <div style={{ flex: 1, minWidth: 80, textAlign: "center" }}>
                  <p style={{ fontFamily: syne, color: s.c || T.txt, fontSize: 19, fontWeight: 800, margin: 0 }}>{s.v}</p>
                  <p style={{ fontFamily: dm, color: T.mut, fontSize: 11, margin: "2px 0 0" }}>{s.s}</p>
                </div>
                {i < arr.length - 1 && <div style={{ width: 1, background: T.brd }} />}
              </Fragment>
            ))}
          </div>

          {/* Tags + effort */}
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {tags.map((tg: string) => <TagChip key={tg} label={tg} />)}
            </div>
          )}
          {destino.esfuerzo && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <span style={{ fontFamily: dm, color: T.sub, fontSize: 13 }}>{t("physicalEffort")}:</span>
              <EffortDots level={destino.esfuerzo} />
            </div>
          )}

          {/* Description */}
          {(destino.descripcion_larga || destino.descripcion) && (
            <p style={{ fontFamily: dm, color: T.sub, fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
              {destino.descripcion_larga || destino.descripcion}
            </p>
          )}

          {/* Tabs */}
          {allTabs.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap", overflowX: "auto", paddingBottom: 4 }}>
              {allTabs.map(tb => (
                <button key={tb.id} className={`tab-btn ${tab === tb.id ? "active" : ""}`} onClick={() => setTab(tb.id)}>
                  {tb.label}
                </button>
              ))}
            </div>
          )}

          {/* TAB: Itinerary */}
          {tab === "itinerary" && itinerary.length > 0 && (
            <div>
              <h3 style={{ fontFamily: syne, fontSize: 20, fontWeight: 800, marginBottom: 16, color: T.txt }}>
                {t("tabItinerary")} <span style={{ fontFamily: dm, fontSize: 14, fontWeight: 400, color: T.mut }}>· {t("dayByDay")}</span>
              </h3>
              {itinerary.map((day: any, i: number) => (
                <Accordion key={i} title={`${day.dia || day.day || `Día ${i + 1}`} — ${day.titulo || day.title || ""}`} defaultOpen={i === 0}>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {(day.imagen || day.img) && (
                      <Img src={day.imagen || day.img} alt={day.titulo || day.title} style={{ width: 200, height: 130, borderRadius: 14, flexShrink: 0 }} />
                    )}
                    <p style={{ fontFamily: dm, color: T.sub, fontSize: 15, lineHeight: 1.7, flex: 1, minWidth: 200 }}>
                      {day.descripcion || day.desc || ""}
                    </p>
                  </div>
                </Accordion>
              ))}
            </div>
          )}

          {/* TAB: Hotel */}
          {tab === "hotel" && hotel && (
            <div style={{ borderRadius: 20, overflow: "hidden", border: `1.5px solid ${T.brd}`, background: T.bg2 }}>
              {hotel.imagen && <Img src={hotel.imagen} alt={hotel.nombre} style={{ width: "100%", height: 280 }} />}
              <div style={{ padding: 28 }}>
                <h3 style={{ fontFamily: syne, color: T.txt, margin: "0 0 6px", fontSize: 22, fontWeight: 800 }}>{hotel.nombre}</h3>
                {hotel.estrellas && <p style={{ color: "#f59e0b", fontSize: 18, margin: "0 0 10px" }}>{"★".repeat(hotel.estrellas)}</p>}
                {hotel.descripcion && <p style={{ fontFamily: dm, color: T.sub, margin: 0, lineHeight: 1.7, fontSize: 15 }}>{hotel.descripcion}</p>}
              </div>
            </div>
          )}

          {/* TAB: Flight */}
          {tab === "flight" && flights && (
            <div style={{ borderRadius: 20, padding: 36, background: T.bg2, border: `1.5px solid ${T.brd}` }}>
              <div className="grid-responsive" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div style={{ padding: 16, borderRadius: 14, background: T.bg, border: `1px solid ${T.brd}` }}>
                  <p style={{ fontFamily: dm, color: T.mut, fontSize: 12, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>{t("arrivalAirport")}</p>
                  <p style={{ fontFamily: syne, fontWeight: 700, fontSize: 16, color: T.txt, margin: 0 }}>{flights.arrival || flights.llegada || "—"}</p>
                </div>
                <div style={{ padding: 16, borderRadius: 14, background: T.bg, border: `1px solid ${T.brd}` }}>
                  <p style={{ fontFamily: dm, color: T.mut, fontSize: 12, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>{t("returnAirport")}</p>
                  <p style={{ fontFamily: syne, fontWeight: 700, fontSize: 16, color: T.txt, margin: 0 }}>{flights.ret || flights.regreso || "—"}</p>
                </div>
              </div>
              {flights.note && <p style={{ fontFamily: dm, color: T.sub, fontSize: 14, marginBottom: 16 }}>{flights.note}</p>}
              <button style={{ padding: "12px 28px", borderRadius: 50, background: T.bg2, border: `1.5px solid ${T.accent}`, color: T.accent, fontFamily: syne, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                {t("searchFlight")}
              </button>
            </div>
          )}

          {/* TAB: Gallery */}
          {tab === "gallery" && gallery.length > 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
              {gallery.map((img: string, i: number) => (
                <div key={i} style={{ borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "all .3s" }}
                  onClick={() => setGi(i)}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "none")}>
                  <Img src={img} alt={`${destino.nombre} ${i + 1}`} style={{ width: "100%", height: 200 }} />
                </div>
              ))}
            </div>
          )}

          {/* TAB: Included / Not included */}
          {tab === "included" && (
            <div className="grid-responsive" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {included.length > 0 && (
                <div style={{ padding: 28, borderRadius: 20, background: T.greenBg, border: `1.5px solid ${T.greenBrd}` }}>
                  <h3 style={{ fontFamily: syne, fontSize: 20, fontWeight: 700, color: T.greenTxt, marginBottom: 16 }}>{"✅"} {t("included")}</h3>
                  {included.map((x: string, i: number) => (
                    <p key={i} style={{ fontFamily: dm, color: T.greenSub, fontSize: 14, margin: "0 0 8px", lineHeight: 1.5 }}>{"•"} {x}</p>
                  ))}
                </div>
              )}
              {notIncluded.length > 0 && (
                <div style={{ padding: 28, borderRadius: 20, background: T.redBg, border: `1.5px solid ${T.redBrd}` }}>
                  <h3 style={{ fontFamily: syne, fontSize: 20, fontWeight: 700, color: T.redTxt, marginBottom: 16 }}>{"✗"} {t("notIncluded")}</h3>
                  {notIncluded.map((x: string, i: number) => (
                    <p key={i} style={{ fontFamily: dm, color: T.redSub, fontSize: 14, margin: "0 0 8px", lineHeight: 1.5 }}>{"•"} {x}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Departures */}
          {tab === "calendar" && departures.length > 0 && (
            <div style={{ background: T.bg2, borderRadius: 20, border: `1.5px solid ${T.brd}`, overflow: "hidden" }}>
              <div className="hide-mobile" style={{
                display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.2fr",
                padding: "14px 24px", background: T.bg3, borderBottom: `1px solid ${T.brd}`,
                fontFamily: dm, fontSize: 12, fontWeight: 600, color: T.mut, textTransform: "uppercase", letterSpacing: 1,
              }}>
                <span>Fecha</span><span>Estado</span><span>Edad</span><span>Precio</span><span></span>
              </div>
              {departures.map((dep: any, i: number) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.2fr",
                  padding: "16px 24px", borderBottom: i < departures.length - 1 ? `1px solid ${T.brd}` : "none", alignItems: "center",
                }}>
                  <span style={{ fontFamily: syne, fontWeight: 700, fontSize: 15 }}>{dep.date || dep.fecha}</span>
                  <span><StatusBadge status={dep.status || "confirmed"} label={statusLabels[dep.status] || dep.status} /></span>
                  <span style={{ fontFamily: dm, fontSize: 13, color: T.sub }}>
                    {destino.edad_min && destino.edad_max ? `${destino.edad_min}-${destino.edad_max}` : "—"}
                  </span>
                  <span style={{ fontFamily: syne, fontWeight: 800, fontSize: 16, color: T.accent }}>{dep.price || dep.precio || destino.precio}{"\u20AC"}</span>
                  <div>
                    {dep.status === "soldOut" ? (
                      <button style={{
                        padding: "8px 20px", borderRadius: 50, border: `1.5px solid ${T.brd}`,
                        background: T.bg2, fontFamily: dm, fontSize: 13, fontWeight: 500, color: T.sub, cursor: "pointer",
                      }}>{t("notifyMe")}</button>
                    ) : (
                      <button onClick={() => setBookingOpen(true)} style={{
                        padding: "8px 20px", borderRadius: 50,
                        background: `linear-gradient(135deg,${T.accent},#0d8a8e)`,
                        color: "#fff", border: "none", fontFamily: syne, fontWeight: 700, fontSize: 13, cursor: "pointer",
                      }}>{t("bookNow")}{dep.spots && dep.spots <= 3 ? ` (${dep.spots} ${t("spots")})` : ""}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: Coordinator */}
          {tab === "coordinator" && coordinator && (
            <div style={{
              display: "flex", gap: 24, padding: 32, borderRadius: 20, background: T.bg2,
              border: `1.5px solid ${T.brd}`, alignItems: "center", flexWrap: "wrap",
            }}>
              {coordinator.avatar && (
                <Img src={coordinator.avatar} alt={coordinator.nombre} style={{ width: 100, height: 100, borderRadius: "50%", flexShrink: 0, border: `3px solid ${T.accent}` }} />
              )}
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontFamily: dm, color: T.accent, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
                  {t("yourCoordinator")}
                </p>
                <h3 style={{ fontFamily: syne, fontSize: 24, fontWeight: 800, color: T.txt, margin: "0 0 4px" }}>{coordinator.nombre}</h3>
                {coordinator.rol && <p style={{ fontFamily: dm, color: T.mut, fontSize: 13, margin: "0 0 10px" }}>{coordinator.rol}</p>}
                {coordinator.descripcion && <p style={{ fontFamily: dm, color: T.sub, fontSize: 15, margin: 0, lineHeight: 1.7 }}>{coordinator.descripcion}</p>}
              </div>
            </div>
          )}

          {/* TAB: FAQs */}
          {tab === "faq" && faqs.length > 0 && (
            <div style={{ background: T.bg2, borderRadius: 20, border: `1.5px solid ${T.brd}`, padding: "8px 28px" }}>
              {faqs.map((f: any, i: number) => (
                <Accordion key={i} title={f.q || f.pregunta || ""}>
                  <p style={{ fontFamily: dm, color: T.sub, fontSize: 15, lineHeight: 1.7, margin: 0 }}>{f.a || f.respuesta || ""}</p>
                </Accordion>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <div style={{ marginTop: 40 }}>
            <AnimateIn from="scale">
              <div style={{ padding: 36, borderRadius: 24, background: `linear-gradient(135deg,${T.accent},#0d8a8e)`, textAlign: "center" }}>
                <h2 style={{ fontFamily: syne, fontSize: "clamp(22px,4vw,34px)", fontWeight: 800, color: "#fff", marginBottom: 10 }}>
                  {t("readyFor")} {destino.nombre}?
                </h2>
                <p style={{ fontFamily: dm, color: "rgba(255,255,255,.8)", fontSize: 15, marginBottom: 24 }}>
                  {t("perPerson")} · <strong style={{ color: T.lime }}>{destino.precio}{"\u20AC"}</strong> · {destino.duracion}
                </p>
                <button onClick={() => setBookingOpen(true)} style={{
                  fontFamily: syne, fontWeight: 700, fontSize: 16, padding: "16px 44px", borderRadius: 50,
                  background: T.lime, color: "#0f172a", border: "none", cursor: "pointer",
                  boxShadow: "0 4px 24px rgba(212,242,77,.4)",
                }}>{t("bookNow")} {"→"}</button>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>

      {/* Booking modal — reuse existing Stripe-connected wizard */}
      {bookingOpen && (
        <BookingModal
          destination={destino}
          clienteId={client.id}
          primaryColor={client.primary_color}
          paymentsEnabled={client.stripe_charges_enabled}
          subscriptionActive={!!client.stripe_subscription_id}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  );
}
