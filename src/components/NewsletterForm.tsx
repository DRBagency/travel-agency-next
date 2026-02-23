"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface NewsletterFormProps {
  clienteId: string;
  primaryColor?: string | null;
}

const NewsletterForm = ({ clienteId, primaryColor }: NewsletterFormProps) => {
  const t = useTranslations("landing.footer");
  const accentColor = primaryColor || "#1CABB0";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), clienteId }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm">
        <CheckCircle className="w-4 h-4" />
        {t("newsletterSuccess")}
      </div>
    );
  }

  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">{t("newsletterDesc")}</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletterPlaceholder")}
          required
          className="flex-1 px-4 py-2.5 rounded-full bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-slate-500 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white transition-all duration-300 hover:brightness-110 disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-400 text-xs mt-2">{t("newsletterError")}</p>
      )}
    </div>
  );
};

export default NewsletterForm;
