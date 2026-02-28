import { supabaseAdmin } from "@/lib/supabase-server";

interface Salida {
  fecha: string;
  estado: string;
  precio: number;
  plazas: number;
  [key: string]: unknown;
}

/**
 * Decrement departure spots for a destination after a booking.
 * Finds the matching departure by date and subtracts the number of travelers.
 * Auto-updates status: 0 spots → "soldOut", ≤3 spots → "lastSpots".
 */
export async function decrementDepartureSpots({
  clienteId,
  destinoId,
  fechaSalida,
  personas,
}: {
  clienteId: string;
  destinoId: string;
  fechaSalida: string;
  personas: number;
}): Promise<void> {
  if (!destinoId || !fechaSalida || !personas) {
    console.warn("decrementDepartureSpots: missing required params", {
      destinoId,
      fechaSalida,
      personas,
    });
    return;
  }

  const { data: destino, error: fetchError } = await supabaseAdmin
    .from("destinos")
    .select("salidas")
    .eq("id", destinoId)
    .eq("cliente_id", clienteId)
    .single();

  if (fetchError || !destino) {
    console.error("decrementDepartureSpots: fetch error", fetchError);
    return;
  }

  const salidas: Salida[] = destino.salidas || [];
  if (salidas.length === 0) return;

  // Normalize date for comparison (YYYY-MM-DD)
  const normalizeDate = (d: string) => d.slice(0, 10);
  const targetDate = normalizeDate(fechaSalida);

  let found = false;
  const updated = salidas.map((s) => {
    // Support both Spanish and English field names (backward compat)
    const sDate = normalizeDate(s.fecha || (s as any).date || "");
    if (sDate !== targetDate) return s;

    found = true;
    const currentSpots = Number(s.plazas ?? (s as any).spots ?? 0);
    const newSpots = Math.max(0, currentSpots - personas);

    let newEstado = s.estado || (s as any).status || "confirmed";
    if (newSpots === 0) {
      newEstado = "soldOut";
    } else if (newSpots <= 3) {
      newEstado = "lastSpots";
    }

    return { ...s, plazas: newSpots, estado: newEstado };
  });

  if (!found) {
    console.warn(
      `decrementDepartureSpots: no departure found for date ${targetDate} in destino ${destinoId}`
    );
    return;
  }

  const { error: updateError } = await supabaseAdmin
    .from("destinos")
    .update({ salidas: updated })
    .eq("id", destinoId)
    .eq("cliente_id", clienteId);

  if (updateError) {
    console.error("decrementDepartureSpots: update error", updateError);
  }
}
