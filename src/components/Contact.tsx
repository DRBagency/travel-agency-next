"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface ContactProps {
  primaryColor?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

const Contact = ({ primaryColor, email, phone, address }: ContactProps) => {
  const t = useTranslations("landing.contact");
  const accentColor = primaryColor || "#1CABB0";
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const contactItems = [
    { icon: Mail, label: t("emailLabel"), value: email, color: accentColor },
    { icon: Phone, label: t("phoneLabel"), value: phone, color: accentColor },
    { icon: MapPin, label: t("addressLabel"), value: address, color: accentColor },
  ].filter((c) => c.value);

  return (
    <section id="contacto" className="py-24 md:py-28 lg:py-32 relative scroll-mt-24">
      {/* Background decoration */}
      <div className="absolute top-1/2 start-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 animate-float-slow" style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)` }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full glass-card text-sm text-white/70 mb-4"
            style={{
              borderColor: `color-mix(in srgb, ${accentColor} 35%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
            }}
          >
            {t("badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t("title")} <span className="gradient-text-sunset">{t("titleHighlight")}</span>?
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactItems.length > 0 && (
              <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-5">
                <h3 className="font-display text-xl font-semibold">
                  {t("infoTitle")}
                </h3>
                {contactItems.map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-4 group cursor-default"
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `color-mix(in srgb, ${item.color} 18%, transparent)` }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{item.label}</div>
                      <div className="text-white/60 text-sm whitespace-pre-line">{item.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div
              className="p-6 rounded-3xl border border-white/10 transition-all duration-300 hover:border-white/20"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${accentColor} 16%, transparent), color-mix(in srgb, ${accentColor} 6%, transparent))`,
              }}
            >
              <h4 className="font-semibold text-white mb-2">
                {t("helpTitle")}
              </h4>
              <p className="text-white/70 text-sm">
                {t("helpText")}
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form
              onSubmit={handleSubmit}
              className="glass-card p-8 rounded-3xl border border-white/10"
            >
              <div className="space-y-5">
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {t("successMessage")}
                  </motion.div>
                )}

                {[
                  { id: "name", label: t("nameLabel"), type: "text", placeholder: t("namePlaceholder") },
                  { id: "email", label: t("emailLabel"), type: "email", placeholder: t("emailPlaceholder") },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-white mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      value={(formData as any)[field.id]}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                    {t("messageLabel")}
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all resize-none"
                    placeholder={t("messagePlaceholder")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="hero-glow-btn w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  style={{ backgroundColor: accentColor }}
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
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
