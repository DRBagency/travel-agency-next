import { requireTraveler } from "@/lib/requireTraveler";
import { supabaseAdmin } from "@/lib/supabase-server";
import PortalChatList from "@/components/portal/PortalChatList";

export const dynamic = "force-dynamic";

export default async function PortalChatPage() {
  const { email, clienteId } = await requireTraveler();

  // Fetch all reservas for this traveler
  const { data: reservas } = await supabaseAdmin
    .from("reservas")
    .select("id, destino, destino_id, created_at")
    .eq("email", email)
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });

  const reservasList = reservas || [];
  const reservaIds = reservasList.map((r: any) => r.id);

  // Fetch latest message + unread count per reserva
  let messagesMap: Record<string, { lastMessage: any; unreadCount: number }> = {};

  if (reservaIds.length > 0) {
    // Get all messages for these reservas
    const { data: allMessages } = await supabaseAdmin
      .from("portal_messages")
      .select("*")
      .in("reserva_id", reservaIds)
      .order("created_at", { ascending: false });

    if (allMessages) {
      for (const rId of reservaIds) {
        const msgs = allMessages.filter((m: any) => m.reserva_id === rId);
        const lastMessage = msgs[0] || null;
        const unreadCount = msgs.filter(
          (m: any) => m.sender_type === "agency" && !m.read_at
        ).length;
        messagesMap[rId] = { lastMessage, unreadCount };
      }
    }
  }

  // Get destination images
  const destinoIds = [...new Set(reservasList.map((r: any) => r.destino_id).filter(Boolean))];
  let destinosMap: Record<string, string> = {};
  if (destinoIds.length > 0) {
    const { data: destinos } = await supabaseAdmin
      .from("destinos")
      .select("id, imagen_url")
      .in("id", destinoIds);
    if (destinos) {
      destinosMap = destinos.reduce((acc: any, d: any) => {
        acc[d.id] = d.imagen_url;
        return acc;
      }, {});
    }
  }

  return (
    <PortalChatList
      reservas={reservasList}
      messagesMap={messagesMap}
      destinosMap={destinosMap}
    />
  );
}
