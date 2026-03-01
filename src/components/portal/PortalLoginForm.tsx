"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLandingTheme } from "@/components/landing/LandingThemeProvider";
import { useTranslations } from "next-intl";
import { Mail, ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface PortalLoginFormProps {
  clientName: string;
  logoUrl?: string | null;
  clienteId?: string;
}

export default function PortalLoginForm({ clientName, logoUrl, clienteId }: PortalLoginFormProps) {
  const T = useLandingTheme();
  const t = useTranslations("landing.portal");
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [state, setState] = useState<"input" | "sent" | "error">("input");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Show expired error from query param
  const initialError = errorParam === "expired" ? t("linkExpired") : "";

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
      }}
    >
      <div
        style={{
          background: T.glass,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${T.border}`,
          borderRadius: 24,
          padding: "40px 32px",
          maxWidth: 440,
          width: "100%",
          boxShadow: `0 20px 60px ${T.shadow}`,
        }}
      >
        {/* Logo + Agency name */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          {logoUrl && (
            <img
              src={logoUrl}
              alt={clientName}
              style={{ width: 56, height: 56, borderRadius: 14, objectFit: "contain", margin: "0 auto 12px" }}
            />
          )}
          <h1
            style={{
              fontFamily: "var(--font-syne), Syne, sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: T.text,
              marginBottom: 8,
            }}
          >
            {t("loginTitle")}
          </h1>
          <p style={{ fontSize: 14, color: T.sub }}>
            {t("loginSubtitle", { agency: clientName })}
          </p>
        </div>

        {/* Expired link error */}
        {initialError && state === "input" && (
          <div
            style={{
              background: T.redBg,
              border: `1px solid ${T.redBorder}`,
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <AlertCircle style={{ width: 18, height: 18, color: T.redText, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: T.redText }}>{initialError}</span>
          </div>
        )}

        {state === "input" || state === "error" ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.sub,
                  marginBottom: 8,
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
                    insetInlineStart: 14,
                    width: 18,
                    height: 18,
                    color: T.muted,
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
                    padding: "12px 16px 12px 44px",
                    borderRadius: 12,
                    border: `1.5px solid ${T.border}`,
                    background: T.bg2,
                    color: T.text,
                    fontSize: 15,
                    outline: "none",
                    transition: "border-color .2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = T.accent)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
                />
              </div>
            </div>

            {/* Error message */}
            {state === "error" && errorMsg && (
              <div
                style={{
                  background: T.redBg,
                  border: `1px solid ${T.redBorder}`,
                  borderRadius: 12,
                  padding: "10px 14px",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <AlertCircle style={{ width: 16, height: 16, color: T.redText, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: T.redText }}>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px 20px",
                borderRadius: 12,
                border: "none",
                background: T.accent,
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: loading ? 0.7 : 1,
                transition: "opacity .2s",
              }}
            >
              {loading ? (
                <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} />
              ) : (
                <>
                  {t("sendLink")}
                  <ArrowRight style={{ width: 18, height: 18 }} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Sent state */
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: T.greenBg,
                border: `2px solid ${T.greenBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <CheckCircle style={{ width: 32, height: 32, color: T.greenText }} />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-syne), Syne, sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: T.text,
                marginBottom: 8,
              }}
            >
              {t("checkEmail")}
            </h2>
            <p style={{ fontSize: 14, color: T.sub, marginBottom: 24, lineHeight: 1.6 }}>
              {t("checkEmailDesc", { email })}
            </p>
            <button
              onClick={handleResend}
              style={{
                background: "transparent",
                border: `1.5px solid ${T.border}`,
                borderRadius: 12,
                padding: "10px 20px",
                color: T.accent,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t("resendLink")}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
