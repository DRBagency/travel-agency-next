import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

/**
 * GET /api/admin/translate/list
 * Returns list of records to translate: client + destinos + opiniones + paginas_legales.
 */
export async function GET() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("cliente_id")?.value;
  if (!clientId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const [{ data: destinos }, { data: opiniones }, { data: paginasLegales }] = await Promise.all([
    supabaseAdmin
      .from("destinos")
      .select("id, nombre")
      .eq("cliente_id", clientId)
      .eq("activo", true),
    supabaseAdmin
      .from("opiniones")
      .select("id, nombre")
      .eq("cliente_id", clientId)
      .eq("activo", true),
    supabaseAdmin
      .from("paginas_legales")
      .select("id, titulo")
      .eq("cliente_id", clientId)
      .eq("activo", true),
  ]);

  return NextResponse.json({
    clientId,
    destinos: destinos || [],
    opiniones: opiniones || [],
    paginasLegales: paginasLegales || [],
  });
}
