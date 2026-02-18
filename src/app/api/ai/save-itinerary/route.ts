import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clienteId,
      pais,
      duracion,
      estilo,
      intereses,
      presupuesto,
      tipo_grupo,
      num_viajeros,
      itinerario,
      precio_estimado,
    } = body;

    if (!clienteId || !pais || !itinerario) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.from("ai_itinerarios").insert({
      cliente_id: clienteId,
      pais,
      duracion,
      estilo,
      intereses,
      presupuesto,
      tipo_grupo,
      num_viajeros,
      itinerario,
      precio_estimado,
    }).select("id").single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
