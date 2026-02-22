"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { sileo } from "sileo";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Unlink,
  AlertTriangle,
} from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// --- Event color options ---
const EVENT_COLOR_DATA = [
  { key: "lime" as const, bg: "#D4F24D", text: "#0a2a2c" },
  { key: "turquoise" as const, bg: "#1CABB0", text: "#ffffff" },
  { key: "blue" as const, bg: "#3B82F6", text: "#ffffff" },
  { key: "violet" as const, bg: "#8B5CF6", text: "#ffffff" },
  { key: "pink" as const, bg: "#EC4899", text: "#ffffff" },
  { key: "orange" as const, bg: "#F97316", text: "#ffffff" },
  { key: "red" as const, bg: "#EF4444", text: "#ffffff" },
  { key: "green" as const, bg: "#22C55E", text: "#ffffff" },
];

// --- Custom date picker ---
function CustomDatePicker({
  value,
  onChange,
  label,
  monthNames,
  dayNames,
  selectDateLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  monthNames: string[];
  dayNames: string[];
  selectDateLabel: string;
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
    ? new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
    : selectDateLabel;

  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs font-medium text-gray-400 dark:text-white/50 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/[0.07] border border-gray-200 dark:border-white/[0.12] hover:border-gray-300 dark:hover:border-white/25 text-gray-900 dark:text-white text-start transition-all"
      >
        <CalendarDays className="w-4 h-4 text-drb-turquoise-600 dark:text-drb-turquoise-400 shrink-0" />
        <span className="text-sm font-medium">{displayDate}</span>
      </button>

      {showPicker && (
        <div className="absolute z-50 top-full mt-2 start-0 w-72 rounded-2xl bg-white dark:bg-[#0d3234] border border-gray-200 dark:border-white/15 shadow-2xl shadow-black/10 dark:shadow-black/40 p-4 animate-in fade-in slide-in-from-top-2">
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

          <div className="grid grid-cols-7 mb-1">
            {dayNames.map((d, i) => (
              <div key={`${d}-${i}`} className="text-center text-[10px] font-semibold text-gray-400 dark:text-white/30 uppercase py-1">
                {d}
              </div>
            ))}
          </div>

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
                      ? "bg-drb-turquoise-500 text-white font-bold shadow-lg shadow-drb-turquoise-500/20"
                      : isToday
                        ? "bg-gray-100 dark:bg-white/10 text-drb-turquoise-600 dark:text-drb-turquoise-400 ring-1 ring-drb-turquoise-400/30"
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
        <Clock className="w-4 h-4 text-drb-turquoise-600 dark:text-drb-turquoise-400 shrink-0" />
        <select
          value={hours}
          onChange={(e) => setTime(Number(e.target.value), minutes)}
          className="bg-transparent text-gray-900 dark:text-white text-sm font-medium appearance-none cursor-pointer outline-none pe-1"
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
}

// --- Main component ---
interface CalendarioContentProps {
  googleConnected?: boolean;
  googleEmail?: string | null;
}

export default function CalendarioContent({
  googleConnected = false,
  googleEmail = null,
}: CalendarioContentProps) {
  const router = useRouter();
  const t = useTranslations("admin.calendario");
  const tc = useTranslations("common");
  const tt = useTranslations("toast");

  const EVENT_COLORS = EVENT_COLOR_DATA.map((c) => ({
    ...c,
    name: t(`colors.${c.key}`),
  }));

  const monthNames = Array.from({ length: 12 }, (_, i) => t(`months.${i}`));
  const dayNames = Array.from({ length: 7 }, (_, i) => t(`dayAbbreviations.${i}`));

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [gcConnected, setGcConnected] = useState(googleConnected);
  const [disconnecting, setDisconnecting] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAllDay, setFormAllDay] = useState(false);
  const [formColor, setFormColor] = useState(EVENT_COLOR_DATA[1].bg); // turquoise default
  const [formSaving, setFormSaving] = useState(false);

  const calendarRef = useRef<FullCalendar>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/calendar/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // ResizeObserver: recalculate FullCalendar size when container resizes (sidebar pin/unpin)
  useEffect(() => {
    const container = calendarContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      // Small delay to let the CSS transition finish
      requestAnimationFrame(() => {
        calendarRef.current?.getApi().updateSize();
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleDisconnectGoogle = async () => {
    if (!confirm(t("confirmDisconnect"))) return;
    setDisconnecting(true);
    try {
      const res = await fetch("/api/admin/calendar/oauth/disconnect", { method: "POST" });
      if (res.ok) {
        setGcConnected(false);
        sileo.success({ title: t("googleDisconnected") });
        router.refresh();
      } else {
        sileo.error({ title: t("errorDisconnecting") });
      }
    } catch {
      sileo.error({ title: t("errorDisconnecting") });
    } finally {
      setDisconnecting(false);
    }
  };

  const openCreateModal = (startStr?: string) => {
    setEditingEvent(null);
    setFormTitle("");
    setFormStart(startStr || new Date().toISOString().slice(0, 16));
    setFormEnd(startStr || new Date().toISOString().slice(0, 16));
    setFormDescription("");
    setFormAllDay(false);
    setFormColor(EVENT_COLOR_DATA[1].bg);
    setModalOpen(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormStart(event.start?.slice(0, 16) || "");
    setFormEnd(event.end?.slice(0, 16) || event.start?.slice(0, 16) || "");
    setFormDescription(event.description || "");
    setFormAllDay(event.allDay || false);
    setFormColor(event.color || EVENT_COLOR_DATA[1].bg);
    setModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!formTitle.trim() || !formStart) return;
    setFormSaving(true);

    try {
      if (editingEvent) {
        const res = await fetch(`/api/admin/calendar/events/${editingEvent.id}`, {
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
        sileo.success({ title: tt("eventUpdated") });
      } else {
        const res = await fetch("/api/admin/calendar/events", {
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
        sileo.success({ title: tt("eventCreated") });
      }

      setModalOpen(false);
      fetchEvents();
    } catch {
      sileo.error({ title: tt("errorGeneric") });
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm(t("confirmDelete"))) return;

    try {
      const res = await fetch(`/api/admin/calendar/events?id=${eventId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        sileo.success({ title: tt("eventDeleted") });
        fetchEvents();
        setModalOpen(false);
      }
    } catch {
      sileo.error({ title: tt("errorGeneric") });
    }
  };

  // --- Event modal ---
  const renderModal = () => {
    if (!modalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" />

        <div
          className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-gradient-to-b dark:from-[#0f3a3d] dark:to-[#0a2a2c] border border-gray-200 dark:border-white/[0.12] shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with color accent */}
          <div className="relative px-7 pt-6 pb-4">
            <div
              className="absolute top-0 start-0 end-0 h-1"
              style={{ backgroundColor: formColor }}
            />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingEvent ? t("editEvent") : t("newEvent")}
                </h3>
                <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">
                  {editingEvent ? t("editEventSub") : t("newEventSub")}
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
                {t("eventTitle")}
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder={t("eventTitlePlaceholder")}
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/[0.07] border border-gray-200 dark:border-white/[0.12] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 text-sm font-medium focus:outline-none focus:border-drb-turquoise-400/50 focus:ring-1 focus:ring-drb-turquoise-400/20 transition-all"
              />
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-xs font-medium text-gray-400 dark:text-white/50 uppercase tracking-wider mb-2">
                {t("color")}
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
                  formAllDay ? "bg-drb-turquoise-500" : "bg-gray-300 dark:bg-white/15"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    formAllDay ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-500 dark:text-white/60">{t("allDay")}</span>
            </div>

            {/* Date & time */}
            {formAllDay ? (
              <div className="grid grid-cols-2 gap-4">
                <CustomDatePicker value={formStart} onChange={setFormStart} label={t("startDate")} monthNames={monthNames} dayNames={dayNames} selectDateLabel={t("selectDate")} />
                <CustomDatePicker value={formEnd} onChange={setFormEnd} label={t("endDate")} monthNames={monthNames} dayNames={dayNames} selectDateLabel={t("selectDate")} />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <CustomDatePicker value={formStart} onChange={setFormStart} label={t("startDate")} monthNames={monthNames} dayNames={dayNames} selectDateLabel={t("selectDate")} />
                  <CustomTimePicker value={formStart} onChange={setFormStart} label={t("startTime")} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <CustomDatePicker value={formEnd} onChange={setFormEnd} label={t("endDate")} monthNames={monthNames} dayNames={dayNames} selectDateLabel={t("selectDate")} />
                  <CustomTimePicker value={formEnd} onChange={setFormEnd} label={t("endTime")} />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-400 dark:text-white/50 uppercase tracking-wider mb-1.5">
                {t("eventDescription")}
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder={t("eventDescPlaceholder")}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/[0.07] border border-gray-200 dark:border-white/[0.12] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 text-sm font-medium focus:outline-none focus:border-drb-turquoise-400/50 focus:ring-1 focus:ring-drb-turquoise-400/20 transition-all resize-none"
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
                {tc("delete")}
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-gray-400 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-sm font-medium"
              >
                {tc("cancel")}
              </button>
              <button
                onClick={handleSaveEvent}
                disabled={formSaving || !formTitle.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-drb-turquoise-500 hover:bg-drb-turquoise-600 text-white font-bold text-sm disabled:opacity-40 transition-all shadow-lg shadow-drb-turquoise-500/20 hover:shadow-drb-turquoise-500/30"
              >
                {editingEvent ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {formSaving ? t("saving") : editingEvent ? t("updateEvent") : t("createEvent")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t("title")}</h1>
          <p className="text-gray-400 dark:text-white/40">{t("subtitle")}</p>
        </div>
        <button
          onClick={() => openCreateModal()}
          className="flex items-center gap-2 btn-primary text-sm shadow-lg shadow-drb-turquoise-500/20"
        >
          <Plus className="w-4 h-4" />
          {t("newEvent")}
        </button>
      </div>

      {/* Google Calendar disconnect banner */}
      {gcConnected && (
        <div className="panel-card p-4 flex items-center gap-3 border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {t("googleCalendar")} — {t("connectedAs")} <span className="font-semibold">{googleEmail}</span>
            </p>
          </div>
          <button
            onClick={handleDisconnectGoogle}
            disabled={disconnecting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/25 font-semibold transition-colors shrink-0"
          >
            <Unlink className="w-3.5 h-3.5" />
            {disconnecting ? "..." : t("disconnect")}
          </button>
        </div>
      )}

      {/* FullCalendar */}
      <div ref={calendarContainerRef} className="panel-card p-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-drb-turquoise-400 border-t-transparent" />
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
                today: t("today"),
                month: t("month"),
                week: t("week"),
                day: t("day"),
              }}
              events={events.map((e) => ({
                id: e.id,
                title: e.title,
                start: e.start,
                end: e.end,
                allDay: e.allDay,
                backgroundColor: e.color || EVENT_COLOR_DATA[1].bg,
                borderColor: e.color || EVENT_COLOR_DATA[1].bg,
                textColor: EVENT_COLOR_DATA.find((c) => c.bg === e.color)?.text || EVENT_COLOR_DATA[1].text,
                extendedProps: {
                  description: e.description,
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
