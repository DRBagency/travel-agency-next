"use client";

import { useLandingTheme } from "@/components/landing/LandingThemeProvider";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Calendar, Users, MapPin, ChevronRight } from "lucide-react";

interface PortalReservasListProps {
  reservas: any[];
  destinosMap: Record<string, { nombre: string; imagen_url: string | null }>;
}

export default function PortalReservasList({ reservas, destinosMap }: PortalReservasListProps) {
  const T = useLandingTheme();
  const t = useTranslations("landing.portal");
  const locale = useLocale();

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
  };

  const statusBadge = (reserva: any) => {
    const estado = reserva.estado_pago || "pendiente";
    const map: Record<string, { label: string; bg: string; text: string; border: string }> = {
      pagado: { label: t("statusPaid"), bg: T.greenBg, text: T.greenText, border: T.greenBorder },
      deposito_pagado: { label: t("statusDeposit"), bg: "#fefce8", text: "#a16207", border: "#fde68a" },
      pendiente_pago: { label: t("statusPending"), bg: "#fefce8", text: "#a16207", border: "#fde68a" },
      pendiente: { label: t("statusPending"), bg: "#fefce8", text: "#a16207", border: "#fde68a" },
      pendiente_confirmacion: { label: t("statusPendingConfirm"), bg: "#fefce8", text: "#a16207", border: "#fde68a" },
      confirmado: { label: t("statusConfirmed"), bg: T.greenBg, text: T.greenText, border: T.greenBorder },
      cancelada: { label: t("statusCancelled"), bg: T.redBg, text: T.redText, border: T.redBorder },
      vencido: { label: t("statusExpired"), bg: T.redBg, text: T.redText, border: T.redBorder },
    };
    const s = map[estado] || map.pendiente;

    return (
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          padding: "4px 10px",
          borderRadius: 20,
          background: s.bg,
          color: s.text,
          border: `1px solid ${s.border}`,
          whiteSpace: "nowrap",
        }}
      >
        {s.label}
      </span>
    );
  };

  // Greeting from first reserva
  const firstName = reservas[0]?.nombre?.split(" ")[0] || "";

  if (reservas.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <MapPin style={{ width: 48, height: 48, color: T.muted, margin: "0 auto 16px" }} />
        <h2
          style={{
            fontFamily: "var(--font-syne), Syne, sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: T.text,
            marginBottom: 8,
          }}
        >
          {t("noBookings")}
        </h2>
        <p style={{ fontSize: 14, color: T.sub }}>{t("noBookingsDesc")}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Greeting */}
      <h1
        style={{
          fontFamily: "var(--font-syne), Syne, sans-serif",
          fontSize: 28,
          fontWeight: 800,
          color: T.text,
          marginBottom: 4,
        }}
      >
        {t("greeting", { name: firstName })}
      </h1>
      <p style={{ fontSize: 14, color: T.sub, marginBottom: 28 }}>
        {t("bookingsSubtitle", { count: reservas.length })}
      </p>

      {/* Grid of cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {reservas.map((reserva: any) => {
          const destino = reserva.destino_id ? destinosMap[reserva.destino_id] : null;
          const imgUrl = destino?.imagen_url || null;
          const bm = reserva.booking_model || "pago_completo";
          const depositPaid = bm === "deposito_resto" && reserva.deposit_amount;
          const depositProgress =
            depositPaid && reserva.precio > 0
              ? ((Number(reserva.deposit_amount) + (reserva.remaining_paid ? Number(reserva.remaining_amount || 0) : 0)) / Number(reserva.precio)) * 100
              : null;

          return (
            <Link
              key={reserva.id}
              href={`/portal/reserva/${reserva.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: T.glass,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: `1px solid ${T.border}`,
                  borderRadius: 18,
                  overflow: "hidden",
                  transition: "all .3s cubic-bezier(.16,1,.3,1)",
                  cursor: "pointer",
                  boxShadow: `0 2px 12px ${T.shadow}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 12px 32px rgba(28,171,176,.15)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 2px 12px ${T.shadow}`;
                }}
              >
                {/* Image */}
                {imgUrl && (
                  <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
                    <img
                      src={imgUrl}
                      alt={reserva.destino || ""}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,.5), transparent 60%)",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        bottom: 12,
                        insetInlineStart: 16,
                        color: "#fff",
                        fontFamily: "var(--font-syne), Syne, sans-serif",
                        fontSize: 18,
                        fontWeight: 700,
                      }}
                    >
                      {reserva.destino || "—"}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: "16px 18px" }}>
                  {!imgUrl && (
                    <h3
                      style={{
                        fontFamily: "var(--font-syne), Syne, sans-serif",
                        fontSize: 18,
                        fontWeight: 700,
                        color: T.text,
                        marginBottom: 12,
                      }}
                    >
                      {reserva.destino || "—"}
                    </h3>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Calendar style={{ width: 14, height: 14, color: T.muted }} />
                      <span style={{ fontSize: 13, color: T.sub }}>
                        {formatDate(reserva.fecha_salida)} → {formatDate(reserva.fecha_regreso)}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Users style={{ width: 14, height: 14, color: T.muted }} />
                      <span style={{ fontSize: 13, color: T.sub }}>
                        {reserva.personas} {t("travelers")}
                      </span>
                    </div>
                  </div>

                  {/* Deposit progress bar */}
                  {bm === "deposito_resto" && depositProgress !== null && (
                    <div style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          height: 6,
                          borderRadius: 3,
                          background: `${T.border}`,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(depositProgress, 100)}%`,
                            background: reserva.remaining_paid ? T.greenText : T.accent,
                            borderRadius: 3,
                            transition: "width .3s ease",
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: T.muted }}>
                          {t("deposited")}
                        </span>
                        <span style={{ fontSize: 11, color: T.muted }}>
                          {Number(reserva.precio).toLocaleString(locale)} €
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Bottom: price + status + arrow */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: T.accent }}>
                      {Number(reserva.precio).toLocaleString(locale)} €
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {statusBadge(reserva)}
                      <ChevronRight style={{ width: 16, height: 16, color: T.muted }} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
