"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Calendar,
  Link2,
  Link2Off,
  Plus,
  Trash2,
  Pencil,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// --- Event color options ---
const EVENT_COLORS = [
  { name: "Lima", bg: "#D4F24D", text: "#0a2a2c" },
  { name: "Turquesa", bg: "#1CABB0", text: "#ffffff" },
  { name: "Azul", bg: "#3B82F6", text: "#ffffff" },
  { name: "Violeta", bg: "#8B5CF6", text: "#ffffff" },
  { name: "Rosa", bg: "#EC4899", text: "#ffffff" },
  { name: "Naranja", bg: "#F97316", text: "#ffffff" },
  { name: "Rojo", bg: "#EF4444", text: "#ffffff" },
  { name: "Verde", bg: "#22C55E", text: "#ffffff" },
];

// --- Custom date picker ---
function CustomDatePicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const dateObj = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(dateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(dateObj.getMonth());

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const today = new Date();
  const selectedDate = value ? value.split("T")[0] : "";

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  const dayNames = ["L", "M", "X", "J", "V", "S", "D"];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const selectDay = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const timePart = value?.includes("T") ? value.split("T")[1] : "09:00";
    onChange(`${viewYear}-${m}-${d}T${timePart}`);
    setShowPicker(false);
  };

  const displayDate = value
    ? new Date(value).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
    : "Seleccionar fecha";

  // Monday-start: shift firstDay (0=Sun -> 6, 1=Mon -> 0, etc.)
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs font-medium text-gray-400 dark:text-white/50 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/[0.07] border border-gray-200 dark:border-white/[0.12] hover:border-gray-300 dark:hover:border-white/25 text-gray-900 dark:text-white text-left transition-all"
      >
        <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <span className="text-sm font-medium">{displayDate}</span>
      </button>

      {showPicker && (
        <div className="absolute z-50 top-full mt-2 left-0 w-72 rounded-2xl bg-white dark:bg-[#0d3234] border border-gray-200 dark:border-white/15 shadow-2xl shadow-black/10 dark:shadow-black/40 p-4 animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {monthNames[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 mb-1">
            {dayNames.map((d) => (
              <div key={d} className="text-center text-[10px] font-semibold text-gray-400 dark:text-white/30 uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected = dateStr === selectedDate;
              const isToday =
                day === today.getDate() &&
                viewMonth === today.getMonth() &&
                viewYear === today.getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => selectDay(day)}
                  className={`
                    h-9 w-full rounded-lg text-sm font-medium transition-all
                    ${isSelected
                      ? "bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20"
                      : isToday
                        ? "bg-gray-100 dark:bg-white/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-400/30"
                        : "text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Custom time picker ---
function CustomTimePicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const timePart = value?.includes("T") ? value.split("T")[1]?.slice(0, 5) : "09:00";
  const [hours, minutes] = timePart.split(":").map(Number);

  const setTime = (h: number, m: number) => {
    const datePart = value?.split("T")[0] || new Date().toISOString().split("T")[0];
    onChange(`${datePart}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = [0, 15, 30, 45];

  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 dark:text-white/50 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/[0.07] border border-gray-200 dark:border-white/[0.12]">
        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <select
          value={hours}
          onChange={(e) => setTime(Number(e.target.value), minutes)}
          className="bg-transparent text-gray-900 dark:text-white text-sm font-medium appearance-none cursor-pointer outline-none pr-1"
        >
          {hourOptions.map((h) => (
            <option key={h} value={h} className="bg-white dark:bg-[#0d3234] text-gray-900 dark:text-white">
              {String(h).padStart(2, "0")}
            </option>
          ))}
        </select>
        <span className="text-gray-400 dark:text-white/40 font-bold text-lg leading-none">:</span>
        <select
          value={minutes}
          onChange={(e) => setTime(hours, Number(e.target.value))}
          className="bg-transparent text-gray-900 dark:text-white text-sm font-medium appearance-none cursor-pointer outline-none"
        >
          {minuteOptions.map((m) => (
            <option key={m} value={m} className="bg-white dark:bg-[#0d3234] text-gray-900 dark:text-white">
              {String(m).padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// --- Types ---
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  description?: string;
  color?: string;
  source?: "google" | "local";
}

interface CalendarioContentProps {
  googleCalendarConnected: boolean;
  googleCalendarEmail?: string | null;
  googleCalendarUrl?: string | null;
  apiBasePath?: string;
}

// --- Main component ---
export default function CalendarioContent({
  googleCalendarConnected,
  googleCalendarEmail,
  googleCalendarUrl,
  apiBasePath = "/api/admin/calendar",
}: CalendarioContentProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAllDay, setFormAllDay] = useState(false);
  const [formColor, setFormColor] = useState(EVENT_COLORS[0].bg);
  const [formSaving, setFormSaving] = useState(false);

  // Embed URL fallback state
  const [embedUrl, setEmbedUrl] = useState(googleCalendarUrl || "");
  const [savingUrl, setSavingUrl] = useState(false);
  const [savedUrl, setSavedUrl] = useState(false);

  const calendarRef = useRef<FullCalendar>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBasePath}/events`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {
      console.error("Error loading events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (googleCalendarConnected) {
      fetchEvents();
    }
  }, [googleCalendarConnected, fetchEvents]);

  const openCreateModal = (startStr?: string) => {
    setEditingEvent(null);
    setFormTitle("");
    setFormStart(startStr || new Date().toISOString().slice(0, 16));
    setFormEnd(startStr || new Date().toISOString().slice(0, 16));
    setFormDescription("");
    setFormAllDay(false);
    setFormColor(EVENT_COLORS[0].bg);
    setModalOpen(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormStart(event.start?.slice(0, 16) || "");
    setFormEnd(event.end?.slice(0, 16) || event.start?.slice(0, 16) || "");
    setFormDescription(event.description || "");
    setFormAllDay(event.allDay || false);
    setFormColor(event.color || EVENT_COLORS[0].bg);
    setModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!formTitle.trim() || !formStart) return;
    setFormSaving(true);

    try {
      if (editingEvent) {
        const res = await fetch(`${apiBasePath}/events/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            start: formAllDay ? formStart.split("T")[0] : formStart,
            end: formAllDay ? (formEnd || formStart).split("T")[0] : formEnd || formStart,
            description: formDescription,
            allDay: formAllDay,
            color: formColor,
          }),
        });
        if (!res.ok) throw new Error("Error updating");
      } else {
        const res = await fetch(`${apiBasePath}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            start: formAllDay ? formStart.split("T")[0] : formStart,
            end: formAllDay ? (formEnd || formStart).split("T")[0] : formEnd || formStart,
            description: formDescription,
            allDay: formAllDay,
            color: formColor,
          }),
        });
        if (!res.ok) throw new Error("Error creating");
      }

      setModalOpen(false);
      fetchEvents();
    } catch {
      alert("Error al guardar el evento");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("¿Eliminar este evento?")) return;

    try {
      const res = await fetch(`${apiBasePath}/events?id=${eventId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchEvents();
        setModalOpen(false);
      }
    } catch {
      alert("Error al eliminar el evento");
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("¿Desconectar Google Calendar? Los eventos locales no se verán afectados.")) return;
    setDisconnecting(true);

    try {
      const res = await fetch(`${apiBasePath}/oauth/disconnect`, {
        method: "POST",
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch {
      alert("Error al desconectar");
    } finally {
      setDisconnecting(false);
    }
  };

  const handleSaveEmbedUrl = async () => {
    if (savingUrl) return;
    setSavingUrl(true);
    setSavedUrl(false);
    try {
      const res = await fetch(`${apiBasePath}/google-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: embedUrl.trim() }),
      });
      if (res.ok) {
        setSavedUrl(true);
        setTimeout(() => setSavedUrl(false), 3000);
      }
    } catch {
      alert("Error al guardar la URL");
    } finally {
      setSavingUrl(false);
    }
  };

  // --- Event modal ---
  const renderModal = () => {
    if (!modalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" />

        {/* Modal */}
        <div
          className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-gradient-to-b dark:from-[#0f3a3d] dark:to-[#0a2a2c] border border-gray-200 dark:border-white/[0.12] shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with color accent */}
          <div className="relative px-7 pt-6 pb-4">
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: formColor }}
            />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingEvent ? "Editar evento" : "Nuevo evento"}
                </h3>
                <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">
                  {editingEvent ? "Modifica los detalles del evento" : "Crea un nuevo evento en tu calendario"}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-7 pb-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-gray-400 dark:text-white/50 uppercase tracking-wider mb-1.5">
                Titulo
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Reunion con cliente, vuelo a Madrid..."
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/[0.07] border border-gray-200 dark:border-white/[0.12] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 text-sm font-medium focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 transition-all"
              />
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-xs font-medium text-gray-400 dark:text-white/50 uppercase tracking-wider mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {EVENT_COLORS.map((c) => (
                  <button
                    key={c.bg}
                    type="button"
                    onClick={() => setFormColor(c.bg)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      formColor === c.bg
                        ? "ring-2 ring-gray-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-[#0f3a3d] scale-110"
                        : "hover:scale-110 opacity-70 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c.bg }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* All day toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormAllDay(!formAllDay)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  formAllDay ? "bg-blue-500" : "bg-gray-300 dark:bg-white/15"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    formAllDay ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-500 dark:text-white/60">Todo el dia</span>
            </div>

            {/* Date & time */}
            {formAllDay ? (
              <div className="grid grid-cols-2 gap-4">
                <CustomDatePicker value={formStart} onChange={setFormStart} label="Fecha inicio" />
                <CustomDatePicker value={formEnd} onChange={setFormEnd} label="Fecha fin" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <CustomDatePicker value={formStart} onChange={setFormStart} label="Fecha inicio" />
                  <CustomTimePicker value={formStart} onChange={setFormStart} label="Hora inicio" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <CustomDatePicker value={formEnd} onChange={setFormEnd} label="Fecha fin" />
                  <CustomTimePicker value={formEnd} onChange={setFormEnd} label="Hora fin" />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-400 dark:text-white/50 uppercase tracking-wider mb-1.5">
                Descripcion
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Notas adicionales sobre el evento..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/[0.07] border border-gray-200 dark:border-white/[0.12] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 text-sm font-medium focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-7 py-4 border-t border-gray-100 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between">
            {editingEvent ? (
              <button
                onClick={() => handleDeleteEvent(editingEvent.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 transition-all text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-gray-400 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEvent}
                disabled={formSaving || !formTitle.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm disabled:opacity-40 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                {editingEvent ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {formSaving ? "Guardando..." : editingEvent ? "Actualizar" : "Crear evento"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Connected view ---
  if (googleCalendarConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calendario</h1>
          <p className="text-gray-500 dark:text-white/60">
            Gestiona tus eventos directamente desde Google Calendar.
          </p>
        </div>

        {/* Connection status */}
        <div className="panel-card p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-green-400 shadow-lg shadow-green-400/50" />
              <span className="text-sm text-gray-500 dark:text-white/60">
                Conectado como{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {googleCalendarEmail}
                </span>
              </span>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => openCreateModal()}
                className="flex items-center gap-2 btn-primary text-sm shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                Nuevo evento
              </button>
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:text-red-600 dark:hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all text-sm disabled:opacity-50"
              >
                <Link2Off className="w-4 h-4" />
                {disconnecting ? "..." : "Desconectar"}
              </button>
            </div>
          </div>
        </div>

        {/* FullCalendar */}
        <div className="panel-card p-5 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent" />
            </div>
          ) : (
            <div className="fc-travelie-theme">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                locale="es"
                buttonText={{
                  today: "Hoy",
                  month: "Mes",
                  week: "Semana",
                  day: "Dia",
                }}
                events={events.map((e) => ({
                  id: e.id,
                  title: e.title,
                  start: e.start,
                  end: e.end,
                  allDay: e.allDay,
                  backgroundColor: e.color || EVENT_COLORS[0].bg,
                  borderColor: e.color || EVENT_COLORS[0].bg,
                  textColor: EVENT_COLORS.find((c) => c.bg === e.color)?.text || EVENT_COLORS[0].text,
                  extendedProps: {
                    description: e.description,
                    source: e.source,
                  },
                }))}
                dateClick={(info) => {
                  const dateStr = info.dateStr.includes("T")
                    ? info.dateStr.slice(0, 16)
                    : info.dateStr + "T09:00";
                  openCreateModal(dateStr);
                }}
                eventClick={(info) => {
                  const ev = events.find((e) => e.id === info.event.id);
                  if (ev) openEditModal(ev);
                }}
                height="auto"
                editable={false}
                selectable={true}
                dayMaxEvents={3}
              />
            </div>
          )}
        </div>

        {renderModal()}
      </div>
    );
  }

  // --- Not connected view ---
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Calendario</h1>
        <p className="text-gray-500 dark:text-white/60">
          Conecta tu Google Calendar para gestionar citas y eventos.
        </p>
      </div>

      {/* Connect Google Calendar */}
      <div className="panel-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Google Calendar</h2>
        </div>

        <p className="text-gray-500 dark:text-white/60 text-sm leading-relaxed">
          Conecta tu cuenta de Google para crear, editar y eliminar eventos
          directamente desde este panel. Los cambios se sincronizaran
          automaticamente con tu Google Calendar.
        </p>

        <a
          href={`${apiBasePath}/oauth/start`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
        >
          <Link2 className="w-5 h-5" />
          Conectar Google Calendar
        </a>
      </div>

      {/* Embed URL fallback */}
      <div className="rounded-2xl border border-gray-100 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.03] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400 dark:text-white/30" />
          <h2 className="text-base font-semibold text-gray-400 dark:text-white/50">
            Alternativa: Calendario embebido (solo lectura)
          </h2>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">
            URL de embed de Google Calendar
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              placeholder="https://calendar.google.com/calendar/embed?src=..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/[0.07] border border-gray-200 dark:border-white/[0.12] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 text-sm focus:outline-none focus:border-gray-300 dark:focus:border-white/25 transition-all"
            />
            <button
              onClick={handleSaveEmbedUrl}
              disabled={savingUrl}
              className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/[0.07] hover:bg-gray-200 dark:hover:bg-white/[0.12] border border-gray-200 dark:border-white/[0.12] text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white font-medium text-sm disabled:opacity-60 transition-all whitespace-nowrap"
            >
              {savingUrl ? "..." : savedUrl ? "Guardado" : "Guardar"}
            </button>
          </div>
        </div>
      </div>

      {/* Calendar iframe */}
      {embedUrl.trim() && (
        <div className="panel-card overflow-hidden">
          <iframe
            src={embedUrl.trim()}
            className="w-full border-0"
            style={{ height: "600px" }}
            title="Google Calendar"
          />
        </div>
      )}
    </div>
  );
}
