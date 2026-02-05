"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface TestimonialsProps {
  primaryColor?: string | null;
  opinions: any[];
}

const Testimonials = ({ primaryColor, opinions }: TestimonialsProps) => {
  const normalized = (opinions || [])
    .map((item, index) => {
      const name =
        item?.nombre ??
        item?.name ??
        item?.cliente_nombre ??
        item?.autor ??
        "";
      const location =
        item?.ubicacion ??
        item?.location ??
        item?.ciudad ??
        item?.pais ??
        "";
      const comment =
        item?.comentario ??
        item?.comment ??
        item?.texto ??
        item?.opinion ??
        "";
      const ratingValue =
        Number(item?.rating ?? item?.puntuacion ?? item?.estrellas ?? 0) || 0;
      const rating = Math.max(0, Math.min(5, Math.round(ratingValue)));
      const avatarText =
        typeof item?.avatar === "string" && item.avatar.trim()
          ? item.avatar.trim()
          : typeof name === "string" && name.trim()
          ? name
              .trim()
              .split(" ")
              .map((part: string) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
          : "";

      return {
        id: item?.id ?? index,
        name,
        location,
        comment,
        rating,
        avatarText,
      };
    })
    .filter((item) => item.comment || item.name);

  if (normalized.length === 0) return null;
  return (
    <section id="opiniones" className="py-24 md:py-28 lg:py-32 relative overflow-hidden scroll-mt-24">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />

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
            Opiniones reales
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Lo que dicen nuestros <span className="gradient-text-ocean">viajeros</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Miles de clientes ya han confiado en nosotros para sus vacaciones. Lee sus experiencias.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {normalized.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-3xl border border-white/10 hover:border-white/30 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote
                className="w-10 h-10 mb-4"
                style={{
                  color: primaryColor
                    ? "color-mix(in srgb, " + primaryColor + " 60%, transparent)"
                    : "rgba(255,255,255,0.25)",
                }}
              />

              {/* Comment */}
              <p className="text-white/80 text-lg mb-6 leading-relaxed">
                "{testimonial.comment}"
              </p>

              {/* Rating */}
              {testimonial.rating > 0 && (
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5"
                      style={{
                        color: primaryColor || "hsl(var(--gold))",
                        fill: primaryColor || "hsl(var(--gold))",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Author */}
              <div className="flex items-center gap-4">
                {testimonial.avatarText && (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{
                      background: primaryColor
                        ? `linear-gradient(135deg, ${primaryColor}, color-mix(in srgb, ${primaryColor} 65%, #22d3ee))`
                        : "linear-gradient(135deg, #0ea5e9, #22d3ee)",
                    }}
                  >
                    {testimonial.avatarText}
                  </div>
                )}
                <div>
                  {testimonial.name && (
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                  )}
                  {testimonial.location && (
                    <div className="text-sm text-white/60">
                      {testimonial.location}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
