"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Plane } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface NavbarProps {
  clientName: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
}

const Navbar = ({
  clientName,
  logoUrl,
  primaryColor,
  ctaText,
  ctaLink,
}: NavbarProps) => {
  const t = useTranslations("landing.navbar");
  const navLinks = [
    { href: "#destinos", label: t("destinations") },
    { href: "#opiniones", label: t("reviews") },
    { href: "#nosotros", label: t("about") },
    { href: "#contacto", label: t("contact") },
  ];
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 start-0 end-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
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
                className={cn(
                  "font-display text-xl font-bold transition-colors duration-300",
                  isScrolled ? "text-slate-900" : "text-white"
                )}
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
                  className={cn(
                    "text-sm font-medium transition-colors duration-300 relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-sm",
                    isScrolled
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-white/80 hover:text-white"
                  )}
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
              className={cn(
                "md:hidden p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
                isScrolled ? "hover:bg-slate-100 text-slate-900" : "hover:bg-white/10 text-white"
              )}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

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
