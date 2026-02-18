"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Send, Paperclip } from "lucide-react";

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
  const t = useTranslations('admin.soporte.thread');
  const locale = useLocale();
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
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px] max-h-[500px]">
        {messages.map((msg) => {
          if (msg.sender_type === "system") {
            return (
              <div key={msg.id} className="text-center py-2">
                <span className="text-xs text-gray-400 dark:text-white/30 italic bg-gray-50 dark:bg-white/[0.03] px-3 py-1 rounded-full">
                  {msg.message}
                </span>
              </div>
            );
          }

          const isClient = msg.sender_type === "client";

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isClient ? "justify-end" : "justify-start"}`}
            >
              {/* Avatar (left for support) */}
              {!isClient && (
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-gray-500 dark:text-white/50 text-xs font-semibold shrink-0">
                  S
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  isClient
                    ? "bg-drb-turquoise-500 text-white rounded-br-md"
                    : "bg-gray-100 dark:bg-white/[0.06] text-gray-900 dark:text-white/90 rounded-bl-md"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                <p
                  className={`text-[10px] mt-1.5 ${
                    isClient ? "text-white/50" : "text-gray-400 dark:text-white/25"
                  }`}
                >
                  {new Date(msg.created_at).toLocaleString(locale, {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Avatar (right for client) */}
              {isClient && (
                <div className="w-8 h-8 rounded-full bg-drb-turquoise-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  T
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-100 dark:border-white/[0.06] p-4 bg-gray-50/50 dark:bg-white/[0.02]">
        {isClosed && (
          <p className="text-center text-gray-400 dark:text-white/30 text-xs mb-3">
            {t('ticketClosed')}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-xl text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isClosed ? t('reopenPlaceholder') : t('messagePlaceholder')
            }
            className="flex-1 bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-drb-turquoise-500/30 focus:border-drb-turquoise-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isPending || !input.trim()}
            className="p-2.5 rounded-xl bg-drb-turquoise-500 hover:bg-drb-turquoise-600 text-white transition-colors disabled:opacity-40"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
