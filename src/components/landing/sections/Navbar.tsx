"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLandingTheme, useLandingMode } from "../LandingThemeProvider";
import Link from "next/link";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface NavbarProps {
  clientName: string;
  logoUrl?: string | null;
  primaryColor?: string;
  ctaText?: string;
  ctaLink?: string;
  darkModeEnabled?: boolean;
  lang?: string;
  availableLanguages?: string[];
  onLangChange?: (lang: string) => void;
  homeUrl?: string;
}

export default function Navbar({
  clientName,
  logoUrl,
  primaryColor,
  ctaText,
  ctaLink = "#contact",
  darkModeEnabled = true,
  lang = "ES",
  availableLanguages = ["es"],
  onLangChange,
  homeUrl = "/",
}: NavbarProps) {
  const t = useTranslations('landing.navbar');
  const T = useLandingTheme();
  const { mode, toggleTheme } = useLandingMode();

  const navLinks = [
    { label: t('destinations'), href: "#destinos" },
    { label: t('whyUs'), href: "#why" },
    { label: t('testimonials'), href: "#testimonials" },
    { label: t('contact'), href: "#contact" },
  ];

  const resolvedCtaText = ctaText || t('book');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const LANG_LABELS: Record<string, string> = { es: "ES", en: "EN", ar: "AR" };
  const showLangDropdown = availableLanguages.length > 1;

  const accent = primaryColor || T.accent;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: T.glass,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${T.border}`,
          boxShadow: scrolled ? `0 4px 24px ${T.shadow}` : "none",
          transition: "box-shadow .3s",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            width: "100%",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo / Brand */}
          <Link href={homeUrl} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={clientName}
                style={{ height: 36, width: "auto", objectFit: "contain" }}
              />
            ) : (
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 22,
                  color: T.text,
                  letterSpacing: "-0.5px",
                }}
              >
                {clientName}
              </span>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
            className="navbar-desktop-links"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="nav-link"
                style={{
                  color: T.sub,
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: FONT,
                  transition: "color .3s",
                  letterSpacing: ".3px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.sub)}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Language selector */}
            {showLangDropdown && (
              <div style={{ position: "relative" }} className="navbar-desktop-only">
                <button
                  onClick={() => setLangOpen((o) => !o)}
                  style={{
                    background: T.bg3,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 13,
                    color: T.sub,
                    cursor: "pointer",
                    transition: "all .3s",
                    letterSpacing: ".5px",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.color = accent;
                  }}
                  onMouseLeave={(e) => {
                    if (!langOpen) {
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.color = T.sub;
                    }
                  }}
                >
                  {LANG_LABELS[lang.toLowerCase()] || lang.toUpperCase()}
                  <span style={{ fontSize: 10, marginLeft: 2 }}>{"▾"}</span>
                </button>
                {langOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      right: 0,
                      background: T.bg2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 10,
                      overflow: "hidden",
                      boxShadow: `0 8px 24px ${T.shadow}`,
                      zIndex: 50,
                      minWidth: 60,
                    }}
                  >
                    {availableLanguages.map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          onLangChange?.(l);
                          setLangOpen(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "8px 16px",
                          border: "none",
                          background: l.toLowerCase() === lang.toLowerCase() ? `${accent}15` : "transparent",
                          color: l.toLowerCase() === lang.toLowerCase() ? accent : T.text,
                          fontFamily: FONT,
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "background .2s",
                        }}
                        onMouseEnter={(e) => {
                          if (l.toLowerCase() !== lang.toLowerCase())
                            e.currentTarget.style.background = T.bg3;
                        }}
                        onMouseLeave={(e) => {
                          if (l.toLowerCase() !== lang.toLowerCase())
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {LANG_LABELS[l] || l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Dark mode toggle */}
            {darkModeEnabled && (
              <button
                onClick={toggleTheme}
                style={{
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all .3s",
                  fontSize: 18,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
                className="navbar-desktop-only"
                aria-label="Toggle theme"
              >
                {mode === "dark" ? (
                  // Sun icon
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  // Moon icon
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            )}

            {/* CTA button (desktop) */}
            <a
              href={ctaLink}
              onClick={(e) => {
                if (ctaLink.startsWith("#")) {
                  e.preventDefault();
                  handleNavClick(ctaLink);
                }
              }}
              className="navbar-desktop-only"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                color: "#fff",
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 14,
                padding: "10px 24px",
                borderRadius: 12,
                textDecoration: "none",
                border: "none",
                cursor: "pointer",
                transition: "all .3s",
                boxShadow: `0 4px 16px ${accent}33`,
                letterSpacing: ".3px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${accent}44`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = `0 4px 16px ${accent}33`;
              }}
            >
              {resolvedCtaText}
            </a>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="navbar-mobile-only"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 5,
                padding: 8,
              }}
              aria-label="Toggle menu"
            >
              <span
                style={{
                  width: 24,
                  height: 2,
                  background: T.text,
                  borderRadius: 2,
                  transition: "all .3s",
                  transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
                }}
              />
              <span
                style={{
                  width: 24,
                  height: 2,
                  background: T.text,
                  borderRadius: 2,
                  transition: "all .3s",
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  width: 24,
                  height: 2,
                  background: T.text,
                  borderRadius: 2,
                  transition: "all .3s",
                  transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: 70,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            background: T.glass,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 40,
            gap: 8,
            animation: "fadeIn .3s ease",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              style={{
                color: T.text,
                textDecoration: "none",
                fontSize: 20,
                fontWeight: 700,
                fontFamily: FONT,
                padding: "14px 24px",
                width: "80%",
                textAlign: "center",
                borderRadius: 12,
                transition: "background .3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.bg3)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {link.label}
            </a>
          ))}

          <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
            {showLangDropdown && availableLanguages.map((l) => (
              <button
                key={l}
                onClick={() => {
                  onLangChange?.(l);
                  setMobileOpen(false);
                }}
                style={{
                  background: l.toLowerCase() === lang.toLowerCase() ? `${accent}20` : T.bg3,
                  border: `1px solid ${l.toLowerCase() === lang.toLowerCase() ? accent : T.border}`,
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 14,
                  color: l.toLowerCase() === lang.toLowerCase() ? accent : T.sub,
                  cursor: "pointer",
                }}
              >
                {LANG_LABELS[l] || l.toUpperCase()}
              </button>
            ))}

            {darkModeEnabled && (
              <button
                onClick={toggleTheme}
                style={{
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  width: 42,
                  height: 42,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 20,
                }}
              >
                {mode === "dark" ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            )}
          </div>

          <a
            href={ctaLink}
            onClick={(e) => {
              if (ctaLink.startsWith("#")) {
                e.preventDefault();
                handleNavClick(ctaLink);
              }
            }}
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
              color: "#fff",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 16,
              padding: "14px 40px",
              borderRadius: 14,
              textDecoration: "none",
              marginTop: 16,
              boxShadow: `0 4px 16px ${accent}33`,
            }}
          >
            {resolvedCtaText}
          </a>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        .navbar-desktop-links { display: flex !important; }
        .navbar-desktop-only { display: flex !important; }
        .navbar-mobile-only { display: none !important; }

        @media (max-width: 768px) {
          .navbar-desktop-links { display: none !important; }
          .navbar-desktop-only { display: none !important; }
          .navbar-mobile-only { display: flex !important; }
        }
      `}</style>
    </>
  );
}
