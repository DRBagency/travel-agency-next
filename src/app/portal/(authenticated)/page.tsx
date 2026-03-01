import { requireTraveler } from "@/lib/requireTraveler";
import { supabaseAdmin } from "@/lib/supabase-server";
import PortalReservasList from "@/components/portal/PortalReservasList";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const { email, clienteId } = await requireTraveler();

  // Fetch all reservas for this traveler with this agency
  const { data: reservas } = await supabaseAdmin
    .from("reservas")
    .select("*")
    .eq("email", email)
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });

  const reservasList = reservas || [];

  // Batch fetch destination images
  const destinoIds = [
    ...new Set(
      reservasList
        .map((r: any) => r.destino_id)
        .filter(Boolean)
    ),
  ];

  let destinosMap: Record<string, { nombre: string; imagen_url: string | null }> = {};
  if (destinoIds.length > 0) {
    const { data: destinos } = await supabaseAdmin
      .from("destinos")
      .select("id, nombre, imagen_url")
      .in("id", destinoIds);

    if (destinos) {
      destinosMap = destinos.reduce((acc: any, d: any) => {
        acc[d.id] = { nombre: d.nombre, imagen_url: d.imagen_url };
        return acc;
      }, {});
    }
  }

  return (
    <PortalReservasList
      reservas={reservasList}
      destinosMap={destinosMap}
    />
  );
}
