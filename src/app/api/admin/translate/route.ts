import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { autoTranslateRecord } from "@/lib/auto-translate";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("cliente_id")?.value;
  if (!clientId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Plan gate: only Grow/Pro
  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("plan")
    .eq("id", clientId)
    .single();

  if (!client || !client.plan || client.plan === "start") {
    return NextResponse.json(
      { error: "Translation requires Grow or Pro plan" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { table, recordId, fields, targetLangs, sourceLang } = body;

  if (!table || !recordId || !fields || !targetLangs || !sourceLang) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const validTables = ["clientes", "destinos", "opiniones"];
  if (!validTables.includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const result = await autoTranslateRecord({
    table,
    recordId,
    clientId,
    fields,
    sourceLang,
    targetLangs,
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error, translations: result.translations },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    translations: result.translations,
    usage: result.usage,
  });
}
