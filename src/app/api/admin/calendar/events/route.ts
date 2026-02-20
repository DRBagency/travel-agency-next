import { NextRequest, NextResponse } from "next/server";
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

  const { data: events } = await supabaseAdmin
    .from("calendar_events")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("start_time", { ascending: true });

  const formattedEvents =
    events?.map((e) => ({
      id: e.id,
      title: e.title,
      start: e.start_time,
      end: e.end_time,
      allDay: e.all_day,
      description: e.description || "",
      color: e.color || "#1CABB0",
    })) || [];

  return NextResponse.json({ events: formattedEvents });
}

export async function POST(req: NextRequest) {
  const clienteId = await getClienteId();
  if (!clienteId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { title, start, end, description, allDay, color } = await req.json();

  const { data, error } = await supabaseAdmin
    .from("calendar_events")
    .insert({
      cliente_id: clienteId,
      title,
      start_time: start,
      end_time: end || start,
      description,
      all_day: allDay || false,
      color: color || "#1CABB0",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    event: {
      id: data.id,
      title: data.title,
      start: data.start_time,
      end: data.end_time,
      allDay: data.all_day,
      description: data.description || "",
      color: data.color || "#1CABB0",
    },
  });
}

export async function DELETE(req: NextRequest) {
  const clienteId = await getClienteId();
  if (!clienteId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("id");

  if (!eventId) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  await supabaseAdmin
    .from("calendar_events")
    .delete()
    .eq("id", eventId)
    .eq("cliente_id", clienteId);

  return NextResponse.json({ success: true });
}
