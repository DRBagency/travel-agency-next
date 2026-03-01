# Database Schema - Supabase PostgreSQL

> **Última actualización:** 1 Marzo 2026
> **Estado:** Schema estable - 30 tablas con RLS, 30 migraciones

## ⚠️ PRINCIPIO FUNDAMENTAL

**ZERO SUPABASE ACCESS:** Ningún usuario (owner ni clientes) debe acceder a Supabase directamente.
Todas las tablas deben tener UI completa de gestión (CRUD) en los paneles correspondientes.

## 🔄 CHECKLIST AL AÑADIR TABLA NUEVA

Cuando se crea una tabla nueva, SIEMPRE seguir estos pasos:

- [ ] 1. Crear migración SQL en `supabase/migrations/`
- [ ] 2. Ejecutar `supabase db push`
- [ ] 3. Habilitar RLS en la tabla
- [ ] 4. Crear políticas para `service_role`
- [ ] 5. Añadir trigger `update_updated_at_column()` si tiene campo `updated_at`
- [ ] 6. Crear UI de creación en panel correspondiente
- [ ] 7. Crear UI de edición
- [ ] 8. Crear UI de eliminación
- [ ] 9. Crear UI de listado/visualización
- [ ] 10. Implementar server actions (CREATE/UPDATE/DELETE)
- [ ] 11. Añadir validaciones en frontend
- [ ] 12. Manejar errores apropiadamente
- [ ] 13. Actualizar este documento (DATABASE_SCHEMA.md)
- [ ] 14. Marcar estado de editabilidad (✅/⚠️/🔄/❌)

## 📊 TABLAS PRINCIPALES

### `clientes`
**Editable desde:** `/owner/clientes` | **Estado:** ✅ CRUD completo

**Columnas importantes añadidas:**
- `onboarding_completed` (boolean) — onboarding wizard completion
- `onboarding_step` (integer) — current wizard step
- `domain_verified` (boolean) — domain DNS verification status
- `profile_photo` (text) — admin profile photo URL (Supabase Storage)
- `slug` (text) — URL slug for public registration
- `plan` (text) — subscription plan (start/grow/pro)
- `stripe_subscription_id`, `stripe_account_id`, `stripe_charges_enabled` — Stripe integration fields

### `platform_settings`
**Editable desde:** `/owner/emails` | **Estado:** ✅ Formulario completo

### `billing_email_templates`
**Editable desde:** `/owner/emails` | **Estado:** ✅ Editor completo

### `email_templates`
**Editable desde:** `/admin/emails` | **Estado:** ✅ Editor completo

### `destinos`
**Editable desde:** `/admin/destinos` | **Estado:** ✅ CRUD completo

### `reservas`
**Editable desde:** `/admin/reservas` | **Estado:** ⚠️ Lectura + cambio estado inline

### `opiniones`
**Editable desde:** `/admin/mi-web` (OpinionesManager) | **Estado:** ✅ CRUD completo

### `paginas_legales`
**Editable desde:** `/admin/legales` | **Estado:** ✅ CRUD completo

### `calendar_events`
**Editable desde:** `/admin/calendario` + `/owner/calendario` | **Estado:** ✅ CRUD completo

### `documents`
**Editable desde:** `/admin/documentos` | **Estado:** ✅ CRUD completo (with PDF generation)

### `support_tickets`
**Editable desde:** `/admin/soporte` y `/owner/soporte` | **Estado:** ✅ CRUD completo (with real-time chat)

### `ticket_messages`
**Editable desde:** Mismo que support_tickets | **Estado:** ✅ CRUD completo (real-time messages)

### `automations`
**Editable desde:** `/owner/automatizaciones` | **Estado:** ✅ CRUD completo (with execution logs)

### `automation_executions`
**Editable desde:** N/A (solo logs) | **Estado:** ✅ Lectura (logs)

## 🤖 TABLAS AI

### `ai_chatbot_config`
**Editable desde:** `/admin/ai/chatbot` | **Estado:** ✅ CRUD completo

### `ai_itinerarios`
**Editable desde:** `/admin/ai/itinerarios` | **Estado:** ✅ CRUD completo

## 📱 TABLAS SOCIAL

### `social_connections`
**Editable desde:** `/admin/social` | **Estado:** ✅ OAuth connect/disconnect

## 🧑‍✈️ TABLAS COORDINADORES

### `coordinadores`
**Panel:** Admin | **Ruta:** `/admin/coordinadores` | **Estado:** ✅ CRUD completo
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID PK | |
| `cliente_id` | UUID FK → clientes | Agencia propietaria |
| `nombre` | text NOT NULL | Nombre del coordinador |
| `avatar` | text | URL foto |
| `rol` | text | Cargo/rol |
| `descripcion` | text | Breve biografía |
| `idiomas` | jsonb DEFAULT '[]' | Array de idiomas |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | Trigger auto-update |

**RLS:** Habilitado, políticas para service_role
**FK en destinos:** `coordinador_id UUID REFERENCES coordinadores(id) ON DELETE SET NULL`
**Índice:** `idx_coordinadores_cliente_id` en `cliente_id`
**Migración:** `20260301000000_create_coordinadores_table.sql`

## 🚀 TABLAS PORTAL DEL VIAJERO (E20)

### `traveler_sessions`
**Uso:** Magic link auth para portal del viajero | **Estado:** ✅ API completa
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID PK | |
| `email` | text NOT NULL | Email del viajero |
| `token` | text UNIQUE NOT NULL | Token UUID del magic link |
| `cliente_id` | UUID FK → clientes | Agencia asociada |
| `expires_at` | timestamptz NOT NULL | Expiración (15 min desde creación) |
| `used_at` | timestamptz | Timestamp de uso (null = no usado) |
| `created_at` | timestamptz | |

**RLS:** Habilitado, políticas para service_role
**Índices:** `idx_traveler_sessions_token` (lookup), `idx_traveler_sessions_email_client` (email + cliente_id + created_at, rate limit)
**Migración:** `20260301100000_create_traveler_sessions.sql`

### `portal_messages`
**Uso:** Chat viajero ↔ agencia en portal | **Estado:** ✅ API completa
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID PK | |
| `reserva_id` | UUID FK → reservas | Reserva asociada |
| `cliente_id` | UUID FK → clientes | Agencia asociada |
| `sender_type` | text CHECK ('traveler','agency') | Tipo de emisor |
| `sender_email` | text NOT NULL | Email del emisor |
| `message` | text NOT NULL | Contenido del mensaje |
| `read_at` | timestamptz | Timestamp de lectura |
| `created_at` | timestamptz | |

**RLS:** Habilitado, políticas para service_role
**Índices:** `idx_portal_messages_reserva` (reserva_id + created_at), `idx_portal_messages_cliente` (cliente_id + created_at)
**Migración:** `20260301200000_create_portal_messages.sql`

## 📈 TABLAS TRACKING

### `page_visits`
**Auto-tracked via:** `/api/track` | **Estado:** ✅ Tracking automático

## 🌍 MULTI-IDIOMA & AUTO-TRADUCCIÓN

### i18n Estático (Panel Admin/Owner)
Implementado con **next-intl** + archivos JSON (`messages/es.json`, `messages/en.json`, `messages/ar.json`). ~1000+ keys para UI de paneles.

### Auto-Traducción Dinámica (Landing Pages)
El contenido de landing (textos, itinerarios, FAQs, etc.) se traduce automáticamente con Claude Haiku y se almacena en la columna `translations` JSONB de cada tabla.

**Columnas relevantes en `clientes`:**
- `preferred_language` (text, default "es") — idioma fuente del contenido
- `available_languages` (jsonb, default '["es"]') — idiomas habilitados en la landing
- `translations` (jsonb, default '{}') — traducciones de campos del cliente (hero, footer, whyus, etc.)

**Columna `translations` en `clientes`, `destinos`, `opiniones`:**
```json
{
  "en": {
    "hero_title": "Your dream trip",
    "itinerario": { "dias": [...] },
    "nombre": "Tokyo"
  },
  "ar": {
    "hero_title": "رحلة أحلامك",
    "itinerario": { "dias": [...] }
  },
  "_hashes": {
    "hero_title": "a1b2c3",
    "itinerario": "d4e5f6",
    "nombre": "g7h8i9"
  }
}
```

- Cada idioma target tiene un objeto con los campos traducidos
- `_hashes` almacena un hash del contenido original por campo. Si el hash no cambia, el campo no se re-traduce (ahorro de tokens)
- Los campos JSONB (itinerario, hotel, vuelos, faqs, etc.) se almacenan completos como objetos traducidos
- Las URLs de imágenes NO se traducen — se preservan del original en runtime

**Campos traducibles por tabla:**
| Tabla | Campos string | Campos JSONB |
|-------|--------------|--------------|
| `clientes` | hero_title, hero_subtitle, hero_description, hero_badge, hero_cta_text, hero_cta_text_secondary, about_title, about_text_1, about_text_2, cta_banner_title, cta_banner_description, cta_banner_cta_text, footer_text, footer_description, meta_title, meta_description | whyus_items |
| `destinos` | nombre, subtitle, tagline, badge, descripcion, descripcion_larga, duracion, categoria, pais, continente, dificultad | itinerario, hotel, vuelos, coordinador, incluido, no_incluido, faqs, clima, highlights, tags |
| `opiniones` | comentario | — |
