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
      subscriptionActive={Boolean(client.stripe_subscription_id)}
    >
      <CalendarioContent googleCalendarUrl={client.google_calendar_url} />
    </AdminShell>
  );
}
