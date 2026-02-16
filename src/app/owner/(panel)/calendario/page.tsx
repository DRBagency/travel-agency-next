import { supabaseAdmin } from "@/lib/supabase-server";
import CalendarioContent from "@/app/admin/calendario/CalendarioContent";

export const dynamic = "force-dynamic";

export default async function OwnerCalendarioPage() {
  const { data: settings } = await supabaseAdmin
    .from("platform_settings")
    .select("google_calendar_connected, google_calendar_email")
    .limit(1)
    .single();

  return (
    <CalendarioContent
      googleCalendarConnected={Boolean(settings?.google_calendar_connected)}
      googleCalendarEmail={settings?.google_calendar_email}
      apiBasePath="/api/owner/calendar"
    />
  );
}
