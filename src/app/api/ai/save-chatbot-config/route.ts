import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clienteId, config } = body;

    if (!clienteId) {
      return NextResponse.json({ error: "Missing clienteId" }, { status: 400 });
    }

    // Upsert - use cliente_id unique constraint
    const { data: existing } = await supabaseAdmin
      .from("ai_chatbot_config")
      .select("id")
      .eq("cliente_id", clienteId)
      .single();

    if (existing) {
      await supabaseAdmin
        .from("ai_chatbot_config")
        .update({
          nombre_bot: config.nombre_bot,
          personalidad: config.personalidad,
          info_agencia: config.info_agencia,
          faqs: config.faqs,
          idiomas: config.idiomas,
          activo: config.activo,
        })
        .eq("id", existing.id);
    } else {
      await supabaseAdmin.from("ai_chatbot_config").insert({
        cliente_id: clienteId,
        nombre_bot: config.nombre_bot,
        personalidad: config.personalidad,
        info_agencia: config.info_agencia,
        faqs: config.faqs,
        idiomas: config.idiomas,
        activo: config.activo,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
