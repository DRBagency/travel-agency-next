import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60_000; // 1 minute

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

type AIAction =
  | "generate-itinerary"
  | "suggest-destinations"
  | "analyze-bookings"
  | "generate-description"
  | "optimize-pricing"
  | "draft-email"
  | "chatbot-response"
  | "generate-report"
  | "ai-recommendations"
  | "free-chat";

function getSystemPrompt(action: AIAction, data: Record<string, any>): string {
  const prompts: Record<AIAction, string> = {
    "generate-itinerary": `Eres un experto planificador de viajes de una agencia de viajes profesional. Genera itinerarios detallados día por día.

INSTRUCCIONES:
- Cada día debe tener actividades para mañana, tarde y noche
- Incluye estimación de precios para cada actividad
- Incluye tips locales y recomendaciones
- Incluye información del clima y mejor época para visitar
- Responde SIEMPRE en JSON válido con esta estructura exacta:
{
  "dias": [
    {
      "dia": 1,
      "titulo": "Título del día",
      "actividades": {
        "manana": { "titulo": "...", "descripcion": "...", "precio_estimado": "...", "duracion": "...", "tipo": "cultura|naturaleza|gastronomia|relax|aventura|compras" },
        "tarde": { "titulo": "...", "descripcion": "...", "precio_estimado": "...", "duracion": "...", "tipo": "..." },
        "noche": { "titulo": "...", "descripcion": "...", "precio_estimado": "...", "duracion": "...", "tipo": "..." }
      },
      "tip_local": "..."
    }
  ],
  "precio_total_estimado": "...",
  "mejor_epoca": "...",
  "clima": "...",
  "tips_generales": ["...", "..."],
  "que_llevar": ["...", "..."]
}

No incluyas texto fuera del JSON. Solo responde con el JSON.`,

    "suggest-destinations": `Eres un asesor de viajes experto. Sugiere destinos basándote en las preferencias del usuario. Responde en JSON.`,

    "analyze-bookings": `Eres un analista de datos de una agencia de viajes. Analiza las métricas y datos de reservas proporcionados. Identifica tendencias, patrones y oportunidades. Responde en español con formato markdown.`,

    "generate-description": `Eres un copywriter profesional especializado en turismo y viajes. Genera descripciones atractivas y persuasivas para destinos turísticos y contenido web de agencias de viajes.

INSTRUCCIONES:
- Adapta el tono según lo indicado (profesional/inspirador/aventurero/romántico/familiar)
- Respeta la longitud solicitada
- Responde en el idioma indicado
- Usa lenguaje evocador que inspire al viajero
- NO incluyas comillas alrededor del texto generado
- Responde SOLO con el texto, sin explicaciones adicionales`,

    "optimize-pricing": `Eres un consultor de pricing para agencias de viajes. Analiza el destino proporcionado y sugiere un precio óptimo.

Responde SIEMPRE en JSON válido:
{
  "precio_sugerido": number,
  "rango_bajo": number,
  "rango_alto": number,
  "justificacion": "...",
  "factores": ["...", "..."],
  "temporada_alta": "...",
  "temporada_baja": "..."
}

No incluyas texto fuera del JSON.`,

    "draft-email": `Eres un experto en email marketing para agencias de viajes. Genera emails HTML profesionales y atractivos.

INSTRUCCIONES:
- Genera HTML completo del email (solo el body content, no <html> ni <head>)
- Usa estilos inline para compatibilidad
- Incluye call-to-action cuando sea apropiado
- Adapta el tono según lo indicado
- Responde SOLO con el HTML, sin explicaciones`,

    "chatbot-response": `Eres un asistente virtual de una agencia de viajes. ${data.botName ? `Te llamas "${data.botName}".` : ""} ${data.personality ? `Tu personalidad es: ${data.personality}.` : ""}

CONTEXTO DE LA AGENCIA:
${data.agencyInfo || "Agencia de viajes profesional"}

DESTINOS DISPONIBLES:
${data.destinations || "Consulta con la agencia para información actualizada de destinos"}

PREGUNTAS FRECUENTES:
${data.faqs || "No hay FAQs configuradas"}

INSTRUCCIONES:
- Responde de forma concisa y útil
- Si no sabes algo, sugiere contactar a la agencia directamente
- Promociona los destinos disponibles cuando sea relevante
- Responde en el idioma del usuario
- Sé amable y profesional`,

    "generate-report": `Eres un analista de negocio SaaS especializado en plataformas de turismo. Analiza las métricas proporcionadas y genera un informe ejecutivo.

INSTRUCCIONES:
- Identifica tendencias principales
- Da recomendaciones accionables (3-5 puntos)
- Predice el comportamiento del próximo mes
- Alerta sobre problemas potenciales (churn, caída de MRR, etc.)
- Responde en español con formato markdown
- Sé conciso pero informativo`,

    "ai-recommendations": `Eres un consultor digital especializado en agencias de viajes. Basándote en los datos del cliente, genera recomendaciones personalizadas.

INSTRUCCIONES:
- Analiza los datos del cliente proporcionados
- Sugiere mejoras específicas para su web
- Recomienda destinos que podría añadir
- Sugiere optimizaciones de precios
- Responde en español con formato markdown
- Máximo 5 recomendaciones priorizadas`,

    "free-chat": `Eres un asistente IA experto en la industria del turismo y agencias de viajes. Ayudas a agencias de viajes con cualquier consulta: marketing, contenido, estrategia, destinos, presupuestos, redes sociales, etc.

CONTEXTO DE LA AGENCIA:
${data.agencyContext || ""}

Responde en español de forma concisa y profesional. Si te piden generar contenido (posts, descripciones, presupuestos), hazlo directamente.`,
  };

  return prompts[action] || "Eres un asistente útil para agencias de viajes. Responde en español.";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, data, clienteId } = body as {
      action: AIAction;
      data: Record<string, any>;
      clienteId?: string;
    };

    if (!action || !data) {
      return NextResponse.json(
        { error: "Missing action or data" },
        { status: 400 }
      );
    }

    // Rate limiting
    const rateLimitKey = clienteId || "anonymous";
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again in a minute." },
        { status: 429 }
      );
    }

    const systemPrompt = getSystemPrompt(action, data);
    const userMessage = typeof data.prompt === "string"
      ? data.prompt
      : JSON.stringify(data);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const textContent = message.content.find((c) => c.type === "text");
    const responseText = textContent?.text || "";

    return NextResponse.json({
      result: responseText,
      usage: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
      },
    });
  } catch (error: any) {
    console.error("[AI API Error]", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "AI request failed" },
      { status: 500 }
    );
  }
}
