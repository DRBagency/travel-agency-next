"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2, Bot, User } from "lucide-react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

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

  const { RiveComponent } = useRive({
    src: "/animations/eden-assistant.riv",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestions = [
    t("chip1"),
    t("chip2"),
    t("chip3"),
    t("chip4"),
  ];

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
      {/* Gradient background header with Rive character */}
      <div className="relative overflow-hidden rounded-2xl mx-3 mt-3 bg-gradient-to-br from-drb-turquoise-500 via-drb-turquoise-600 to-drb-turquoise-700">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,242,77,0.15),transparent_60%)]" />
        <div className="relative flex flex-col items-center py-4 px-3">
          <div className="w-[100px] h-[100px] mb-2">
            <RiveComponent />
          </div>
          <h3 className="text-white font-bold text-base">Eden</h3>
          <p className="text-white/70 text-xs text-center mt-0.5">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="space-y-3">
            {/* Welcome message */}
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center shrink-0">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-white/[0.06] rounded-xl rounded-tl-sm px-3 py-2 text-xs text-gray-700 dark:text-white/80">
                {t("welcome")}
              </div>
            </div>

            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-1.5 ps-8">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-drb-turquoise-200 dark:border-drb-turquoise-500/20 text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:bg-drb-turquoise-50 dark:hover:bg-drb-turquoise-500/10 transition-colors"
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
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center shrink-0">
                <Bot className="w-3 h-3 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
                msg.role === "user"
                  ? "bg-drb-turquoise-500 text-white rounded-tr-sm"
                  : "bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/80 rounded-tl-sm"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">{msg.content}</div>
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-md bg-gray-200 dark:bg-white/10 flex items-center justify-center shrink-0">
                <User className="w-3 h-3 text-gray-500 dark:text-white/50" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center shrink-0">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-white/[0.06] rounded-xl rounded-tl-sm px-3 py-2">
              <div className="flex items-center gap-1">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 dark:border-white/[0.06] p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            className="panel-input flex-1 text-xs py-2"
            placeholder={t("placeholder")}
            disabled={loading}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="shrink-0 w-8 h-8 rounded-lg bg-drb-turquoise-500 hover:bg-drb-turquoise-600 disabled:opacity-40 flex items-center justify-center transition-colors"
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
