import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import CalendarioContent from "./CalendarioContent";

export const dynamic = "force-dynamic";

export default async function AdminCalendarioPage() {
  const client = await requireAdminClient();

  const { data } = await supabaseAdmin
    .from("clientes")
    .select("google_calendar_connected, google_calendar_email")
    .eq("id", client.id)
    .single();

  // Auto-cleanup: if Google Calendar was connected, force-disconnect and remove synced events
  if (data?.google_calendar_connected) {
    await supabaseAdmin
      .from("clientes")
      .update({
        google_calendar_refresh_token: null,
        google_calendar_connected: false,
        google_calendar_email: null,
        google_calendar_url: null,
      })
      .eq("id", client.id);

    // Delete events that came from Google Calendar (have google_event_id)
    await supabaseAdmin
      .from("calendar_events")
      .delete()
      .eq("cliente_id", client.id)
      .not("google_event_id", "is", null);
  }

  return <CalendarioContent />;
}
