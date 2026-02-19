import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;
  if (!clienteId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("ai_itinerarios")
    .delete()
    .eq("id", id)
    .eq("cliente_id", clienteId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
