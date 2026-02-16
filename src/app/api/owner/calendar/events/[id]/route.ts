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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const owner = cookieStore.get("owner")?.value;
  if (!owner) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: settings } = await supabaseAdmin
    .from("platform_settings")
    .select("*")
    .limit(1)
    .single();

  if (!settings?.google_calendar_connected || !settings?.google_calendar_refresh_token) {
    return NextResponse.json({ error: "Google Calendar no conectado" }, { status: 400 });
  }

  const { id: eventId } = await params;
  const { title, start, end, description, allDay, color } = await req.json();

  try {
    const calendar = getCalendarClient(settings.google_calendar_refresh_token);

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
    console.error("Error updating owner Google Calendar event:", err);
    return NextResponse.json({ error: "Error al actualizar evento" }, { status: 500 });
  }
}
