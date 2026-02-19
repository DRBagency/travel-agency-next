"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2, Bot, User } from "lucide-react";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[250px] flex items-center justify-center">
      <div className="animate-pulse text-white/50 text-sm">Loading Eden...</div>
    </div>
  ),
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface EdenChatProps {
  clienteId: string;
  agencyContext: string;
}

export default function EdenChat({ clienteId, agencyContext }: EdenChatProps) {
  const t = useTranslations("admin.eden");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestions = [t("chip1"), t("chip2"), t("chip3"), t("chip4")];

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "free-chat",
          data: {
            prompt: msg,
            agencyContext,
            history: messages
              .slice(-10)
              .map((m) => `${m.role}: ${m.content}`)
              .join("\n"),
          },
          clienteId,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: json.result },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${e.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Eden 3D Spline scene */}
      <div className="flex flex-col items-center pt-2 pb-1 px-3">
        <div className="relative w-full h-[250px] rounded-2xl overflow-hidden">
          <Spline scene="https://prod.spline.design/BkOlv0JtuanNyTN9/scene.splinecode" />
        </div>

        {/* Name with gradient */}
        <span className="text-2xl font-bold bg-gradient-to-r from-drb-turquoise-300 to-drb-lime-400 bg-clip-text text-transparent mt-1.5">
          Eden
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="space-y-3">
            {/* Welcome message */}
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-white/90 shadow-sm border border-white/20">
                {t("welcome")}
              </div>
            </div>

            {/* Quick suggestions — pill style */}
            <div className="flex flex-wrap gap-1.5 ps-8">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/15 backdrop-blur-sm border border-white/25 text-white/85 hover:bg-white/25 hover:border-white/40 transition-all shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-3 h-3 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs shadow-sm ${
                msg.role === "user"
                  ? "bg-drb-turquoise-500/80 text-white rounded-tr-sm border border-drb-turquoise-400/30"
                  : "bg-white/20 backdrop-blur-sm text-white/90 rounded-tl-sm border border-white/20"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {msg.content}
              </div>
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-sm">
                <User className="w-3 h-3 text-white/70" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm border border-white/20">
              <div className="flex items-center gap-1">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-drb-turquoise-300 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full bg-drb-turquoise-300 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full bg-drb-turquoise-300 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input — premium style */}
      <div className="p-3 pt-2">
        <div className="flex gap-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/25 shadow-sm px-1 py-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            className="flex-1 bg-transparent text-xs py-1.5 px-3 outline-none text-white placeholder:text-white/40"
            placeholder={t("placeholder")}
            disabled={loading}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 hover:from-drb-turquoise-400 hover:to-drb-turquoise-500 disabled:opacity-40 flex items-center justify-center transition-all shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 text-white animate-spin" />
            ) : (
              <Send className="w-3 h-3 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
