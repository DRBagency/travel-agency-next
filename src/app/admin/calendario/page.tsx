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

  return (
    <CalendarioContent
      googleConnected={data?.google_calendar_connected || false}
      googleEmail={data?.google_calendar_email || null}
    />
  );
}
