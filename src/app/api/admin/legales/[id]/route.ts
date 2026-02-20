import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("cliente_id")?.value;
  if (!clientId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const { error } = await supabaseAdmin
    .from("paginas_legales")
    .update({
      titulo: body.titulo ?? undefined,
      slug: body.slug ?? undefined,
      contenido: body.contenido ?? undefined,
      activo: body.activo !== undefined ? Boolean(body.activo) : undefined,
    })
    .eq("id", id)
    .eq("cliente_id", clientId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/admin/mi-web");
  revalidatePath("/admin/legales");
  if (body.slug) {
    revalidatePath(`/legal/${body.slug}`);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("cliente_id")?.value;
  if (!clientId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("paginas_legales")
    .delete()
    .eq("id", id)
    .eq("cliente_id", clientId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/admin/mi-web");
  revalidatePath("/admin/legales");

  return NextResponse.json({ success: true });
}
