"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useTranslations } from "next-intl";

interface TestimonialsProps {
  primaryColor?: string | null;
  opinions: any[];
}

interface NormalizedTestimonial {
  id: string | number;
  name: string;
  location: string;
  comment: string;
  rating: number;
  avatarText: string;
}

function TestimonialCard({
  testimonial,
  primaryColor,
}: {
  testimonial: NormalizedTestimonial;
  primaryColor?: string | null;
}) {
  return (
    <div className="flex-shrink-0 w-[380px] md:w-[420px] bg-white p-7 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group border border-slate-100">
      {/* Quote Icon */}
      <Quote
        className="w-8 h-8 mb-3 transition-transform duration-300 group-hover:scale-110"
        style={{
          color: primaryColor || "rgba(148,163,184,0.5)",
        }}
      />

      {/* Comment */}
      <p className="text-slate-600 text-[15px] mb-5 leading-relaxed line-clamp-4">
        &ldquo;{testimonial.comment}&rdquo;
      </p>

      {/* Rating */}
      {testimonial.rating > 0 && (
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-amber-400 text-amber-400"
            />
          ))}
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        {testimonial.avatarText && (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
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
            <div className="font-semibold text-slate-800 text-sm">{testimonial.name}</div>
          )}
          {testimonial.location && (
            <div className="text-xs text-slate-400">{testimonial.location}</div>
          )}
        </div>
      </div>
    </div>
  );
}

const Testimonials = ({ primaryColor, opinions }: TestimonialsProps) => {
  const t = useTranslations("landing.testimonials");
  const accentColor = primaryColor || "#1CABB0";
  const normalized: NormalizedTestimonial[] = (opinions || [])
    .map((item, index) => {
      const name =
        item?.nombre ?? item?.name ?? item?.cliente_nombre ?? item?.autor ?? "";
      const location =
        item?.ubicacion ?? item?.location ?? item?.ciudad ?? item?.pais ?? "";
      const comment =
        item?.comentario ?? item?.comment ?? item?.texto ?? item?.opinion ?? "";
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

      return { id: item?.id ?? index, name, location, comment, rating, avatarText };
    })
    .filter((item) => item.comment || item.name);

  if (normalized.length === 0) return null;

  // Duplicate items for infinite scroll effect
  const row1 = [...normalized, ...normalized];
  const row2 = [...normalized.slice().reverse(), ...normalized.slice().reverse()];

  return (
    <section
      id="opiniones"
      className="py-24 md:py-28 lg:py-32 relative overflow-hidden scroll-mt-24 bg-white"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm mb-4 font-semibold"
            style={{
              borderColor: `color-mix(in srgb, ${accentColor} 30%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${accentColor} 8%, transparent)`,
              color: accentColor,
              border: "1px solid",
            }}
          >
            {t("badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            {t("title")}{" "}
            <span className="gradient-text-ocean-light">{t("titleHighlight")}</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>
      </div>

      {/* Marquee rows */}
      <div className="space-y-6">
        {/* Row 1 — scrolls left */}
        <div className="marquee-mask overflow-hidden">
          <div
            className="flex gap-6 animate-marquee"
            style={{ "--marquee-duration": `${Math.max(30, normalized.length * 8)}s` } as React.CSSProperties}
          >
            {row1.map((testimonial, i) => (
              <TestimonialCard key={`r1-${i}`} testimonial={testimonial} primaryColor={primaryColor} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right (only if 4+ testimonials) */}
        {normalized.length >= 4 && (
          <div className="marquee-mask overflow-hidden">
            <div
              className="flex gap-6 animate-marquee-reverse"
              style={{ "--marquee-duration": `${Math.max(35, normalized.length * 9)}s` } as React.CSSProperties}
            >
              {row2.map((testimonial, i) => (
                <TestimonialCard key={`r2-${i}`} testimonial={testimonial} primaryColor={primaryColor} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
