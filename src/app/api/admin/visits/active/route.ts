import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

async function getClienteId() {
  const cookieStore = await cookies();
  return cookieStore.get("cliente_id")?.value || null;
}

export async function GET() {
  const clienteId = await getClienteId();
  if (!clienteId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdmin.rpc("count_active_visitors", {
    p_cliente_id: clienteId,
    p_since: since,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ activeNow: Number(data) || 0 });
}
