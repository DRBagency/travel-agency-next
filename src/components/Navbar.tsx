"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Plane } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NavbarProps {
  clientName: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
}

const navLinks = [
  { href: "#destinos", label: "Destinos" },
  { href: "#opiniones", label: "Opiniones" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

const Navbar = ({
  clientName,
  logoUrl,
  primaryColor,
  ctaText,
  ctaLink,
}: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const safeLogoUrl = (() => {
    if (typeof logoUrl !== "string") return null;

    const cleaned = logoUrl.trim();

    if (!cleaned) return null;

    // URL absoluta válida
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
      return cleaned;
    }

    // Path local válido (/logo.png)
    if (cleaned.startsWith("/")) {
      return cleaned;
    }

    // Todo lo demás → inválido
    return null;
  })();

  const shouldRenderCta = Boolean(ctaText && ctaLink);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "sticky top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-slate-950/85 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(2,6,23,0.55)]"
            : "bg-slate-950/60 backdrop-blur-md"
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
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Plane className="w-5 h-5 text-foreground" />
                </div>
              )}
              <span className="font-display text-xl font-bold">
                {clientName}
              </span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/70 hover:text-white transition-colors relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-sm"
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{
                      backgroundColor: primaryColor || "currentColor",
                    }}
                  />
                </a>
              ))}
            </div>

            {/* CTA */}
            {shouldRenderCta && (
              <div className="hidden md:block">
                <a
                  href={ctaLink ?? undefined}
                  className={
                    primaryColor
                      ? "px-6 py-2.5 rounded-xl font-semibold text-sm text-white shadow-[0_10px_24px_rgba(0,0,0,0.35)] hover:brightness-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      : "px-6 py-2.5 rounded-xl font-semibold text-sm bg-white text-slate-950 shadow-[0_10px_24px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  }
                  style={
                    primaryColor
                      ? { backgroundColor: primaryColor }
                      : undefined
                  }
                >
                  {ctaText}
                </a>
              </div>
            )}

            {/* Mobile */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-slate-950 border-l border-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-xl font-bold">
                  {clientName}
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-lg text-white/80 hover:text-white hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    {link.label}
                  </a>
                ))}

                {shouldRenderCta && (
                  <a
                    href={ctaLink ?? undefined}
                    className={
                      primaryColor
                        ? "block mt-6 px-4 py-3 rounded-xl text-center font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                        : "block mt-6 px-4 py-3 rounded-xl text-center font-semibold bg-white text-slate-950 shadow-[0_10px_24px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    }
                    style={
                      primaryColor
                        ? { backgroundColor: primaryColor }
                        : undefined
                    }
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
