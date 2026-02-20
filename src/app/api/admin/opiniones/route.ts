import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("cliente_id")?.value;
  if (!clientId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();

  const { error } = await supabaseAdmin.from("opiniones").insert({
    cliente_id: clientId,
    nombre: body.nombre || null,
    ubicacion: body.ubicacion || null,
    comentario: body.comentario || null,
    rating: Number(body.rating) || 5,
    activo: Boolean(body.activo),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/admin/mi-web");
  revalidatePath("/admin/opiniones");

  return NextResponse.json({ success: true });
}
