"use client";

import { Plane } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface FooterProps {
  primaryColor?: string | null;
  clientName?: string | null;
  logoUrl?: string | null;
  footerText?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
  legalPages?: any[];
}

const Footer = ({
  primaryColor,
  clientName,
  logoUrl,
  footerText,
  instagramUrl,
  facebookUrl,
  tiktokUrl,
  legalPages = [],
}: FooterProps) => {
  const t = useTranslations("landing");
  const tn = useTranslations("landing.navbar");
  const tf = useTranslations("landing.footer");
  const currentYear = new Date().getFullYear();
  const accentColor = primaryColor || "#1CABB0";

  const safeLogoUrl = (() => {
    if (typeof logoUrl !== "string") return null;
    const cleaned = logoUrl.trim();
    if (!cleaned) return null;
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
    if (cleaned.startsWith("/")) return cleaned;
    return null;
  })();

  const socials = [
    {
      url: instagramUrl,
      label: "Instagram",
      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    },
    {
      url: facebookUrl,
      label: "Facebook",
      path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    },
    {
      url: tiktokUrl,
      label: "TikTok",
      path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
    },
  ].filter((s) => s.url);

  const navItems = [
    { label: tn("destinations"), href: "#destinos" },
    { label: tn("reviews"), href: "#opiniones" },
    { label: tn("about"), href: "#nosotros" },
    { label: tn("contact"), href: "#contacto" },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-slate-950">
      {/* Glow accent */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-20 start-1/3 h-64 w-64 rounded-full blur-[120px]"
          style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 18%, transparent)` }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-4 group">
              {safeLogoUrl ? (
                <img
                  src={safeLogoUrl}
                  alt={clientName ?? ""}
                  className="h-11 w-11 rounded-xl object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, color-mix(in srgb, ${accentColor} 65%, #22d3ee))`,
                  }}
                >
                  <Plane className="w-5 h-5 text-white" />
                </div>
              )}
              {clientName && (
                <span className="font-display text-xl font-bold">{clientName}</span>
              )}
            </a>
            {footerText && (
              <p className="text-white/55 max-w-sm mb-6 leading-relaxed">{footerText}</p>
            )}

            {/* Social Links with hover glow */}
            {socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-white/20"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = `color-mix(in srgb, ${accentColor} 20%, transparent)`;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px color-mix(in srgb, ${accentColor} 30%, transparent)`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.05)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                    aria-label={s.label}
                  >
                    <svg className="w-[18px] h-[18px] text-white/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d={s.path} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-5 text-white/90">{tf("navigation")}</h4>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-white/55 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          {legalPages.length > 0 && (
            <div>
              <h4 className="font-display font-semibold mb-5 text-white/90">{tf("legal")}</h4>
              <ul className="space-y-3">
                {legalPages.map((item: any) => {
                  const slug = item?.slug ?? "";
                  const label = item?.titulo ?? item?.title ?? slug;
                  if (!slug) return null;
                  return (
                    <li key={slug}>
                      <a
                        href={`/legal/${slug}`}
                        className="text-white/55 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {currentYear} {clientName || "Travel Agency"}. {tf("rights")}
          </p>
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <span>{tf("poweredBy")}</span>
            <span className="font-semibold text-white/50">DRB Agency</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
