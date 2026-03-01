"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLandingTheme } from "@/components/landing/LandingThemeProvider";
import { useTranslations } from "next-intl";
import { Send, Loader2 } from "lucide-react";

interface PortalChatThreadProps {
  reservaId: string;
  destinoName: string;
}

interface Message {
  id: string;
  sender_type: "traveler" | "agency";
  sender_email: string;
  message: string;
  created_at: string;
  read_at: string | null;
}

export default function PortalChatThread({ reservaId, destinoName }: PortalChatThreadProps) {
  const T = useLandingTheme();
  const t = useTranslations("landing.portal");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/portal/chat/messages?reserva_id=${reservaId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [reservaId]);

  useEffect(() => {
    fetchMessages();
    // Poll every 5 seconds
    intervalRef.current = setInterval(fetchMessages, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchMessages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/portal/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reserva_id: reservaId, message: input.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setInput("");
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const formatTime = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { day: "numeric", month: "short" }) +
      " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      style={{
        background: T.glass,
        backdropFilter: "blur(12px)",
        border: `1px solid ${T.border}`,
        borderRadius: 18,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 220px)",
        minHeight: 400,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-syne), Syne, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: T.text,
          }}
        >
          {destinoName}
        </span>
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Loader2
              style={{ width: 24, height: 24, color: T.muted, animation: "spin 1s linear infinite", margin: "0 auto" }}
            />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontSize: 14, color: T.muted }}>{t("startConversation")}</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isTraveler = msg.sender_type === "traveler";
            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: isTraveler ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "10px 14px",
                    borderRadius: 14,
                    background: isTraveler ? T.accent : T.bg2,
                    color: isTraveler ? "#fff" : T.text,
                    border: isTraveler ? "none" : `1px solid ${T.border}`,
                    borderBottomRightRadius: isTraveler ? 4 : 14,
                    borderBottomLeftRadius: isTraveler ? 14 : 4,
                  }}
                >
                  <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap" }}>
                    {msg.message}
                  </p>
                  <span
                    style={{
                      fontSize: 11,
                      color: isTraveler ? "rgba(255,255,255,.6)" : T.muted,
                      display: "block",
                      marginTop: 4,
                      textAlign: "end",
                    }}
                  >
                    {formatTime(msg.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={t("typeMessage")}
          data-glass-skip
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 12,
            border: `1.5px solid ${T.border}`,
            background: T.bg2,
            color: T.text,
            fontSize: 14,
            outline: "none",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = T.accent)}
          onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: "none",
            background: T.accent,
            color: "#fff",
            cursor: !input.trim() || sending ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: !input.trim() || sending ? 0.5 : 1,
            transition: "opacity .2s",
          }}
        >
          {sending ? (
            <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} />
          ) : (
            <Send style={{ width: 18, height: 18 }} />
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
