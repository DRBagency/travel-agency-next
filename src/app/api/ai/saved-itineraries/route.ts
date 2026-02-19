import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;
  if (!clienteId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("ai_itinerarios")
    .select("id, pais, duracion, estilo, itinerario, created_at")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ itineraries: data || [] });
}
