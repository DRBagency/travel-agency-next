# Integraciones — DRB Agency

> **Última actualización:** 2026-02-26

## Integraciones Activas

### 1. Stripe (Pagos)
- **Stripe Connect:** Cobro de reservas con comisión automática
- **Stripe Billing:** Suscripciones SaaS (3 planes)
- **SDK:** stripe 20.2.0
- **Detalles:** Ver `docs/PAYMENTS.md`

### 2. Supabase (Base de Datos + Auth)
- **PostgreSQL:** 30 tablas con RLS
- **Auth:** Login admin/owner via Supabase Auth + cookies custom
- **Storage:** Bucket `profile-photos` para avatares
- **Realtime:** Suscripciones para `page_visits` (visitantes en vivo)
- **SDK:** @supabase/supabase-js 2.93.2

### 3. Anthropic Claude (AI)
- **Sonnet 4:** Itinerarios, chatbot, recomendaciones, free-chat
- **Haiku 4.5:** Auto-traducción de contenido
- **SDK:** @anthropic-ai/sdk ^0.76.0
- **Detalles:** Ver `docs/AI-FEATURES.md`

### 4. Google Calendar
- **OAuth 2.0** para conectar calendario del admin/owner
- **Lib:** `src/lib/google-calendar.ts`
- **API Routes:** `/api/admin/calendar/oauth/*` y `/api/owner/calendar/oauth/*`
- **UI:** FullCalendar (@fullcalendar) con vista día/semana/mes
- **SDK:** googleapis 171.4.0

### 5. Resend (Email)
- **SDK:** resend 6.9.1
- **Dominio:** contact@drb.agency
- **Templates:** HTML dinámico con tokens, guardados en Supabase
- **Tipos:** reserva_cliente, reserva_agencia, bienvenida, recordatorio_viaje, seguimiento, promocion, magic_link (portal)
- **Billing emails:** bienvenida, cambio plan, cancelación
- **Portal email:** Magic link con branding de agencia (logo, color primario, traducciones ES/EN/AR inline)

### 6. Vercel API (Dominios)
- **Helper:** `src/lib/vercel/domains.ts`
- **Operaciones:** add, verify, remove, get domain
- **Self-service:** Agencias configuran su dominio desde el panel
- **Env vars:** `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`

### 7. Unsplash (Imágenes)
- **API:** `/api/admin/unsplash/search`
- **UI:** `UnsplashPicker.tsx` en Mi Web y editor de destinos
- **Env var:** `UNSPLASH_ACCESS_KEY`

## Integraciones Pendientes

### Social Media (D1) — Código listo, faltan env vars

| Red Social | OAuth Start | Callback | Estado |
|------------|------------|----------|--------|
| Instagram | `/api/admin/social/oauth/instagram/start` | `.../callback` | Falta `INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET` |
| TikTok | `/api/admin/social/oauth/tiktok/start` | `.../callback` | Falta `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` |
| Facebook | Solo URL manual en Mi Web | N/A | Funcional |

**Tabla:** `social_connections` — OAuth tokens, profile data, stats cache
**UI:** `/admin/social` → `SocialContent.tsx` (connect/disconnect, sync stats, recent posts)
**Cron:** `/api/cron/social-token-refresh` (diario 03:00 UTC)

**Para activar:**
1. Crear app en Meta Developer Portal (Instagram)
2. Crear app en TikTok Developer Portal
3. Añadir env vars en Vercel
4. Redirect URIs: `https://drb.agency/api/admin/social/oauth/{instagram,tiktok}/callback`

> Última actualización: 2026-03-01
