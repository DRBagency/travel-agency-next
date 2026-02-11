"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

export default function AdminCalendarioPage() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch("/api/admin/calendar/events");
    const data = await res.json();
    setEvents(data.events || []);
  };

  const handleDateClick = (info: { dateStr: string }) => {
    setNewEvent({
      ...newEvent,
      start: info.dateStr,
      end: info.dateStr,
    });
    setShowModal(true);
  };

  const handleEventClick = (info: { event: { id: string; title: string } }) => {
    if (confirm(`¿Eliminar evento "${info.event.title}"?`)) {
      deleteEvent(info.event.id);
    }
  };

  const createEvent = async () => {
    const res = await fetch("/api/admin/calendar/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    if (res.ok) {
      setShowModal(false);
      fetchEvents();
      setNewEvent({ title: "", start: "", end: "", description: "" });
    }
  };

  const deleteEvent = async (eventId: string) => {
    await fetch(`/api/admin/calendar/events?id=${eventId}`, {
      method: "DELETE",
    });
    fetchEvents();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Calendario</h1>
      <p className="text-white/60 mb-8">Gestiona tus citas y eventos</p>

      <div className="bg-white rounded-lg p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={esLocale}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          editable={true}
          selectable={true}
          height="auto"
        />
      </div>

      {/* Modal para crear evento */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Nuevo Evento</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Título"
                className="w-full px-3 py-2 border rounded text-gray-900"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border rounded text-gray-900"
                value={newEvent.start}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, start: e.target.value })
                }
              />
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border rounded text-gray-900"
                value={newEvent.end}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, end: e.target.value })
                }
              />
              <textarea
                placeholder="Descripción"
                className="w-full px-3 py-2 border rounded text-gray-900"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={createEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Crear
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
