# DRB Agency — Agent Configurations

> Guía para que Claude Code trabaje de forma óptima en cada área del proyecto.

---

## Agent: Frontend Admin

**Scope:** `src/app/admin/`, `src/components/admin/`

**Contexto:**
- Panel para agencias (clientes de DRB). Cada agencia ve solo sus datos.
- Layout: AdminShell (sidebar colapsable + main + right column en xl+)
- Background: DashboardBackground.tsx (SVG montañas fixed)
- Right column: MountainBackground + perfil + EdenChat
- Todas las páginas usan `force-dynamic` + `getTranslations`

**Reglas:**
- Server Components por defecto
- Usar classes del design system (panel-card, kpi-card, panel-input, btn-primary)
- Dark mode: `bg-[#0a2a35]/80 backdrop-blur-sm` para cards
- i18n namespace: `admin.{seccion}`
- Delete actions: siempre `DeleteWithConfirm`
- Empty states: siempre `EmptyState`
- RTL: logical properties obligatorias

---

## Agent: Frontend Owner

**Scope:** `src/app/owner/`, `src/components/owner/`

**Contexto:**
- Panel para DRB Agency (superadmin). Ve TODOS los clientes.
- Layout: OwnerShell (mismo patrón que AdminShell)
- Dashboard compacto sin scroll (3 filas)
- Gráficas semanales (8 semanas)
- OwnerChat usa `/api/ai` con action `owner-chat` + platformContext

**Reglas:**
- Mismas reglas que Admin pero namespace `owner.{seccion}`
- No hay plan-gating (owner siempre tiene acceso completo)
- Métricas vienen de `getDashboardMetrics()` en `src/lib/owner/`
- Charts data de `getChartData()` en `src/lib/owner/get-chart-data.ts`

---

## Agent: API Routes

**Scope:** `src/app/api/`

**Contexto:**
- Next.js App Router API routes
- Supabase `supabaseAdmin` (service_role) para todas las queries
- Stripe Connect webhooks en `/api/stripe/connect/webhook`
- Stripe Billing webhooks en `/api/stripe/billing/webhook`
- AI routes en `/api/ai/route.ts` (actions: free-chat, owner-chat, itinerary, etc.)

**Reglas:**
- Validar inputs siempre
- Usar `supabaseAdmin` (nunca anon key)
- Return `NextResponse.json()` con status codes apropiados
- Error handling: try/catch con mensajes útiles

---

## Agent: i18n

**Scope:** `messages/`, `src/i18n/`

**Contexto:**
- 3 idiomas: ES (fuente de verdad), EN, AR
- ~1000+ keys por archivo
- Cookie `NEXT_LOCALE` sin prefijo URL

**Reglas:**
- SIEMPRE editar los 3 archivos
- Keys en español primero (es.json), luego traducir
- Estructura: `panel.seccion.key` (ej: `admin.crm.contactName`)
- Arabic: traducción profesional, RTL compatible
- Cuando Edit tool da duplicate match: dar más contexto surrounding

---

## Agent: Database

**Scope:** `supabase/migrations/`, `src/lib/supabase/`

**Contexto:**
- PostgreSQL via Supabase
- 17+ tablas con RLS habilitado
- `supabaseAdmin` bypasses RLS (service_role key)
- Migraciones SQL manuales

**Reglas:**
- RLS obligatorio en toda tabla nueva
- Política mínima: `service_role` puede todo
- Trigger `update_updated_at_column()` si tiene `updated_at`
- Foreign keys con ON DELETE apropiado
- Indexes en columnas de filtrado frecuente

---

## Agent: Styling

**Scope:** `src/app/globals.css`, `tailwind.config.js`

**Contexto:**
- Tailwind CSS con design system custom
- DRB colors: turquoise (#1CABB0), lime (#D4F24D), magenta (#E91E63)
- Dark mode con `dark:` prefix
- Glassmorphism en columna derecha (bg-white/25 backdrop-blur-lg)
- Cards principales: `bg-[#0a2a35]/80 backdrop-blur-sm` en dark

**Reglas:**
- CSS logical properties para RTL (text-start, ms-, ps-, start-0, end-0)
- No usar `text-left`, `ml-`, `pl-`, `left-`, `right-`
- Animations definidas en tailwind.config.js
- Custom classes en globals.css con @apply

---

## Workflow General

1. Leer archivos relevantes antes de modificar
2. Usar design system existente (no reinventar)
3. i18n en los 3 idiomas siempre
4. `npm run build` para verificar
5. Commit + push cuando el usuario lo pida
6. Actualizar CLAUDE.md al completar fases
