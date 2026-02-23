"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Menu, X, Plane } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface NavbarProps {
  clientName: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  hasBlog?: boolean;
}

const Navbar = ({
  clientName,
  logoUrl,
  primaryColor,
  ctaText,
  ctaLink,
  hasBlog,
}: NavbarProps) => {
  const t = useTranslations("landing.navbar");
  const navLinks = [
    { href: "#destinos", label: t("destinations") },
    { href: "#opiniones", label: t("reviews") },
    { href: "#nosotros", label: t("about") },
    { href: "#contacto", label: t("contact") },
    ...(hasBlog ? [{ href: "#blog", label: t("blog") }] : []),
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const safeLogoUrl = (() => {
    if (typeof logoUrl !== "string") return null;
    const cleaned = logoUrl.trim();
    if (!cleaned) return null;
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
    if (cleaned.startsWith("/")) return cleaned;
    return null;
  })();

  const shouldRenderCta = Boolean(ctaText && ctaLink);
  const accentColor = primaryColor || "#1CABB0";

  const { scrollY } = useScroll();

  // Continuous interpolation values
  const bgOpacity = useTransform(scrollY, [0, 150], [0, 0.92]);
  const blurPx = useTransform(scrollY, [0, 150], [0, 12]);
  const shadowOpacity = useTransform(scrollY, [0, 150], [0, 0.08]);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 50);
  });

  return (
    <>
      <motion.nav
        className="fixed top-0 start-0 end-0 z-50"
        style={{
          backgroundColor: useTransform(bgOpacity, (v) => `rgba(255,255,255,${v})`),
          backdropFilter: useTransform(blurPx, (v) => `blur(${v}px)`),
          WebkitBackdropFilter: useTransform(blurPx, (v) => `blur(${v}px)`),
          boxShadow: useTransform(shadowOpacity, (v) => `0 1px 3px rgba(0,0,0,${v})`),
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3">
              {safeLogoUrl ? (
                <Image
                  src={safeLogoUrl}
                  alt={clientName}
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Plane className="w-5 h-5 text-slate-600" />
                </div>
              )}
              <span
                className="font-display text-xl font-bold transition-colors duration-500"
                style={{ color: scrolled ? "#0f172a" : "#ffffff" }}
              >
                {clientName}
              </span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-500 relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-sm"
                  style={{
                    color: scrolled ? "#475569" : "rgba(255,255,255,0.8)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = scrolled ? "#0f172a" : "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = scrolled ? "#475569" : "rgba(255,255,255,0.8)";
                  }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 start-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </a>
              ))}
            </div>

            {/* CTA pill */}
            {shouldRenderCta && (
              <div className="hidden md:block">
                <a
                  href={ctaLink ?? undefined}
                  className="px-6 py-2.5 rounded-full font-semibold text-sm text-white shadow-lg hover:brightness-110 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  style={{ backgroundColor: accentColor }}
                >
                  {ctaText}
                </a>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              style={{
                color: scrolled ? "#0f172a" : "#ffffff",
              }}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute end-0 top-0 bottom-0 w-80 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-xl font-bold text-slate-900">
                  {clientName}
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    {link.label}
                  </a>
                ))}

                {shouldRenderCta && (
                  <a
                    href={ctaLink ?? undefined}
                    className="block mt-6 px-4 py-3 rounded-full text-center font-semibold text-white shadow-lg"
                    style={{ backgroundColor: accentColor }}
                  >
                    {ctaText}
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
