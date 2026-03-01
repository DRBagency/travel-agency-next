"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, Send, Loader2 } from "lucide-react";

interface PortalChatAdminProps {
  reservaId: string;
}

interface Message {
  id: string;
  sender_type: "traveler" | "agency";
  sender_email: string;
  message: string;
  created_at: string;
  read_at: string | null;
}

export default function PortalChatAdmin({ reservaId }: PortalChatAdminProps) {
  const t = useTranslations("admin.reserva");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/portal-messages?reserva_id=${reservaId}`);
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
      const res = await fetch("/api/admin/portal-messages", {
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
    <div className="panel-card p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-drb-turquoise-500" />
        {t("portalChat") || "Chat con viajero"}
      </h3>

      {/* Messages */}
      <div
        className="overflow-y-auto space-y-3 mb-3"
        style={{ maxHeight: 320, minHeight: 100 }}
      >
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 text-gray-400 dark:text-white/40 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-gray-400 dark:text-white/40 py-8">
            {t("noPortalMessages") || "No hay mensajes del viajero"}
          </p>
        ) : (
          messages.map((msg) => {
            const isAgency = msg.sender_type === "agency";
            return (
              <div key={msg.id} className={`flex ${isAgency ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 text-sm ${
                    isAgency
                      ? "bg-drb-turquoise-500 text-white rounded-xl rounded-br-sm"
                      : "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white rounded-xl rounded-bl-sm"
                  }`}
                >
                  {!isAgency && (
                    <span className="text-xs text-gray-500 dark:text-white/50 block mb-1">
                      {msg.sender_email}
                    </span>
                  )}
                  <p className="whitespace-pre-wrap m-0">{msg.message}</p>
                  <span
                    className={`text-[10px] block mt-1 text-end ${
                      isAgency ? "text-white/60" : "text-gray-400 dark:text-white/30"
                    }`}
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
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={t("replyPlaceholder") || "Escribe un mensaje..."}
          className="panel-input flex-1 text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="btn-primary px-3 flex items-center gap-1.5 disabled:opacity-50"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
