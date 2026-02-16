# Database Schema - Supabase PostgreSQL

> **Última actualización:** 10 Febrero 2026
> **Estado:** Schema estable - Extensible

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

### `platform_settings`
**Editable desde:** `/owner/emails` | **Estado:** ✅ Formulario completo

### `billing_email_templates`
**Editable desde:** `/owner/emails` | **Estado:** ✅ Editor completo

### `email_templates`
**Editable desde:** `/admin/emails` | **Estado:** ✅ Editor completo

### `destinos`
**Editable desde:** `/admin/destinos` | **Estado:** ✅ CRUD completo

### `reservas`
**Editable desde:** `/admin/reservas` | **Estado:** ⚠️ Solo lectura

### `opiniones`
**Editable desde:** `/admin/opiniones` | **Estado:** ✅ CRUD completo

### `paginas_legales`
**Editable desde:** `/admin/legales` | **Estado:** ✅ CRUD completo

### `calendar_events`
**Editable desde:** `/admin/calendario` | **Estado:** 🔄 En desarrollo

### `documents`
**Editable desde:** `/admin/documentos` | **Estado:** 🔄 En desarrollo

### `support_tickets`
**Editable desde:** `/admin/soporte` y `/owner/soporte` | **Estado:** 🔄 En desarrollo

### `ticket_messages`
**Editable desde:** Mismo que support_tickets | **Estado:** 🔄 En desarrollo

### `automations`
**Editable desde:** `/owner/automatizaciones` | **Estado:** ❌ Sin UI funcional

### `automation_executions`
**Editable desde:** N/A (solo logs) | **Estado:** ❌ Sin UI

## 🌍 PREPARACIÓN MULTI-IDIOMA

### Tabla propuesta: `translations`

CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  language TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(table_name, record_id, field_name, language)
);

**Uso:**
- Campos traducibles: `nombre`, `descripcion`, `titulo`, `contenido`, etc.
- Idioma por defecto: español (guardado en tabla principal)
- Otros idiomas: guardados en `translations`
