"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ContactProps {
  primaryColor?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  heroImageUrl?: string | null;
}

const Contact = ({ primaryColor, email, phone, address, heroImageUrl }: ContactProps) => {
  const t = useTranslations("landing.contact");
  const accentColor = primaryColor || "#1CABB0";
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch {
      // Silently fail for the end user
    } finally {
      setIsSubmitting(false);
    }
  };

  const safeImageUrl = (() => {
    if (typeof heroImageUrl !== "string") return null;
    const cleaned = heroImageUrl.trim();
    if (!cleaned) return null;
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
    if (cleaned.startsWith("/")) return cleaned;
    return null;
  })();

  return (
    <section id="contacto" className="py-24 md:py-28 lg:py-32 relative scroll-mt-24">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            {t("readyTitle")}
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            {t("readySubtitle")}
          </p>
        </motion.div>

        {/* Split card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
          style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 90%, #0f172a)` }}
        >
          <div className="grid lg:grid-cols-2">
            {/* Form side */}
            <div className="p-8 md:p-12 text-white">
              {/* Contact info */}
              {(email || phone || address) && (
                <div className="flex flex-wrap gap-4 text-sm text-white/70 mb-8">
                  {email && <span>{email}</span>}
                  {phone && <span>{phone}</span>}
                  {address && <span>{address}</span>}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {t("successMessage")}
                  </motion.div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                      {t("nameLabel")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                      placeholder={t("namePlaceholder")}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                      {t("emailLabel")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                      placeholder={t("emailPlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                    {t("messageLabel")}
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
                    placeholder={t("messagePlaceholder")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-semibold bg-white text-slate-900 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {isSubmitting ? (
                    t("sending")
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t("send")}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Image/quote side — hidden on mobile */}
            <div className="relative hidden lg:block">
              {safeImageUrl ? (
                <Image
                  src={safeImageUrl}
                  alt=""
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              )}
              <div className="absolute inset-0 bg-black/40" />

              {/* Quote */}
              <div className="absolute inset-0 flex items-end p-12">
                <div>
                  <p className="text-white/90 text-xl italic leading-relaxed mb-4">
                    &ldquo;{t("quote")}&rdquo;
                  </p>
                  <span className="text-white/60 text-sm font-semibold">
                    — {t("quoteAuthor")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
