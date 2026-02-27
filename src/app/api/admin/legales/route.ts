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

  const { data: inserted, error } = await supabaseAdmin.from("paginas_legales").insert({
    cliente_id: clientId,
    titulo: body.titulo || null,
    slug: body.slug || null,
    contenido: body.contenido || null,
    activo: Boolean(body.activo),
  }).select("id, titulo, slug, contenido, activo, created_at").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/admin/mi-web");
  revalidatePath("/admin/legales");

  return NextResponse.json({ success: true, record: inserted });
}
