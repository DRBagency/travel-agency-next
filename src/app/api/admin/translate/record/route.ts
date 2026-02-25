import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { autoTranslateRecord } from "@/lib/auto-translate";
import {
  TRANSLATABLE_CLIENT_FIELDS,
  TRANSLATABLE_DESTINO_FIELDS,
  TRANSLATABLE_OPINION_FIELDS,
} from "@/lib/translations";

export const maxDuration = 120;

const FIELD_MAPS: Record<string, Record<string, string>> = {
  clientes: TRANSLATABLE_CLIENT_FIELDS,
  destinos: TRANSLATABLE_DESTINO_FIELDS,
  opiniones: TRANSLATABLE_OPINION_FIELDS,
};

/**
 * POST /api/admin/translate/record
 * Translates a single record. Body: { table, recordId }
 * Fetches the record, extracts translatable fields, calls AI translation.
 */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("cliente_id")?.value;
  if (!clientId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("plan, preferred_language, available_languages")
    .eq("id", clientId)
    .single();

  if (!client || !client.plan || client.plan === "start") {
    return NextResponse.json({ error: "Requires Grow or Pro plan" }, { status: 403 });
  }

  const body = await req.json();
  const { table, recordId } = body;

  if (!table || !recordId || !FIELD_MAPS[table]) {
    return NextResponse.json({ error: "Invalid table or recordId" }, { status: 400 });
  }

  const sourceLang = client.preferred_language || "es";
  const availLangs: string[] = Array.isArray(client.available_languages) ? client.available_languages : [];
  const targetLangs = availLangs.filter((l: string) => l !== sourceLang);

  if (targetLangs.length === 0) {
    return NextResponse.json({ error: "No target languages" }, { status: 400 });
  }

  // Fetch the record
  let query = supabaseAdmin.from(table).select("*").eq("id", recordId);
  if (table !== "clientes") {
    query = query.eq("cliente_id", clientId);
  }
  const { data: record } = await query.single();

  if (!record) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }

  // Extract translatable fields
  const fieldMap = FIELD_MAPS[table];
  const fields: Record<string, any> = {};
  for (const key of Object.keys(fieldMap)) {
    const val = record[key];
    if (val !== null && val !== undefined && val !== "") {
      fields[key] = val;
    }
  }

  if (Object.keys(fields).length === 0) {
    return NextResponse.json({ success: true, message: "No fields to translate" });
  }

  const result = await autoTranslateRecord({
    table: table as "clientes" | "destinos" | "opiniones",
    recordId,
    clientId,
    fields,
    sourceLang,
    targetLangs,
  });

  return NextResponse.json({
    success: result.success,
    error: result.error,
    usage: result.usage,
  });
}
