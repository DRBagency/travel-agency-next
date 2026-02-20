import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;
  if (!clienteId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id: eventId } = await params;
  const { title, start, end, description, allDay, color } = await req.json();

  const { data, error } = await supabaseAdmin
    .from("calendar_events")
    .update({
      title,
      start_time: start,
      end_time: end || start,
      description,
      all_day: allDay || false,
      color: color || "#1CABB0",
    })
    .eq("id", eventId)
    .eq("cliente_id", clienteId)
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
