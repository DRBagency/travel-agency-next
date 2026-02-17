import { requireAdminClient } from "@/lib/requireAdminClient";
import AdminShell from "@/components/admin/AdminShell";
import CalendarioContent from "./CalendarioContent";

export const dynamic = "force-dynamic";

export default async function AdminCalendarioPage() {
  const client = await requireAdminClient();

  return (
    <AdminShell
      clientName={client.nombre}
      primaryColor={client.primary_color}
      logoUrl={client.logo_url}
      subscriptionActive={Boolean(client.stripe_subscription_id)}
    >
      <CalendarioContent
        googleCalendarConnected={Boolean(client.google_calendar_connected)}
        googleCalendarEmail={client.google_calendar_email}
        googleCalendarUrl={client.google_calendar_url}
      />
    </AdminShell>
  );
}
