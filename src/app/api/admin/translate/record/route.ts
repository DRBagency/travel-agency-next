import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { autoTranslateRecord } from "@/lib/auto-translate";
import {
  TRANSLATABLE_CLIENT_FIELDS,
  TRANSLATABLE_DESTINO_FIELDS,
  TRANSLATABLE_OPINION_FIELDS,
  type FieldType,
} from "@/lib/translations";

export const maxDuration = 120;

const FIELD_MAPS: Record<string, Record<string, FieldType>> = {
  clientes: TRANSLATABLE_CLIENT_FIELDS,
  destinos: TRANSLATABLE_DESTINO_FIELDS,
  opiniones: TRANSLATABLE_OPINION_FIELDS,
};

/**
 * POST /api/admin/translate/record
 * Translates a single record. Body: { table, recordId }
 * For destinos, splits into two passes (string fields + JSONB fields)
 * to avoid oversized prompts that timeout.
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

  // Extract translatable fields, split into string and jsonb groups
  const fieldMap = FIELD_MAPS[table];
  const stringFields: Record<string, any> = {};
  const jsonbFields: Record<string, any> = {};

  for (const key of Object.keys(fieldMap)) {
    const val = record[key];
    if (val === null || val === undefined || val === "") continue;
    if (fieldMap[key] === "jsonb") {
      jsonbFields[key] = val;
    } else {
      stringFields[key] = val;
    }
  }

  const hasStrings = Object.keys(stringFields).length > 0;
  const hasJsonb = Object.keys(jsonbFields).length > 0;

  if (!hasStrings && !hasJsonb) {
    return NextResponse.json({ success: true, message: "No fields to translate" });
  }

  const baseParams = {
    table: table as "clientes" | "destinos" | "opiniones",
    recordId,
    clientId,
    sourceLang,
    targetLangs,
  };

  // For tables with JSONB fields (destinos), split into two passes
  // to keep prompts small enough to avoid timeouts
  const errors: string[] = [];
  let totalSkipped = 0;

  if (hasStrings) {
    const r = await autoTranslateRecord({ ...baseParams, fields: stringFields });
    if (!r.success) errors.push(r.error || "String fields failed");
    totalSkipped += r.skipped || 0;
  }

  if (hasJsonb) {
    // Translate each JSONB field individually to avoid huge prompts
    for (const [key, val] of Object.entries(jsonbFields)) {
      const r = await autoTranslateRecord({ ...baseParams, fields: { [key]: val } });
      if (!r.success) errors.push(`${key}: ${r.error || "failed"}`);
      totalSkipped += r.skipped || 0;
    }
  }

  return NextResponse.json({
    success: errors.length === 0,
    error: errors.length > 0 ? errors.join("; ") : undefined,
    skipped: totalSkipped,
  });
}
