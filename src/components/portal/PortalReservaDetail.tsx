"use client";

import { useState } from "react";
import { useLandingTheme } from "@/components/landing/LandingThemeProvider";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  Hotel,
  Plane,
  MapPin,
  Star,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { TabItinerary } from "@/components/landing/destination/TabItinerary";
import { TabHotel, normalizeHotels } from "@/components/landing/destination/TabHotel";
import { TabFlight } from "@/components/landing/destination/TabFlight";
import { TabIncluded } from "@/components/landing/destination/TabIncluded";

interface PortalReservaDetailProps {
  reserva: any;
  destino: any;
  coordinador: any;
  stripeEnabled: boolean;
}

export default function PortalReservaDetail({
  reserva,
  destino,
  coordinador,
  stripeEnabled,
}: PortalReservaDetailProps) {
  const T = useLandingTheme();
  const t = useTranslations("landing.portal");
  const locale = useLocale();
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const bd = (reserva.booking_details as Record<string, any>) || {};
  const hotelInfo = bd.hotel || null;
  const habitacion = bd.habitacion || null;
  const precioUnitario = bd.precio_unitario || null;
  const suplementoTotal = bd.suplemento_total || 0;
  const passengers = Array.isArray(reserva.passengers) ? reserva.passengers : [];
  const bm = reserva.booking_model || "pago_completo";

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
  };

  // Timeline steps
  const statusSteps =
    bm === "deposito_resto"
      ? ["pendiente_pago", "deposito_pagado", "pagado"]
      : bm === "solo_reserva"
        ? ["pendiente_confirmacion", "confirmado", "pagado"]
        : ["pendiente_pago", "revisada", "pagado"];
  const currentIdx = statusSteps.indexOf(reserva.estado_pago ?? statusSteps[0]);
  const isCancelled = reserva.estado_pago === "cancelada" || reserva.estado_pago === "vencido";

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      pendiente: t("statusPending"),
      pendiente_pago: t("statusPending"),
      revisada: t("statusReviewed"),
      pagado: t("statusPaid"),
      deposito_pagado: t("statusDeposit"),
      pendiente_confirmacion: t("statusPendingConfirm"),
      confirmado: t("statusConfirmed"),
      vencido: t("statusExpired"),
      cancelada: t("statusCancelled"),
    };
    return map[s] || s;
  };

  const statusColor = (estado: string) => {
    if (isCancelled) return { bg: T.redBg, text: T.redText, border: T.redBorder };
    if (estado === "pagado") return { bg: T.greenBg, text: T.greenText, border: T.greenBorder };
    if (["deposito_pagado", "confirmado", "revisada"].includes(estado))
      return { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" };
    return { bg: "#fefce8", text: "#a16207", border: "#fde68a" };
  };

  const badgeColor = statusColor(reserva.estado_pago || "pendiente");

  // Pay remaining handler
  const handlePayRemaining = async () => {
    setPayLoading(true);
    setPayError(null);
    try {
      const res = await fetch("/api/portal/pay-remaining", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reserva_id: reserva.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPayError(data.error || t("payError"));
      }
    } catch {
      setPayError(t("payError"));
    } finally {
      setPayLoading(false);
    }
  };

  // Duration calc
  const duration =
    reserva.fecha_salida && reserva.fecha_regreso
      ? Math.ceil(
          (new Date(reserva.fecha_regreso).getTime() - new Date(reserva.fecha_salida).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

  // Destination tabs availability
  const hasItinerary = destino?.itinerario;
  const hasHotel = destino?.hotel;
  const hasFlight = destino?.vuelos;
  const hasIncluded = destino?.incluido || destino?.no_incluido;
  const hasTabs = hasItinerary || hasHotel || hasFlight || hasIncluded;

  const tabs = [
    ...(hasItinerary ? [{ id: "itinerary", label: t("tabItinerary") }] : []),
    ...(hasHotel ? [{ id: "hotel", label: t("tabHotel") }] : []),
    ...(hasFlight ? [{ id: "flights", label: t("tabFlights") }] : []),
    ...(hasIncluded ? [{ id: "included", label: t("tabIncluded") }] : []),
  ];

  const cardStyle = {
    background: T.glass,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    padding: "20px",
  };

  return (
    <div>
      {/* Back link */}
      <Link
        href="/portal"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 14,
          color: T.muted,
          textDecoration: "none",
          marginBottom: 20,
        }}
      >
        <ArrowLeft style={{ width: 16, height: 16 }} />
        {t("backToBookings")}
      </Link>

      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `${T.accent}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MapPin style={{ width: 22, height: 22, color: T.accent }} />
          </div>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-syne), Syne, sans-serif",
                fontSize: 24,
                fontWeight: 800,
                color: T.text,
              }}
            >
              {reserva.destino || "—"}
            </h1>
            <p style={{ fontSize: 12, color: T.muted }}>
              {t("bookingId")}: {reserva.id.substring(0, 8)}...
            </p>
          </div>
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            padding: "6px 14px",
            borderRadius: 20,
            background: badgeColor.bg,
            color: badgeColor.text,
            border: `1px solid ${badgeColor.border}`,
          }}
        >
          {statusLabel(reserva.estado_pago ?? "pendiente")}
        </span>
      </div>

      {/* Timeline */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {statusSteps.map((step, idx) => (
            <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: !isCancelled && idx <= currentIdx ? "#fff" : T.muted,
                    background: isCancelled
                      ? T.redBg
                      : idx <= currentIdx
                        ? T.accent
                        : `${T.border}`,
                    boxShadow:
                      !isCancelled && step === reserva.estado_pago
                        ? `0 0 0 4px ${T.accent}30`
                        : "none",
                    transition: "all .3s",
                  }}
                >
                  {!isCancelled && idx < currentIdx ? (
                    <CheckCircle style={{ width: 18, height: 18 }} />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    marginTop: 8,
                    fontWeight: 600,
                    color: !isCancelled && idx <= currentIdx ? T.accent : T.muted,
                    textAlign: "center",
                  }}
                >
                  {statusLabel(step)}
                </span>
              </div>
              {idx < statusSteps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    margin: "0 12px",
                    background: !isCancelled && idx < currentIdx ? T.accent : T.border,
                    borderRadius: 1,
                    marginBottom: 26,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 16,
        }}
        className="lg:!grid-cols-[1fr_340px]"
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Dates card */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar style={{ width: 16, height: 16, color: T.accent }} />
              {t("travelDates")}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div>
                <span style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 4 }}>{t("departure")}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{formatDate(reserva.fecha_salida)}</span>
              </div>
              <div>
                <span style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 4 }}>{t("return")}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{formatDate(reserva.fecha_regreso)}</span>
              </div>
              {duration && (
                <div>
                  <span style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 4 }}>{t("duration")}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{duration} {t("days")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Passengers card */}
          {passengers.length > 0 && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Users style={{ width: 16, height: 16, color: T.accent }} />
                {t("passengers")} ({passengers.length})
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                      <th style={{ textAlign: "start", padding: "8px 12px 8px 0", color: T.muted, fontWeight: 500, fontSize: 12 }}>#</th>
                      <th style={{ textAlign: "start", padding: "8px 12px 8px 0", color: T.muted, fontWeight: 500, fontSize: 12 }}>{t("name")}</th>
                      <th style={{ textAlign: "start", padding: "8px 12px 8px 0", color: T.muted, fontWeight: 500, fontSize: 12 }}>{t("document")}</th>
                      <th style={{ textAlign: "start", padding: "8px 12px 8px 0", color: T.muted, fontWeight: 500, fontSize: 12 }}>{t("nationality")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passengers.map((p: any, i: number) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${T.border}40` }}>
                        <td style={{ padding: "10px 12px 10px 0", color: T.muted }}>{i + 1}</td>
                        <td style={{ padding: "10px 12px 10px 0", fontWeight: 600, color: T.text }}>{p.fullName || p.name || "—"}</td>
                        <td style={{ padding: "10px 12px 10px 0", color: T.sub }}>
                          {p.docType || p.document_type || ""} {p.docNumber || p.document_number || "—"}
                        </td>
                        <td style={{ padding: "10px 12px 10px 0", color: T.sub }}>{p.nationality || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Hotel from booking_details */}
          {hotelInfo && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Hotel style={{ width: 16, height: 16, color: T.accent }} />
                Hotel
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div>
                  <span style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 4 }}>Hotel</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{hotelInfo.nombre}</span>
                  {hotelInfo.estrellas > 0 && (
                    <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                      {Array.from({ length: hotelInfo.estrellas }).map((_, i) => (
                        <Star key={i} style={{ width: 12, height: 12, color: "#f59e0b", fill: "#f59e0b" }} />
                      ))}
                    </div>
                  )}
                </div>
                {habitacion && (
                  <div>
                    <span style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 4 }}>{t("roomType")}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{habitacion.tipo}</span>
                  </div>
                )}
                {suplementoTotal > 0 && (
                  <div>
                    <span style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 4 }}>{t("supplement")}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>+{suplementoTotal} €/pax</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Destination tabs */}
          {hasTabs && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin style={{ width: 16, height: 16, color: T.accent }} />
                {t("destinationDetails")}
              </h3>

              {/* Tab buttons */}
              <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 10,
                      border: `1.5px solid ${activeTab === tab.id ? T.accent : T.border}`,
                      background: activeTab === tab.id ? `${T.accent}15` : "transparent",
                      color: activeTab === tab.id ? T.accent : T.sub,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all .2s",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === "itinerary" && hasItinerary && (
                <TabItinerary rawItinerario={destino.itinerario} />
              )}
              {activeTab === "hotel" && hasHotel && (
                <TabHotel
                  hotels={normalizeHotels(destino.hotel)}
                  basePrice={Number(reserva.precio) / (reserva.personas || 1)}
                  selectedHotelIndex={0}
                  selectedRoomIndex={0}
                  onSelectHotel={() => {}}
                  onSelectRoom={() => {}}
                />
              )}
              {activeTab === "flights" && hasFlight && (
                <TabFlight flights={destino.vuelos} />
              )}
              {activeTab === "included" && hasIncluded && (
                <TabIncluded
                  included={destino.incluido || []}
                  notIncluded={destino.no_incluido || []}
                />
              )}
            </div>
          )}
        </div>

        {/* Right column — Price + Payment */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Price breakdown */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <CreditCard style={{ width: 16, height: 16, color: T.accent }} />
              {t("priceBreakdown")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {precioUnitario && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: T.sub }}>{t("pricePerPerson")}</span>
                  <span style={{ color: T.text }}>{precioUnitario} €</span>
                </div>
              )}
              {suplementoTotal > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: T.sub }}>{t("supplement")}</span>
                  <span style={{ color: T.text }}>+{suplementoTotal} €</span>
                </div>
              )}
              {reserva.personas > 1 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: T.sub }}>{t("travelers")}</span>
                  <span style={{ color: T.text }}>×{reserva.personas}</span>
                </div>
              )}
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: T.accent }}>
                  {Number(reserva.precio).toLocaleString(locale)} €
                </span>
              </div>

              {/* Deposit info */}
              {bm === "deposito_resto" && reserva.deposit_amount != null && (
                <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: T.sub }}>{t("depositPaid")}</span>
                    <span style={{ fontWeight: 600, color: T.greenText }}>
                      {Number(reserva.deposit_amount).toLocaleString(locale)} €
                    </span>
                  </div>
                  {reserva.remaining_amount != null && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: T.sub }}>{t("remainingAmount")}</span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: reserva.remaining_paid ? T.greenText : "#d97706",
                        }}
                      >
                        {Number(reserva.remaining_amount).toLocaleString(locale)} €
                        {reserva.remaining_paid && " ✓"}
                      </span>
                    </div>
                  )}
                  {reserva.remaining_due_date && !reserva.remaining_paid && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: T.sub }}>{t("dueDate")}</span>
                      <span style={{ color: T.text }}>{formatDate(reserva.remaining_due_date)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pay remaining CTA */}
          {bm === "deposito_resto" && !reserva.remaining_paid && !isCancelled && stripeEnabled && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 8 }}>
                {t("payRemaining")}
              </h3>
              <p style={{ fontSize: 13, color: T.sub, marginBottom: 16, lineHeight: 1.5 }}>
                {t("payRemainingDesc")}
              </p>
              <button
                onClick={handlePayRemaining}
                disabled={payLoading}
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  borderRadius: 12,
                  border: "none",
                  background: T.accent,
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: payLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: payLoading ? 0.7 : 1,
                }}
              >
                {payLoading ? (
                  <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} />
                ) : (
                  <>
                    {t("payNow")} — {Number(reserva.remaining_amount).toLocaleString(locale)} €
                  </>
                )}
              </button>
              {payError && (
                <p style={{ fontSize: 13, color: "#dc2626", marginTop: 10, textAlign: "center" }}>
                  {payError}
                </p>
              )}
            </div>
          )}

          {/* Calendar card */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar style={{ width: 16, height: 16, color: T.accent }} />
              {t("dates")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: T.sub }}>{t("departure")}</span>
                <span style={{ fontWeight: 600, color: T.text }}>{formatDate(reserva.fecha_salida)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: T.sub }}>{t("return")}</span>
                <span style={{ fontWeight: 600, color: T.text }}>{formatDate(reserva.fecha_regreso)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: T.sub }}>{t("booked")}</span>
                <span style={{ color: T.sub }}>
                  {reserva.created_at ? new Date(reserva.created_at).toLocaleDateString(locale) : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg\\:!grid-cols-\\[1fr_340px\\] {
            grid-template-columns: 1fr 340px !important;
          }
        }
      `}</style>
    </div>
  );
}
