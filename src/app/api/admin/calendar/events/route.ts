import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { getCalendarClient } from "@/lib/google-calendar";

// Google Calendar colorId mapping (1-11)
// https://developers.google.com/calendar/api/v3/reference/colors
const HEX_TO_GOOGLE_COLOR: Record<string, string> = {
  "#D4F24D": "5",  // Banana (yellow-green) → Lima
  "#1CABB0": "7",  // Peacock (teal) → Turquesa
  "#3B82F6": "9",  // Blueberry → Azul
  "#8B5CF6": "3",  // Grape → Violeta
  "#EC4899": "4",  // Flamingo → Rosa
  "#F97316": "6",  // Tangerine → Naranja
  "#EF4444": "11", // Tomato → Rojo
  "#22C55E": "10", // Basil (green) → Verde
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
  "1": "#8B5CF6",  // Lavender → Violeta
  "2": "#22C55E",  // Sage → Verde
  "8": "#1CABB0",  // Graphite → Turquesa
};

async function getAuthenticatedClient() {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;
  if (!clienteId) return null;

  const cliente = await getClientByDomain();
  return cliente;
}

export async function GET() {
  const cliente = await getAuthenticatedClient();
  if (!cliente) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // If connected to Google Calendar, fetch from Google
  if (cliente.google_calendar_connected && cliente.google_calendar_refresh_token) {
    try {
      const calendar = getCalendarClient(cliente.google_calendar_refresh_token);
      const now = new Date();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      const threeMonthsAhead = new Date(now.getFullYear(), now.getMonth() + 3, 0);

      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: threeMonthsAgo.toISOString(),
        timeMax: threeMonthsAhead.toISOString(),
        maxResults: 250,
        singleEvents: true,
        orderBy: "startTime",
      });

      const events = (response.data.items || []).map((e) => ({
        id: e.id,
        title: e.summary || "(Sin título)",
        start: e.start?.dateTime || e.start?.date,
        end: e.end?.dateTime || e.end?.date,
        allDay: !e.start?.dateTime,
        description: e.description || "",
        color: e.colorId ? (GOOGLE_COLOR_TO_HEX[e.colorId] || "#D4F24D") : "#D4F24D",
        source: "google" as const,
      }));

      return NextResponse.json({ events, source: "google" });
    } catch (err) {
      console.error("Error fetching Google Calendar events:", err);
    }
  }

  // Fallback: local database events
  const { data: events } = await supabaseAdmin
    .from("calendar_events")
    .select("*")
    .eq("cliente_id", cliente.id)
    .order("start_time", { ascending: true });

  const formattedEvents =
    events?.map((e) => ({
      id: e.id,
      title: e.title,
      start: e.start_time,
      end: e.end_time,
      allDay: e.all_day,
      description: e.description || "",
      color: "#D4F24D",
      source: "local" as const,
    })) || [];

  return NextResponse.json({ events: formattedEvents, source: "local" });
}

export async function POST(req: NextRequest) {
  const cliente = await getAuthenticatedClient();
  if (!cliente) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { title, start, end, description, allDay, color } = await req.json();

  // If connected to Google Calendar, create in Google
  if (cliente.google_calendar_connected && cliente.google_calendar_refresh_token) {
    try {
      const calendar = getCalendarClient(cliente.google_calendar_refresh_token);

      const startISO = allDay ? undefined : (start.length === 16 ? start + ":00" : start);
      const endISO = allDay ? undefined : ((end || start).length === 16 ? (end || start) + ":00" : (end || start));
      const colorId = color ? HEX_TO_GOOGLE_COLOR[color] : undefined;

      const response = await calendar.events.insert({
        calendarId: "primary",
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
      console.error("Error creating Google Calendar event:", err);
      return NextResponse.json({ error: "Error al crear evento en Google Calendar" }, { status: 500 });
    }
  }

  // Fallback: local database
  const { data, error } = await supabaseAdmin
    .from("calendar_events")
    .insert({
      cliente_id: cliente.id,
      title,
      start_time: start,
      end_time: end || start,
      description,
      all_day: allDay || false,
    })
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

export async function DELETE(req: NextRequest) {
  const cliente = await getAuthenticatedClient();
  if (!cliente) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("id");

  if (!eventId) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  if (cliente.google_calendar_connected && cliente.google_calendar_refresh_token) {
    try {
      const calendar = getCalendarClient(cliente.google_calendar_refresh_token);
      await calendar.events.delete({
        calendarId: "primary",
        eventId,
      });
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("Error deleting Google Calendar event:", err);
      return NextResponse.json({ error: "Error al eliminar evento de Google Calendar" }, { status: 500 });
    }
  }

  await supabaseAdmin.from("calendar_events").delete().eq("id", eventId).eq("cliente_id", cliente.id);
  return NextResponse.json({ success: true });
}
