"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useLandingTheme } from "./LandingThemeProvider";
import { setLocale } from "@/lib/set-locale";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  clientName: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  darkModeEnabled?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const LANGUAGES = [
  { code: "es", label: "ES", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "en", label: "EN", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "ar", label: "AR", flag: "\u{1F1F8}\u{1F1E6}" },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LandingNavbar({
  clientName,
  logoUrl,
  primaryColor,
  ctaText,
  ctaLink,
  darkModeEnabled = true,
}: Props) {
  const T = useLandingTheme();
  const t = useTranslations("landing");
  const locale = useLocale();
  const router = useRouter();

  /* ---- scroll state ---- */
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); // check initial position
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- mobile menu ---- */
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ---- lang dropdown ---- */
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLangChange(code: string) {
    setLangOpen(false);
    await setLocale(code);
    router.refresh();
  }

  /* ---- derived ---- */
  const accent = primaryColor || T.accent;
  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  const safeLogoUrl = (() => {
    if (typeof logoUrl !== "string") return null;
    const cleaned = logoUrl.trim();
    if (!cleaned) return null;
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
    if (cleaned.startsWith("/")) return cleaned;
    return null;
  })();

  const navLinks = [
    { href: "#destinos", label: t("navbar.destinations") },
    { href: "#why", label: t("navbar.whyUs") },
    { href: "#test", label: t("navbar.testimonials") },
    { href: "#contact", label: t("navbar.contact") },
  ];

  /* ---- styles ---- */
  const navBg = scrolled
    ? { background: T.glass, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${T.glassBorder}` }
    : { background: "transparent" };

  const linkColor = scrolled ? T.sub : "rgba(255,255,255,.78)";
  const linkHoverColor = scrolled ? T.txt : "#ffffff";
  const nameColor = scrolled ? T.txt : "#ffffff";

  return (
    <>
      {/* ========================= NAVBAR ========================= */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          zIndex: 100,
          height: 72,
          display: "flex",
          alignItems: "center",
          transition: "background .35s, backdrop-filter .35s, border .35s",
          ...navBg,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ---- Logo ---- */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            {safeLogoUrl ? (
              <img
                src={safeLogoUrl}
                alt={clientName}
                style={{ width: 40, height: 40, borderRadius: 12, objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${accent}, ${accent}88)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 18,
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                }}
              >
                {clientName.charAt(0).toUpperCase()}
              </div>
            )}
            <span
              style={{
                fontFamily: "var(--font-syne), 'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: nameColor,
                transition: "color .35s",
              }}
            >
              {clientName}
            </span>
          </a>

          {/* ---- Desktop nav links (center) ---- */}
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="navl"
                style={{
                  color: linkColor,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  transition: "color .3s",
                  fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = linkHoverColor; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = linkColor; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ---- Right side: lang + theme toggle + CTA ---- */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Language switcher */}
            <div ref={langRef} style={{ position: "relative" }}>
              <button
                onClick={() => setLangOpen((p) => !p)}
                aria-label={t("navbar.language")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 10px",
                  borderRadius: 10,
                  border: `1px solid ${scrolled ? T.brd : "rgba(255,255,255,.2)"}`,
                  background: scrolled ? T.bg2 : "rgba(255,255,255,.1)",
                  color: scrolled ? T.sub : "rgba(255,255,255,.85)",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "all .3s",
                  fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>{currentLang.flag}</span>
                <span>{currentLang.label}</span>
              </button>

              {langOpen && (
                <div
                  style={{
                    position: "absolute",
                    insetInlineEnd: 0,
                    top: "calc(100% + 6px)",
                    background: T.card,
                    border: `1px solid ${T.brd}`,
                    borderRadius: 14,
                    boxShadow: `0 12px 32px ${T.shadow}`,
                    overflow: "hidden",
                    zIndex: 200,
                    minWidth: 110,
                  }}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangChange(lang.code)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        padding: "10px 14px",
                        textAlign: "start" as const,
                        fontSize: 13,
                        fontWeight: lang.code === locale ? 600 : 400,
                        color: lang.code === locale ? accent : T.txt,
                        background: lang.code === locale ? `${accent}12` : "transparent",
                        border: "none",
                        cursor: "pointer",
                        transition: "background .2s",
                        fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        if (lang.code !== locale) (e.currentTarget as HTMLElement).style.background = T.bg3;
                      }}
                      onMouseLeave={(e) => {
                        if (lang.code !== locale) (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    >
                      <span style={{ fontSize: 16, lineHeight: 1 }}>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light toggle */}
            {darkModeEnabled && (
              <button
                onClick={T.toggle}
                aria-label={T.mode === "dark" ? t("navbar.lightMode") : t("navbar.darkMode")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  border: `1px solid ${scrolled ? T.brd : "rgba(255,255,255,.2)"}`,
                  background: scrolled ? T.bg2 : "rgba(255,255,255,.1)",
                  cursor: "pointer",
                  fontSize: 18,
                  transition: "all .3s",
                }}
              >
                {T.mode === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19"}
              </button>
            )}

            {/* CTA Button (desktop) */}
            {ctaText && ctaLink && (
              <a
                href={ctaLink}
                className="hide-mobile"
                style={{
                  marginInlineStart: 8,
                  padding: "10px 26px",
                  borderRadius: 50,
                  background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                  color: "#fff",
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  transition: "transform .25s, box-shadow .25s",
                  boxShadow: `0 4px 20px ${accent}40`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${accent}55`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${accent}40`;
                }}
              >
                {ctaText}
              </a>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 10,
                border: "none",
                background: "transparent",
                color: scrolled ? T.txt : "#fff",
                cursor: "pointer",
                fontSize: 24,
              }}
              className="mobile-menu-btn"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ========================= MOBILE MENU ========================= */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,.5)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />

          {/* Panel */}
          <div
            style={{
              position: "absolute",
              insetInlineEnd: 0,
              top: 0,
              bottom: 0,
              width: 300,
              background: T.card,
              boxShadow: `0 0 60px ${T.shadow}`,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              animation: "slideInFromEnd .3s ease-out",
            }}
          >
            {/* Close */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <span
                style={{
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: T.txt,
                }}
              >
                {clientName}
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: `1px solid ${T.brd}`,
                  background: T.bg3,
                  color: T.sub,
                  cursor: "pointer",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    fontSize: 16,
                    fontWeight: 500,
                    color: T.txt,
                    textDecoration: "none",
                    transition: "background .2s",
                    fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.bg3; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile CTA */}
            {ctaText && ctaLink && (
              <a
                href={ctaLink}
                onClick={() => setMobileOpen(false)}
                style={{
                  marginTop: 24,
                  padding: "14px 24px",
                  borderRadius: 50,
                  background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                  color: "#fff",
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  textAlign: "center" as const,
                  boxShadow: `0 4px 20px ${accent}40`,
                }}
              >
                {ctaText}
              </a>
            )}
          </div>
        </div>
      )}

      {/* ========================= INLINE STYLES ========================= */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
        @keyframes slideInFromEnd {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        [dir="rtl"] @keyframes slideInFromEnd {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
