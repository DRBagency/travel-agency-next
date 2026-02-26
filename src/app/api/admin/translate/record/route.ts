import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { autoTranslateRecord } from "@/lib/auto-translate";
import {
  TRANSLATABLE_CLIENT_FIELDS,
  TRANSLATABLE_DESTINO_FIELDS,
  TRANSLATABLE_OPINION_FIELDS,
  TRANSLATABLE_LEGAL_FIELDS,
  type FieldType,
} from "@/lib/translations";

export const maxDuration = 180;

const FIELD_MAPS: Record<string, Record<string, FieldType>> = {
  clientes: TRANSLATABLE_CLIENT_FIELDS,
  destinos: TRANSLATABLE_DESTINO_FIELDS,
  opiniones: TRANSLATABLE_OPINION_FIELDS,
  paginas_legales: TRANSLATABLE_LEGAL_FIELDS,
};

/**
 * POST /api/admin/translate/record
 * Translates specific fields of a single record.
 * Body: { table, recordId, fieldGroup?: "strings" | "<jsonb_field_name>" }
 *
 * Each call makes exactly ONE AI API call:
 * - fieldGroup="strings" → translate all string-type fields
 * - fieldGroup="itinerario" → translate just that one JSONB field
 * - no fieldGroup → translate all string fields (for small records)
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
  const { table, recordId, fieldGroup } = body;

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

  const fieldMap = FIELD_MAPS[table];
  const fields: Record<string, any> = {};

  if (fieldGroup && fieldGroup !== "strings") {
    // Single JSONB field
    const val = record[fieldGroup];
    if (val !== null && val !== undefined && val !== "") {
      fields[fieldGroup] = val;
    }
  } else {
    // All string fields (fieldGroup="strings" or omitted)
    for (const key of Object.keys(fieldMap)) {
      if (fieldGroup === "strings" && fieldMap[key] === "jsonb") continue;
      const val = record[key];
      if (val === null || val === undefined || val === "") continue;
      fields[key] = val;
    }
  }

  if (Object.keys(fields).length === 0) {
    return NextResponse.json({ success: true, skipped: 0 });
  }

  // Single AI call
  const result = await autoTranslateRecord({
    table: table as "clientes" | "destinos" | "opiniones" | "paginas_legales",
    recordId,
    clientId,
    fields,
    sourceLang,
    targetLangs,
  });

  return NextResponse.json({
    success: result.success,
    error: result.error,
    skipped: result.skipped || 0,
    usage: result.usage,
  });
}
