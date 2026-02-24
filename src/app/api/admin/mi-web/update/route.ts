import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";

const ALLOWED_FIELDS = new Set([
  "logo_url",
  "primary_color",
  "hero_title",
  "hero_subtitle",
  "hero_cta_text",
  "hero_cta_link",
  "hero_image_url",
  "hero_badge",
  "hero_description",
  "hero_cta_text_secondary",
  "hero_cta_link_secondary",
  "stats_years",
  "stats_destinations",
  "stats_travelers",
  "stats_rating",
  "stats_repeat",
  "about_title",
  "about_text_1",
  "about_text_2",
  "contact_email",
  "contact_phone",
  "contact_address",
  "instagram_url",
  "facebook_url",
  "tiktok_url",
  "footer_text",
  "footer_description",
  "preferred_language",
  "whyus_items",
  "cta_banner_title",
  "cta_banner_description",
  "cta_banner_cta_text",
  "cta_banner_cta_link",
  "dark_mode_enabled",
  "meta_title",
  "meta_description",
]);

/** Fields that should NOT be trimmed/stringified — they're JSONB or boolean */
const JSONB_FIELDS = new Set(["whyus_items"]);
const BOOLEAN_FIELDS = new Set(["dark_mode_enabled"]);

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("cliente_id")?.value;
  if (!clientId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();

  // Filter to only allowed fields with proper type handling
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_FIELDS.has(key)) continue;

    if (JSONB_FIELDS.has(key)) {
      // Pass JSONB as-is (array/object)
      payload[key] = value ?? [];
    } else if (BOOLEAN_FIELDS.has(key)) {
      payload[key] = Boolean(value);
    } else {
      // Strings: trim + empty → null
      payload[key] = typeof value === "string" && value.trim() !== "" ? value.trim() : null;
    }
  }

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: "No hay campos para actualizar" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("clientes")
    .update(payload)
    .eq("id", clientId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/admin/mi-web");

  return NextResponse.json({ success: true });
}
