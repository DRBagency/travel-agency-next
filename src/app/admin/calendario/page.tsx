import { requireAdminClient } from "@/lib/requireAdminClient";
import CalendarioContent from "./CalendarioContent";

export const dynamic = "force-dynamic";

export default async function AdminCalendarioPage() {
  const client = await requireAdminClient();

  return (
      <CalendarioContent
        googleCalendarConnected={Boolean(client.google_calendar_connected)}
        googleCalendarEmail={client.google_calendar_email}
        googleCalendarUrl={client.google_calendar_url}
      />
  );
}
