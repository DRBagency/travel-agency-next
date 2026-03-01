import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { createNotification } from "@/lib/notifications/create-notification";

async function getTravelerSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("traveler_session")?.value;
  const email = cookieStore.get("traveler_email")?.value;

  if (!sessionId || !email) return null;

  const { data: session } = await supabaseAdmin
    .from("traveler_sessions")
    .select("email, cliente_id")
    .eq("id", sessionId)
    .single();

  if (!session || session.email !== email) return null;
  return session;
}

// GET: fetch messages for a reserva
export async function GET(req: Request) {
  const session = await getTravelerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const reservaId = searchParams.get("reserva_id");

  if (!reservaId) {
    return NextResponse.json({ error: "reserva_id requerido" }, { status: 400 });
  }

  // Verify reserva belongs to traveler
  const { data: reserva } = await supabaseAdmin
    .from("reservas")
    .select("id")
    .eq("id", reservaId)
    .eq("email", session.email)
    .eq("cliente_id", session.cliente_id)
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

  // Mark agency messages as read
  await supabaseAdmin
    .from("portal_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("reserva_id", reservaId)
    .eq("sender_type", "agency")
    .is("read_at", null);

  return NextResponse.json({ messages: messages || [] });
}

// POST: send a message as traveler
export async function POST(req: Request) {
  const session = await getTravelerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { reserva_id, message } = body;

  if (!reserva_id || !message?.trim()) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // Verify reserva belongs to traveler
  const { data: reserva } = await supabaseAdmin
    .from("reservas")
    .select("id, destino")
    .eq("id", reserva_id)
    .eq("email", session.email)
    .eq("cliente_id", session.cliente_id)
    .single();

  if (!reserva) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  // Insert message
  const { data: newMessage, error } = await supabaseAdmin
    .from("portal_messages")
    .insert({
      reserva_id,
      cliente_id: session.cliente_id,
      sender_type: "traveler",
      sender_email: session.email,
      message: message.trim(),
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Error al enviar" }, { status: 500 });
  }

  // Create notification for agency
  await createNotification({
    clienteId: session.cliente_id,
    type: "mensaje",
    title: `Mensaje de viajero`,
    description: `${session.email} — ${reserva.destino || "Reserva"}`,
    href: `/admin/reserva/${reserva_id}`,
  }).catch(() => {});

  return NextResponse.json({ message: newMessage });
}
