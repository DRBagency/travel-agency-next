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
  | "free-chat"
  | "owner-chat";

// Actions that return JSON — strip markdown code fences from response
const JSON_ACTIONS: AIAction[] = ["generate-itinerary", "optimize-pricing", "suggest-destinations"];

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^```(?:json|JSON)?\s*\n?([\s\S]*?)\n?\s*```$/);
  return match ? match[1].trim() : trimmed;
}

function getSystemPrompt(action: AIAction, data: Record<string, any>): string {
  const prompts: Record<AIAction, string> = {
    "generate-itinerary": `Eres un experto planificador de viajes y copywriter de una agencia de viajes profesional. Genera una ficha de destino COMPLETA con todos los campos necesarios para publicar el destino en la web de la agencia.

INSTRUCCIONES:
- Genera TODOS los campos en una sola respuesta
- "descripcion" debe ser corta (máximo 200 caracteres) para tarjetas de la landing
- "descripcion_larga" debe tener 300-500 caracteres para la página de detalle del destino
- "precio_total_estimado" y "precio_original" deben ser números como strings SIN símbolos de moneda (ej: "3190", no "3190€")
- "esfuerzo" es un entero de 1 a 5 indicando esfuerzo físico
- "tags" debe incluir 3-5 etiquetas relevantes al estilo del destino
- "highlights" debe incluir 3-5 puntos clave de venta del destino
- "faqs" debe incluir 3-4 preguntas y respuestas relevantes para el viajero
- "incluido" y "no_incluido" deben ser listas completas y realistas
- Cada día del itinerario debe tener actividades para mañana, tarde y noche
- Incluye estimación de precios para cada actividad
- Incluye tips locales y recomendaciones
- Responde en el idioma de la descripción del destino (español por defecto)
- Responde SIEMPRE en JSON válido con esta estructura exacta:
{
  "nombre": "Nombre del destino",
  "subtitle": "Frase corta evocadora",
  "tagline": "Eslogan breve del destino",
  "badge": "Bestseller|Nuevo|Oferta|Popular|Exclusivo",
  "descripcion": "Descripción corta para tarjetas (máx 200 chars)",
  "descripcion_larga": "Descripción larga y rica para la página de detalle del destino (300-500 chars)",
  "pais": "País",
  "continente": "Asia|Europa|América|África|Oceanía",
  "categoria": "Aventura|Cultural|Relax|Gastronomía|Naturaleza|Urbano",
  "dificultad": "Baja|Media|Alta",
  "duracion": "X noches",
  "esfuerzo": 3,
  "grupo_max": 16,
  "edad_min": 18,
  "edad_max": 45,
  "precio_total_estimado": "3190",
  "precio_original": "3690",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "highlights": ["Punto clave 1", "Punto clave 2", "Punto clave 3"],
  "clima": {
    "temp_avg": "28°C",
    "best_months": "Abril - Octubre",
    "description": "Descripción del clima del destino"
  },
  "hotel": {
    "nombre": "Nombre del hotel",
    "estrellas": 4,
    "descripcion": "Descripción breve del hotel",
    "amenidades": ["Piscina", "Spa", "Restaurante", "WiFi"]
  },
  "vuelos": {
    "aeropuerto_llegada": "Nombre del aeropuerto (código IATA)",
    "aeropuerto_regreso": "Nombre del aeropuerto (código IATA)",
    "nota": "Nota sobre vuelos disponibles"
  },
  "coordinador": {
    "nombre": "Nombre del coordinador",
    "rol": "Coordinador local",
    "descripcion": "Breve bio del coordinador",
    "idiomas": ["Español", "Inglés"]
  },
  "incluido": ["Vuelos ida y vuelta", "Alojamiento X noches", "Desayunos diarios", "Transfers aeropuerto", "Guía en español", "Seguro de viaje"],
  "no_incluido": ["Comidas no especificadas", "Gastos personales", "Propinas", "Visado"],
  "faqs": [
    {"pregunta": "Pregunta frecuente 1", "respuesta": "Respuesta detallada 1"},
    {"pregunta": "Pregunta frecuente 2", "respuesta": "Respuesta detallada 2"},
    {"pregunta": "Pregunta frecuente 3", "respuesta": "Respuesta detallada 3"}
  ],
  "itinerario": {
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
    "mejor_epoca": "...",
    "clima": "...",
    "tips_generales": ["...", "..."],
    "que_llevar": ["...", "..."]
  }
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

    "owner-chat": `Eres Eden, el copiloto IA de la plataforma SaaS "DRB Agency" que provee software para agencias de viajes. Ayudas al propietario de la plataforma con análisis de métricas, retención, estrategia de crecimiento, redacción de emails a agencias y optimización del negocio SaaS.

MÉTRICAS ACTUALES DE LA PLATAFORMA:
${data.ownerContext || "Sin datos disponibles"}

INSTRUCCIONES:
- Analiza MRR, churn, retención y crecimiento cuando te lo pidan
- Identifica agencias en riesgo de cancelación basándote en las métricas
- Sugiere estrategias para mejorar retención y upselling
- Redacta emails profesionales para comunicarte con agencias
- Da recomendaciones accionables basadas en datos
- Responde en el idioma del usuario de forma concisa y profesional`,
  };

  return prompts[action] || "Eres un asistente útil para agencias de viajes. Responde en español.";
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured. Add it to your environment variables." },
        { status: 503 }
      );
    }

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

    const MAX_TOKENS_MAP: Record<AIAction, number> = {
      "generate-description": 512,
      "optimize-pricing": 1024,
      "free-chat": 2000,
      "owner-chat": 2000,
      "generate-itinerary": 8000,
      "draft-email": 2048,
      "chatbot-response": 1024,
      "suggest-destinations": 1024,
      "analyze-bookings": 2048,
      "generate-report": 2048,
      "ai-recommendations": 2048,
    };

    const maxTokens = MAX_TOKENS_MAP[action] || 2048;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const textContent = message.content.find((c) => c.type === "text");
    let responseText = textContent?.text || "";

    // Strip markdown code fences from JSON responses
    if (JSON_ACTIONS.includes(action)) {
      responseText = stripCodeFences(responseText);
    }

    return NextResponse.json({
      result: responseText,
      usage: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
      },
    });
  } catch (error: any) {
    console.error("[AI API Error]", error?.status, error?.message || error);

    // Parse Anthropic API errors for user-friendly messages
    const status = error?.status || 500;
    let userMessage = "AI request failed";

    if (status === 400 && error?.message?.includes("credit balance")) {
      userMessage = "Anthropic API credits exhausted. Please add credits at console.anthropic.com";
    } else if (status === 401) {
      userMessage = "Invalid Anthropic API key. Check your ANTHROPIC_API_KEY.";
    } else if (status === 429) {
      userMessage = "Anthropic rate limit reached. Please wait a moment.";
    } else if (status === 529 || status === 503) {
      userMessage = "Anthropic API temporarily unavailable. Try again shortly.";
    } else if (error?.message) {
      userMessage = error.message;
    }

    return NextResponse.json(
      { error: userMessage },
      { status }
    );
  }
}
