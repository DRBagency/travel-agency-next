"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2, Bot, User, Sparkles, Lock } from "lucide-react";
import { isAILocked } from "@/lib/plan-gating";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface EdenChatProps {
  clienteId: string;
  agencyContext: string;
  plan?: string;
}

export default function EdenChat({ clienteId, agencyContext, plan }: EdenChatProps) {
  const t = useTranslations("admin.eden");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestions = [t("chip1"), t("chip2"), t("chip3"), t("chip4")];

  if (isAILocked(plan)) {
    return (
      <div className="flex flex-col h-full">
        {/* Eden AI header — compact */}
        <div className="flex flex-col items-center pt-4 pb-2 px-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-drb-turquoise-500 via-drb-turquoise-400 to-drb-lime-500 flex items-center justify-center shadow-lg opacity-50">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-drb-turquoise-500 to-drb-lime-500 dark:from-drb-turquoise-300 dark:to-drb-lime-400 bg-clip-text text-transparent mt-1.5 opacity-50">
            Eden AI
          </span>
        </div>

        {/* Locked overlay */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-white/20 flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-gray-400 dark:text-white/60" />
          </div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-white/80 mb-1">{t("lockedTitle")}</h4>
          <p className="text-xs text-gray-500 dark:text-white/50 mb-4">{t("lockedDesc")}</p>
          <Link
            href="/admin/stripe"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-drb-turquoise-500 to-drb-turquoise-600 text-white hover:brightness-110 transition-all shadow-md"
          >
            {t("upgradePlan")}
          </Link>
        </div>
      </div>
    );
  }

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
      {/* Eden AI header */}
      <div className="flex flex-col items-center pt-4 pb-2 px-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-drb-turquoise-500 via-drb-turquoise-400 to-drb-lime-500 flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-drb-turquoise-500 to-drb-lime-500 dark:from-drb-turquoise-300 dark:to-drb-lime-400 bg-clip-text text-transparent mt-1.5">
          Eden AI
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 min-h-[120px]">
        {messages.length === 0 && (
          <div className="space-y-3">
            {/* Welcome message */}
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-white dark:bg-[#0a2a35]/80 backdrop-blur-md rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-gray-800 dark:text-white shadow-sm border border-gray-200 dark:border-white/15">
                {t("welcome")}
              </div>
            </div>

            {/* Quick suggestions */}
            <div className="grid grid-cols-2 gap-1.5 ps-9">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium
                    bg-drb-turquoise-50 dark:bg-white/15
                    border border-drb-turquoise-200 dark:border-white/20
                    text-drb-turquoise-700 dark:text-white/90
                    hover:bg-drb-turquoise-100 dark:hover:bg-white/25
                    hover:border-drb-turquoise-300 dark:hover:border-white/40
                    transition-all"
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
            className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                msg.role === "user"
                  ? "bg-drb-turquoise-500 text-white rounded-tr-sm border border-drb-turquoise-400/40"
                  : "bg-white dark:bg-[#0a2a35]/80 backdrop-blur-md text-gray-800 dark:text-white rounded-tl-sm border border-gray-200 dark:border-white/15"
              }`}
            >
              <div className="whitespace-pre-wrap break-words leading-relaxed">
                {msg.content}
              </div>
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-sm">
                <User className="w-3.5 h-3.5 text-gray-600 dark:text-white/80" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white dark:bg-[#0a2a35]/80 backdrop-blur-md rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm border border-gray-200 dark:border-white/15">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full bg-drb-turquoise-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-drb-turquoise-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-drb-turquoise-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 pt-2">
        <div className="flex gap-2 items-center bg-gray-50 dark:bg-white/10 rounded-full border border-gray-200 dark:border-white/15 px-2 py-1.5 focus-within:border-drb-turquoise-300 dark:focus-within:border-drb-turquoise-500/40 transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            className="flex-1 bg-transparent text-sm py-1 px-2 outline-none text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
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
