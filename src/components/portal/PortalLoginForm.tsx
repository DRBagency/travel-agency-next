"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useLandingTheme } from "@/components/landing/LandingThemeProvider";
import { useTranslations } from "next-intl";
import { Mail, ArrowRight, CheckCircle, AlertCircle, Loader2, Plane, Globe } from "lucide-react";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface PortalLoginFormProps {
  clientName: string;
  logoUrl?: string | null;
  clienteId?: string;
  primaryColor?: string;
  availableLanguages?: string[];
  currentLang?: string;
}

export default function PortalLoginForm({ clientName, logoUrl, clienteId, primaryColor, availableLanguages, currentLang }: PortalLoginFormProps) {
  const T = useLandingTheme();
  const t = useTranslations("landing.portal");
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [state, setState] = useState<"input" | "sent" | "error">("input");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const accent = primaryColor || T.accent;
  const initialError = errorParam === "expired" ? t("linkExpired") : "";

  const handleLangChange = useCallback((lang: string) => {
    document.cookie = `LANDING_LOCALE=${lang};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    window.location.reload();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/portal/auth/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), clienteId }),
      });

      if (res.ok) {
        setState("sent");
      } else {
        const data = await res.json();
        if (data.error === "no_reservations") {
          setErrorMsg(t("noReservations"));
        } else if (data.error === "rate_limit") {
          setErrorMsg(t("tooManyAttempts"));
        } else {
          setErrorMsg(t("genericError"));
        }
        setState("error");
      }
    } catch {
      setErrorMsg(t("genericError"));
      setState("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setState("input");
    setErrorMsg("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background orbs */}
      <div className="portal-orb portal-orb-1" style={{ background: accent }} />
      <div className="portal-orb portal-orb-2" style={{ background: accent }} />
      <div className="portal-orb portal-orb-3" style={{ background: `${accent}66` }} />

      {/* Subtle grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${T.border} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />

      {/* Language selector — top right */}
      {availableLanguages && availableLanguages.length > 1 && (
        <div
          style={{
            position: "absolute",
            top: 20,
            insetInlineEnd: 24,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: T.glass,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            padding: "6px 10px",
          }}
        >
          <Globe style={{ width: 14, height: 14, color: T.muted }} />
          <select
            value={currentLang}
            onChange={(e) => handleLangChange(e.target.value)}
            data-glass-skip
            style={{
              background: "transparent",
              color: T.text,
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: FONT2,
              cursor: "pointer",
              outline: "none",
              padding: 0,
            }}
          >
            {availableLanguages.map((l) => (
              <option key={l} value={l} style={{ background: T.bg2, color: T.text }}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Card */}
      <div
        className="portal-login-card"
        style={{
          background: T.glass,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${T.border}`,
          borderRadius: 28,
          padding: "48px 36px 40px",
          maxWidth: 420,
          width: "100%",
          boxShadow: `0 24px 80px ${T.shadow}, 0 0 0 1px ${T.border}`,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Travel icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${accent}20, ${accent}08)`,
            border: `1.5px solid ${accent}25`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={clientName}
              style={{ width: 44, height: 44, borderRadius: 12, objectFit: "contain" }}
            />
          ) : (
            <Plane
              style={{ width: 32, height: 32, color: accent, transform: "rotate(-45deg)" }}
            />
          )}
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: FONT,
              fontSize: 26,
              fontWeight: 800,
              color: T.text,
              marginBottom: 10,
              letterSpacing: "-0.5px",
            }}
          >
            {t("loginTitle")}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: T.sub,
              fontFamily: FONT2,
              lineHeight: 1.5,
            }}
          >
            {t("loginSubtitle", { agency: clientName })}
          </p>
        </div>

        {/* Expired link error */}
        {initialError && state === "input" && (
          <div
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 14,
              padding: "12px 16px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <AlertCircle style={{ width: 18, height: 18, color: "#ef4444", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#ef4444", fontFamily: FONT2 }}>{initialError}</span>
          </div>
        )}

        {state === "input" || state === "error" ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.sub,
                  marginBottom: 8,
                  fontFamily: FONT2,
                }}
              >
                {t("emailLabel")}
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    insetInlineStart: 16,
                    width: 18,
                    height: 18,
                    color: T.muted,
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("input");
                  }}
                  placeholder={t("emailPlaceholder")}
                  required
                  data-glass-skip
                  style={{
                    width: "100%",
                    padding: "14px 18px 14px 48px",
                    borderRadius: 14,
                    border: `1.5px solid ${T.border}`,
                    background: T.bg2,
                    color: T.text,
                    fontSize: 15,
                    fontFamily: FONT2,
                    outline: "none",
                    transition: "border-color .2s, box-shadow .2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}18`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Error message */}
            {state === "error" && errorMsg && (
              <div
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 14,
                  padding: "10px 14px",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <AlertCircle style={{ width: 16, height: 16, color: "#ef4444", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#ef4444", fontFamily: FONT2 }}>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="portal-login-btn"
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 14,
                border: "none",
                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: FONT,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: loading ? 0.7 : 1,
                transition: "all .3s",
                boxShadow: `0 4px 20px ${accent}33`,
                letterSpacing: ".3px",
              }}
            >
              {loading ? (
                <Loader2 style={{ width: 18, height: 18, animation: "portalSpin 1s linear infinite" }} />
              ) : (
                <>
                  {t("sendLink")}
                  <ArrowRight style={{ width: 18, height: 18 }} />
                </>
              )}
            </button>

            {/* Magic link explanation */}
            <p
              style={{
                textAlign: "center",
                fontSize: 12,
                color: T.muted,
                marginTop: 20,
                fontFamily: FONT2,
                lineHeight: 1.5,
              }}
            >
              {t("magicLinkHint")}
            </p>
          </form>
        ) : (
          /* Sent state */
          <div style={{ textAlign: "center" }}>
            <div
              className="portal-check-pulse"
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(34,197,94,0.1)",
                border: "2px solid rgba(34,197,94,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <CheckCircle style={{ width: 36, height: 36, color: "#22c55e" }} />
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: 22,
                fontWeight: 700,
                color: T.text,
                marginBottom: 10,
              }}
            >
              {t("checkEmail")}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: T.sub,
                marginBottom: 28,
                lineHeight: 1.6,
                fontFamily: FONT2,
              }}
            >
              {t("checkEmailDesc", { email })}
            </p>
            <button
              onClick={handleResend}
              className="portal-resend-btn"
              style={{
                background: "transparent",
                border: `1.5px solid ${T.border}`,
                borderRadius: 14,
                padding: "11px 24px",
                color: accent,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: FONT,
                cursor: "pointer",
                transition: "all .3s",
              }}
            >
              {t("resendLink")}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes portalSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes portalFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes portalFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.08); }
          66% { transform: translate(20px, -30px) scale(0.92); }
        }
        @keyframes portalFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, 40px) scale(1.1); }
        }
        @keyframes portalPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.2); }
          50% { box-shadow: 0 0 0 12px rgba(34,197,94,0); }
        }
        .portal-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.15;
        }
        .portal-orb-1 {
          width: 400px;
          height: 400px;
          top: -10%;
          right: -5%;
          animation: portalFloat1 12s ease-in-out infinite;
        }
        .portal-orb-2 {
          width: 350px;
          height: 350px;
          bottom: -10%;
          left: -8%;
          animation: portalFloat2 15s ease-in-out infinite;
        }
        .portal-orb-3 {
          width: 250px;
          height: 250px;
          top: 40%;
          left: 50%;
          animation: portalFloat3 10s ease-in-out infinite;
        }
        .portal-login-card {
          animation: portalCardIn 0.6s ease-out;
        }
        @keyframes portalCardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .portal-login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }
        .portal-check-pulse {
          animation: portalPulse 2s ease-in-out infinite;
        }
        .portal-resend-btn:hover {
          background: rgba(128,128,128,0.08) !important;
        }
      `}</style>
    </div>
  );
}
