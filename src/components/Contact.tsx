"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin } from "lucide-react";

interface ContactProps {
  primaryColor?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

const Contact = ({ primaryColor, email, phone, address }: ContactProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <section id="contacto" className="py-24 md:py-28 lg:py-32 relative scroll-mt-24">
      {/* Background decoration */}
      <div className="absolute top-1/2 start-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2" />
      
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
            style={
              primaryColor
                ? {
                    borderColor: "color-mix(in srgb, " + primaryColor + " 35%, transparent)",
                    backgroundColor: "color-mix(in srgb, " + primaryColor + " 12%, transparent)",
                  }
                : undefined
            }
          >
            Contacto
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            ¿Tienes alguna <span className="gradient-text-sunset">duda</span>?
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {(email || phone || address) && (
              <div className="glass-card p-6 rounded-3xl border border-white/10">
                <h3 className="font-display text-xl font-semibold mb-6">
                  Información de contacto
                </h3>
                <div className="space-y-6">
                {email && (
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: primaryColor
                          ? `color-mix(in srgb, ${primaryColor} 18%, transparent)`
                          : "rgba(14,165,233,0.2)",
                      }}
                    >
                      <Mail
                        className="w-5 h-5"
                        style={{ color: primaryColor || "#7dd3fc" }}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white">Email</div>
                      <div className="text-white/60">{email}</div>
                    </div>
                  </div>
                )}
                {phone && (
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: primaryColor
                          ? `color-mix(in srgb, ${primaryColor} 18%, transparent)`
                          : "rgba(34,211,238,0.2)",
                      }}
                    >
                      <Phone
                        className="w-5 h-5"
                        style={{ color: primaryColor || "#67e8f9" }}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white">Teléfono</div>
                      <div className="text-white/60">{phone}</div>
                    </div>
                  </div>
                )}
                {address && (
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: primaryColor
                          ? `color-mix(in srgb, ${primaryColor} 18%, transparent)`
                          : "rgba(45,212,191,0.2)",
                      }}
                    >
                      <MapPin
                        className="w-5 h-5"
                        style={{ color: primaryColor || "#5eead4" }}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white">Dirección</div>
                      <div className="text-white/60 whitespace-pre-line">
                        {address}
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            )}

            <div
              className="p-6 rounded-3xl border border-white/10"
              style={{
                background: primaryColor
                  ? `linear-gradient(135deg, color-mix(in srgb, ${primaryColor} 16%, transparent), color-mix(in srgb, ${primaryColor} 6%, transparent))`
                  : "linear-gradient(135deg, rgba(14,165,233,0.1), rgba(34,211,238,0.1))",
              }}
            >
              <h4 className="font-semibold text-white mb-2">
                ¿Necesitas ayuda con tu reserva?
              </h4>
              <p className="text-white/70 text-sm">
                Para consultas sobre reservas existentes, accede a tu cuenta o 
                contacta con nuestro equipo de atención al cliente.
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
              <div className="space-y-6">
                {isSubmitted && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                    Mensaje enviado correctamente. Te contactaremos pronto.
                  </div>
                )}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={
                    primaryColor
                      ? "w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition hover:brightness-110 shadow-[0_16px_40px_rgba(2,6,23,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      : "w-full btn-gradient py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  }
                  style={
                    primaryColor
                      ? { backgroundColor: primaryColor }
                      : undefined
                  }
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar mensaje
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
