# AI Features — DRB Agency

> **Última actualización:** 2026-02-26

## Modelos Usados

| Modelo | ID | Uso |
|--------|-----|-----|
| Claude Sonnet 4 | `claude-sonnet-4-20250514` | AI principal: itinerarios, chatbot, recomendaciones, free-chat |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | Auto-traducción (barato, rápido, 8192 max output tokens) |

## Endpoint Principal: `POST /api/ai`

**Rate limit:** 20 req/min por `clienteId` (in-memory).

| Action | max_tokens | Descripción |
|--------|-----------|-------------|
| `generate-itinerary` | 8000 | Genera destino completo como JSON |
| `suggest-destinations` | 1024 | Lista de sugerencias de destinos |
| `analyze-bookings` | 2048 | Análisis de métricas de reservas (Markdown) |
| `generate-description` | 512 | Copywriting para destinos |
| `optimize-pricing` | 1024 | Recomendación de precios (JSON) |
| `draft-email` | 2048 | Cuerpo HTML de email |
| `chatbot-response` | 1024 | Respuesta para chatbot público |
| `generate-report` | 2048 | Reporte ejecutivo para owner |
| `ai-recommendations` | 2048 | Recomendaciones personalizadas para agencia |
| `free-chat` | 2000 | Asistente libre "Eden" (admin panel) |
| `owner-chat` | 2000 | Copiloto "Eden" (owner panel, con métricas) |

## Componentes AI (`src/components/ai/`)

| Componente | Uso |
|------------|-----|
| `ItineraryGenerator` | Generador de itinerarios con export PDF |
| `ChatbotConfig` | Configuración del chatbot público (nombre, personalidad, FAQs) |
| `FreeChat` | Chat libre con Eden (asistente IA) |
| `AIDescriptionButton` | Botón inline para generar descripciones |
| `AIEmailGenerator` | Generador de emails con IA |
| `AIPricingSuggestion` | Sugerencia de precios |
| `AIRecommendations` | Recomendaciones para agencia (tab AI en detalle cliente owner) |
| `AIInsightsCard` | Card compacta de insights para dashboard |
| `AILockedOverlay` | Overlay para plan Start (AI bloqueado) |

## Auto-Traducción

### Arquitectura
- **Motor:** `src/lib/auto-translate.ts` — Claude Haiku 4.5
- **Config:** SDK timeout 150s, maxRetries 2, **1 idioma por llamada**, **1 llamada por invocación serverless**
- **Content hashing:** `_hashes` en translations JSONB. Campos sin cambios = 0 tokens
- **fieldGroup splitting:** Para destinos: "strings" primero, luego cada campo JSONB individualmente

### API Endpoints
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/admin/translate` | POST | Traducción por sección (hook de guardado) |
| `/api/admin/translate/list` | GET | Lista records a traducir |
| `/api/admin/translate/record` | POST | Traduce un record/fieldGroup. `maxDuration=180` |
| `/api/admin/translate/all` | POST | Traducción masiva (legacy) |

### Tablas con `translations` JSONB
- `clientes` — campos de landing (hero, whyus, cta, footer, meta)
- `destinos` — nombre, descripción, itinerario, hotel, vuelos, coordinador, incluido, etc.
- `opiniones` — texto, nombre, ciudad

### Field Maps (`src/lib/translations.ts`)
- `TRANSLATABLE_CLIENT_FIELDS` — 17+ campos string + JSONB
- `TRANSLATABLE_DESTINO_FIELDS` — 20+ campos string + JSONB
- `TRANSLATABLE_OPINION_FIELDS` — campos de opiniones

### Runtime
- `tr(obj, field, lang, preferredLang)` — Lee traducción de un campo
- `makeTr(obj, lang, preferredLang)` — Crea helper reutilizable
- Image URLs se merge en runtime (`DestinationDetail.tsx`)

## Chatbot Público

- **Widget:** `src/components/ChatbotWidget.tsx` — widget flotante
- **API:** `POST /api/chatbot` — usa `chatbot-response` action
- **Config:** Tabla `ai_chatbot_config` (nombre bot, personalidad, info agencia, FAQs)
- **Rate limiting:** Incluido en el endpoint

## Eden AI (Panel Chat)

- **Admin:** `EdenChat.tsx` en `AdminRightColumn` → `/api/ai` con action `free-chat`
- **Owner:** `OwnerChat.tsx` en `OwnerRightColumn` → `/api/ai` con action `owner-chat` + métricas de plataforma como contexto
- **UI:** Glassmorphism bubbles, suggestion chips, typing indicator

## Plan Gating

- **Start:** AI bloqueado (`AILockedOverlay`), traducciones no disponibles
- **Grow/Pro:** Acceso completo a AI + auto-traducción
- **Owner:** Sin restricciones (siempre acceso completo)

## Tablas AI

| Tabla | Descripción |
|-------|-------------|
| `ai_chatbot_config` | Configuración del chatbot por agencia |
| `ai_itinerarios` | Itinerarios generados guardados |

> Última actualización: 2026-02-26
