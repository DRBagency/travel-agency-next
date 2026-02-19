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
  const greetingTrigger = useStateMachineInput(rive, STATE_MACHINE, "Greeting");
  const talkingInput = useStateMachineInput(rive, STATE_MACHINE, "Talking");
  const talkingAlt = useStateMachineInput(rive, STATE_MACHINE, "talking");
  const isTalking = useStateMachineInput(rive, STATE_MACHINE, "isTalking");

  // Log discovered inputs on mount (dev only) and fire greeting
  useEffect(() => {
    if (!rive || hasGreeted) return;

    // Discover all available inputs
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
    const input = talkingInput || talkingAlt || isTalking;
    if (input) {
      input.value = loading;
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
      {/* Eden character header — transparent, Rive-powered animations */}
      <div className="flex flex-col items-center pt-4 pb-2 px-3">
        <button
          type="button"
          onClick={fireWave}
          className="cursor-pointer"
          title="Say hi!"
        >
          <div
            className="w-[180px] h-[180px]"
            style={{ background: "transparent" }}
          >
            <RiveComponent
              style={{ background: "transparent" }}
            />
          </div>
        </button>
        <h3 className="text-gray-900 dark:text-white font-bold text-base -mt-1">Eden</h3>
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
