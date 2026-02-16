import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
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

async function getOwnerSettings() {
  const cookieStore = await cookies();
  const owner = cookieStore.get("owner")?.value;
  if (!owner) return null;

  const { data } = await supabaseAdmin
    .from("platform_settings")
    .select("*")
    .limit(1)
    .single();

  return data;
}

export async function GET() {
  const settings = await getOwnerSettings();
  if (!settings) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (settings.google_calendar_connected && settings.google_calendar_refresh_token) {
    try {
      const calendar = getCalendarClient(settings.google_calendar_refresh_token);
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
      console.error("Error fetching owner Google Calendar events:", err);
    }
  }

  return NextResponse.json({ events: [], source: "none" });
}

export async function POST(req: NextRequest) {
  const settings = await getOwnerSettings();
  if (!settings) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { title, start, end, description, allDay, color } = await req.json();

  if (!settings.google_calendar_connected || !settings.google_calendar_refresh_token) {
    return NextResponse.json({ error: "Google Calendar no conectado" }, { status: 400 });
  }

  try {
    const calendar = getCalendarClient(settings.google_calendar_refresh_token);

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
    console.error("Error creating owner Google Calendar event:", err);
    return NextResponse.json({ error: "Error al crear evento en Google Calendar" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const settings = await getOwnerSettings();
  if (!settings) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("id");

  if (!eventId) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  if (!settings.google_calendar_connected || !settings.google_calendar_refresh_token) {
    return NextResponse.json({ error: "Google Calendar no conectado" }, { status: 400 });
  }

  try {
    const calendar = getCalendarClient(settings.google_calendar_refresh_token);
    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting owner Google Calendar event:", err);
    return NextResponse.json({ error: "Error al eliminar evento" }, { status: 500 });
  }
}
