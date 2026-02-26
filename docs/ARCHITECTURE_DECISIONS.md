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

### 11. Auto-Traducción: JSONB column + Claude Haiku + Client-side Orchestration

**Decisión:** Traducir contenido de landing con IA y almacenar en columna `translations` JSONB
**Razón:** El contenido de la landing (itinerarios, FAQs, descripciones) es dinámico y específico de cada agencia. No se puede usar archivos JSON estáticos como en el panel admin.

**Arquitectura (evolucionada tras múltiples iteraciones):**

1. **Almacenamiento:** Columna `translations JSONB` en `clientes`, `destinos`, `opiniones`. Estructura: `{ "en": { campo: valor }, "ar": { campo: valor }, "_hashes": { campo: hash } }`

2. **Modelo:** Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) — rápido, barato, suficiente calidad para traducción
   - Sin fallback a Sonnet (causaba timeouts dobles)
   - SDK timeout: 150s, maxRetries: 2 (para 529/503)

3. **Un idioma por llamada:** Haiku tiene límite de 8192 tokens de salida. Un itinerario grande traducido a 2 idiomas excede ese límite. Solución: traducir a EN primero, luego a AR en llamada separada

4. **Client-side orchestration ("Traducir todo"):** El cliente (MiWebContent.tsx) controla el flujo:
   - Obtiene lista de records desde `/api/admin/translate/list`
   - Para cada record, divide en fieldGroups: "strings" + cada campo JSONB individual
   - Cada llamada POST a `/api/admin/translate/record` = exactamente 1 campo × 1 idioma × 1 llamada AI
   - Progreso en vivo: "2/9 — Tokio (itinerario)..."
   - **Razón:** Vercel serverless tiene timeout fijo. Si una función hace N llamadas AI secuenciales, puede exceder el timeout. 1 llamada AI por función = predecible

5. **Content hashing:** Cada campo se hashea antes de traducir. El hash se almacena en `_hashes`. En traducciones posteriores, los campos sin cambios se saltan (0 tokens). Reduce costes drásticamente

6. **Preservación de imágenes:** Las URLs de imágenes en JSONB traducido se pierden (no son texto traducible). `DestinationDetail.tsx` hace merge de `imagen`/`avatar` del original al traducido en runtime

7. **Plan gating:** Solo Grow/Pro. Start plan guarda contenido pero no traduce

**Lecciones aprendidas (cronología de problemas resueltos):**
- `maxDuration` en Vercel es OBLIGATORIO para funciones > 10s (default es 10s en Hobby, 15s en Pro)
- Anthropic API 529 (overloaded) es frecuente — necesita maxRetries
- Modelo fallback (Haiku→Sonnet) duplica el tiempo peor-caso — eliminado
- Traducir múltiples idiomas en una llamada puede exceder max_tokens
- Funciones serverless con múltiples llamadas AI secuenciales siempre fallan — usar orchestración cliente
