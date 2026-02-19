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
      {/* Eden starry night card — black artboard blends into dark gradient */}
      <div className="flex flex-col items-center pt-2 pb-1 px-3">
        <button
          type="button"
          onClick={fireWave}
          className="cursor-pointer relative rounded-2xl overflow-hidden"
          title="Say hi!"
          style={{
            background:
              "linear-gradient(180deg, #000000 0%, #041820 50%, #0C4551 100%)",
          }}
        >
          {/* Decorative stars */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 start-5 w-1 h-1 rounded-full bg-white/40" />
            <div className="absolute top-8 end-6 w-0.5 h-0.5 rounded-full bg-white/30" />
            <div className="absolute top-3 end-10 w-0.5 h-0.5 rounded-full bg-white/50" />
            <div className="absolute top-12 start-8 w-0.5 h-0.5 rounded-full bg-white/25" />
            {/* Moon glow */}
            <div
              className="absolute top-3 end-4 w-5 h-5 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(212,242,77,0.25) 0%, transparent 70%)",
              }}
            />
          </div>
          <div className="w-[200px] h-[200px]">
            <RiveComponent />
          </div>
        </button>

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
