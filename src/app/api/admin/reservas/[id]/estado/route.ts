import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireValidApiDomain();
  } catch {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { id } = await params;

  const body = await req.json();
  const { estado } = body;
  const session = (await cookies()).get("admin_session");
  if (!session || session.value !== "ok") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const allowed = ["pagado", "cancelada", "revisada", "pendiente"];
  if (!allowed.includes(estado)) {
    return new NextResponse("Invalid status", { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("reservas")
    .update({ estado_pago: estado })
    .eq("id", id);

  if (error) {
    console.error("❌ Error actualizando estado:", error);
    return new NextResponse("Database error", { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
