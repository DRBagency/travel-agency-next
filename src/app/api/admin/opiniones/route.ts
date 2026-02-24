import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { autoTranslateRecord } from "@/lib/auto-translate";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("cliente_id")?.value;
  if (!clientId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();

  const { data: inserted, error } = await supabaseAdmin
    .from("opiniones")
    .insert({
      cliente_id: clientId,
      nombre: body.nombre || null,
      ubicacion: body.ubicacion || null,
      comentario: body.comentario || null,
      rating: Number(body.rating) || 5,
      activo: Boolean(body.activo),
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/admin/mi-web");
  revalidatePath("/admin/opiniones");

  // Auto-translate if eligible (Grow/Pro plan)
  if (inserted?.id && body.comentario) {
    const { data: client } = await supabaseAdmin
      .from("clientes")
      .select("plan, preferred_language, available_languages")
      .eq("id", clientId)
      .single();

    if (
      client &&
      client.plan &&
      client.plan !== "start" &&
      Array.isArray(client.available_languages) &&
      client.available_languages.length > 1
    ) {
      // Fire-and-forget — don't block the response
      autoTranslateRecord({
        table: "opiniones",
        recordId: inserted.id,
        clientId,
        fields: { comentario: body.comentario },
        sourceLang: client.preferred_language || "es",
        targetLangs: client.available_languages,
      }).catch(() => {});
    }
  }

  return NextResponse.json({ success: true });
}
