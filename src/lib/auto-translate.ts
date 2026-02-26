/* eslint-disable @typescript-eslint/no-explicit-any */
import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "@/lib/supabase-server";
import {
  TRANSLATABLE_CLIENT_FIELDS,
  TRANSLATABLE_DESTINO_FIELDS,
  TRANSLATABLE_OPINION_FIELDS,
  type FieldType,
} from "@/lib/translations";

const LANG_NAMES: Record<string, string> = {
  es: "Spanish",
  en: "English",
  ar: "Arabic",
};

const FIELD_MAPS: Record<string, Record<string, FieldType>> = {
  clientes: TRANSLATABLE_CLIENT_FIELDS,
  destinos: TRANSLATABLE_DESTINO_FIELDS,
  opiniones: TRANSLATABLE_OPINION_FIELDS,
};

/** Simple hash for change detection (not crypto) */
function contentHash(value: any): string {
  const str = typeof value === "string" ? value : JSON.stringify(value);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

interface AutoTranslateParams {
  table: "clientes" | "destinos" | "opiniones" | "paginas_legales";
  recordId: string;
  clientId: string;
  fields: Record<string, any>;
  sourceLang: string;
  targetLangs: string[];
  force?: boolean; // skip hash check, retranslate everything
}

interface TranslationResult {
  success: boolean;
  translations: Record<string, Record<string, any>>;
  usage?: { input_tokens: number; output_tokens: number };
  error?: string;
  skipped?: number; // fields skipped because unchanged
}

/**
 * Translates fields for a record and stores results in its `translations` JSONB column.
 * Uses content hashing to skip unchanged fields (saves tokens).
 */
export async function autoTranslateRecord(
  params: AutoTranslateParams
): Promise<TranslationResult> {
  const { table, recordId, clientId, fields, sourceLang, targetLangs, force } = params;

  if (!process.env.ANTHROPIC_API_KEY) {
    return { success: false, translations: {}, error: "No API key configured" };
  }

  const fieldMap = FIELD_MAPS[table];
  if (!fieldMap) {
    return { success: false, translations: {}, error: `Unknown table: ${table}` };
  }

  // Filter to only translatable fields that have content
  const allFields: Record<string, any> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (!fieldMap[key]) continue;
    if (value === null || value === undefined || value === "") continue;
    if (typeof value === "string" && value.trim() === "") continue;
    allFields[key] = value;
  }

  if (Object.keys(allFields).length === 0) {
    return { success: true, translations: {} };
  }

  // Filter out source lang from targets
  const langs = targetLangs.filter((l) => l !== sourceLang);
  if (langs.length === 0) {
    return { success: true, translations: {} };
  }

  // Load existing translations to check hashes
  const { data: existing } = await supabaseAdmin
    .from(table)
    .select("translations")
    .eq("id", recordId)
    .single();

  const existingTranslations: Record<string, any> = existing?.translations || {};
  const existingHashes: Record<string, string> = existingTranslations._hashes || {};

  // Filter out unchanged fields (unless force=true)
  const toTranslate: Record<string, any> = {};
  let skippedCount = 0;

  for (const [key, value] of Object.entries(allFields)) {
    const hash = contentHash(value);
    if (!force && existingHashes[key] === hash) {
      // Content hasn't changed since last translation — skip
      skippedCount++;
      continue;
    }
    toTranslate[key] = value;
  }

  if (Object.keys(toTranslate).length === 0) {
    console.log(`[translate] ${table}/${recordId}: all ${skippedCount} fields unchanged, skipping`);
    return { success: true, translations: existingTranslations, skipped: skippedCount };
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      maxRetries: 2,      // retry on 529/503 (API overloaded) — SDK handles backoff
      timeout: 150_000,   // 2.5 min — generous for large JSONB (itinerario etc.)
    });

    const changedFields = Object.keys(toTranslate).join(",");
    console.log(`[translate] Starting ${table}/${recordId} → ${langs.join(",")}, changed: ${changedFields} (${skippedCount} unchanged)`);

    // Translate ONE language at a time to avoid exceeding Haiku's 8192 output token limit.
    // A large itinerario translated to 2 languages can exceed 8192 tokens; splitting halves output per call.
    const merged: Record<string, any> = { ...existingTranslations };
    const totalUsage = { input_tokens: 0, output_tokens: 0 };

    for (const lang of langs) {
      const langLabel = `"${lang}" (${LANG_NAMES[lang] || lang})`;
      const prompt = buildTranslationPrompt(toTranslate, fieldMap, sourceLang, langLabel, [lang]);

      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 8192,
        messages: [{ role: "user", content: prompt }],
      });

      totalUsage.input_tokens += response.usage.input_tokens;
      totalUsage.output_tokens += response.usage.output_tokens;

      if (response.stop_reason === "max_tokens") {
        console.error(`[translate] TRUNCATED ${table}/${recordId} lang=${lang}`);
        return {
          success: false,
          translations: {},
          error: `Translation truncated for ${lang} (content too large)`,
          skipped: skippedCount,
        };
      }

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error(`[translate] PARSE FAIL ${table}/${recordId} lang=${lang}`);
        return {
          success: false,
          translations: {},
          error: `Could not parse translation for ${lang}`,
          skipped: skippedCount,
        };
      }

      const parsed: Record<string, Record<string, any>> = JSON.parse(jsonMatch[0]);
      if (parsed[lang]) {
        merged[lang] = { ...(merged[lang] || {}), ...parsed[lang] };
      }
    }

    // Update hashes for translated fields
    const newHashes = { ...existingHashes };
    for (const key of Object.keys(toTranslate)) {
      newHashes[key] = contentHash(toTranslate[key]);
    }
    merged._hashes = newHashes;

    // Save to database
    let query = supabaseAdmin
      .from(table)
      .update({ translations: merged })
      .eq("id", recordId);

    if (table !== "clientes") {
      query = query.eq("cliente_id", clientId);
    }

    const { error: updateError } = await query;

    if (updateError) {
      return {
        success: false,
        translations: merged,
        error: updateError.message,
        skipped: skippedCount,
      };
    }

    return {
      success: true,
      translations: merged,
      usage: totalUsage,
      skipped: skippedCount,
    };
  } catch (err: any) {
    console.error(`[translate] FAILED ${table}/${recordId}:`, err?.status, err?.message);
    return {
      success: false,
      translations: {},
      error: `${err?.status || ""} ${err?.message || "Translation failed"}`.trim(),
      skipped: skippedCount,
    };
  }
}

function buildTranslationPrompt(
  fields: Record<string, any>,
  fieldMap: Record<string, FieldType>,
  sourceLang: string,
  targetLangList: string,
  langs: string[]
): string {
  const fieldDescriptions: string[] = [];

  for (const [key, value] of Object.entries(fields)) {
    const type = fieldMap[key];
    if (type === "jsonb") {
      fieldDescriptions.push(
        `"${key}": ${JSON.stringify(value, null, 2)}`
      );
    } else {
      fieldDescriptions.push(`"${key}": ${JSON.stringify(value)}`);
    }
  }

  return `You are a professional travel industry translator. Translate the following content from ${LANG_NAMES[sourceLang] || sourceLang} to ${targetLangList}.

RULES:
- Maintain the exact same JSON structure for JSONB fields (arrays stay arrays, objects stay objects)
- Keep the same keys — only translate string VALUES
- Do NOT translate: URLs, email addresses, phone numbers, icon emojis, numeric values, currency codes, dates, proper nouns that are brand names, image paths
- PRESERVE all URL fields (imagen, image, avatar, avatar_url, logo_url) exactly as-is in the output
- For JSONB arrays of strings (like "incluido", "tags", "highlights"), translate each string in the array
- For JSONB objects (like "hotel", "coordinador"), translate text fields but keep structural fields (like "estrellas", "amenidades" keys) unchanged
- For itinerario arrays, translate titles, descriptions, activity text but keep structural keys
- For FAQs, translate both "pregunta" and "respuesta"
- Preserve HTML if any
- Use natural, professional travel industry language appropriate for each target language

SOURCE FIELDS:
{
${fieldDescriptions.join(",\n")}
}

RESPOND WITH ONLY a valid JSON object in this exact structure (no extra text, no markdown):
{
${langs.map((l) => `  "${l}": { /* translated fields */ }`).join(",\n")}
}`;
}
