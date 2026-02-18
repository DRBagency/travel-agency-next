"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";
import { useTranslations } from "next-intl";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotWidgetProps {
  clienteId: string;
  primaryColor?: string;
}

export default function ChatbotWidget({
  clienteId,
  primaryColor = "#1CABB0",
}: ChatbotWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("landing.chatbot");
  const [available, setAvailable] = useState<boolean | null>(null);
  const [botName, setBotName] = useState("Asistente");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if chatbot is configured for this client
    fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clienteId, message: "__ping__" }),
    }).then((res) => {
      if (res.status === 404) {
        setAvailable(false);
      } else {
        setAvailable(true);
      }
    }).catch(() => setAvailable(false));
  }, [clienteId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (available === false || available === null) return null;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId,
          message: text,
          history: messages,
        }),
      });

      const data = await res.json();

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("error"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{ backgroundColor: primaryColor }}
          className="fixed bottom-6 end-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 end-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-4rem)] flex flex-col rounded-2xl shadow-2xl border border-white/10 overflow-hidden bg-white dark:bg-gray-900">
          {/* Header */}
          <div
            style={{ backgroundColor: primaryColor }}
            className="flex items-center justify-between px-4 py-3 text-white shrink-0"
          >
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold text-sm">{botName}</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot
                  className="w-10 h-10 mx-auto mb-3 opacity-30"
                  style={{ color: primaryColor }}
                />
                <p className="text-sm text-gray-400 dark:text-white/40">
                  {t("greeting")}
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "text-white"
                      : "bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white/80"
                  }`}
                  style={
                    msg.role === "user"
                      ? { backgroundColor: primaryColor }
                      : undefined
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-white/10 rounded-2xl px-4 py-2.5">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-gray-200 dark:border-white/10 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("placeholder")}
                className="flex-1 rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 px-3 py-2 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:border-gray-300 dark:focus:border-white/30"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{ backgroundColor: primaryColor }}
                className="p-2 rounded-xl text-white disabled:opacity-50 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
