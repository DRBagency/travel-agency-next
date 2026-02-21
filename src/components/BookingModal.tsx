"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, CreditCard, MapPin } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { ar } from "date-fns/locale";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import type { Locale } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* DESTINO DESDE SUPABASE */
export interface Destination {
  id: string;
  nombre: string;
  precio: number;
  precio_adulto?: number;
  precio_nino?: number;
  precio_grupo?: number;
  imagen_url: string | null;
}

interface BookingModalProps {
  destination: Destination | null;
  clienteId: string;
  primaryColor?: string | null;
  paymentsEnabled?: boolean;
  subscriptionActive?: boolean;
  onClose: () => void;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

interface PassengerData {
  name: string;
  document_type: "dni" | "passport" | "nie";
  document_number: string;
  birth_date: string;
  nationality: string;
}

const BookingModal = ({
  destination,
  clienteId,
  primaryColor,
  paymentsEnabled,
  subscriptionActive,
  onClose,
}: BookingModalProps) => {
  const t = useTranslations('booking');
  const locale = useLocale();
  const dateFnsLocales: Record<string, Locale> = { es, en: enUS, ar };
  const dateFnsLocale = dateFnsLocales[locale] || es;

  const [step, setStep] = useState(1);
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showErrors, setShowErrors] = useState(false);

  const [customer, setCustomer] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
  });

  const [passengers, setPassengers] = useState<PassengerData[]>([]);

  useEffect(() => {
    if (!destination) {
      setStep(1);
      setDepartureDate(undefined);
      setReturnDate(undefined);
      setAdults(2);
      setChildren(0);
      setCustomer({ name: "", email: "", phone: "" });
      setPassengers([]);
      setShowErrors(false);
    }
  }, [destination]);

  if (!destination) return null;

  const safeDestinationImage = (() => {
    if (typeof destination.imagen_url !== "string") return null;
    const cleaned = destination.imagen_url.trim();
    if (!cleaned) return null;
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
      return cleaned;
    }
    if (cleaned.startsWith("/")) return cleaned;
    return null;
  })();

  /* 🔒 PRECIO BLINDADO */
  const persons = adults + children;
  const basePrice = Number(destination.precio);
  const hasDetailedPricing = (destination.precio_adulto ?? 0) > 0 || (destination.precio_nino ?? 0) > 0;
  const totalPrice = hasDetailedPricing
    ? ((destination.precio_adulto || destination.precio) * adults) + ((destination.precio_nino || destination.precio) * children)
    : Number.isFinite(basePrice) && basePrice > 0
      ? basePrice * persons
      : 0;

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!departureDate;
      case 2:
        return !!returnDate && !!departureDate && returnDate > departureDate;
      case 3:
        return persons > 0;
      case 4:
        return (
          customer.name.trim().length > 0 &&
          customer.email.includes("@") &&
          customer.phone.trim().length > 0
        );
      case 5:
        return passengers.length === persons && passengers.every(
          (p) =>
            p.name.trim().length > 0 &&
            p.document_number.trim().length > 0 &&
            p.birth_date.trim().length > 0 &&
            p.nationality.trim().length > 0
        );
      default:
        return false;
    }
  };

  /* Initialize passengers when moving to step 5 */
  const initPassengers = () => {
    const newPassengers: PassengerData[] = [];
    for (let i = 0; i < persons; i++) {
      newPassengers.push({
        name: i === 0 ? customer.name : "",
        document_type: "dni",
        document_number: "",
        birth_date: "",
        nationality: "",
      });
    }
    setPassengers(newPassengers);
  };

  const updatePassenger = (index: number, field: keyof PassengerData, value: string) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handlePay = async () => {
    if (!subscriptionActive) return;
    if (!paymentsEnabled) return;
    if (!canProceed()) return;

    const res = await fetch("/api/stripe/connect/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente_id: clienteId,
        destino_id: destination.id,
        destino_nombre: destination.nombre,
        nombre: customer.name,
        email: customer.email,
        telefono: customer.phone,
        fecha_salida: departureDate!.toISOString().slice(0, 10),
        fecha_regreso: returnDate!.toISOString().slice(0, 10),
        personas: persons,
        total: totalPrice,
        passengers,
        adults,
        children,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(t('paymentError'));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl mx-4 rounded-3xl bg-slate-950 border border-white/10 overflow-hidden shadow-[0_30px_80px_rgba(2,6,23,0.65)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="relative h-40 overflow-hidden">
            {safeDestinationImage && (
              <Image
                src={safeDestinationImage}
                alt={destination.nombre}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 end-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 start-6">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4" />
                {t('directBooking')}
              </div>
              <h3 className="text-2xl font-bold">
                {destination.nombre}
              </h3>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              {[1, 2, 3, 4, 5].map((s) => {
                const isActive = step === s;
                const isDone = step > s;
                return (
                  <div key={s} className="flex items-center flex-1">
                    <div
                      className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold border"
                      style={{
                        backgroundColor: isDone
                          ? primaryColor || "#0ea5e9"
                          : isActive
                          ? "rgba(255,255,255,0.12)"
                          : "transparent",
                        borderColor: isDone
                          ? "transparent"
                          : isActive
                          ? primaryColor || "rgba(255,255,255,0.3)"
                          : "rgba(255,255,255,0.15)",
                        color: isDone || isActive ? "white" : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {s}
                    </div>
                    {s < 5 && (
                      <div
                        className="mx-2 h-[2px] flex-1 rounded-full"
                        style={{
                          backgroundColor: step > s
                            ? primaryColor || "#0ea5e9"
                            : "rgba(255,255,255,0.12)",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {step === 1 && (
              <Popover>
                <PopoverTrigger
                  className={`w-full bg-slate-800 border p-3 rounded-xl text-start text-white placeholder:text-slate-400 ${
                    showErrors && !departureDate
                      ? "border-red-500"
                      : "border-white/10"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
                >
                  {departureDate
                    ? format(departureDate, "PPP", { locale: dateFnsLocale })
                    : t('selectDeparture')}
                </PopoverTrigger>
                <PopoverContent
                  className="bg-slate-950 border border-white/10 shadow-2xl text-white"
                  style={
                    primaryColor
                      ? { ["--calendar-accent" as any]: primaryColor }
                      : { ["--calendar-accent" as any]: "#38bdf8" }
                  }
                >
                  <CalendarComponent
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    className="text-white"
                    classNames={{
                      caption_label: "text-white",
                      head_cell: "text-white/50 rounded-md w-9 font-normal text-[0.8rem]",
                      day: "h-9 w-9 p-0 font-normal text-white/80 hover:bg-white/10 rounded-md",
                      day_today: "bg-white/10 text-white",
                      day_selected:
                        "bg-[var(--calendar-accent)] text-white hover:bg-[var(--calendar-accent)] hover:text-white focus:bg-[var(--calendar-accent)] focus:text-white",
                      day_outside:
                        "day-outside text-white/30 opacity-50 aria-selected:bg-white/10 aria-selected:text-white/40 aria-selected:opacity-50",
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}

            {step === 2 && (
              <Popover>
                <PopoverTrigger
                  className={`w-full bg-slate-800 border p-3 rounded-xl text-start text-white placeholder:text-slate-400 ${
                    showErrors &&
                    (!returnDate || !departureDate || returnDate <= departureDate)
                      ? "border-red-500"
                      : "border-white/10"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
                >
                  {returnDate
                    ? format(returnDate, "PPP", { locale: dateFnsLocale })
                    : t('selectReturn')}
                </PopoverTrigger>
                <PopoverContent
                  className="bg-slate-950 border border-white/10 shadow-2xl text-white"
                  style={
                    primaryColor
                      ? { ["--calendar-accent" as any]: primaryColor }
                      : { ["--calendar-accent" as any]: "#38bdf8" }
                  }
                >
                  <CalendarComponent
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    className="text-white"
                    classNames={{
                      caption_label: "text-white",
                      head_cell: "text-white/50 rounded-md w-9 font-normal text-[0.8rem]",
                      day: "h-9 w-9 p-0 font-normal text-white/80 hover:bg-white/10 rounded-md",
                      day_today: "bg-white/10 text-white",
                      day_selected:
                        "bg-[var(--calendar-accent)] text-white hover:bg-[var(--calendar-accent)] hover:text-white focus:bg-[var(--calendar-accent)] focus:text-white",
                      day_outside:
                        "day-outside text-white/30 opacity-50 aria-selected:bg-white/10 aria-selected:text-white/40 aria-selected:opacity-50",
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}

            {step === 3 && (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  min={1}
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="bg-slate-800 border border-white/10 p-3 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  placeholder={t('adults')}
                />
                <input
                  type="number"
                  min={0}
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="bg-slate-800 border border-white/10 p-3 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  placeholder={t('children')}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <input
                  className={`w-full bg-slate-800 border p-3 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
                    showErrors && customer.name.trim().length === 0
                      ? "border-red-500"
                      : "border-white/10"
                  }`}
                  placeholder={t('fullName')}
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                />
                <input
                  className={`w-full bg-slate-800 border p-3 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
                    showErrors && !customer.email.includes("@")
                      ? "border-red-500"
                      : "border-white/10"
                  }`}
                  placeholder={t('email')}
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                />
                <input
                  className={`w-full bg-slate-800 border p-3 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
                    showErrors && customer.phone.trim().length === 0
                      ? "border-red-500"
                      : "border-white/10"
                  }`}
                  placeholder={t('phone')}
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4 max-h-[340px] overflow-y-auto pe-1">
                <div className="text-sm text-white/60">{t('passengerDetails')}</div>
                {passengers.map((p, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                    <div className="text-sm font-semibold text-white/80">
                      {t('passengerN', { n: i + 1 })}
                    </div>
                    <input
                      className={`w-full bg-slate-800 border p-2.5 rounded-xl text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
                        showErrors && p.name.trim().length === 0
                          ? "border-red-500"
                          : "border-white/10"
                      }`}
                      placeholder={t('fullName')}
                      value={p.name}
                      onChange={(e) => updatePassenger(i, "name", e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        className="bg-slate-800 border border-white/10 p-2.5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        value={p.document_type}
                        onChange={(e) => updatePassenger(i, "document_type", e.target.value)}
                      >
                        <option value="dni">{t('dni')}</option>
                        <option value="passport">{t('passport')}</option>
                        <option value="nie">{t('nie')}</option>
                      </select>
                      <input
                        className={`bg-slate-800 border p-2.5 rounded-xl text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
                          showErrors && p.document_number.trim().length === 0
                            ? "border-red-500"
                            : "border-white/10"
                        }`}
                        placeholder={t('documentNumber')}
                        value={p.document_number}
                        onChange={(e) => updatePassenger(i, "document_number", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        className={`bg-slate-800 border p-2.5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
                          showErrors && p.birth_date.trim().length === 0
                            ? "border-red-500"
                            : "border-white/10"
                        }`}
                        placeholder={t('birthDate')}
                        value={p.birth_date}
                        onChange={(e) => updatePassenger(i, "birth_date", e.target.value)}
                      />
                      <input
                        className={`bg-slate-800 border p-2.5 rounded-xl text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
                          showErrors && p.nationality.trim().length === 0
                            ? "border-red-500"
                            : "border-white/10"
                        }`}
                        placeholder={t('nationality')}
                        value={p.nationality}
                        onChange={(e) => updatePassenger(i, "nationality", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-white/60 mb-2">
                    {t('summary')}
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>{t('departure')}</span>
                    <span>
                      {departureDate
                        ? format(departureDate, "PPP", { locale: dateFnsLocale })
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>{t('return')}</span>
                    <span>
                      {returnDate
                        ? format(returnDate, "PPP", { locale: dateFnsLocale })
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>{t('persons')}</span>
                    <span>{persons}</span>
                  </div>
                  {hasDetailedPricing && (
                    <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                      <div className="text-xs text-white/50 font-medium">{t('priceBreakdown')}</div>
                      <div className="flex items-center justify-between text-sm text-white/70">
                        <span>{adults} x {t('adultPrice')}</span>
                        <span>{(destination.precio_adulto || destination.precio) * adults} €</span>
                      </div>
                      {children > 0 && (
                        <div className="flex items-center justify-between text-sm text-white/70">
                          <span>{children} x {t('childPrice')}</span>
                          <span>{(destination.precio_nino || destination.precio) * children} €</span>
                        </div>
                      )}
                      {(destination.precio_grupo ?? 0) > 0 && (
                        <div className="flex items-center justify-between text-xs text-white/50">
                          <span>{t('groupPrice')}</span>
                          <span>{destination.precio_grupo} €</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between font-semibold text-white">
                    <span>{t('total')}</span>
                    <span>{totalPrice} €</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t border-white/10 flex justify-between items-center">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex items-center gap-2 text-white/60 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-lg px-2 py-1"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('back')}
            </button>

            {step < 5 ? (
              <button
                onClick={() => {
                  if (!canProceed()) {
                    setShowErrors(true);
                    return;
                  }
                  setShowErrors(false);
                  if (step === 4) initPassengers();
                  setStep((s) => s + 1);
                }}
                className={
                  primaryColor
                    ? "px-6 py-3 rounded-2xl text-white font-semibold shadow-[0_12px_30px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    : "px-6 py-3 rounded-2xl bg-white text-slate-950 font-semibold shadow-[0_12px_30px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                }
                style={
                  primaryColor
                    ? { backgroundColor: primaryColor }
                    : undefined
                }
              >
                {t('next')}
              </button>
            ) : (
              <div className="flex flex-col items-end gap-2">
                {!subscriptionActive && (
                  <span className="text-sm text-amber-200">
                    {t('subscriptionInactive')}
                  </span>
                )}
                {subscriptionActive && !paymentsEnabled && (
                  <span className="text-sm text-amber-200">
                    {t('paymentsNotEnabled')}
                  </span>
                )}
                <button
                  onClick={() => {
                    if (!subscriptionActive) return;
                    if (!paymentsEnabled) return;
                    if (!canProceed()) {
                      setShowErrors(true);
                      return;
                    }
                    setShowErrors(false);
                    handlePay();
                  }}
                  disabled={!subscriptionActive || !paymentsEnabled}
                  className={
                    primaryColor
                      ? "px-6 py-3 rounded-2xl flex items-center gap-2 text-white font-semibold shadow-[0_12px_30px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed"
                      : "px-6 py-3 rounded-2xl flex items-center gap-2 bg-white text-slate-950 font-semibold shadow-[0_12px_30px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed"
                  }
                  style={
                    primaryColor
                      ? { backgroundColor: primaryColor }
                      : undefined
                  }
                >
                  <CreditCard className="w-5 h-5" />
                  {t('pay')} · {totalPrice} €
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
