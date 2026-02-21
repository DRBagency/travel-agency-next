import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import type { SocialPlatform } from "@/lib/social/types";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;

  if (!clienteId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { platform } = (await req.json()) as { platform: SocialPlatform };

  if (!platform || !["instagram", "tiktok"].includes(platform)) {
    return NextResponse.json(
      { error: "Invalid platform" },
      { status: 400 }
    );
  }

  // Delete the connection row
  const { error } = await supabaseAdmin
    .from("social_connections")
    .delete()
    .eq("cliente_id", clienteId)
    .eq("platform", platform);

  if (error) {
    console.error("Social disconnect error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
