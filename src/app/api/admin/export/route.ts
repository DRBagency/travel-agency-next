import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { headers, cookies } from "next/headers";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";

export async function GET(req: Request) {
  try {
    await requireValidApiDomain();
  } catch {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const url = new URL(req.url);
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "ok") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const host = (await headers()).get("host") ?? "localhost";
  const client = await getClientByDomain();

  if (!client) {
    return new NextResponse("Client not found", { status: 404 });
  }

  const { data: reservas, error } = await supabaseAdmin
    .from("reservas")
    .select("*")
    .eq("cliente_id", client.id)
    .order("created_at", { ascending: false });

  if (error) {
    return new NextResponse("Database error", { status: 500 });
  }

  const headersCsv = [
    "Fecha",
    "Nombre",
    "Email",
    "Destino",
    "Personas",
    "Precio",
    "Estado",
    "Stripe Session",
  ];

  const rows = reservas.map((r) => [
    new Date(r.created_at).toLocaleString(),
    r.nombre,
    r.email,
    r.destino,
    r.personas,
    r.precio,
    r.estado_pago,
    r.stripe_session_id,
  ]);

  const csv =
    [headersCsv, ...rows]
      .map((row) =>
        row
          .map((cell) =>
            `"${String(cell ?? "").replace(/"/g, '""')}"`
          )
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
