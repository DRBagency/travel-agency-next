# API Routes — DRB Agency

> **Última actualización:** 2026-03-01

## Resumen

63 route files organizados en 5 grupos. Todos en `src/app/api/`.

## Admin Routes (`/api/admin/...`) — 36 routes

### Calendar
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST | `/api/admin/calendar/events` | Listar/crear eventos |
| GET/PATCH/DELETE | `/api/admin/calendar/events/[id]` | Detalle/editar/eliminar evento |
| GET | `/api/admin/calendar/google-url` | URL del calendario Google |
| GET | `/api/admin/calendar/oauth/start` | Iniciar OAuth Google |
| GET | `/api/admin/calendar/oauth/callback` | Callback OAuth Google |
| POST | `/api/admin/calendar/oauth/disconnect` | Desconectar Google Calendar |

### CRM
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/crm/export` | Exportar CRM a CSV |

### Destinos
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST/PATCH | `/api/admin/destinos/[id]/update` | Actualizar destino (typed fields: STRING, NUMBER, BOOLEAN, UUID, JSONB) |

### Coordinadores
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/coordinadores` | Listar coordinadores del cliente |
| POST | `/api/admin/coordinadores` | Crear coordinador (nombre, avatar, rol, descripcion, idiomas[]) |
| PATCH | `/api/admin/coordinadores/[id]` | Actualizar coordinador |
| DELETE | `/api/admin/coordinadores/[id]` | Eliminar coordinador |

### Domain
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/admin/domain/add` | Añadir dominio a Vercel |
| POST | `/api/admin/domain/remove` | Eliminar dominio |
| POST | `/api/admin/domain/save` | Guardar config dominio |
| POST | `/api/admin/domain/verify` | Verificar dominio |

### Emails
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/email-preview` | Preview de email template |
| POST | `/api/admin/emails/send-promocion` | Enviar email promocional |

### Export
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/export` | Exportar reservas CSV/PDF |

### Legales
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST | `/api/admin/legales` | Listar/crear páginas legales |
| GET/PATCH/DELETE | `/api/admin/legales/[id]` | Detalle/editar/eliminar |

### Mensajes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST | `/api/admin/messages` | Listar/marcar mensajes |

### Mi Web
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/admin/mi-web/update` | Actualizar contenido web |

### Opiniones
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST | `/api/admin/opiniones` | Listar/crear opiniones |
| GET/PATCH/DELETE | `/api/admin/opiniones/[id]` | Detalle/editar/eliminar |

### Reservas
| Método | Ruta | Descripción |
|--------|------|-------------|
| PATCH | `/api/admin/reservas/[id]/estado` | Cambiar estado reserva |

### Search
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/search` | Búsqueda global admin |

### Social Media
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/admin/social/disconnect` | Desconectar red social |
| POST | `/api/admin/social/sync` | Sincronizar datos social |
| GET | `/api/admin/social/oauth/instagram/start` | OAuth Instagram |
| GET | `/api/admin/social/oauth/instagram/callback` | Callback Instagram |
| GET | `/api/admin/social/oauth/tiktok/start` | OAuth TikTok |
| GET | `/api/admin/social/oauth/tiktok/callback` | Callback TikTok |

### Translate
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/admin/translate` | Traducir sección (hook guardado) |
| POST | `/api/admin/translate/all` | Traducir todo (legacy) |
| GET | `/api/admin/translate/list` | Listar records a traducir |
| POST | `/api/admin/translate/record` | Traducir record/fieldGroup (`maxDuration=180`) |

### Otros
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/unsplash/search` | Buscar imágenes Unsplash |
| POST | `/api/admin/upload-avatar` | Subir foto de perfil |
| GET | `/api/admin/visits/active` | Visitantes activos (Realtime) |

## AI Routes (`/api/ai/...`) — 5 routes

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/ai` | Endpoint principal AI (11 actions) |
| DELETE | `/api/ai/delete-itinerary` | Eliminar itinerario guardado |
| POST | `/api/ai/save-chatbot-config` | Guardar config chatbot |
| POST | `/api/ai/save-itinerary` | Guardar itinerario |
| GET | `/api/ai/saved-itineraries` | Listar itinerarios guardados |

## Owner Routes (`/api/owner/...`) — 7 routes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST | `/api/owner/calendar/events` | Eventos calendario owner |
| GET/PATCH/DELETE | `/api/owner/calendar/events/[id]` | CRUD evento owner |
| GET | `/api/owner/calendar/oauth/start` | OAuth Google (owner) |
| GET | `/api/owner/calendar/oauth/callback` | Callback OAuth (owner) |
| POST | `/api/owner/calendar/oauth/disconnect` | Desconectar Google (owner) |
| GET | `/api/owner/email-preview` | Preview email billing |
| GET | `/api/owner/notifications` | Notificaciones owner |

## Stripe Routes (`/api/stripe/...`) — 10 routes

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/stripe/billing/create-subscription` | Crear suscripción |
| POST | `/api/stripe/billing/change-plan` | Cambiar plan |
| POST | `/api/stripe/billing/cancel-subscription` | Cancelar suscripción |
| POST | `/api/stripe/billing/reactivate-subscription` | Reactivar suscripción |
| POST | `/api/stripe/billing/webhook` | Webhook billing |
| POST | `/api/stripe/connect/checkout` | Checkout reserva |
| POST | `/api/stripe/connect/create-account` | Crear cuenta Connect |
| POST | `/api/stripe/connect/onboarding` | Link onboarding Connect |
| POST/GET | `/api/stripe/connect/start` | Iniciar flujo Connect |
| POST | `/api/stripe/connect/webhook` | Webhook Connect |

## Public Routes — 5 routes

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/chatbot` | Chatbot público (visitantes landing) |
| POST | `/api/contact` | Formulario de contacto landing |
| GET | `/api/notifications` | Notificaciones admin |
| POST | `/api/track` | Tracking visitas (público, rate limited) |
| GET | `/api/test` | Test endpoint |

## Cron Jobs — 2 routes

| Método | Ruta | Schedule | Descripción |
|--------|------|----------|-------------|
| GET/POST | `/api/cron/email-automation` | `0 9 * * *` (09:00 UTC) | Emails automáticos |
| GET/POST | `/api/cron/social-token-refresh` | `0 3 * * *` (03:00 UTC) | Refresh tokens social |

Configurados en `vercel.json`.

## Patrones Comunes

### Autenticación Admin
```ts
import { requireAdminClient } from "@/lib/requireAdminClient";
const { clienteId } = await requireAdminClient(request);
```

### Queries con supabaseAdmin
```ts
import { supabaseAdmin } from "@/lib/supabase-server";
const { data, error } = await supabaseAdmin.from("tabla").select("*").eq("cliente_id", clienteId);
```

### Validación de dominio API
```ts
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";
```

> Última actualización: 2026-03-01
