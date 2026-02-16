import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { getCalendarClient } from "@/lib/google-calendar";

const HEX_TO_GOOGLE_COLOR: Record<string, string> = {
  "#D4F24D": "5",
  "#1CABB0": "7",
  "#3B82F6": "9",
  "#8B5CF6": "3",
  "#EC4899": "4",
  "#F97316": "6",
  "#EF4444": "11",
  "#22C55E": "10",
};

const GOOGLE_COLOR_TO_HEX: Record<string, string> = {
  "5": "#D4F24D",
  "7": "#1CABB0",
  "9": "#3B82F6",
  "3": "#8B5CF6",
  "4": "#EC4899",
  "6": "#F97316",
  "11": "#EF4444",
  "10": "#22C55E",
  "1": "#8B5CF6",
  "2": "#22C55E",
  "8": "#1CABB0",
};

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");
  if (!sessionCookie) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const cliente = await getClientByDomain();
  if (!cliente) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  }

  const { id: eventId } = await params;
  const { title, start, end, description, allDay, color } = await req.json();

  // If connected to Google Calendar, update in Google
  if (cliente.google_calendar_connected && cliente.google_calendar_refresh_token) {
    try {
      const calendar = getCalendarClient(cliente.google_calendar_refresh_token);

      const startISO = allDay ? undefined : (start.length === 16 ? start + ":00" : start);
      const endISO = allDay ? undefined : ((end || start).length === 16 ? (end || start) + ":00" : (end || start));
      const colorId = color ? HEX_TO_GOOGLE_COLOR[color] : undefined;

      const response = await calendar.events.update({
        calendarId: "primary",
        eventId,
        requestBody: {
          summary: title,
          description: description || "",
          colorId: colorId || undefined,
          start: allDay
            ? { date: start.split("T")[0] }
            : { dateTime: startISO, timeZone: "Europe/Madrid" },
          end: allDay
            ? { date: (end || start).split("T")[0] }
            : { dateTime: endISO, timeZone: "Europe/Madrid" },
        },
      });

      return NextResponse.json({
        event: {
          id: response.data.id,
          title: response.data.summary,
          start: response.data.start?.dateTime || response.data.start?.date,
          end: response.data.end?.dateTime || response.data.end?.date,
          allDay: !response.data.start?.dateTime,
          description: response.data.description || "",
          color: response.data.colorId ? (GOOGLE_COLOR_TO_HEX[response.data.colorId] || color) : color,
          source: "google",
        },
      });
    } catch (err) {
      console.error("Error updating Google Calendar event:", err);
      return NextResponse.json({ error: "Error al actualizar evento en Google Calendar" }, { status: 500 });
    }
  }

  // Fallback: local database
  const { data, error } = await supabaseAdmin
    .from("calendar_events")
    .update({
      title,
      start_time: start,
      end_time: end || start,
      description,
      all_day: allDay || false,
    })
    .eq("id", eventId)
    .eq("cliente_id", cliente.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    event: {
      id: data.id,
      title: data.title,
      start: data.start_time,
      end: data.end_time,
      allDay: data.all_day,
      description: data.description || "",
      color: color || "#D4F24D",
      source: "local",
    },
  });
}
