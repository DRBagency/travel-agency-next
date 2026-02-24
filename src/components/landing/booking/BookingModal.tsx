"use client";

import { useState, useEffect, CSSProperties } from "react";
import { useLandingTheme } from "../LandingThemeProvider";
import { Img } from "../ui/Img";
import { StatusBadge } from "../ui/StatusBadge";
import { InputField } from "../ui/InputField";

/* ─── Fonts ─── */
const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

/* ─── Translations ─── */
const translations = {
  es: {
    s1: "Salida y viajeros",
    s2: "Datos de pasajeros",
    s3: "Resumen",
    s4: "Pago",
    sDep: "Selecciona tu fecha de salida",
    sAd: "Adultos",
    sCh: "Ninos",
    sNx: "Continuar",
    sBk: "Atras",
    sFn: "Nombre completo",
    sEm: "Email",
    sPh: "Telefono",
    sDt: "Tipo documento",
    sDn: "Numero de documento",
    sDb: "Fecha de nacimiento",
    sNt: "Nacionalidad",
    sMc: "Contacto principal",
    sCo: "Acompanante",
    sSm: "Resumen de tu reserva",
    sDs: "Destino",
    sFd: "Fecha de salida",
    sDu: "Duracion",
    sTv: "Viajeros",
    sDp: "Anticipo para reservar (200\u20ac/persona)",
    sTt: "Total del viaje",
    sSc: "Pago cifrado y seguro con Stripe",
    sPy: "Pagar",
    sCd: "Numero de tarjeta",
    sEx: "Caducidad",
    sCv: "CVV",
    sHl: "Titular de la tarjeta",
    sCt: "\u00a1Reserva confirmada!",
    sCm: "Recibiras un email con todos los detalles de tu viaje. Tu coordinador/a se pondra en contacto contigo pronto.",
    sCl: "Volver al destino",
    sSp: "plazas disponibles",
    conf: "Confirmado",
    last: "Ultimas plazas",
    sold: "Agotado",
    pp: "por persona",
    sUnit: "Precio unitario",
    sDeposit: "Deposito",
    adults: "adulto(s)",
    children: "nino(s)",
    passenger: "Pasajero",
    dni: "DNI",
    passport: "Pasaporte",
    nie: "NIE",
  },
  en: {
    s1: "Departure & travelers",
    s2: "Passenger details",
    s3: "Summary",
    s4: "Payment",
    sDep: "Select your departure date",
    sAd: "Adults",
    sCh: "Children",
    sNx: "Continue",
    sBk: "Back",
    sFn: "Full name",
    sEm: "Email",
    sPh: "Phone",
    sDt: "Document type",
    sDn: "Document number",
    sDb: "Date of birth",
    sNt: "Nationality",
    sMc: "Main contact",
    sCo: "Companion",
    sSm: "Booking summary",
    sDs: "Destination",
    sFd: "Departure date",
    sDu: "Duration",
    sTv: "Travelers",
    sDp: "Deposit to reserve (\u20ac200/person)",
    sTt: "Trip total",
    sSc: "Encrypted and secure payment with Stripe",
    sPy: "Pay",
    sCd: "Card number",
    sEx: "Expiry",
    sCv: "CVV",
    sHl: "Card holder",
    sCt: "Booking confirmed!",
    sCm: "You will receive an email with all details. Your coordinator will contact you soon.",
    sCl: "Back to destination",
    sSp: "spots available",
    conf: "Confirmed",
    last: "Last spots",
    sold: "Sold out",
    pp: "per person",
    sUnit: "Unit price",
    sDeposit: "Deposit",
    adults: "adult(s)",
    children: "child(ren)",
    passenger: "Passenger",
    dni: "DNI",
    passport: "Passport",
    nie: "NIE",
  },
};

/* ─── Types ─── */
interface Departure {
  /* Spanish (source of truth) */
  fecha?: string;
  estado?: string;
  precio?: number;
  plazas?: number;
  /* English (backwards-compat) */
  date?: string;
  status?: string;
  price?: number;
  spots?: number;
}

/* Normalise departure fields (Spanish takes precedence) */
function depDate(d: Departure) { return d.fecha || d.date || ""; }
function depStatus(d: Departure) { return d.estado || d.status || "confirmed"; }
function depPrice(d: Departure) { return d.precio ?? d.price; }
function depSpots(d: Departure) { return d.plazas ?? d.spots; }

interface Passenger {
  fullName: string;
  docType: string;
  docNumber: string;
  dob: string;
  nationality: string;
}

interface BookingModalProps {
  destination: any;
  initialDeparture?: any;
  onClose: () => void;
  lang?: "es" | "en";
}

/* ─── Keyframes injected once ─── */
const KEYFRAMES = `
@keyframes bkFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes bkCheckScale {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes bkCheckDraw {
  to { stroke-dashoffset: 0; }
}
`;

/* ─── Component ─── */
export default function BookingModal({
  destination,
  initialDeparture,
  onClose,
  lang = "es",
}: BookingModalProps) {
  const T = useLandingTheme();
  const t = translations[lang] || translations.es;

  /* ── State ── */
  const [step, setStep] = useState(1);
  const [selectedDep, setSelectedDep] = useState<Departure | null>(
    initialDeparture || null
  );
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  // Main contact
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Passengers
  const [passengers, setPassengers] = useState<Passenger[]>([
    { fullName: "", docType: "DNI", docNumber: "", dob: "", nationality: "" },
  ]);

  // Payment fields (visual only)
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  /* Sync passenger count with adults + children */
  useEffect(() => {
    const total = adults + children;
    setPassengers((prev) => {
      if (prev.length === total) return prev;
      if (prev.length < total) {
        const extra = Array.from({ length: total - prev.length }, () => ({
          fullName: "",
          docType: "DNI",
          docNumber: "",
          dob: "",
          nationality: "",
        }));
        return [...prev, ...extra];
      }
      return prev.slice(0, total);
    });
  }, [adults, children]);

  /* Auto-fill first passenger name from main contact */
  useEffect(() => {
    if (contactName && passengers.length > 0 && !passengers[0].fullName) {
      setPassengers((prev) => {
        const copy = [...prev];
        copy[0] = { ...copy[0], fullName: contactName };
        return copy;
      });
    }
  }, [contactName]);

  /* ── Derived values ── */
  const salidas: Departure[] = destination?.salidas || [];
  const availableDeps = salidas.filter((s: Departure) => {
    const st = depStatus(s);
    return st !== "soldOut" && st !== "agotado";
  });
  const unitPrice = (selectedDep ? depPrice(selectedDep) : undefined) ?? destination?.precio ?? 0;
  const totalTravelers = adults + children;
  const totalPrice = unitPrice * totalTravelers;
  const deposit = 200 * totalTravelers;

  /* ── Helpers ── */
  const statusLabel = (status: string) => {
    if (status === "confirmed" || status === "confirmado") return t.conf;
    if (status === "lastSpots" || status === "ultimas_plazas") return t.last;
    if (status === "soldOut" || status === "agotado") return t.sold;
    return status;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr; // already formatted or unparseable
      return d.toLocaleDateString(lang === "en" ? "en-GB" : "es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  /* ── Shared styles ── */
  const accentGrad = `linear-gradient(135deg, ${T.accent}, ${T.lime})`;

  const primaryBtn: CSSProperties = {
    background: accentGrad,
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "15px 32px",
    fontFamily: FONT,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "all .25s",
    letterSpacing: ".2px",
  };

  const primaryBtnDisabled: CSSProperties = {
    ...primaryBtn,
    opacity: 0.4,
    cursor: "not-allowed",
  };

  const secondaryBtn: CSSProperties = {
    background: T.bg2,
    color: T.text,
    border: `1.5px solid ${T.border}`,
    borderRadius: 14,
    padding: "15px 28px",
    fontFamily: FONT,
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    transition: "all .25s",
  };

  const cardStyle: CSSProperties = {
    background: T.bg,
    border: `1.5px solid ${T.border}`,
    borderRadius: 18,
    padding: "20px 22px",
    marginBottom: 18,
  };

  const sectionTitle: CSSProperties = {
    fontFamily: FONT,
    fontWeight: 700,
    fontSize: 17,
    color: T.text,
    margin: 0,
    marginBottom: 16,
  };

  const animateIn: CSSProperties = {
    animation: "bkFadeIn .3s ease-out both",
  };

  /* ── Step Labels for stepper ── */
  const stepLabels = [t.s1, t.s2, t.s3, t.s4];

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(0,0,0,.5)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Modal */}
        <div
          style={{
            background: T.bg2,
            borderRadius: 26,
            maxWidth: 580,
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative",
            boxShadow: `0 24px 80px rgba(0,0,0,.35)`,
            animation: "bkFadeIn .35s ease-out",
          }}
        >
          {/* ── Header: image + overlay + close + destination info ── */}
          <div style={{ position: "relative", height: 150, overflow: "hidden", borderRadius: "26px 26px 0 0" }}>
            <Img
              src={destination?.imagen_url || ""}
              alt={destination?.nombre || "Destination"}
              isDark={T.mode === "dark"}
              style={{ width: "100%", height: "100%", borderRadius: 0 }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,.78) 0%, rgba(0,0,0,.3) 50%, rgba(0,0,0,.15) 100%)",
                pointerEvents: "none",
              }}
            />
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,.2)",
                color: "#fff",
                fontSize: 18,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .2s",
                lineHeight: 1,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.15)";
              }}
            >
              ✕
            </button>
            {/* Destination name + price */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 22,
                right: 22,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 22,
                    color: "#fff",
                    margin: 0,
                    letterSpacing: "-.3px",
                  }}
                >
                  {destination?.nombre || "Destination"}
                </h2>
                <p
                  style={{
                    fontFamily: FONT2,
                    fontSize: 13,
                    color: "rgba(255,255,255,.7)",
                    margin: 0,
                    marginTop: 2,
                  }}
                >
                  {destination?.pais || ""}
                  {destination?.duracion ? ` \u00b7 ${destination.duracion}` : ""}
                </p>
              </div>
              <div
                style={{
                  background: T.lime,
                  color: "#0f172a",
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 17,
                  padding: "7px 16px",
                  borderRadius: 12,
                  letterSpacing: "-.2px",
                  whiteSpace: "nowrap",
                }}
              >
                {unitPrice.toLocaleString("es-ES")}{"€"}
              </div>
            </div>
          </div>

          {/* ── Stepper (steps 1-4, not shown on confirmation) ── */}
          {step <= 4 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "22px 24px 6px",
                gap: 0,
              }}
            >
              {stepLabels.map((label, i) => {
                const stepNum = i + 1;
                const isActive = step === stepNum;
                const isCompleted = step > stepNum;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {/* Circle */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: FONT,
                          fontWeight: 700,
                          fontSize: 16,
                          color: isActive || isCompleted ? "#fff" : T.muted,
                          background:
                            isActive || isCompleted ? accentGrad : T.bg3,
                          border: isActive
                            ? `2.5px solid ${T.lime}`
                            : isCompleted
                            ? `2.5px solid ${T.accent}`
                            : `2px solid ${T.border}`,
                          transition: "all .3s",
                        }}
                      >
                        {isCompleted ? "\u2713" : stepNum}
                      </div>
                      <span
                        style={{
                          fontFamily: FONT2,
                          fontSize: 12,
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? T.text : T.muted,
                          whiteSpace: "nowrap",
                          maxWidth: 85,
                          textAlign: "center",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                    {/* Connector line */}
                    {i < stepLabels.length - 1 && (
                      <div
                        style={{
                          width: 32,
                          height: 2,
                          background:
                            step > stepNum ? T.accent : T.border,
                          marginLeft: 4,
                          marginRight: 4,
                          marginBottom: 24,
                          borderRadius: 2,
                          transition: "background .3s",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Content area ── */}
          <div style={{ padding: "16px 24px 28px" }}>
            {/* ═══════ STEP 1: Departure + Travelers ═══════ */}
            {step === 1 && (
              <div style={animateIn}>
                {/* Departure selection */}
                <h3 style={sectionTitle}>{t.sDep}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {availableDeps.length === 0 && (
                    <p
                      style={{
                        fontFamily: FONT2,
                        fontSize: 14,
                        color: T.muted,
                        textAlign: "center",
                        padding: "24px 0",
                      }}
                    >
                      {lang === "es"
                        ? "No hay salidas disponibles"
                        : "No departures available"}
                    </p>
                  )}
                  {availableDeps.map((dep: Departure, i: number) => {
                    const dDate = depDate(dep);
                    const dStatus = depStatus(dep);
                    const dPrice = depPrice(dep);
                    const dSpots = depSpots(dep);
                    const isSelected =
                      selectedDep && depDate(selectedDep) === dDate;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDep(dep)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                          padding: "14px 18px",
                          borderRadius: 14,
                          border: isSelected
                            ? `2px solid ${T.accent}`
                            : `1.5px solid ${T.border}`,
                          background: isSelected
                            ? `${T.accent}10`
                            : T.bg,
                          cursor: "pointer",
                          transition: "all .2s",
                          width: "100%",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected)
                            (e.currentTarget as HTMLButtonElement).style.borderColor = T.accent;
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected)
                            (e.currentTarget as HTMLButtonElement).style.borderColor = T.border;
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <span
                            style={{
                              fontFamily: FONT,
                              fontWeight: 700,
                              fontSize: 15,
                              color: T.text,
                            }}
                          >
                            {formatDate(dDate)}
                          </span>
                          <span
                            style={{
                              fontFamily: FONT2,
                              fontSize: 13,
                              color: T.sub,
                            }}
                          >
                            {dSpots != null
                              ? `${dSpots} ${t.sSp}`
                              : ""}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {dPrice != null && (
                            <span
                              style={{
                                fontFamily: FONT,
                                fontWeight: 800,
                                fontSize: 16,
                                color: T.text,
                              }}
                            >
                              {dPrice.toLocaleString("es-ES")}{"€"}
                            </span>
                          )}
                          <StatusBadge
                            status={dStatus}
                            label={statusLabel(dStatus)}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Travelers */}
                <h3 style={sectionTitle}>{t.sTv}</h3>
                <div style={{ display: "flex", gap: 20, marginBottom: 28 }}>
                  {/* Adults */}
                  <div
                    style={{
                      flex: 1,
                      ...cardStyle,
                      marginBottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontFamily: FONT,
                          fontWeight: 700,
                          fontSize: 14,
                          color: T.text,
                          display: "block",
                        }}
                      >
                        {t.sAd}
                      </span>
                      <span
                        style={{
                          fontFamily: FONT2,
                          fontSize: 12,
                          color: T.muted,
                        }}
                      >
                        +18
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <CounterButton
                        onClick={() => setAdults((a) => Math.max(1, a - 1))}
                        disabled={adults <= 1}
                        T={T}
                      >
                        -
                      </CounterButton>
                      <span
                        style={{
                          fontFamily: FONT,
                          fontWeight: 800,
                          fontSize: 18,
                          color: T.text,
                          minWidth: 24,
                          textAlign: "center",
                        }}
                      >
                        {adults}
                      </span>
                      <CounterButton
                        onClick={() => setAdults((a) => a + 1)}
                        T={T}
                      >
                        +
                      </CounterButton>
                    </div>
                  </div>

                  {/* Children */}
                  <div
                    style={{
                      flex: 1,
                      ...cardStyle,
                      marginBottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontFamily: FONT,
                          fontWeight: 700,
                          fontSize: 14,
                          color: T.text,
                          display: "block",
                        }}
                      >
                        {t.sCh}
                      </span>
                      <span
                        style={{
                          fontFamily: FONT2,
                          fontSize: 12,
                          color: T.muted,
                        }}
                      >
                        0-17
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <CounterButton
                        onClick={() => setChildren((c) => Math.max(0, c - 1))}
                        disabled={children <= 0}
                        T={T}
                      >
                        -
                      </CounterButton>
                      <span
                        style={{
                          fontFamily: FONT,
                          fontWeight: 800,
                          fontSize: 18,
                          color: T.text,
                          minWidth: 24,
                          textAlign: "center",
                        }}
                      >
                        {children}
                      </span>
                      <CounterButton
                        onClick={() => setChildren((c) => c + 1)}
                        T={T}
                      >
                        +
                      </CounterButton>
                    </div>
                  </div>
                </div>

                {/* Continue */}
                <button
                  onClick={() => selectedDep && setStep(2)}
                  disabled={!selectedDep}
                  style={selectedDep ? primaryBtn : primaryBtnDisabled}
                >
                  {t.sNx} {"→"}
                </button>
              </div>
            )}

            {/* ═══════ STEP 2: Passenger Details ═══════ */}
            {step === 2 && (
              <div style={animateIn}>
                {/* Main contact card */}
                <div
                  style={{
                    ...cardStyle,
                    border: `2px solid ${T.accent}`,
                  }}
                >
                  <h3
                    style={{
                      ...sectionTitle,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 18,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: accentGrad,
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 800,
                      }}
                    >
                      1
                    </span>
                    {t.sMc}
                  </h3>
                  <InputField
                    label={t.sFn}
                    placeholder={lang === "es" ? "Juan Garcia Lopez" : "John Smith"}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <InputField
                      label={t.sEm}
                      type="email"
                      placeholder="email@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                    <InputField
                      label={t.sPh}
                      type="tel"
                      placeholder="+34 600 000 000"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Per-passenger cards */}
                {passengers.map((pax, i) => (
                  <div key={i} style={cardStyle}>
                    <h3
                      style={{
                        ...sectionTitle,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 18,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          background: i === 0 ? accentGrad : T.bg3,
                          color: i === 0 ? "#fff" : T.text,
                          fontSize: 13,
                          fontWeight: 800,
                          border: i === 0 ? "none" : `1.5px solid ${T.border}`,
                        }}
                      >
                        {i + 1}
                      </span>
                      {i === 0
                        ? t.sMc
                        : `${t.sCo} ${i}`}
                    </h3>

                    <InputField
                      label={t.sFn}
                      value={pax.fullName}
                      onChange={(e) => updatePassenger(i, "fullName", e.target.value)}
                      placeholder={
                        i === 0
                          ? lang === "es"
                            ? "Se rellena del contacto principal"
                            : "Auto-filled from main contact"
                          : ""
                      }
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <InputField
                        label={t.sDt}
                        type="select"
                        value={pax.docType}
                        onChange={(e) => updatePassenger(i, "docType", e.target.value)}
                      >
                        <option value="DNI">{t.dni}</option>
                        <option value="Passport">{t.passport}</option>
                        <option value="NIE">{t.nie}</option>
                      </InputField>
                      <InputField
                        label={t.sDn}
                        value={pax.docNumber}
                        onChange={(e) => updatePassenger(i, "docNumber", e.target.value)}
                        placeholder="12345678A"
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <InputField
                        label={t.sDb}
                        type="date"
                        value={pax.dob}
                        onChange={(e) => updatePassenger(i, "dob", e.target.value)}
                      />
                      <InputField
                        label={t.sNt}
                        value={pax.nationality}
                        onChange={(e) => updatePassenger(i, "nationality", e.target.value)}
                        placeholder={lang === "es" ? "Espanola" : "Spanish"}
                      />
                    </div>
                  </div>
                ))}

                {/* Navigation */}
                {(() => {
                  const contactValid = contactName.trim() && contactEmail.trim() && contactPhone.trim();
                  const passengersValid = passengers.every(
                    (p) => p.fullName.trim() && p.docNumber.trim()
                  );
                  const canContinue = !!(contactValid && passengersValid);
                  return (
                    <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                      <button onClick={() => setStep(1)} style={secondaryBtn}>
                        {t.sBk}
                      </button>
                      <button
                        onClick={() => canContinue && setStep(3)}
                        disabled={!canContinue}
                        style={canContinue ? { ...primaryBtn, flex: 1 } : { ...primaryBtnDisabled, flex: 1 }}
                      >
                        {t.sNx} {"→"}
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ═══════ STEP 3: Summary ═══════ */}
            {step === 3 && (
              <div style={animateIn}>
                <h3 style={sectionTitle}>{t.sSm}</h3>

                {/* Summary table */}
                <div style={cardStyle}>
                  <SummaryRow label={t.sDs} value={destination?.nombre || ""} T={T} />
                  <SummaryRow
                    label={t.sFd}
                    value={selectedDep ? formatDate(depDate(selectedDep)) : ""}
                    T={T}
                  />
                  <SummaryRow
                    label={t.sDu}
                    value={destination?.duracion || ""}
                    T={T}
                  />
                  <SummaryRow
                    label={t.sTv}
                    value={`${adults} ${t.adults}${children > 0 ? ` + ${children} ${t.children}` : ""}`}
                    T={T}
                    isLast
                  />
                </div>

                {/* Price breakdown */}
                <div
                  style={{
                    background: `${T.accent}12`,
                    border: `1.5px solid ${T.accent}30`,
                    borderRadius: 18,
                    padding: "20px 22px",
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT2,
                        fontSize: 14,
                        color: T.sub,
                      }}
                    >
                      {t.sUnit}: {unitPrice.toLocaleString("es-ES")}{"€"} x{" "}
                      {totalTravelers}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT,
                        fontWeight: 800,
                        fontSize: 18,
                        color: T.text,
                      }}
                    >
                      {totalPrice.toLocaleString("es-ES")}{"€"}
                    </span>
                  </div>

                  <div
                    style={{
                      height: 1,
                      background: `${T.accent}25`,
                      margin: "10px 0",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT2,
                        fontSize: 13,
                        color: T.sub,
                      }}
                    >
                      {t.sTt}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: 15,
                        color: T.sub,
                      }}
                    >
                      {totalPrice.toLocaleString("es-ES")}{"€"}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: 15,
                        color: T.accent,
                      }}
                    >
                      {t.sDp}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT,
                        fontWeight: 800,
                        fontSize: 20,
                        color: T.accent,
                      }}
                    >
                      {deposit.toLocaleString("es-ES")}{"€"}
                    </span>
                  </div>
                </div>

                {/* Secure payment badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 16px",
                    borderRadius: 12,
                    background: T.greenBg,
                    border: `1px solid ${T.greenBorder}`,
                    marginBottom: 22,
                  }}
                >
                  <span style={{ fontSize: 16 }}>🔒</span>
                  <span
                    style={{
                      fontFamily: FONT2,
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.greenText,
                    }}
                  >
                    {t.sSc}
                  </span>
                </div>

                {/* Navigation */}
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep(2)} style={secondaryBtn}>
                    {t.sBk}
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    style={{ ...primaryBtn, flex: 1 }}
                  >
                    {t.sPy} {deposit.toLocaleString("es-ES")}{"€ →"}
                  </button>
                </div>
              </div>
            )}

            {/* ═══════ STEP 4: Payment (visual preview) ═══════ */}
            {step === 4 && (
              <div style={animateIn}>
                {/* Deposit amount display */}
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: 24,
                    padding: "18px 0",
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT2,
                      fontSize: 13,
                      color: T.sub,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {t.sDeposit}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT,
                      fontWeight: 800,
                      fontSize: 38,
                      background: accentGrad,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "-1px",
                    }}
                  >
                    {deposit.toLocaleString("es-ES")}{"€"}
                  </span>
                </div>

                {/* Card holder */}
                <InputField
                  label={t.sHl}
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder={lang === "es" ? "JUAN GARCIA LOPEZ" : "JOHN SMITH"}
                />

                {/* Card number */}
                <InputField
                  label={t.sCd}
                  value={cardNumber}
                  onChange={(e) => {
                    const v = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 16)
                      .replace(/(.{4})/g, "$1 ")
                      .trim();
                    setCardNumber(v);
                  }}
                  placeholder="4242 4242 4242 4242"
                />

                {/* Expiry + CVV */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <InputField
                    label={t.sEx}
                    value={cardExpiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                      setCardExpiry(v);
                    }}
                    placeholder="MM/YY"
                  />
                  <InputField
                    label={t.sCv}
                    value={cardCvv}
                    onChange={(e) => {
                      setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
                    }}
                    placeholder="123"
                  />
                </div>

                {/* Secure payment badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 16px",
                    borderRadius: 12,
                    background: T.greenBg,
                    border: `1px solid ${T.greenBorder}`,
                    marginBottom: 22,
                    marginTop: 6,
                  }}
                >
                  <span style={{ fontSize: 16 }}>🔒</span>
                  <span
                    style={{
                      fontFamily: FONT2,
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.greenText,
                    }}
                  >
                    {t.sSc}
                  </span>
                </div>

                {/* Navigation */}
                {(() => {
                  const payValid = cardHolder.trim() && cardNumber.replace(/\s/g, "").length >= 15 && cardExpiry.length >= 5 && cardCvv.length >= 3;
                  return (
                    <div style={{ display: "flex", gap: 12 }}>
                      <button onClick={() => setStep(3)} style={secondaryBtn}>
                        {t.sBk}
                      </button>
                      <button
                        onClick={() => {
                          if (!payValid) return;
                          // In production: call /api/stripe/connect/checkout
                          setStep(5);
                        }}
                        disabled={!payValid}
                        style={payValid ? { ...primaryBtn, flex: 1 } : { ...primaryBtnDisabled, flex: 1 }}
                      >
                        {t.sPy} {deposit.toLocaleString("es-ES")}{"€"}
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ═══════ STEP 5: Confirmation ═══════ */}
            {step === 5 && (
              <div
                style={{
                  ...animateIn,
                  textAlign: "center",
                  padding: "10px 0 8px",
                }}
              >
                {/* Animated checkmark */}
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    background: accentGrad,
                    margin: "0 auto 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "bkCheckScale .5s ease-out both",
                    boxShadow: `0 8px 32px ${T.accent}40`,
                  }}
                >
                  <svg
                    width="42"
                    height="42"
                    viewBox="0 0 42 42"
                    fill="none"
                    style={{ overflow: "visible" }}
                  >
                    <path
                      d="M10 22L18 30L32 14"
                      stroke="#fff"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 50,
                        strokeDashoffset: 50,
                        animation: "bkCheckDraw .4s .4s ease-out forwards",
                      }}
                    />
                  </svg>
                </div>

                {/* Heading */}
                <h2
                  style={{
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 26,
                    color: T.text,
                    margin: 0,
                    marginBottom: 10,
                    letterSpacing: "-.3px",
                  }}
                >
                  {t.sCt}
                </h2>

                {/* Message */}
                <p
                  style={{
                    fontFamily: FONT2,
                    fontSize: 15,
                    color: T.sub,
                    lineHeight: 1.6,
                    margin: "0 auto 28px",
                    maxWidth: 380,
                  }}
                >
                  {t.sCm}
                </p>

                {/* Summary card */}
                <div
                  style={{
                    ...cardStyle,
                    textAlign: "left",
                    marginBottom: 24,
                  }}
                >
                  <SummaryRow label={t.sDs} value={destination?.nombre || ""} T={T} />
                  <SummaryRow
                    label={t.sFd}
                    value={selectedDep ? formatDate(depDate(selectedDep)) : ""}
                    T={T}
                  />
                  <SummaryRow
                    label={t.sTv}
                    value={`${adults} ${t.adults}${children > 0 ? ` + ${children} ${t.children}` : ""}`}
                    T={T}
                  />
                  <SummaryRow
                    label={t.sDeposit}
                    value={`${deposit.toLocaleString("es-ES")}€`}
                    T={T}
                    accent
                  />
                  <SummaryRow
                    label={t.sTt}
                    value={`${totalPrice.toLocaleString("es-ES")}€`}
                    T={T}
                    isLast
                    accent
                  />
                </div>

                {/* Back to destination */}
                <button
                  onClick={onClose}
                  style={{ ...primaryBtn, width: "100%" }}
                >
                  {t.sCl}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Sub-components ─── */

function CounterButton({
  children,
  onClick,
  disabled,
  T,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  T: any;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        border: `1.5px solid ${T.border}`,
        background: disabled ? T.bg3 : T.bg2,
        color: disabled ? T.muted : T.text,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 18,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all .2s",
        opacity: disabled ? 0.4 : 1,
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  );
}

function SummaryRow({
  label,
  value,
  T,
  isLast,
  accent,
}: {
  label: string;
  value: string;
  T: any;
  isLast?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "11px 0",
        borderBottom: isLast ? "none" : `1px solid ${T.border}`,
      }}
    >
      <span
        style={{
          fontFamily: FONT2,
          fontSize: 14,
          color: T.sub,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: accent ? 800 : 600,
          fontSize: accent ? 16 : 14,
          color: accent ? T.accent : T.text,
        }}
      >
        {value}
      </span>
    </div>
  );
}
