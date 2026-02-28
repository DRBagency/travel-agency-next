import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("cliente_id")?.value;
  if (!clientId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const payload: Record<string, unknown> = {};
  if (body.nombre !== undefined) payload.nombre = (body.nombre || "").slice(0, 200);
  if (body.avatar !== undefined) payload.avatar = (body.avatar || "").slice(0, 500);
  if (body.rol !== undefined) payload.rol = (body.rol || "").slice(0, 200);
  if (body.descripcion !== undefined) payload.descripcion = (body.descripcion || "").slice(0, 2000);
  if (body.idiomas !== undefined) payload.idiomas = body.idiomas;

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: "No fields" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("coordinadores")
    .update(payload)
    .eq("id", id)
    .eq("cliente_id", clientId)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("cliente_id")?.value;
  if (!clientId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("coordinadores")
    .delete()
    .eq("id", id)
    .eq("cliente_id", clientId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
