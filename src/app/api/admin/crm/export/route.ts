import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;
  if (!clienteId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("id, slug")
    .eq("id", clienteId)
    .single();

  if (!client) {
    return new NextResponse("Client not found", { status: 404 });
  }

  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const stage = url.searchParams.get("stage") || "";
  const from = url.searchParams.get("from") || "";
  const to = url.searchParams.get("to") || "";

  let query = supabaseAdmin
    .from("agency_customers")
    .select("*")
    .eq("cliente_id", client.id)
    .order("updated_at", { ascending: false });

  if (q) {
    query = query.or(`nombre.ilike.%${q}%,email.ilike.%${q}%`);
  }
  if (stage) {
    query = query.eq("lead_status", stage);
  }
  if (from) {
    query = query.gte("created_at", `${from}T00:00:00.000Z`);
  }
  if (to) {
    query = query.lte("created_at", `${to}T23:59:59.999Z`);
  }

  const { data: customers, error } = await query;

  if (error) {
    return new NextResponse("Database error", { status: 500 });
  }

  const headersCsv = [
    "Nombre",
    "Email",
    "Telefono",
    "Estado",
    "Tags",
    "Reservas",
    "Total Gastado",
    "Primera Reserva",
    "Ultima Reserva",
    "Creado",
  ];

  const rows = (customers || []).map((c) => [
    c.nombre || "",
    c.email || "",
    c.telefono || "",
    c.lead_status || "nuevo",
    Array.isArray(c.tags) ? (c.tags as string[]).join("; ") : "",
    c.total_bookings ?? 0,
    c.total_spent ?? 0,
    c.first_booking_at ? new Date(c.first_booking_at).toLocaleDateString() : "",
    c.last_booking_at ? new Date(c.last_booking_at).toLocaleDateString() : "",
    c.created_at ? new Date(c.created_at).toLocaleDateString() : "",
  ]);

  const csv = [headersCsv, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="crm-${client.slug}.csv"`,
    },
  });
}
