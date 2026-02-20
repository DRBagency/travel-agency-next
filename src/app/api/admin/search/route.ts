import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;
  if (!clienteId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const pattern = `%${q}%`;

  // Search in parallel across multiple tables
  const [reservasRes, destinosRes, messagesRes, documentsRes] = await Promise.all([
    supabaseAdmin
      .from("reservas")
      .select("id, nombre, destino, precio, estado_pago")
      .eq("cliente_id", clienteId)
      .or(`nombre.ilike.${pattern},destino.ilike.${pattern}`)
      .order("created_at", { ascending: false })
      .limit(5),

    supabaseAdmin
      .from("destinos")
      .select("id, nombre, precio, activo")
      .eq("cliente_id", clienteId)
      .ilike("nombre", pattern)
      .order("created_at", { ascending: false })
      .limit(5),

    supabaseAdmin
      .from("contact_messages")
      .select("id, sender_name, sender_email, message")
      .eq("cliente_id", clienteId)
      .or(`sender_name.ilike.${pattern},sender_email.ilike.${pattern},message.ilike.${pattern}`)
      .order("created_at", { ascending: false })
      .limit(3),

    supabaseAdmin
      .from("documents")
      .select("id, title, type")
      .eq("cliente_id", clienteId)
      .ilike("title", pattern)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const results: {
    category: string;
    items: { id: string; title: string; subtitle: string; href: string; type: string }[];
  }[] = [];

  // Reservas
  const reservas = reservasRes.data ?? [];
  if (reservas.length > 0) {
    results.push({
      category: "reservas",
      items: reservas.map((r) => ({
        id: r.id,
        title: r.nombre || "Reserva",
        subtitle: `${r.destino || "—"} · ${r.precio}€ · ${r.estado_pago}`,
        href: `/admin/reserva/${r.id}`,
        type: "reserva",
      })),
    });
  }

  // Destinos
  const destinos = destinosRes.data ?? [];
  if (destinos.length > 0) {
    results.push({
      category: "destinos",
      items: destinos.map((d) => ({
        id: d.id,
        title: d.nombre || "Destino",
        subtitle: `${d.precio}€ · ${d.activo ? "Activo" : "Inactivo"}`,
        href: "/admin/destinos",
        type: "destino",
      })),
    });
  }

  // Messages
  const messages = messagesRes.data ?? [];
  if (messages.length > 0) {
    results.push({
      category: "mensajes",
      items: messages.map((m) => ({
        id: m.id,
        title: m.sender_name,
        subtitle: m.message.slice(0, 60) + (m.message.length > 60 ? "..." : ""),
        href: "/admin/mensajes",
        type: "mensaje",
      })),
    });
  }

  // Documents
  const documents = documentsRes.data ?? [];
  if (documents.length > 0) {
    results.push({
      category: "documentos",
      items: documents.map((d) => ({
        id: d.id,
        title: d.title || "Documento",
        subtitle: d.type || "",
        href: "/admin/documentos",
        type: "documento",
      })),
    });
  }

  return NextResponse.json({ results });
}
