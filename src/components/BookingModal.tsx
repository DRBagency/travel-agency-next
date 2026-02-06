"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, CreditCard, MapPin } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
  imagen_url: string | null;
}

interface BookingModalProps {
  destination: Destination | null;
  clienteId: string;
  primaryColor?: string | null;
  paymentsEnabled?: boolean;
  onClose: () => void;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

const BookingModal = ({
  destination,
  clienteId,
  primaryColor,
  paymentsEnabled,
  onClose,
}: BookingModalProps) => {
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

  useEffect(() => {
    if (!destination) {
      setStep(1);
      setDepartureDate(undefined);
      setReturnDate(undefined);
      setAdults(2);
      setChildren(0);
      setCustomer({ name: "", email: "", phone: "" });
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
  const totalPrice =
    Number.isFinite(basePrice) && basePrice > 0
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
      default:
        return false;
    }
  };

  const handlePay = async () => {
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
        total: totalPrice, // 👈 número seguro
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Error al iniciar el pago");
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
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-6">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4" />
                Reserva directa
              </div>
              <h3 className="text-2xl font-bold">
                {destination.nombre}
              </h3>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              {[1, 2, 3, 4].map((s) => {
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
                    {s < 4 && (
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
                  className={`w-full bg-slate-800 border p-3 rounded-xl text-left text-white placeholder:text-slate-400 ${
                    showErrors && !departureDate
                      ? "border-red-500"
                      : "border-white/10"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
                >
                  {departureDate
                    ? format(departureDate, "PPP", { locale: es })
                    : "Selecciona fecha de salida"}
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
                  className={`w-full bg-slate-800 border p-3 rounded-xl text-left text-white placeholder:text-slate-400 ${
                    showErrors &&
                    (!returnDate || !departureDate || returnDate <= departureDate)
                      ? "border-red-500"
                      : "border-white/10"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
                >
                  {returnDate
                    ? format(returnDate, "PPP", { locale: es })
                    : "Selecciona fecha de regreso"}
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
                  placeholder="Adultos"
                />
                <input
                  type="number"
                  min={0}
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="bg-slate-800 border border-white/10 p-3 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  placeholder="Niños"
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
                  placeholder="Nombre completo"
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
                  placeholder="Email"
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
                  placeholder="Teléfono"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                />

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-white/60 mb-2">
                    Resumen
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>Salida</span>
                    <span>
                      {departureDate
                        ? format(departureDate, "PPP", { locale: es })
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>Regreso</span>
                    <span>
                      {returnDate
                        ? format(returnDate, "PPP", { locale: es })
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>Personas</span>
                    <span>{persons}</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-white">
                    <span>Total</span>
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
              Atrás
            </button>

            {step < 4 ? (
              <button
                onClick={() => {
                  if (!canProceed()) {
                    setShowErrors(true);
                    return;
                  }
                  setShowErrors(false);
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
                Siguiente
              </button>
            ) : (
              <div className="flex flex-col items-end gap-2">
                {!paymentsEnabled && (
                  <span className="text-sm text-amber-200">
                    Esta agencia aún no puede aceptar pagos.
                  </span>
                )}
                <button
                  onClick={() => {
                    if (!paymentsEnabled) return;
                    if (!canProceed()) {
                      setShowErrors(true);
                      return;
                    }
                    setShowErrors(false);
                    handlePay();
                  }}
                  disabled={!paymentsEnabled}
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
                  Pagar · {totalPrice} €
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
