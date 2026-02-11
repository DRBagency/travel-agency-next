import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getClientByDomain } from "@/lib/getClientByDomain";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const cliente = await getClientByDomain();
  if (!cliente) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  }

  const { data: events } = await supabaseAdmin
    .from("calendar_events")
    .select("*")
    .eq("cliente_id", cliente.id)
    .order("start_time", { ascending: true });

  const formattedEvents =
    events?.map((e) => ({
      id: e.id,
      title: e.title,
      start: e.start_time,
      end: e.end_time,
      allDay: e.all_day,
    })) || [];

  return NextResponse.json({ events: formattedEvents });
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const cliente = await getClientByDomain();
  if (!cliente) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  }

  const { title, start, end, description } = await req.json();

  const { data, error } = await supabaseAdmin
    .from("calendar_events")
    .insert({
      cliente_id: cliente.id,
      title,
      start_time: start,
      end_time: end,
      description,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ event: data });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("id");

  if (!eventId) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  await supabaseAdmin.from("calendar_events").delete().eq("id", eventId);

  return NextResponse.json({ success: true });
}
