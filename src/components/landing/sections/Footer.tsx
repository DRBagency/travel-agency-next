"use client";

import { useLandingTheme } from "../LandingThemeProvider";
import Link from "next/link";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface DestinoLink {
  slug: string;
  nombre: string;
}

interface LegalPage {
  slug: string;
  titulo: string;
}

interface FooterProps {
  clientName: string;
  logoUrl?: string | null;
  footerDescription?: string;
  destinos?: DestinoLink[];
  paginasLegales?: LegalPage[];
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
}

export default function Footer({
  clientName,
  logoUrl,
  footerDescription = "Tu agencia de viajes de confianza. Experiencias unicas en los mejores destinos del mundo.",
  destinos = [],
  paginasLegales = [],
  instagramUrl,
  facebookUrl,
  tiktokUrl,
}: FooterProps) {
  const T = useLandingTheme();
  const year = new Date().getFullYear();

  const navLinks = [
    { label: "Why Us", href: "#why" },
    { label: "Testimonios", href: "#testimonials" },
    { label: "Contacto", href: "#contact" },
  ];

  const handleAnchorClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      style={{
        background: T.bg2,
        borderTop: `1px solid ${T.border}`,
        paddingTop: 60,
        paddingBottom: 0,
      }}
    >
      {/* Accent gradient line */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(90deg, ${T.accent}, ${T.lime}, ${T.accent})`,
          marginTop: -63,
          marginBottom: 60,
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* 4-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
            gap: 40,
          }}
          className="footer-grid"
        >
          {/* Column 1: Brand */}
          <div>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={clientName}
                style={{
                  height: 36,
                  width: "auto",
                  objectFit: "contain",
                  marginBottom: 16,
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 22,
                  color: T.text,
                  marginBottom: 16,
                  letterSpacing: "-0.5px",
                }}
              >
                {clientName}
              </div>
            )}
            <p
              style={{
                fontFamily: FONT2,
                fontSize: 14,
                color: T.muted,
                lineHeight: 1.7,
                margin: 0,
                maxWidth: 280,
              }}
            >
              {footerDescription}
            </p>
          </div>

          {/* Column 2: Destinos */}
          <div>
            <h4
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 15,
                color: T.text,
                margin: 0,
                marginBottom: 18,
                letterSpacing: ".2px",
              }}
            >
              Destinos
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {destinos.slice(0, 6).map((d) => (
                <Link
                  key={d.slug}
                  href={`/destino/${d.slug}`}
                  style={{
                    fontFamily: FONT2,
                    fontSize: 14,
                    color: T.muted,
                    textDecoration: "none",
                    transition: "color .3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.accent)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = T.muted)
                  }
                >
                  {d.nombre}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Navigation */}
          <div>
            <h4
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 15,
                color: T.text,
                margin: 0,
                marginBottom: 18,
                letterSpacing: ".2px",
              }}
            >
              Navegacion
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAnchorClick(link.href);
                  }}
                  style={{
                    fontFamily: FONT2,
                    fontSize: 14,
                    color: T.muted,
                    textDecoration: "none",
                    transition: "color .3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.accent)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = T.muted)
                  }
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Social */}
          <div>
            <h4
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 15,
                color: T.text,
                margin: 0,
                marginBottom: 18,
                letterSpacing: ".2px",
              }}
            >
              Redes sociales
            </h4>
            <div style={{ display: "flex", gap: 12 }}>
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: T.bg3,
                    border: `1px solid ${T.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all .3s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = T.accent;
                    e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                    e.currentTarget.style.boxShadow = `0 4px 16px ${T.accent}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  aria-label="Instagram"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={T.muted}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}

              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: T.bg3,
                    border: `1px solid ${T.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all .3s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = T.accent;
                    e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                    e.currentTarget.style.boxShadow = `0 4px 16px ${T.accent}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  aria-label="Facebook"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={T.muted}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              )}

              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: T.bg3,
                    border: `1px solid ${T.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all .3s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = T.accent;
                    e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                    e.currentTarget.style.boxShadow = `0 4px 16px ${T.accent}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  aria-label="TikTok"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={T.muted}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            paddingBottom: 24,
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <p
            style={{
              fontFamily: FONT2,
              fontSize: 13,
              color: T.muted,
              margin: 0,
            }}
          >
            &copy; {year} {clientName}. Todos los derechos reservados.
          </p>

          {paginasLegales.length > 0 && (
            <div style={{ display: "flex", gap: 20 }}>
              {paginasLegales.map((page) => (
                <Link
                  key={page.slug}
                  href={`/legal/${page.slug}`}
                  style={{
                    fontFamily: FONT2,
                    fontSize: 13,
                    color: T.muted,
                    textDecoration: "none",
                    transition: "color .3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = T.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = T.muted)
                  }
                >
                  {page.titulo}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .footer-grid {
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
