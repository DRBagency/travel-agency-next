"use client";

import { useState } from "react";
import { useLandingTheme, useLandingMode } from "@/components/landing/LandingThemeProvider";
import { useTranslations } from "next-intl";
import { Sun, Moon, LogOut, Menu, X, MessageCircle, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PortalNavbarProps {
  logoUrl?: string | null;
  clientName: string;
  email: string;
  availableLanguages?: string[];
  currentLang?: string;
  onLangChange?: (lang: string) => void;
}

export default function PortalNavbar({
  logoUrl,
  clientName,
  email,
  availableLanguages,
  currentLang,
  onLangChange,
}: PortalNavbarProps) {
  const T = useLandingTheme();
  const { mode, toggleTheme } = useLandingMode();
  const t = useTranslations("landing.portal");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("myBookings"), href: "/portal", icon: <Briefcase style={{ width: 16, height: 16 }} /> },
    { label: t("chat"), href: "/portal/chat", icon: <MessageCircle style={{ width: 16, height: 16 }} /> },
  ];

  const isActive = (href: string) => {
    if (href === "/portal") return pathname === "/portal";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch("/api/portal/auth/logout", { method: "POST" });
    window.location.href = "/portal/login";
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: T.glass,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.border}`,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Logo + Name */}
        <Link href="/portal" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          {logoUrl && (
            <img
              src={logoUrl}
              alt={clientName}
              style={{ width: 36, height: 36, borderRadius: 10, objectFit: "contain" }}
            />
          )}
          <span
            style={{
              fontFamily: "var(--font-syne), Syne, sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: T.text,
            }}
          >
            {clientName}
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="hidden md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                color: isActive(link.href) ? T.accent : T.sub,
                background: isActive(link.href) ? `${T.accent}15` : "transparent",
                textDecoration: "none",
                transition: "all .2s",
              }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Language selector */}
          {availableLanguages && availableLanguages.length > 1 && (
            <select
              value={currentLang}
              onChange={(e) => onLangChange?.(e.target.value)}
              data-glass-skip
              style={{
                background: T.bg2,
                color: T.text,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: "6px 8px",
                fontSize: 13,
                cursor: "pointer",
                outline: "none",
              }}
            >
              {availableLanguages.map((l) => (
                <option key={l} value={l}>
                  {l.toUpperCase()}
                </option>
              ))}
            </select>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: "transparent",
              border: "none",
              color: T.muted,
              cursor: "pointer",
              padding: 6,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
            }}
          >
            {mode === "dark" ? <Sun style={{ width: 18, height: 18 }} /> : <Moon style={{ width: 18, height: 18 }} />}
          </button>

          {/* Email badge (desktop) */}
          <span
            className="hidden md:inline"
            style={{
              fontSize: 13,
              color: T.muted,
              padding: "6px 10px",
              background: `${T.accent}10`,
              borderRadius: 8,
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {email}
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="hidden md:flex"
            style={{
              background: "transparent",
              border: `1px solid ${T.border}`,
              color: T.muted,
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <LogOut style={{ width: 14, height: 14 }} />
            {t("logout")}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            style={{
              background: "transparent",
              border: "none",
              color: T.text,
              cursor: "pointer",
              padding: 4,
            }}
          >
            {mobileOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            paddingBottom: 16,
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                color: isActive(link.href) ? T.accent : T.text,
                background: isActive(link.href) ? `${T.accent}15` : "transparent",
                textDecoration: "none",
              }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <div
            style={{
              borderTop: `1px solid ${T.border}`,
              marginTop: 8,
              paddingTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 13, color: T.muted }}>{email}</span>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: `1px solid ${T.border}`,
                color: T.muted,
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
              }}
            >
              <LogOut style={{ width: 14, height: 14 }} />
              {t("logout")}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
