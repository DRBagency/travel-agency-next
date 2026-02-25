"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useLandingTheme } from "../LandingThemeProvider";
import { AnimateIn } from "../ui/AnimateIn";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface DestinoOption {
  id: string;
  slug: string;
  nombre: string;
}

interface ContactFormProps {
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  destinos?: DestinoOption[];
  clienteId?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export default function ContactForm({
  contactEmail = "info@agencia.com",
  contactPhone = "+34 600 000 000",
  contactAddress,
  destinos = [],
  clienteId,
  sectionTitle,
  sectionSubtitle,
}: ContactFormProps) {
  const T = useLandingTheme();
  const t = useTranslations('landing.contact');

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          clienteId,
        }),
      });

      if (res.ok) {
        setStatus("sent");
        setFormData({
          name: "",
          email: "",
          phone: "",
          destination: "",
          message: "",
        });
        // Reset after 5 seconds
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    fontFamily: FONT2,
    fontSize: 15,
    color: T.text,
    background: T.bg,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    outline: "none",
    transition: "border-color .3s, box-shadow .3s",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: FONT,
    fontWeight: 600,
    fontSize: 13,
    color: T.sub,
    marginBottom: 6,
    letterSpacing: ".3px",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = T.accent;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${T.accent}20`;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = T.border;
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <section id="contact" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section heading */}
        <AnimateIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: "clamp(28px, 4vw, 42px)",
                color: T.text,
                margin: 0,
                marginBottom: 12,
                letterSpacing: "-0.5px",
              }}
            >
              {sectionTitle || t('writeUs')}
            </h2>
            <p
              style={{
                fontFamily: FONT2,
                fontSize: 17,
                color: T.sub,
                margin: 0,
                maxWidth: 500,
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: 1.6,
              }}
            >
              {sectionSubtitle || t('subtitle')}
            </p>
          </div>
        </AnimateIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 40,
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Form */}
          <AnimateIn delay={0.1}>
            <form
              onSubmit={handleSubmit}
              style={{
                background: T.bg2,
                border: `1px solid ${T.border}`,
                borderRadius: 22,
                padding: 32,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 18,
                }}
                className="contact-form-grid"
              >
                {/* Name */}
                <div>
                  <label style={labelStyle}>{t('nameLabel')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={t('namePlaceholder')}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>{t('emailLabel')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={t('emailPlaceholder')}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={labelStyle}>{t('phoneLabel')}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="+34 600 000 000"
                    style={inputStyle}
                  />
                </div>

                {/* Destination select */}
                <div>
                  <label style={labelStyle}>{t('selectDest')}</label>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    onFocus={handleFocus as any}
                    onBlur={handleBlur as any}
                    style={{
                      ...inputStyle,
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: 36,
                    }}
                  >
                    <option value="">{t('selectDest')}</option>
                    {destinos.map((d) => (
                      <option key={d.id} value={d.slug}>
                        {d.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div style={{ marginTop: 18 }}>
                <label style={labelStyle}>{t('messageLabel')}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={handleFocus as any}
                  onBlur={handleBlur as any}
                  placeholder={t('messagePlaceholder')}
                  rows={5}
                  required
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    minHeight: 120,
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  marginTop: 24,
                  width: "100%",
                  padding: "15px 32px",
                  background:
                    status === "sent"
                      ? T.greenText
                      : status === "error"
                      ? T.redText
                      : `linear-gradient(135deg, ${T.accent}, ${T.accent}cc)`,
                  color: "#fff",
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 16,
                  borderRadius: 14,
                  border: "none",
                  cursor: status === "sending" ? "wait" : "pointer",
                  transition: "all .3s",
                  boxShadow: `0 4px 16px ${T.accent}33`,
                  letterSpacing: ".3px",
                  opacity: status === "sending" ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (status === "idle") {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 8px 24px ${T.accent}44`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = `0 4px 16px ${T.accent}33`;
                }}
              >
                {status === "sending"
                  ? t('sending')
                  : status === "sent"
                  ? `✓ ${t('successMessage')}`
                  : status === "error"
                  ? "Error"
                  : t('send')}
              </button>
            </form>
          </AnimateIn>

          {/* Contact info sidebar */}
          <AnimateIn delay={0.2} from="right">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* Email */}
              <div
                style={{
                  background: T.bg2,
                  border: `1px solid ${T.border}`,
                  borderRadius: 18,
                  padding: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  transition: "all .3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${T.accent}40`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: `${T.accent}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={T.accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontWeight: 700,
                      fontSize: 14,
                      color: T.text,
                      marginBottom: 2,
                    }}
                  >
                    {t('emailLabel')}
                  </div>
                  <a
                    href={`mailto:${contactEmail}`}
                    style={{
                      fontFamily: FONT2,
                      fontSize: 14,
                      color: T.accent,
                      textDecoration: "none",
                    }}
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div
                style={{
                  background: T.bg2,
                  border: `1px solid ${T.border}`,
                  borderRadius: 18,
                  padding: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  transition: "all .3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${T.accent}40`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: `${T.accent}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={T.accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontWeight: 700,
                      fontSize: 14,
                      color: T.text,
                      marginBottom: 2,
                    }}
                  >
                    {t('phoneLabel')}
                  </div>
                  <a
                    href={`tel:${contactPhone}`}
                    style={{
                      fontFamily: FONT2,
                      fontSize: 14,
                      color: T.accent,
                      textDecoration: "none",
                    }}
                  >
                    {contactPhone}
                  </a>
                </div>
              </div>

              {/* Address */}
              {contactAddress && (
                <div
                  style={{
                    background: T.bg2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 18,
                    padding: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    transition: "all .3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${T.accent}40`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: `${T.accent}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={T.accent}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: 14,
                        color: T.text,
                        marginBottom: 2,
                      }}
                    >
                      {t('addressLabel')}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT2,
                        fontSize: 14,
                        color: T.sub,
                        lineHeight: 1.5,
                      }}
                    >
                      {contactAddress}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AnimateIn>
        </div>
      </div>

      <style>{`
        .contact-grid {
          grid-template-columns: 1fr 360px;
        }
        .contact-form-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 868px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 520px) {
          .contact-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
