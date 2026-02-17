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
  const estado = url.searchParams.get("estado") || "todos";
  const q = url.searchParams.get("q") || "";
  const from = url.searchParams.get("from") || "";
  const to = url.searchParams.get("to") || "";
  const format = url.searchParams.get("format") || "csv";

  let query = supabaseAdmin
    .from("reservas")
    .select("*")
    .eq("cliente_id", client.id)
    .order("created_at", { ascending: false });

  if (estado && estado !== "todos") {
    query = query.eq("estado_pago", estado);
  }

  if (q) {
    query = query.or(`nombre.ilike.%${q}%,email.ilike.%${q}%`);
  }

  if (from) {
    query = query.gte("created_at", `${from}T00:00:00.000Z`);
  }

  if (to) {
    query = query.lte("created_at", `${to}T23:59:59.999Z`);
  }

  const { data: reservas, error } = await query;

  if (error) {
    return new NextResponse("Database error", { status: 500 });
  }

  if (format === "json") {
    return NextResponse.json(reservas || []);
  }

  // CSV format
  const headersCsv = [
    "Fecha",
    "Nombre",
    "Email",
    "Destino",
    "Personas",
    "Precio",
    "Estado",
    "Fecha Salida",
    "Fecha Regreso",
    "Telefono",
    "Stripe Session",
  ];

  const rows = (reservas || []).map((r) => [
    new Date(r.created_at).toLocaleString("es-ES"),
    r.nombre,
    r.email,
    r.destino,
    r.personas,
    r.precio,
    r.estado_pago,
    r.fecha_salida || "",
    r.fecha_regreso || "",
    r.telefono || "",
    r.stripe_session_id,
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
      "Content-Disposition": `attachment; filename="reservas-${client.slug}.csv"`,
    },
  });
}
