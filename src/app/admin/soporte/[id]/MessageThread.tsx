"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender_type: "client" | "admin" | "system";
  message: string;
  created_at: string;
}

interface MessageThreadProps {
  messages: Message[];
  ticketStatus: string;
  addMessageAction: (formData: FormData) => Promise<void>;
}

export default function MessageThread({
  messages,
  ticketStatus,
  addMessageAction,
}: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;

    const formData = new FormData();
    formData.set("message", input.trim());

    setInput("");
    startTransition(() => addMessageAction(formData));
  }

  const isClosed = ticketStatus === "closed";

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[500px]">
        {messages.map((msg) => {
          if (msg.sender_type === "system") {
            return (
              <div key={msg.id} className="text-center">
                <span className="text-xs text-gray-400 dark:text-white/40 italic">
                  {msg.message}
                </span>
              </div>
            );
          }

          const isClient = msg.sender_type === "client";

          return (
            <div
              key={msg.id}
              className={`flex ${isClient ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isClient
                    ? "bg-drb-turquoise-500 dark:bg-drb-turquoise-600 text-white rounded-br-md"
                    : "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white/90 rounded-bl-md"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    isClient ? "text-white/60" : "text-gray-400 dark:text-white/30"
                  }`}
                >
                  {new Date(msg.created_at).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-100 dark:border-white/10 p-4">
        {isClosed ? (
          <p className="text-center text-gray-400 dark:text-white/40 text-sm py-2">
            Este ticket esta cerrado. Envia un mensaje para reabrirlo.
          </p>
        ) : null}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isClosed ? "Escribe para reabrir el ticket..." : "Escribe un mensaje..."
            }
            className="panel-input flex-1"
          />
          <button
            type="submit"
            disabled={isPending || !input.trim()}
            className="px-4 py-2 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-drb-turquoise-900/30 border-t-drb-turquoise-900 rounded-full animate-spin inline-block" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
