"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2, Bot, User } from "lucide-react";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[280px] flex items-center justify-center">
      <div className="animate-pulse text-white/50 text-sm">Loading Eden AI...</div>
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
  const splineContainerRef = useRef<HTMLDivElement>(null);

  // Block wheel events inside Spline to prevent panel scroll + zoom
  useEffect(() => {
    const el = splineContainerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

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
        <div
          ref={splineContainerRef}
          className="eden-spline-wrapper relative w-full h-[280px] rounded-2xl overflow-hidden"
        >
          <Spline scene="https://prod.spline.design/BkOlv0JtuanNyTN9/scene.splinecode" />
        </div>

        {/* Name with gradient */}
        <span className="text-2xl font-bold bg-gradient-to-r from-drb-turquoise-300 to-drb-lime-400 bg-clip-text text-transparent mt-1.5">
          Eden AI
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="space-y-3">
            {/* Welcome message */}
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-white/30 backdrop-blur-md rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-white shadow-sm border border-white/30">
                {t("welcome")}
              </div>
            </div>

            {/* Quick suggestions — pill style */}
            <div className="flex flex-wrap gap-1.5 ps-9">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all shadow-sm"
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
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                msg.role === "user"
                  ? "bg-drb-turquoise-500/90 text-white rounded-tr-sm border border-drb-turquoise-400/40"
                  : "bg-white/30 backdrop-blur-md text-white rounded-tl-sm border border-white/30"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {msg.content}
              </div>
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-sm">
                <User className="w-3.5 h-3.5 text-white/80" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white/30 backdrop-blur-md rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm border border-white/30">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full bg-drb-turquoise-300 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-drb-turquoise-300 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-drb-turquoise-300 animate-bounce"
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
        <div className="flex gap-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-sm px-1.5 py-1.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            className="flex-1 bg-transparent text-sm py-1.5 px-3 outline-none text-white placeholder:text-white/50"
            placeholder={t("placeholder")}
            disabled={loading}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 hover:from-drb-turquoise-400 hover:to-drb-turquoise-500 disabled:opacity-40 flex items-center justify-center transition-all shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
