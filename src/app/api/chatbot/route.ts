import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "@/lib/supabase-server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Rate limiting per client
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60_000;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const { clienteId, message, history } = await req.json();

    if (!clienteId || !message) {
      return NextResponse.json(
        { error: "Missing clienteId or message" },
        { status: 400 }
      );
    }

    if (!checkRateLimit(clienteId)) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Load chatbot config
    const { data: config } = await supabaseAdmin
      .from("ai_chatbot_config")
      .select("*")
      .eq("cliente_id", clienteId)
      .eq("activo", true)
      .single();

    if (!config) {
      return NextResponse.json(
        { error: "Chatbot not configured" },
        { status: 404 }
      );
    }

    // Load active destinations for context
    const { data: destinos } = await supabaseAdmin
      .from("destinos")
      .select("nombre, descripcion, precio")
      .eq("cliente_id", clienteId)
      .eq("activo", true);

    // Load client info
    const { data: cliente } = await supabaseAdmin
      .from("clientes")
      .select("nombre")
      .eq("id", clienteId)
      .single();

    const destinosList = (destinos || [])
      .map((d) => `- ${d.nombre}: ${d.descripcion || ""} (${d.precio}€)`)
      .join("\n");

    const faqsList = (config.faqs || [])
      .map((f: any) => `P: ${f.question}\nR: ${f.answer}`)
      .join("\n\n");

    const systemPrompt = `Eres "${config.nombre_bot}", el asistente virtual de la agencia de viajes "${cliente?.nombre || ""}".

Personalidad: ${config.personalidad}
${config.info_agencia ? `Información de la agencia: ${config.info_agencia}` : ""}

Destinos disponibles:
${destinosList || "No hay destinos cargados."}

${faqsList ? `Preguntas frecuentes:\n${faqsList}` : ""}

REGLAS:
- Responde siempre en el idioma del usuario
- Sé útil y amigable según tu personalidad
- Solo recomienda destinos que estén en la lista
- Si no sabes algo, sugiere contactar a la agencia
- Respuestas cortas y directas (máximo 3 párrafos)
- No inventes precios ni destinos que no estén en la lista`;

    const messages: any[] = [];

    // Add conversation history
    if (Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        });
      }
    }

    messages.push({ role: "user", content: message });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error("Chatbot error:", error?.status, error?.message || error);

    const status = error?.status || 500;
    let userMessage = "Error processing request";

    if (status === 400 && error?.message?.includes("credit balance")) {
      userMessage = "AI credits exhausted. Contact the agency.";
    } else if (error?.message) {
      userMessage = error.message;
    }

    return NextResponse.json(
      { error: userMessage },
      { status }
    );
  }
}
