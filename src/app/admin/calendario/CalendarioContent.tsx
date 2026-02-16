"use client";

import { useState } from "react";
import { Calendar, ExternalLink } from "lucide-react";

interface CalendarioContentProps {
  googleCalendarUrl?: string | null;
}

export default function CalendarioContent({ googleCalendarUrl }: CalendarioContentProps) {
  const [url, setUrl] = useState(googleCalendarUrl || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/calendar/google-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert("Error al guardar la URL");
    } finally {
      setSaving(false);
    }
  };

  const embedUrl = url.trim();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Calendario</h1>
        <p className="text-white/60">Conecta tu Google Calendar para gestionar citas y eventos.</p>
      </div>

      {/* Configuración */}
      <div className="rounded-2xl border border-white/20 bg-white/10 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-drb-lime-400" />
          <h2 className="text-xl font-semibold">Google Calendar</h2>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-white/70">
            URL de embed de Google Calendar
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://calendar.google.com/calendar/embed?src=..."
              className="flex-1 border border-white/30 bg-white/95 text-gray-900 placeholder:text-gray-400 px-4 py-2.5 rounded-xl"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold disabled:opacity-60 transition-colors whitespace-nowrap"
            >
              {saving ? "Guardando..." : saved ? "Guardado" : "Guardar"}
            </button>
          </div>
        </div>

        {!embedUrl && (
          <div className="rounded-xl border border-white/15 bg-white/5 p-5 space-y-3">
            <h3 className="font-semibold text-white/90">Como obtener la URL de embed:</h3>
            <ol className="text-sm text-white/70 space-y-2 list-decimal pl-5">
              <li>
                Abre{" "}
                <a
                  href="https://calendar.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-drb-lime-400 hover:text-drb-lime-300 underline inline-flex items-center gap-1"
                >
                  Google Calendar <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Ve a <strong className="text-white/90">Configuracion</strong> (icono engranaje)</li>
              <li>En el panel izquierdo, selecciona el calendario que quieres integrar</li>
              <li>Baja hasta la seccion <strong className="text-white/90">&quot;Integrar calendario&quot;</strong></li>
              <li>Copia la <strong className="text-white/90">URL publica</strong> del campo &quot;URL publica de este calendario&quot; o el <strong className="text-white/90">codigo iframe</strong></li>
              <li>Pega la URL aqui arriba y haz clic en &quot;Guardar&quot;</li>
            </ol>
            <p className="text-xs text-white/50 mt-2">
              Nota: Asegurate de que el calendario sea publico o que el enlace sea accesible.
            </p>
          </div>
        )}
      </div>

      {/* Calendar iframe */}
      {embedUrl && (
        <div className="rounded-2xl border border-white/20 bg-white/10 overflow-hidden">
          <iframe
            src={embedUrl}
            className="w-full border-0"
            style={{ height: "600px" }}
            title="Google Calendar"
          />
        </div>
      )}
    </div>
  );
}
