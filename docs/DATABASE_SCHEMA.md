# Database Schema - Supabase PostgreSQL

> **Última actualización:** 22 Febrero 2026
> **Estado:** Schema estable - 17+ tablas con RLS

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

## 📈 TABLAS TRACKING

### `page_visits`
**Auto-tracked via:** `/api/track` | **Estado:** ✅ Tracking automático

## 🌍 MULTI-IDIOMA

> **Nota:** El sistema multi-idioma fue implementado usando **next-intl** con archivos JSON (`messages/es.json`, `messages/en.json`, `messages/ar.json`), no con una tabla `translations` en base de datos. No se necesita tabla de traducciones en Supabase.
