"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Calendar, Link2, Link2Off, Plus, Trash2, Pencil, X } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  description?: string;
  source?: "google" | "local";
}

interface CalendarioContentProps {
  googleCalendarConnected: boolean;
  googleCalendarEmail?: string | null;
  googleCalendarUrl?: string | null;
}

export default function CalendarioContent({
  googleCalendarConnected,
  googleCalendarEmail,
  googleCalendarUrl,
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
  const [formSaving, setFormSaving] = useState(false);

  // Embed URL fallback state
  const [embedUrl, setEmbedUrl] = useState(googleCalendarUrl || "");
  const [savingUrl, setSavingUrl] = useState(false);
  const [savedUrl, setSavedUrl] = useState(false);

  const calendarRef = useRef<FullCalendar>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/calendar/events");
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
    setModalOpen(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormStart(event.start?.slice(0, 16) || "");
    setFormEnd(event.end?.slice(0, 16) || event.start?.slice(0, 16) || "");
    setFormDescription(event.description || "");
    setFormAllDay(event.allDay || false);
    setModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!formTitle.trim() || !formStart) return;
    setFormSaving(true);

    try {
      if (editingEvent) {
        // Update existing event
        const res = await fetch(`/api/admin/calendar/events/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            start: formAllDay ? formStart.split("T")[0] : formStart,
            end: formAllDay ? (formEnd || formStart).split("T")[0] : formEnd || formStart,
            description: formDescription,
            allDay: formAllDay,
          }),
        });
        if (!res.ok) throw new Error("Error updating");
      } else {
        // Create new event
        const res = await fetch("/api/admin/calendar/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            start: formAllDay ? formStart.split("T")[0] : formStart,
            end: formAllDay ? (formEnd || formStart).split("T")[0] : formEnd || formStart,
            description: formDescription,
            allDay: formAllDay,
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
      const res = await fetch(`/api/admin/calendar/events?id=${eventId}`, {
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
      const res = await fetch("/api/admin/calendar/oauth/disconnect", {
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
      const res = await fetch("/api/admin/calendar/google-url", {
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

  // FullCalendar connected view
  if (googleCalendarConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calendario</h1>
          <p className="text-white/60">
            Gestiona tus eventos directamente desde Google Calendar.
          </p>
        </div>

        {/* Connection status */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/80">
                Conectado como{" "}
                <span className="font-semibold text-white">
                  {googleCalendarEmail}
                </span>
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => openCreateModal()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nuevo evento
              </button>
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-400/40 text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
              >
                <Link2Off className="w-4 h-4" />
                {disconnecting ? "Desconectando..." : "Desconectar"}
              </button>
            </div>
          </div>
        </div>

        {/* FullCalendar */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-4 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-drb-lime-400" />
            </div>
          ) : (
            <div className="fc-dark-theme">
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
                  day: "Día",
                }}
                events={events.map((e) => ({
                  id: e.id,
                  title: e.title,
                  start: e.start,
                  end: e.end,
                  allDay: e.allDay,
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

        {/* Event Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-drb-turquoise-900 border border-white/20 rounded-2xl p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">
                  {editingEvent ? "Editar evento" : "Nuevo evento"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-white/70 mb-1">Título</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Reunión con cliente..."
                    className="w-full border border-white/30 bg-white/95 text-gray-900 placeholder:text-gray-400 px-4 py-2.5 rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allDay"
                    checked={formAllDay}
                    onChange={(e) => setFormAllDay(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="allDay" className="text-sm text-white/70">
                    Todo el día
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-white/70 mb-1">Inicio</label>
                    <input
                      type={formAllDay ? "date" : "datetime-local"}
                      value={formAllDay ? formStart.split("T")[0] : formStart}
                      onChange={(e) => setFormStart(e.target.value)}
                      className="w-full border border-white/30 bg-white/95 text-gray-900 px-4 py-2.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">Fin</label>
                    <input
                      type={formAllDay ? "date" : "datetime-local"}
                      value={formAllDay ? formEnd.split("T")[0] : formEnd}
                      onChange={(e) => setFormEnd(e.target.value)}
                      className="w-full border border-white/30 bg-white/95 text-gray-900 px-4 py-2.5 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1">Descripción</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Detalles del evento..."
                    rows={3}
                    className="w-full border border-white/30 bg-white/95 text-gray-900 placeholder:text-gray-400 px-4 py-2.5 rounded-xl resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                {editingEvent ? (
                  <button
                    onClick={() => handleDeleteEvent(editingEvent.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-400/10 border border-red-400/30 transition-colors"
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
                    className="px-4 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEvent}
                    disabled={formSaving || !formTitle.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold disabled:opacity-60 transition-colors"
                  >
                    {editingEvent ? (
                      <Pencil className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {formSaving
                      ? "Guardando..."
                      : editingEvent
                        ? "Actualizar"
                        : "Crear"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FullCalendar dark theme styles */}
        <style>{`
          .fc-dark-theme .fc {
            --fc-border-color: rgba(255,255,255,0.15);
            --fc-button-bg-color: rgba(255,255,255,0.1);
            --fc-button-border-color: rgba(255,255,255,0.2);
            --fc-button-text-color: #fff;
            --fc-button-hover-bg-color: rgba(255,255,255,0.2);
            --fc-button-hover-border-color: rgba(255,255,255,0.3);
            --fc-button-active-bg-color: #D4F24D;
            --fc-button-active-border-color: #D4F24D;
            --fc-today-bg-color: rgba(212,242,77,0.08);
            --fc-event-bg-color: #D4F24D;
            --fc-event-border-color: #D4F24D;
            --fc-event-text-color: #0a2a2c;
            --fc-page-bg-color: transparent;
            --fc-neutral-bg-color: rgba(255,255,255,0.05);
            --fc-list-event-hover-bg-color: rgba(255,255,255,0.1);
            color: #fff;
          }
          .fc-dark-theme .fc .fc-button-active {
            color: #0a2a2c !important;
          }
          .fc-dark-theme .fc .fc-col-header-cell-cushion,
          .fc-dark-theme .fc .fc-daygrid-day-number,
          .fc-dark-theme .fc .fc-timegrid-slot-label {
            color: rgba(255,255,255,0.7);
          }
          .fc-dark-theme .fc .fc-toolbar-title {
            color: #fff;
            font-size: 1.25rem;
          }
          .fc-dark-theme .fc .fc-daygrid-event {
            border-radius: 6px;
            padding: 1px 4px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
          }
          .fc-dark-theme .fc .fc-day-today {
            background-color: rgba(212,242,77,0.08) !important;
          }
          .fc-dark-theme .fc td, .fc-dark-theme .fc th {
            border-color: rgba(255,255,255,0.1);
          }
        `}</style>
      </div>
    );
  }

  // Not connected view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Calendario</h1>
        <p className="text-white/60">
          Conecta tu Google Calendar para gestionar citas y eventos.
        </p>
      </div>

      {/* Connect Google Calendar */}
      <div className="rounded-2xl border border-white/20 bg-white/10 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-drb-lime-400" />
          <h2 className="text-xl font-semibold">Google Calendar</h2>
        </div>

        <p className="text-white/70 text-sm">
          Conecta tu cuenta de Google para crear, editar y eliminar eventos
          directamente desde este panel. Los cambios se sincronizarán
          automáticamente con tu Google Calendar.
        </p>

        <a
          href="/api/admin/calendar/oauth/start"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold transition-colors"
        >
          <Link2 className="w-5 h-5" />
          Conectar Google Calendar
        </a>
      </div>

      {/* Embed URL fallback */}
      <div className="rounded-2xl border border-white/20 bg-white/10 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-white/50" />
          <h2 className="text-lg font-semibold text-white/70">
            Alternativa: Calendario embebido (solo lectura)
          </h2>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-white/70">
            URL de embed de Google Calendar
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              placeholder="https://calendar.google.com/calendar/embed?src=..."
              className="flex-1 border border-white/30 bg-white/95 text-gray-900 placeholder:text-gray-400 px-4 py-2.5 rounded-xl"
            />
            <button
              onClick={handleSaveEmbedUrl}
              disabled={savingUrl}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold disabled:opacity-60 transition-colors whitespace-nowrap"
            >
              {savingUrl ? "Guardando..." : savedUrl ? "Guardado" : "Guardar"}
            </button>
          </div>
        </div>
      </div>

      {/* Calendar iframe */}
      {embedUrl.trim() && (
        <div className="rounded-2xl border border-white/20 bg-white/10 overflow-hidden">
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
