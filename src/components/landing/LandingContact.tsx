"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { useLandingTheme } from "./LandingThemeProvider";
import { AnimateIn } from "./AnimateIn";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Destino {
  id: string;
  nombre: string;
}

interface Props {
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactAddress?: string | null;
  destinos: Destino[];
  clienteId: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LandingContact({
  contactEmail,
  contactPhone,
  contactAddress,
  destinos,
  clienteId,
}: Props) {
  const T = useLandingTheme();
  const t = useTranslations("landing");

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    destino: "",
    mensaje: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ---- helpers ---- */

  const update = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: `1.5px solid ${T.brd}`,
    background: T.bg,
    color: T.txt,
    fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
    fontSize: 15,
    outline: "none",
    transition: "border-color .2s, box-shadow .2s",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = T.accent;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${T.accent}26`;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = T.brd;
    e.currentTarget.style.boxShadow = "none";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, clienteId }),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ nombre: "", email: "", telefono: "", destino: "", mensaje: "" });
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      style={{
        padding: "80px 40px",
        position: "relative",
      }}
    >
      <AnimateIn>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div
            style={{
              background: T.bg2,
              borderRadius: 24,
              padding: 36,
              border: `1.5px solid ${T.brd}`,
              boxShadow: `0 8px 32px ${T.shadow}`,
            }}
          >
            {/* header */}
            <h3
              style={{
                fontFamily: "var(--font-syne), 'Syne', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: T.txt,
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span role="img" aria-label="envelope">
                📩
              </span>
              {t("contact.writeUs")}
            </h3>

            {/* success banner */}
            {success && (
              <div
                style={{
                  background: T.greenBg,
                  border: `1px solid ${T.greenBrd}`,
                  borderRadius: 12,
                  padding: "12px 16px",
                  color: T.greenTxt,
                  fontSize: 14,
                  marginBottom: 20,
                  fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                }}
              >
                {t("contact.successMessage")}
              </div>
            )}

            {/* form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* name */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.sub,
                    marginBottom: 6,
                  }}
                >
                  {t("contact.nameLabel")}
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={update}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  style={inputStyle}
                />
              </div>

              {/* email */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.sub,
                    marginBottom: 6,
                  }}
                >
                  {t("contact.emailLabel")}
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  style={inputStyle}
                />
              </div>

              {/* phone */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.sub,
                    marginBottom: 6,
                  }}
                >
                  {t("contact.phoneLabel")}
                </label>
                <input
                  name="telefono"
                  type="tel"
                  value={form.telefono}
                  onChange={update}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={inputStyle}
                />
              </div>

              {/* destination select */}
              {destinos.length > 0 && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.sub,
                      marginBottom: 6,
                    }}
                  >
                    {t("contact.selectDest")}
                  </label>
                  <select
                    name="destino"
                    value={form.destino}
                    onChange={update}
                    onFocus={handleFocus as any}
                    onBlur={handleBlur as any}
                    style={{
                      ...inputStyle,
                      appearance: "none",
                      WebkitAppearance: "none",
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingInlineEnd: 36,
                    }}
                  >
                    <option value="">{t("contact.selectDest")}</option>
                    {destinos.map((d) => (
                      <option key={d.id} value={d.nombre}>
                        {d.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* message */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.sub,
                    marginBottom: 6,
                  }}
                >
                  {t("contact.messageLabel")}
                </label>
                <textarea
                  name="mensaje"
                  rows={4}
                  value={form.mensaje}
                  onChange={update}
                  onFocus={handleFocus as any}
                  onBlur={handleBlur as any}
                  required
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  borderRadius: 14,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#fff",
                  background: `linear-gradient(135deg, ${T.accent}, #0d8a8e)`,
                  opacity: loading ? 0.6 : 1,
                  transition: "opacity .2s, transform .2s",
                }}
                onMouseEnter={(e) => {
                  if (!loading) (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {loading ? t("contact.sending") : `${t("contact.send")} →`}
              </button>
            </form>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
