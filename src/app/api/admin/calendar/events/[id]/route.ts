import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { getCalendarClient } from "@/lib/google-calendar";

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
  const { title, start, end, description, allDay } = await req.json();

  // If connected to Google Calendar, update in Google
  if (cliente.google_calendar_connected && cliente.google_calendar_refresh_token) {
    try {
      const calendar = getCalendarClient(cliente.google_calendar_refresh_token);

      const startISO = allDay ? undefined : (start.length === 16 ? start + ":00" : start);
      const endISO = allDay ? undefined : ((end || start).length === 16 ? (end || start) + ":00" : (end || start));

      const response = await calendar.events.update({
        calendarId: "primary",
        eventId,
        requestBody: {
          summary: title,
          description: description || "",
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
      source: "local",
    },
  });
}
