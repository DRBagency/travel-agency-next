import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

async function getAdminClientId() {
  const cookieStore = await cookies();
  return cookieStore.get("cliente_id")?.value || null;
}

// GET: fetch messages for a reserva (admin side)
export async function GET(req: Request) {
  const clienteId = await getAdminClientId();
  if (!clienteId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const reservaId = searchParams.get("reserva_id");

  if (!reservaId) {
    return NextResponse.json({ error: "reserva_id requerido" }, { status: 400 });
  }

  // Verify reserva belongs to this agency
  const { data: reserva } = await supabaseAdmin
    .from("reservas")
    .select("id")
    .eq("id", reservaId)
    .eq("cliente_id", clienteId)
    .single();

  if (!reserva) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  // Fetch messages
  const { data: messages } = await supabaseAdmin
    .from("portal_messages")
    .select("*")
    .eq("reserva_id", reservaId)
    .order("created_at", { ascending: true });

  // Mark traveler messages as read
  await supabaseAdmin
    .from("portal_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("reserva_id", reservaId)
    .eq("sender_type", "traveler")
    .is("read_at", null);

  return NextResponse.json({ messages: messages || [] });
}

// POST: send a message as agency
export async function POST(req: Request) {
  const clienteId = await getAdminClientId();
  if (!clienteId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { reserva_id, message } = body;

  if (!reserva_id || !message?.trim()) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // Verify reserva belongs to this agency
  const { data: reserva } = await supabaseAdmin
    .from("reservas")
    .select("id")
    .eq("id", reserva_id)
    .eq("cliente_id", clienteId)
    .single();

  if (!reserva) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  // Get agency email
  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("contact_email, email")
    .eq("id", clienteId)
    .single();

  const senderEmail = client?.contact_email || client?.email || "agency";

  // Insert message
  const { data: newMessage, error } = await supabaseAdmin
    .from("portal_messages")
    .insert({
      reserva_id,
      cliente_id: clienteId,
      sender_type: "agency",
      sender_email: senderEmail,
      message: message.trim(),
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Error al enviar" }, { status: 500 });
  }

  return NextResponse.json({ message: newMessage });
}
