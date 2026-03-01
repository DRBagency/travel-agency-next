"use client";

import { useState } from "react";
import { useLandingTheme } from "@/components/landing/LandingThemeProvider";
import { useTranslations } from "next-intl";
import { MessageCircle, ChevronRight } from "lucide-react";
import PortalChatThread from "./PortalChatThread";

interface PortalChatListProps {
  reservas: any[];
  messagesMap: Record<string, { lastMessage: any; unreadCount: number }>;
  destinosMap: Record<string, string>;
}

export default function PortalChatList({ reservas, messagesMap, destinosMap }: PortalChatListProps) {
  const T = useLandingTheme();
  const t = useTranslations("landing.portal");
  const [selectedReservaId, setSelectedReservaId] = useState<string | null>(null);

  const selectedReserva = reservas.find((r: any) => r.id === selectedReservaId);

  if (selectedReservaId && selectedReserva) {
    return (
      <div>
        <button
          onClick={() => setSelectedReservaId(null)}
          style={{
            background: "transparent",
            border: "none",
            color: T.muted,
            cursor: "pointer",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 16,
            padding: 0,
          }}
        >
          ← {t("backToChats")}
        </button>
        <PortalChatThread
          reservaId={selectedReservaId}
          destinoName={selectedReserva.destino || "Reserva"}
        />
      </div>
    );
  }

  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-syne), Syne, sans-serif",
          fontSize: 24,
          fontWeight: 800,
          color: T.text,
          marginBottom: 4,
        }}
      >
        {t("chatTitle")}
      </h1>
      <p style={{ fontSize: 14, color: T.sub, marginBottom: 24 }}>
        {t("chatSubtitle")}
      </p>

      {reservas.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <MessageCircle style={{ width: 48, height: 48, color: T.muted, margin: "0 auto 16px" }} />
          <p style={{ fontSize: 15, color: T.sub }}>{t("noChats")}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {reservas.map((reserva: any) => {
            const info = messagesMap[reserva.id] || { lastMessage: null, unreadCount: 0 };
            const imgUrl = reserva.destino_id ? destinosMap[reserva.destino_id] : null;

            return (
              <button
                key={reserva.id}
                onClick={() => setSelectedReservaId(reserva.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  background: T.glass,
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${T.border}`,
                  borderRadius: 14,
                  cursor: "pointer",
                  textAlign: "start",
                  width: "100%",
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border;
                }}
              >
                {/* Avatar / image */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    overflow: "hidden",
                    flexShrink: 0,
                    background: `${T.accent}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {imgUrl ? (
                    <img src={imgUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <MessageCircle style={{ width: 20, height: 20, color: T.accent }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>
                      {reserva.destino || "Reserva"}
                    </span>
                    {info.unreadCount > 0 && (
                      <span
                        style={{
                          background: T.accent,
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 700,
                          borderRadius: 10,
                          padding: "2px 8px",
                          minWidth: 20,
                          textAlign: "center",
                        }}
                      >
                        {info.unreadCount}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: T.muted,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      margin: 0,
                    }}
                  >
                    {info.lastMessage
                      ? info.lastMessage.message
                      : t("noMessages")}
                  </p>
                </div>

                <ChevronRight style={{ width: 16, height: 16, color: T.muted, flexShrink: 0 }} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
