"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useLandingTheme } from "../LandingThemeProvider";
import { StatusBadge } from "../ui/StatusBadge";
import { localizeDigits } from "@/lib/format-arabic";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

/* eslint-disable @typescript-eslint/no-explicit-any */

interface TabDeparturesProps {
  departures: any[];
  onBook: (departure: any) => void;
  destinationName?: string;
  clienteId?: string;
}

export function TabDepartures({ departures, onBook, destinationName, clienteId }: TabDeparturesProps) {
  const T = useLandingTheme();
  const t = useTranslations("landing.destino");
  const locale = useLocale();
  const ld = (v: string | number | null | undefined) => localizeDigits(v, locale);

  const [notifyIndex, setNotifyIndex] = useState<number | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySending, setNotifySending] = useState(false);
  const [notifySent, setNotifySent] = useState<Set<number>>(new Set());

  const handleNotify = async (depIndex: number, depDate: string) => {
    if (!notifyEmail || notifySending) return;
    setNotifySending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: notifyEmail.split("@")[0],
          email: notifyEmail,
          message: `${t("notifyMe")}: ${destinationName || ""} — ${depDate}`,
          clienteId: clienteId || "",
        }),
      });
      if (res.ok) {
        setNotifySent((prev) => new Set(prev).add(depIndex));
        setNotifyIndex(null);
        setNotifyEmail("");
      }
    } catch { /* ignore */ }
    setNotifySending(false);
  };

  return (
    <div
      style={{
        background: T.bg2,
        borderRadius: 22,
        border: `1.5px solid ${T.border}`,
        overflow: "hidden",
      }}
    >
      {/* Table header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.2fr",
          padding: "14px 24px",
          background: T.bg3,
          borderBottom: `1px solid ${T.border}`,
          fontFamily: FONT2,
          fontSize: 12,
          fontWeight: 600,
          color: T.muted,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        <span>Fecha</span>
        <span>Estado</span>
        <span>Plazas</span>
        <span>Precio</span>
        <span></span>
      </div>

      {/* Departure rows */}
      {departures.map((dep, i) => {
        const date = dep.fecha || dep.date;
        const status = dep.estado || dep.status || "confirmed";
        const price = dep.precio ?? dep.price;
        const spots = dep.plazas ?? dep.spots;
        const isSoldOut = status === "soldOut" || status === "agotado";
        const alreadyNotified = notifySent.has(i);

        return (
          <div key={i}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.2fr",
                padding: "16px 24px",
                borderBottom:
                  i < departures.length - 1 && notifyIndex !== i
                    ? `1px solid ${T.border}`
                    : "none",
                alignItems: "center",
                opacity: isSoldOut ? 0.6 : 1,
                transition: "background .2s",
              }}
              onMouseEnter={(e) => {
                if (!isSoldOut) e.currentTarget.style.background = T.bg3 + "60";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Date */}
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 15,
                  color: T.text,
                }}
              >
                {date}
              </span>

              {/* Status badge */}
              <span>
                <StatusBadge
                  status={status}
                  label={
                    status === "confirmed"
                      ? t("confirmed")
                      : status === "lastSpots"
                        ? t("lastSpots")
                        : status === "soldOut"
                          ? t("soldOut")
                          : status
                  }
                />
              </span>

              {/* Spots */}
              <span
                style={{
                  fontFamily: FONT2,
                  fontSize: 13,
                  color: T.sub,
                }}
              >
                {spots != null ? `${ld(spots)} ${t("spots")}` : "\u2014"}
              </span>

              {/* Price */}
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 16,
                  color: T.accent,
                }}
              >
                {price != null ? `${ld(price)}\u20AC` : "\u2014"}
              </span>

              {/* Action button */}
              <div>
                {isSoldOut ? (
                  alreadyNotified ? (
                    <span
                      style={{
                        padding: "8px 20px",
                        fontFamily: FONT2,
                        fontSize: 13,
                        fontWeight: 500,
                        color: T.accent,
                      }}
                    >
                      {t("notifySent")}
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        setNotifyIndex(notifyIndex === i ? null : i)
                      }
                      style={{
                        padding: "8px 20px",
                        borderRadius: 50,
                        border: `1.5px solid ${notifyIndex === i ? T.accent : T.border}`,
                        background: T.bg2,
                        fontFamily: FONT2,
                        fontSize: 13,
                        fontWeight: 500,
                        color: notifyIndex === i ? T.accent : T.sub,
                        cursor: "pointer",
                        transition: "all .3s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = T.accent;
                        e.currentTarget.style.color = T.accent;
                      }}
                      onMouseLeave={(e) => {
                        if (notifyIndex !== i) {
                          e.currentTarget.style.borderColor = T.border;
                          e.currentTarget.style.color = T.sub;
                        }
                      }}
                    >
                      {t("notifyMe")}
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => onBook(dep)}
                    style={{
                      padding: "8px 20px",
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
                    {t("bookNow")}
                    {spots != null && spots <= 3
                      ? ` (${ld(spots)})`
                      : ""}
                  </button>
                )}
              </div>
            </div>

            {/* Notify email inline form */}
            {notifyIndex === i && !alreadyNotified && (
              <div
                style={{
                  padding: "12px 24px 16px",
                  borderBottom:
                    i < departures.length - 1
                      ? `1px solid ${T.border}`
                      : "none",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <input
                  data-glass-skip
                  type="email"
                  placeholder={t("notifyEmailPlaceholder")}
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNotify(i, date)}
                  style={{
                    flex: 1,
                    padding: "8px 14px",
                    borderRadius: 50,
                    border: `1.5px solid ${T.border}`,
                    background: T.bg2,
                    fontFamily: FONT2,
                    fontSize: 13,
                    color: T.text,
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = T.accent;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = T.border;
                  }}
                />
                <button
                  onClick={() => handleNotify(i, date)}
                  disabled={notifySending || !notifyEmail}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 50,
                    background: `linear-gradient(135deg, ${T.accent}, #0d8a8e)`,
                    color: "#fff",
                    border: "none",
                    fontFamily: FONT2,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: notifySending ? "wait" : "pointer",
                    opacity: notifySending || !notifyEmail ? 0.5 : 1,
                    transition: "all .3s",
                  }}
                >
                  {notifySending ? "..." : t("notifySend")}
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 700px) {
          div[style*="grid-template-columns: 1.5fr 1fr 1fr 1fr 1.2fr"] {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
