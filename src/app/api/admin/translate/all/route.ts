import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { autoTranslateRecord } from "@/lib/auto-translate";
import {
  TRANSLATABLE_CLIENT_FIELDS,
  TRANSLATABLE_DESTINO_FIELDS,
  TRANSLATABLE_OPINION_FIELDS,
} from "@/lib/translations";

export const maxDuration = 300; // 5 minutes for bulk translation

/**
 * POST /api/admin/translate/all
 * Translates ALL content for the current client: clientes row + all destinos + all opiniones.
 * Plan-gated to Grow/Pro.
 */
export async function POST() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("cliente_id")?.value;
  if (!clientId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Plan gate: only Grow/Pro
  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("*")
    .eq("id", clientId)
    .single();

  if (!client || !client.plan || client.plan === "start") {
    return NextResponse.json(
      { error: "Translation requires Grow or Pro plan" },
      { status: 403 }
    );
  }

  const sourceLang = client.preferred_language || "es";
  const availLangs: string[] = Array.isArray(client.available_languages)
    ? client.available_languages
    : [];
  const targetLangs = availLangs.filter((l: string) => l !== sourceLang);

  if (targetLangs.length === 0) {
    return NextResponse.json(
      { error: "No target languages configured" },
      { status: 400 }
    );
  }

  const results: { table: string; id: string; name?: string; success: boolean; error?: string }[] = [];

  // 1. Translate client record
  const clientFields: Record<string, any> = {};
  for (const key of Object.keys(TRANSLATABLE_CLIENT_FIELDS)) {
    if (client[key] !== null && client[key] !== undefined && client[key] !== "") {
      clientFields[key] = client[key];
    }
  }

  if (Object.keys(clientFields).length > 0) {
    const r = await autoTranslateRecord({
      table: "clientes",
      recordId: clientId,
      clientId,
      fields: clientFields,
      sourceLang,
      targetLangs,
    });
    results.push({ table: "clientes", id: clientId, name: client.nombre, success: r.success, error: r.error });
  }

  // 2. Translate all active destinos (sequential to avoid API rate limits)
  const { data: destinos } = await supabaseAdmin
    .from("destinos")
    .select("*")
    .eq("cliente_id", clientId)
    .eq("activo", true);

  for (const destino of destinos || []) {
    const destFields: Record<string, any> = {};
    for (const key of Object.keys(TRANSLATABLE_DESTINO_FIELDS)) {
      if (destino[key] !== null && destino[key] !== undefined && destino[key] !== "") {
        destFields[key] = destino[key];
      }
    }
    if (Object.keys(destFields).length === 0) continue;
    const r = await autoTranslateRecord({
      table: "destinos",
      recordId: destino.id,
      clientId,
      fields: destFields,
      sourceLang,
      targetLangs,
    });
    results.push({ table: "destinos", id: destino.id, name: destino.nombre, success: r.success, error: r.error });
  }

  // 3. Translate all active opiniones (sequential)
  const { data: opiniones } = await supabaseAdmin
    .from("opiniones")
    .select("*")
    .eq("cliente_id", clientId)
    .eq("activo", true);

  for (const opinion of opiniones || []) {
    const opFields: Record<string, any> = {};
    for (const key of Object.keys(TRANSLATABLE_OPINION_FIELDS)) {
      if (opinion[key] !== null && opinion[key] !== undefined && opinion[key] !== "") {
        opFields[key] = opinion[key];
      }
    }
    if (Object.keys(opFields).length === 0) continue;
    const r = await autoTranslateRecord({
      table: "opiniones",
      recordId: opinion.id,
      clientId,
      fields: opFields,
      sourceLang,
      targetLangs,
    });
    results.push({ table: "opiniones", id: opinion.id, name: opinion.nombre, success: r.success, error: r.error });
  }

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  return NextResponse.json({
    success: failCount === 0,
    total: results.length,
    translated: successCount,
    failed: failCount,
    details: results,
  });
}
