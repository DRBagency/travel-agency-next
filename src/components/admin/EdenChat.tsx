"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2, Bot, User } from "lucide-react";
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";

const STATE_MACHINE = "State Machine 1";

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
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { rive, RiveComponent } = useRive({
    src: "/animations/eden-assistant.riv",
    stateMachines: STATE_MACHINE,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  // Try known input names — the asset exposes trigger/boolean inputs
  const waveTrigger = useStateMachineInput(rive, STATE_MACHINE, "Wave");
  const waveTriggerAlt = useStateMachineInput(rive, STATE_MACHINE, "wave");
  const greetingTrigger = useStateMachineInput(
    rive,
    STATE_MACHINE,
    "Greeting"
  );
  const talkingInput = useStateMachineInput(rive, STATE_MACHINE, "Talking");
  const talkingAlt = useStateMachineInput(rive, STATE_MACHINE, "talking");
  const isTalking = useStateMachineInput(rive, STATE_MACHINE, "isTalking");

  // Log discovered inputs on mount and fire greeting
  useEffect(() => {
    if (!rive || hasGreeted) return;

    try {
      const inputs = rive.stateMachineInputs(STATE_MACHINE);
      if (inputs && inputs.length > 0) {
        console.log(
          "[Eden] State machine inputs:",
          inputs.map((i) => `${i.name} (${i.type})`).join(", ")
        );
      }
    } catch {
      // rive not ready yet
    }

    // Fire greeting/wave on first load
    const timer = setTimeout(() => {
      const trigger = waveTrigger || waveTriggerAlt || greetingTrigger;
      if (trigger && typeof (trigger as any).fire === "function") {
        (trigger as any).fire();
      } else if (trigger) {
        trigger.value = true;
      }
      setHasGreeted(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [rive, waveTrigger, waveTriggerAlt, greetingTrigger, hasGreeted]);

  // Set talking state while loading AI response
  useEffect(() => {
    const inp = talkingInput || talkingAlt || isTalking;
    if (inp) {
      inp.value = loading;
    }
  }, [loading, talkingInput, talkingAlt, isTalking]);

  const fireWave = useCallback(() => {
    const trigger = waveTrigger || waveTriggerAlt || greetingTrigger;
    if (trigger && typeof (trigger as any).fire === "function") {
      (trigger as any).fire();
    } else if (trigger) {
      trigger.value = true;
    }
  }, [waveTrigger, waveTriggerAlt, greetingTrigger]);

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
      {/* Eden character — large, transparent bg via mix-blend-mode */}
      <div className="flex flex-col items-center pt-3 pb-1 px-3">
        <button
          type="button"
          onClick={fireWave}
          className="cursor-pointer relative"
          title="Say hi!"
        >
          {/* Radial mask to blend Rive's dark artboard into the landscape bg */}
          <div
            className="relative w-[220px] h-[220px] eden-rive-wrapper"
            style={{ background: "transparent" }}
          >
            <RiveComponent className="eden-rive-canvas" />
          </div>
        </button>

        {/* Name with gradient */}
        <span className="text-xl font-bold bg-gradient-to-r from-drb-turquoise-400 to-drb-lime-400 bg-clip-text text-transparent -mt-2">
          Eden
        </span>
        <p className="text-[11px] text-drb-turquoise-700/70 dark:text-drb-turquoise-300/60 mt-0.5">
          {t("subtitle")}
        </p>
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
              <div className="bg-white/70 dark:bg-drb-turquoise-900/60 backdrop-blur-sm rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-drb-turquoise-800 dark:text-white/85 shadow-sm border border-white/40 dark:border-white/[0.06]">
                {t("welcome")}
              </div>
            </div>

            {/* Quick suggestions — pill style */}
            <div className="flex flex-wrap gap-1.5 ps-8">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/60 dark:bg-drb-turquoise-900/50 backdrop-blur-sm border border-drb-turquoise-200/60 dark:border-drb-turquoise-500/20 text-drb-turquoise-700 dark:text-drb-turquoise-300 hover:bg-drb-turquoise-50 dark:hover:bg-drb-turquoise-500/20 hover:border-drb-turquoise-400 dark:hover:border-drb-turquoise-400/40 transition-all shadow-sm"
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
                  ? "bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 text-white rounded-tr-sm"
                  : "bg-white/70 dark:bg-drb-turquoise-900/60 backdrop-blur-sm text-drb-turquoise-800 dark:text-white/85 rounded-tl-sm border border-white/40 dark:border-white/[0.06]"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {msg.content}
              </div>
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-sm">
                <User className="w-3 h-3 text-drb-turquoise-600 dark:text-white/50" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-lime-500 flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="bg-white/70 dark:bg-drb-turquoise-900/60 backdrop-blur-sm rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm border border-white/40 dark:border-white/[0.06]">
              <div className="flex items-center gap-1">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-drb-turquoise-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full bg-drb-turquoise-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full bg-drb-turquoise-400 animate-bounce"
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
        <div className="flex gap-2 bg-white/70 dark:bg-drb-turquoise-900/60 backdrop-blur-sm rounded-full border border-white/50 dark:border-drb-turquoise-500/20 shadow-sm px-1 py-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            className="flex-1 bg-transparent text-xs py-1.5 px-3 outline-none text-drb-turquoise-800 dark:text-white placeholder:text-drb-turquoise-400/60 dark:placeholder:text-drb-turquoise-400/40"
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
