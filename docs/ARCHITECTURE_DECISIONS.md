# Architecture Decisions - DRB Agency

> **Última actualización:** 10 Febrero 2026

## 🏗️ Decisiones Arquitectónicas Clave

### 1. Multi-tenant por Dominio

**Decisión:** Cada cliente tiene su propio dominio/subdominio
**Razón:** Branding personalizado + SEO individual
**Implementación:** Middleware detecta dominio → busca cliente → carga datos

### 2. Separación Estricta Owner vs Cliente

**Decisión:** Dos paneles completamente separados
**Razón:** Claridad de roles + seguridad

**NO se mezclan:**
- ❌ Owner no accede vía /admin
- ❌ Cliente no accede vía /owner
- ❌ No comparten sesiones
- ❌ No comparten componentes de UI (salvo base)

### 3. Stripe: Connect + Billing Separados

**Decisión:** Usar dos productos de Stripe para dos flujos diferentes

#### Stripe Connect (Agencia → Cliente final)
**Para:** Reservas de viajes
**Webhook:** `/api/stripe/connect/webhook`

#### Stripe Billing (DRB → Agencia)
**Para:** Suscripciones SaaS
**Webhook:** `/api/stripe/billing/webhook`

### 4. Templates de Email Dinámicos (NO React Email)

**Decisión:** HTML + tokens en Supabase, renderizado en servidor
**Razón:** Editabilidad sin redeploy

### 5. Zero Supabase Access

**Decisión:** NINGÚN usuario accede a Supabase Dashboard directamente
**Razón:** Seguridad + UX + escalabilidad

#### Cuando se añade una columna:

✅ HACER:
1. Migración SQL
2. Añadir campo al formulario del panel
3. Actualizar server action
4. Validaciones en frontend

❌ NO HACER:
- Asumir edición desde Supabase Dashboard
- Dejar campos sin UI de gestión

### 6. Server Components First

**Decisión:** Usar Server Components por defecto, Client Components solo cuando sea necesario

### 7. Cookies Personalizadas vs NextAuth

**Decisión:** Sistema custom de cookies para autenticación
**Razón:** Simplicidad para este caso de uso

### 8. Force Dynamic en Páginas con Datos en Tiempo Real

**Decisión:** Usar `export const dynamic = "force-dynamic"` en páginas que muestran datos actualizados

### 9. Migraciones SQL Manuales (No ORM Migrations)

**Decisión:** Migraciones SQL escritas a mano con Supabase CLI

### 10. Vercel Edge Runtime Selectivo

**Decisión:** Edge runtime solo para rutas específicas
