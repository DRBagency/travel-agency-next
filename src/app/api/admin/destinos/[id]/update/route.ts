import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";

/** Fields allowed for destino updates. */
const STRING_FIELDS = new Set([
  "nombre",
  "slug",
  "subtitle",
  "tagline",
  "badge",
  "descripcion",
  "descripcion_larga",
  "imagen_url",
  "categoria",
  "continente",
  "dificultad",
  "duracion",
  "moneda",
  "pais",
]);

const NUMBER_FIELDS = new Set([
  "precio",
  "precio_original",
  "precio_adulto",
  "precio_nino",
  "precio_grupo",
  "esfuerzo",
  "grupo_max",
  "edad_min",
  "edad_max",
  "rating",
  "reviews",
  "latitude",
  "longitude",
]);

const BOOLEAN_FIELDS = new Set(["activo"]);

const JSONB_FIELDS = new Set([
  "itinerario",
  "galeria",
  "highlights",
  "tags",
  "coordinador",
  "hotel",
  "vuelos",
  "incluido",
  "no_incluido",
  "salidas",
  "faqs",
  "clima",
  "translations",
]);

export async function POST(
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

  // Build a safe payload
  const payload: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(body)) {
    if (STRING_FIELDS.has(key)) {
      payload[key] =
        typeof value === "string" && value.trim() !== ""
          ? value.trim()
          : null;
    } else if (NUMBER_FIELDS.has(key)) {
      const n = Number(value);
      payload[key] = isNaN(n) ? null : n;
    } else if (BOOLEAN_FIELDS.has(key)) {
      payload[key] = Boolean(value);
    } else if (JSONB_FIELDS.has(key)) {
      payload[key] = value ?? null;
    }
  }

  if (Object.keys(payload).length === 0) {
    return NextResponse.json(
      { error: "No hay campos para actualizar" },
      { status: 400 }
    );
  }

  // Ensure destino belongs to this client
  const { error } = await supabaseAdmin
    .from("destinos")
    .update(payload)
    .eq("id", id)
    .eq("cliente_id", clientId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/admin/destinos");
  revalidatePath(`/admin/destinos/${id}`);

  return NextResponse.json({ success: true });
}
