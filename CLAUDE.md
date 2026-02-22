# DRB Agency - Contexto del Proyecto

> **Última actualización:** 21 Febrero 2026
> **Estado:** En producción - Mejora continua activa
> **Documentación extendida:** /docs/

---

## VISIÓN GENERAL

DRB Agency es una plataforma SaaS multi-tenant B2B que proporciona software all-in-one para agencias de viajes pequeñas y medianas. Centraliza gestión web, reservas, pagos, operaciones y automatizaciones bajo un único panel.

**Propuesta de valor:** "Everything your agency needs, in one panel"

**Público objetivo:** Agencias de viajes pequeñas (1-5 empleados), medianas (5-20), emprendedores turismo. Enfoque: España, LATAM, mercado internacional.

**URLs:**
- Producción: https://drb.agency
- Staging: https://travel-agency-next-ten.vercel.app

---

## MODELO DE NEGOCIO

### Suscripciones SaaS (mensual):
- Start: 29€/mes (comisión 5%)
- Grow: 59€/mes (comisión 3%)
- Pro: 99€/mes (comisión 1%)

### Comisiones por reserva:
- % según plan sobre cada reserva procesada
- Cobro automático vía Stripe Connect

---

## PRINCIPIOS FUNDAMENTALES

1. **Zero Supabase Access:** Ni owner ni clientes acceden a Supabase directamente. TODO se gestiona desde UI.
2. **Todo editable desde UI:** Cada tabla DEBE tener CRUD completo en su panel correspondiente.
3. **Multi-tenant estricto:** Aislamiento total entre clientes.
4. **Server Components First:** `"use client"` solo cuando sea necesario.
5. **Mejora continua:** Nada es definitivo, todo es mejorable.
6. **B2B profesional:** Tono serio, confiable, no overselling.

---

## TECH STACK

### Frontend
- **Framework:** Next.js 16.1.6 (App Router)
- **React:** 19.2.3
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + custom design system (DataTable, KPICard, ConfirmDialog, EmptyState)
- **i18n:** next-intl (cookie-based, sin prefijo URL)
- **Charts:** Recharts
- **Calendar:** FullCalendar
- **Animations:** Framer Motion (framer-motion@12.29.2) + Lottie (lottie-react)
- **Rive:** @rive-app/react-canvas (interactive login animations only)
- **Icons:** Lucide React
- **AI:** Anthropic Claude API (@anthropic-ai/sdk) — itineraries, recommendations, chatbot config

### Backend
- **Runtime:** Node.js (Edge Runtime selectivo)
- **API Routes:** Next.js App Router API
- **Authentication:** Supabase Auth + Custom cookies (NO NextAuth)

### Base de Datos
- **Database:** PostgreSQL (Supabase)
- **ORM:** Supabase Client (@supabase/supabase-js 2.93.2)
- **Migrations:** Supabase CLI (SQL manual)
- **RLS:** Habilitado en TODAS las 17 tablas (verificado 21 Feb 2026)
- **Service Role:** `supabaseAdmin` para operaciones del servidor (service_role bypasses RLS)
- **Anon Key:** Solo usado client-side para Supabase Auth login + lectura pública destinos activos

### Pagos
- **Stripe Connect:** Reservas (agencia → cliente final). Webhook: `/api/stripe/connect/webhook`
- **Stripe Billing:** Suscripciones SaaS (DRB → agencia). Webhook: `/api/stripe/billing/webhook`
- **SDK:** stripe 20.2.0

### Email
- **Provider:** Resend (SDK 6.9.1)
- **Templates:** HTML dinámico con tokens en Supabase (NO react-email)
- **Dominio:** contact@drb.agency

### Deployment
- **Hosting:** Vercel (auto-deploy desde main)
- **CI/CD:** GitHub → Vercel

---

## ESTRUCTURA DE CARPETAS

```
travel-agency-next/
├── src/
│   ├── app/
│   │   ├── admin/             # Panel CLIENTE (agencia)
│   │   ├── owner/             # Panel OWNER (DRB Agency)
│   │   ├── api/               # API routes
│   │   ├── legal/             # Páginas legales dinámicas
│   │   └── [otros]
│   ├── components/
│   │   ├── ui/               # shadcn/ui + DataTable, KPICard, ConfirmDialog, EmptyState, DeleteWithConfirm, AnimatedSection, RiveAnimation
│   │   ├── ai/               # AI components (ItineraryGenerator, ChatbotConfig, AIDescriptionButton, AIEmailGenerator, AIPricingSuggestion, FreeChat, AIRecommendations, AIInsightsCard[compact])
│   │   ├── admin/            # Componentes admin (charts, dashboard, AdminShell, EdenChat, MountainBackground, DashboardBackground, AdminRightColumn)
│   │   ├── owner/            # Componentes owner (charts, LatestAgenciesTable, ExecutionLogsTable, OwnerSupportWidget, OwnerCalendarWidget)
│   │   └── ChatbotWidget.tsx # Widget flotante público para chatbot AI
│   ├── i18n/
│   │   └── request.ts        # Config next-intl (cookie NEXT_LOCALE)
│   ├── lib/
│   │   ├── emails/           # Sistema de emails
│   │   ├── billing/          # Funciones de billing
│   │   ├── social/           # OAuth helpers + API calls (Instagram, TikTok)
│   │   ├── owner/            # Funciones del owner (get-chart-data: 8 semanas, get-dashboard-metrics)
│   │   ├── supabase/         # Clients de Supabase
│   │   └── set-locale.ts     # Server action cambio idioma
│   └── middleware.ts
├── messages/
│   ├── es.json                # Español (fuente de verdad, ~1000 keys)
│   ├── en.json                # English
│   └── ar.json                # العربية (Arabic)
├── public/
├── supabase/migrations/
├── docs/                      # Documentación extendida
└── CLAUDE.md                  # Este archivo
```

---

## CONVENCIONES DE CÓDIGO

- **Rutas:** kebab-case (`/admin/stripe`, `/owner/emails`)
- **Componentes:** PascalCase (`AdminShell.tsx`)
- **Funciones:** camelCase (`getClientByDomain`)
- **Server Actions:** camelCase (`createCliente`)
- **Constantes:** UPPER_SNAKE_CASE (`PLAN_PRICES`)
- `export const dynamic = "force-dynamic"` para páginas con datos en tiempo real
- Server Actions en el mismo archivo cuando son específicos de la página
- **i18n Server Components:** `const t = await getTranslations('namespace');` (from `next-intl/server`)
- **i18n Client Components:** `const t = useTranslations('namespace');` (from `next-intl`)
- **CSS RTL:** Usar propiedades lógicas (`text-start`, `ms-`, `ps-`, `start-0`, `end-0`, `border-s`, `border-e`). NUNCA `text-left`, `ml-`, `pl-`, `left-`, `right-` en código nuevo

---

## ARQUITECTURA: DECISIONES CLAVE

### Multi-tenant por Dominio
Middleware detecta dominio → busca cliente → carga datos. Cada cliente tiene su propio dominio/subdominio.

### Separación Estricta Owner vs Cliente
- Owner: `/owner/*` — gestiona la plataforma
- Cliente: `/admin/*` — gestiona su agencia
- NO comparten sesiones, ni componentes de UI (salvo base)

### Stripe Connect + Billing Separados
- Connect = reservas de viajes (comisión automática a DRB)
- Billing = suscripciones SaaS (3 planes)

### Templates Email Dinámicos
HTML + tokens en Supabase, renderizado en servidor. Editables sin redeploy.

### Cookies Personalizadas
Sistema custom de cookies para auth de admin y owner (no NextAuth).

### Multi-idioma (next-intl)
- **Routing:** Cookie-based (`NEXT_LOCALE`), sin prefijo URL. URLs limpias: `/admin/*`, no `/es/admin/*`
- **Idiomas:** ES (default), EN, AR (con RTL)
- **Archivos:** `messages/es.json`, `messages/en.json`, `messages/ar.json` (~1000 keys cada uno)
- **RTL:** `<html dir={locale === 'ar' ? 'rtl' : 'ltr'}>`, fuente Noto Sans Arabic, CSS logical properties
- **Selector:** `<LanguageSelector />` en header de AdminShell y OwnerShell
- **Fechas:** `toLocaleDateString(locale)` con locale dinámico, date-fns con locale map
- **Landing i18n:** Per-client locale override via `preferred_language` column in `clientes` table. `page.tsx` loads locale-specific messages and wraps `HomeClient` with nested `NextIntlClientProvider`. Configurable in `/admin/mi-web` (marca section)
- **Landing namespace:** `landing.*` keys (navbar, hero, destinations, testimonials, about, contact, footer, chatbot) — 80+ keys per locale

---

## BASE DE DATOS - TABLAS Y ESTADO

### Tablas con CRUD completo (✅):
| Tabla | Panel | Ruta |
|-------|-------|------|
| `clientes` | Owner | `/owner/clientes` |
| `platform_settings` | Owner | `/owner/emails` |
| `billing_email_templates` | Owner | `/owner/emails` |
| `email_templates` | Admin | `/admin/emails` |
| `destinos` | Admin | `/admin/destinos` |
| `opiniones` | Admin | `/admin/mi-web` (OpinionesManager, integrado en Mi Web) |
| `paginas_legales` | Admin | `/admin/legales` |
| `calendar_events` | Admin | `/admin/calendario` |
| `documents` | Admin | `/admin/documentos` (crear, editar, eliminar, PDF) |
| `support_tickets` | Admin | `/admin/soporte` (crear, detalle, cerrar/reabrir) |
| `ticket_messages` | Admin | `/admin/soporte/[id]` (chat en tiempo real) |

### Tablas con UI parcial (⚠️):
| Tabla | Estado |
|-------|--------|
| `reservas` | Lectura + cambio estado inline en `/admin/reservas` (ReservasTable con DataTable) |

### Tablas con CRUD en Owner (✅):
| Tabla | Panel | Ruta |
|-------|-------|------|
| `automations` | Owner | `/owner/automatizaciones` (crear, activar/desactivar, eliminar) |
| `automation_executions` | Owner | `/owner/automatizaciones` (ExecutionLogsTable con DataTable) |

### Tablas AI (✅):
| Tabla | Panel | Ruta |
|-------|-------|------|
| `ai_chatbot_config` | Admin | `/admin/ai/chatbot` (configurar chatbot público) |
| `ai_itinerarios` | Admin | `/admin/ai/itinerarios` (guardar itinerarios generados) |

### Tablas Social (✅):
| Tabla | Panel | Ruta |
|-------|-------|------|
| `social_connections` | Admin | `/admin/social` (OAuth connect/disconnect, sync stats, recent posts) |

### Tablas Tracking (✅):
| Tabla | Panel | Ruta |
|-------|-------|------|
| `page_visits` | Admin (header badge) | Tracking público via `/api/track`, lectura via `/api/admin/visits/active` + Realtime |

### CHECKLIST AL AÑADIR TABLA NUEVA:
1. Crear migración SQL en `supabase/migrations/`
2. Ejecutar `supabase db push`
3. Habilitar RLS + políticas para `service_role`
4. Añadir trigger `update_updated_at_column()` si tiene `updated_at`
5. Crear UI completa: listado, creación, edición, eliminación
6. Implementar server actions (CREATE/UPDATE/DELETE)
7. Validaciones en frontend + error handling
8. Actualizar documentación

---

## ESTADO ACTUAL DE FEATURES

### ✅ Panel OWNER completado:
- Dashboard compacto sin scroll: 5 KPIs + gráficas semanales (8 semanas: MRR, clientes, reservas, RevenueBreakdown, TopDestinos) + LatestAgenciesTable + AIInsightsCard (compact) + OwnerSupportWidget + OwnerCalendarWidget
- Gestión de clientes (CRUD + auto-creación templates + tabbed detail: Info/Destinos/Reservas/AI con AIRecommendations)
- Emails de billing (3 templates + preview en modal) — fully i18n
- Monetización (MRR, desglose por planes, top comisiones con CommissionsTable DataTable, KPICards, ComparisonChart, ProjectionChart)
- Configuración Stripe (modo, keys, price IDs, webhooks)
- Automatizaciones (CRUD + ExecutionLogsTable con DataTable + DeleteWithConfirm)
- Soporte (tickets de clientes con SoporteTable DataTable)

### ✅ Panel CLIENTE completado:
- Contenido web (hero, nosotros, contacto + AIDescriptionButton en campos de texto)
- Destinos (CRUD + imágenes + activo/inactivo + visual card grid + DeleteWithConfirm + DestinoDescriptionField AI + DestinoPriceFieldWithAI)
- Reservas (ReservasTable DataTable con inline StatusCell + filtrado + export CSV/PDF + 3 KPICards + timeline visual en detalle)
- Opiniones (CRUD + rating + moderación + star distribution chart + DeleteWithConfirm — integrado en Mi Web via OpinionesManager)
- Emails (6 templates: reserva_cliente, reserva_agencia, bienvenida, recordatorio_viaje, seguimiento, promocion + preview en modal + EmailBodyWithAI + SendPromocionButton)
- Páginas legales (CRUD collapsible + editor HTML + DeleteWithConfirm)
- Stripe/Pagos (StripeTabs: Connect/Suscripción/Tarifas + onboarding + cambio plan + cancelar + reactivar)
- Documentos (presupuestos, contratos, facturas — crear, editar, eliminar, generar PDF con jsPDF + DataTable + DeleteWithConfirm)
- Soporte (tickets con chat — crear, ver detalle, enviar mensajes, cerrar/reabrir)
- ~~Analytics~~ (eliminado en Fase F — KPIs y charts integrados en dashboard principal)
- AI (Generador itinerarios + PDF export + Chatbot config + Asistente libre + Dashboard AI card)
- Social Media (Instagram + TikTok OAuth connect, profile/stats caching, recent posts grid, sync, disconnect. Facebook: URL only via Mi Web)

### ✅ Sistema de Emails:
- Emails de reservas (cliente + agencia, templates editables, tokens, branding)
- Emails de billing (bienvenida, cambio plan, cancelación, dominio verificado)

### ✅ Sistema de Pagos:
- Stripe Connect (onboarding, cobro reservas, comisión automática, webhook)
- Stripe Billing (3 planes, checkout, cambio, cancelación, reactivación, webhook)

### ✅ Pendientes menores completados:
- ✅ Preview de emails (owner y admin) — boton Preview con modal iframe
- ✅ Export reservas a CSV + PDF (con filtros aplicados)
- ✅ Comparativa mensual y proyección de ingresos en monetización

### ✅ Fase 1 completada:
- ✅ Gráficas avanzadas en ambos paneles (KPIs, desglose mensual, reservas owner)
- ✅ Calendario completo con Google Calendar
- ✅ Generador de documentos (presupuestos, contratos, facturas) con PDF
- ✅ Sistema de tickets completo con chat

### ✅ Fase 2 completada:
- ✅ Analytics avanzado con KPIs, filtros de fecha, tabla mensual y exports CSV/PDF
- ✅ Automatizaciones funcionales (CRUD + logs de ejecuciones)

### ✅ Fase 3 completada:
- ✅ Multi-idioma completo (ES/EN/AR) con next-intl — 1000+ keys traducidos
- ✅ LanguageSelector en header de ambos paneles
- ✅ RTL support para Árabe (CSS logical properties, fuente Noto Sans Arabic)
- ✅ Formateo de fechas/números locale-aware en todas las páginas
- ✅ Todas las páginas admin + owner + landing traducidas

### ✅ Fase 4 completada (AI + Design System + UX Upgrade):
- ✅ **AI Features** (Anthropic Claude API): Generador de itinerarios con PDF export, recomendaciones AI, configuración chatbot, chatbot público, asistente libre, AI inline helpers (descripción, pricing, emails, mi-web)
- ✅ **AI Database**: ai_chatbot_config + ai_itinerarios tables con RLS
- ✅ **ChatbotWidget**: Widget flotante público con rate limiting, contexto de agencia, FAQs
- ✅ **Design System**: DataTable (search/sort/pagination), KPICard (animated counters), ConfirmDialog, EmptyState, AnimatedSection, DeleteWithConfirm
- ✅ **Tailwind Premium**: Custom shadows (100-500), glassmorphism, premium border-radius
- ✅ **Owner Panel Upgrade**: 5 KPIs, 5 charts (MRR, clientes, reservas, RevenueBreakdown, TopDestinos), LatestAgenciesTable, ClienteTabs (4 tabs), CommissionsTable, ExecutionLogsTable, DataTable everywhere
- ✅ **Admin Panel Upgrade**: ReservasTable con inline StatusCell, StripeTabs (3 tabs), legales collapsible, status timeline en detalle reserva, DestinosChart en dashboard, AI quick access card, animate-fade-in + headers en ALL pages
- ✅ **Cross-cutting**: RTL logical properties in ALL custom components (0 violations), loading.tsx skeletons for admin/owner
- ✅ **Login Premium**: Rive animation full-screen + glassmorphism form + logo + welcome message en admin y owner login

### ✅ Fase 5 completada (Landing Page Premium + i18n):
- ✅ **Hero Premium**: Animated floating orbs, conic-gradient rotating background, grid pattern overlay, animated stat counters (IntersectionObserver + rAF), shimmer text glow, pulsing CTA (animate-pulse-glow), staggered badge entrance, scroll indicator
- ✅ **Testimonials Marquee**: Infinite horizontal scroll with two rows scrolling opposite directions, CSS mask fade edges, dynamic speed via CSS variable
- ✅ **DestinationsGrid Premium**: Staggered card entrance with custom framer-motion variants, hover lift with glow, image zoom on hover, animated reserve button
- ✅ **About Premium**: Animated stat counters, 6 feature icon cards with hover rotate, floating background orbs
- ✅ **Contact Premium**: Hover animations on contact items, success CheckCircle animation, glow button effect
- ✅ **Footer Premium**: Gradient accent line, social links with hover glow + scale, "Powered by DRB Agency", motion animations
- ✅ **Landing i18n**: Per-client language via `preferred_language` column in `clientes` table, nested NextIntlClientProvider, 80+ keys in `landing.*` namespace (ES/EN/AR), RTL `dir` wrapper, configurable from `/admin/mi-web`
- ✅ **Dropdown Contrast Fix**: CSS rules for `<option>` elements in dark mode (white-on-white text bug)

### ✅ Fase 6 completada (Admin Layout Redesign + Eden AI + Visual Upgrade):
- ✅ **Admin Layout Redesign**: Collapsible sidebar with pin/unpin (Framer Motion), right column on xl+ breakpoint, mobile drawer
- ✅ **AdminShell**: 3-column layout (sidebar | main content | right column), responsive behavior, no duplicate page titles
- ✅ **AdminRightColumn**: Profile card with avatar upload, edit profile modal (name, email, phone), notification bell, glassmorphism cards (bg-white/25 backdrop-blur-lg)
- ✅ **Eden AI Chat**: AI assistant in right column, free-chat via /api/ai, suggestion chips, typing indicator, glassmorphism chat bubbles (bg-white/30)
- ✅ **Mountain Landscape Backgrounds**: MountainBackground.tsx (vivid SVG for right column, sky gradient + 4 mountain layers + pines + moon), DashboardBackground.tsx (subtle SVG for main area, light/dark mode)
- ✅ **Profile Photo System**: Separate `profile_photo` column in clientes table, Supabase Storage bucket `profile-photos`, upload API `/api/admin/upload-avatar`
- ✅ **Supabase Migration**: `20260220100000_add_profile_photo_and_storage.sql` — profile_photo column + storage bucket + RLS policies
- ✅ **i18n Keys**: admin.eden namespace (welcome, chip1-4, placeholder, editProfile, photoUpdated, profileSaved, phone) in ES/EN/AR
- ✅ **Eden AI Visual**: Tried Rive animation (black bg issues), tried Spline 3D (watermark/bg issues) — currently simple icon+gradient header, pending better 3D/animation solution

### ⚠️ Fase D — Nuevas Secciones / Integraciones (parcial):
- ⏳ **D1 — Social Media Integration**: Código OAuth listo (social_connections table, OAuth library, API routes, UI). **Pendiente:** env vars Meta/TikTok (`INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET`, `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`), crear apps en Meta Developer + TikTok Developer, gráficas de rendimiento de posts
- ✅ **Más plantillas email**: Bienvenida, Recordatorio de viaje, Seguimiento post-viaje, Promoción (con SendPromocionButton). Total 6 templates (+ reserva_cliente, reserva_agencia)
- ✅ **Merge Opiniones en Mi Web**: OpinionesManager integrado en `/admin/mi-web`, ruta standalone `/admin/opiniones` eliminada (21 Feb 2026), API routes `/api/admin/opiniones` mantenidas para OpinionesManager
- 🚧 D2-D5 pendientes (Coordinadores, Vuelos/hoteles, FAQs por destino, Depósitos/anticipos)

### ✅ Fase E — Owner Panel Premium Upgrade (21 Feb 2026):
- ✅ **OwnerShell Rewrite**: 3-column layout matching AdminShell — collapsible sidebar (64px/240px) with Framer Motion pin/unpin (`drb_owner_sidebar_pinned`), right column 300px on xl+, DashboardBackground behind main, dynamic CSS variable margins
- ✅ **OwnerRightColumn**: MountainBackground + glassmorphism profile card (avatar "D", DRB Agency, ownerEmail, "Platform Owner" badge) + OwnerChat
- ✅ **OwnerChat (Eden AI)**: Platform copilot chat via `/api/ai` with `owner-chat` action, suggestion chips (Analizar MRR, Agencias en riesgo, Redactar email a agencia, Sugerir mejoras), platform metrics context from `getDashboardMetrics()`
- ✅ **API Route**: `owner-chat` action in `/api/ai/route.ts` — SaaS copilot system prompt (MRR, churn, retention, strategy, emails), MAX_TOKENS 2000
- ✅ **Mobile/Tablet**: Eden FAB (MessageCircle) in header opens right panel drawer, hamburger sidebar sheet
- ✅ **i18n**: `owner.eden` namespace (7 keys × 3 languages: welcome, placeholder, chip1-4, platformOwner)
- ✅ **Layout**: Server-side `getDashboardMetrics()` → `platformContext` string passed to OwnerShell
- ✅ **No plan-gating**: Owner panel has no `isAILocked` or Lock icons (owner always has full access)

### ✅ Fase F completada — Visual / UX Premium (21 Feb 2026):
- ✅ **F1 — DashboardBackground Rewrite**: SVG widescreen (1600×900) con angular peaked mountains (L-paths, no Q-curves), crescent moon (disc + shadow overlay + craters + lime radial glow), 24 stars, pine tree silhouettes. Dark mode: sky gradient #041820→#0C4551, 4 mountain layers opacity 0.15-0.22. Light mode: sky gradient #FFFFFF→#B3EFF2, 3 mountain layers opacity 0.14-0.30
- ✅ **F2-owner — Owner Dashboard Compacto**: Layout sin scroll en 3 filas — (1) Header + 5 KPIs, (2) Charts|LatestAgencies|Charts en grid 3 cols, (3) AIInsightsCard compact + OwnerSupportWidget + OwnerCalendarWidget. Queries: support_tickets (últimos 3) + calendar_events (próximos 3)
- ✅ **F4 — Eden AI Visual Fixes**: Header icon 16→12px, título 2xl→lg, bubbles bg-white/20 + border-white/15, chips text-[11px], typing dots w-1.5, input más compacto
- ✅ **F5 — Gráficas Semanales**: Admin + Owner charts cambiados de 6 meses a 8 semanas (subWeeks/startOfWeek/endOfWeek con weekStartsOn:1 Lunes). Labels "dd MMM". Proyección: 4 semanas futuras (regresión lineal)
- ✅ **F6 — Eliminar /admin/analytics**: Página eliminada, nav item eliminado de AdminShell, import BarChart3 limpiado
- ✅ **F7 — Filtros Reservas Colapsados**: Form de filtros en `<details>/<summary>` (collapsed by default) con icono Filter + i18n key "Filtros"
- ✅ **F8 — Contador de Visitas en Vivo**: `page_visits` table + Realtime + RPC `count_active_visitors`, `/api/track` público con rate limiting, `/api/admin/visits/active` auth'd, `LiveVisitorBadge` en header (emerald pill, pulsing dot, Realtime + 60s polling), tracking `useEffect` en `HomeClient.tsx`, i18n `onYourWeb` ES/EN/AR
- ✅ **Widget Opacity Fix**: panel-card/kpi-card dark mode cambiado de `bg-white/[0.06]` a `bg-[#0a2a35]/80 backdrop-blur-sm`. Light mode `bg-white/95`. panel-input dark `bg-[#0a2a35]/70`. Mejora legibilidad sobre mountain background

### ⏳ Pendiente config externa (código listo):
- **Social Media OAuth**: Crear app en Meta Developer (Instagram) + TikTok Developer, añadir env vars (`INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET`, `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`) en Vercel. Redirect URIs: `https://drb.agency/api/admin/social/oauth/{instagram,tiktok}/callback`

---

## ROADMAP DE FASES

### Orden sugerido de ejecución:
1. ~~Fase F (Visual/UX)~~ — **COMPLETADA**
2. Fase E (Self-service) — Crítico para escalar sin depender del owner
3. Fase G (Landing rediseño) — Lo más visible para el cliente final
4. Fase D (Nuevas secciones) — Coordinadores, vuelos, depósitos
5. Fase H (Técnico) — Notificaciones, búsqueda, RGPD
6. Fase I (Futuro) — Cuando las anteriores estén sólidas

### Fase D — Nuevas Secciones / Integraciones
| # | Feature | Descripción | Estado |
|---|---------|-------------|--------|
| D1 | Social Media completa | Conectar Instagram, Facebook, TikTok. Estadísticas de cuentas, gráficas de rendimiento de posts, métricas de engagement | Código OAuth listo, faltan env vars Meta/TikTok + gráficas de rendimiento |
| D2 | Sección de Coordinadores | Panel admin para gestionar coordinadores de viaje de la agencia (nombre, foto, bio, idiomas). Se muestran en landing en los destinos asignados | Nuevo |
| D3 | Vuelos y hoteles en destinos | Opción para que la agencia añade info de vuelos (aeropuertos recomendados, buscar vuelo) y hoteles a cada destino | Nuevo |
| D4 | FAQs por destino | Preguntas frecuentes editables por destino, visibles en la landing | Nuevo |
| D5 | Sistema de depósitos/anticipos | La agencia configura % de depósito y fecha límite para pago restante. El cliente final paga anticipo (ej: 100€) y el resto antes de fecha X | Nuevo |

### Fase E — Plataforma Self-Service (Autonomía Total)
| # | Feature | Descripción |
|---|---------|-------------|
| E1 | Registro público de agencias | drb.agency/admin como URL pública con opción de registrarse por primera vez (email + contraseña), sin depender del owner |
| E2 | Onboarding wizard | Flujo guiado post-registro: datos agencia → suscripción Stripe → conectar dominio → personalizar web → publicar |
| E3 | Conexión de dominio self-service | La agencia configura su propio dominio desde el panel (instrucciones CNAME + verificación automática) |
| E4 | Redirigir /owner | Mover owner a URL definitiva (ej: drb.agency/owner o platform.drb.agency) |
| E5 | Pago suscripción integrado en registro | Stripe Checkout embebido en el flujo de registro, sin intervención manual |
| E6 | Setup Stripe Connect autoguiado | Wizard paso a paso para que la agencia conecte Stripe Connect sola |
| E7 | Automatización dominio Vercel | Cuando la agencia conecta un dominio, llamar automáticamente a la API de Vercel para añadir el dominio al proyecto y configurar SSL. Eliminar paso manual de CNAME |

### Fase G — Landing Page Rediseño Completo
| # | Feature | Descripción |
|---|---------|-------------|
| G1 | Rediseño UX/UI completo | Landing page completamente nueva, premium, inspirada en WeRoad y otras agencias top |
| G2 | Página de destino individual | /destino/[slug] con toda la info: galería de fotos, características, itinerario visual, incluido/no incluido, coordinador, vuelos, FAQs |
| G3 | Galería de fotos por destino | Múltiples fotos editables por destino (no solo 1 imagen), carrusel/grid en landing |
| G4 | Características del destino | Tags editables tipo "¿Es este viaje para mí?": Fiesta y Nightlife, Relax, Naturaleza y Aventura, Ciudad y Culturas, Monumentos e Historia, Esfuerzo Físico (nivel), Tipo de viaje |
| G5 | Itinerario visual mejorado | Más visible y agradable de leer. Imagen principal por día. Mapa con flechas/rutas del recorrido |
| G6 | Qué está incluido / No incluido | Secciones editables desde admin: alojamiento, desayunos, transporte, guía, seguro, etc. |
| G7 | Por qué [nombre agencia] | Sección editable: grupos reducidos, cancelación gratuita, reserva con anticipo, etc. |
| G8 | Calendario de salidas | Fechas de salida con estado (confirmado, últimas plazas, agotado), franja de edad, precio, botón reservar con anticipo, "avísame" |
| G9 | Buscar vuelo | Sección con aeropuertos recomendados de llegada/regreso + CTA buscar vuelo |
| G10 | Página de reserva completa | Flujo: ver destino → reservar → pagar. Cada paso con su propia página/redirección con toda la info |
| G11 | Espacio personal cliente final | En la landing, el viajero accede con sus datos (email) y ve: sus reservas, itinerarios, documentos, estado de pago, chat con agencia |

### Fase H — Mejoras Técnicas / Infraestructura
| # | Feature | Descripción |
|---|---------|-------------|
| H1 | Notificaciones en tiempo real | Supabase Realtime para notificaciones push en el panel (nueva reserva, nuevo mensaje, etc.) |
| H2 | Búsqueda global mejorada | Buscador que busca en destinos, reservas, clientes, documentos, todo desde un único input |
| H3 | Dashboard drag & drop | Widgets del dashboard reorganizables por el usuario, guardar layout en preferencias |
| H4 | Legal / RGPD | Cumplimiento normativo para datos de clientes en Supabase: consentimiento, derecho al olvido, export de datos, política de privacidad automática |

### Fase I — Futuro (largo plazo)
| # | Feature | Descripción |
|---|---------|-------------|
| I1 | Eden AI 3D avatar | Buscar mejor solución que Spline/Rive para avatar interactivo |
| I2 | Marketing automation | Campañas de email automáticas + segmentación por pipeline CRM |
| I3 | Gestión de equipo | Multi-usuario por agencia, roles y permisos |
| I4 | Multi-moneda | EUR/USD/GBP + monedas LATAM y MENA |
| I5 | Pagos offline | Marcar reservas como pagadas fuera de Stripe |
| I6 | App nativa / PWA | Gestión móvil para la agencia |
| I7 | API pública | REST API documentada para integraciones |
| I8 | White-label | Branding completo personalizable |
| I9 | Pricing dinámico AI | AI sugiere precios según demanda/temporada |
| I10 | Inspiración continua | Revisar plantillas de webs de agencias de viajes, librerías, herramientas (WeRoad, Travelie, etc.) para mejorar continuamente |

---

## WORKFLOW DE DESARROLLO

### Nueva feature:
1. Planificar alcance + tablas/APIs
2. Migración SQL (si aplica) → `supabase db push`
3. Server Actions / API Routes
4. Frontend (CRUD completo + validaciones + loading + errors)
5. Testing manual
6. `git push origin main` (auto-deploy Vercel)
7. Actualizar docs

### Comandos frecuentes:
```bash
# Supabase
supabase db push
supabase migration list

# Stripe testing
stripe listen --forward-to localhost:3000/api/stripe/billing/webhook
stripe trigger customer.subscription.created

# Deploy
npm run build
git push origin main
```

### Pre-deploy checklist:
- Build funciona (`npm run build`)
- Sin errores TypeScript
- Migraciones aplicadas
- Env vars en Vercel
- Testing manual hecho

---

## MULTI-IDIOMA (IMPLEMENTADO)

**Idiomas:** ES (default), EN (internacional), AR (mercado MENA, con RTL)

### Arquitectura:
- **next-intl** con cookie `NEXT_LOCALE` (sin prefijo URL)
- `src/i18n/request.ts` — config de locale
- `messages/{es,en,ar}.json` — ~1000 keys organizados por dominio
- `src/lib/set-locale.ts` — server action para cambiar idioma
- `src/components/ui/LanguageSelector.tsx` — dropdown con banderas

### Estructura de keys:
```json
{
  "common": { "save", "cancel", "delete", ... },
  "auth": { "adminLogin": { ... }, "ownerLogin": { ... } },
  "admin": { "nav", "dashboard", "destinos", "reservas", "stripe", ... },
  "owner": { "nav", "dashboard", "clientes", "monetization", ... },
  "landing": { "navbar", "hero", "destinations", "testimonials", "about", "contact", "footer", "chatbot" },
  "notifications": { ... },
  "booking": { ... }
}
```

### Patrones de uso:
```tsx
// Server Component
import { getTranslations, getLocale } from 'next-intl/server';
const t = await getTranslations('admin.destinos');
const locale = await getLocale();

// Client Component
import { useTranslations, useLocale } from 'next-intl';
const t = useTranslations('admin.destinos');
const locale = useLocale();

// Interpolación
t('greeting', { name: 'DRB' })  // "Hola, {name}" → "Hola, DRB"
```

### RTL Support:
- `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>`
- CSS logical properties en TODO el código (text-start, ms-, ps-, start-0, end-0, border-s, border-e)
- Fuente: Noto Sans Arabic para `[dir="rtl"]`
- SheetContent side flip: `side={locale === "ar" ? "right" : "left"}`

---

## DESIGN SYSTEM

**Estado actual:** Premium design implementado con design system propio.

### Colores DRB:
- Turquesa primario: `drb-turquoise` (50-950 scale, base #1CABB0)
- Lima acento: `drb-lime` (#D4F24D)
- Magenta acento: `drb-magenta` (#E91E63)
- Dark mode con `dark:` prefix en todo el código

### Componentes Design System (`src/components/ui/`):
| Componente | Tipo | Uso |
|------------|------|-----|
| `DataTable` | Client | Tabla con search, sort, pagination, export CSV |
| `KPICard` | Client | Card con animated counter, icon, accent color |
| `ConfirmDialog` | Client | Modal confirmación con variants (danger/warning) |
| `DeleteWithConfirm` | Client | Wrapper de ConfirmDialog para server actions |
| `EmptyState` | Client | Estado vacío con icon, title, description, action + framer-motion entrance |
| `AnimatedSection` | Client | Viewport-triggered animation (framer-motion) |
| `DashboardCard` | Server | Card de navegación con icon + hover |
| `NotificationBell` | Client | Campana de notificaciones con badge count |

### Componentes Admin (`src/components/admin/`):
| Componente | Tipo | Uso |
|------------|------|-----|
| `AdminShell` | Client | Layout principal admin: sidebar + main + right column |
| `AdminRightColumn` | Client | Columna derecha: perfil + Eden AI chat |
| `EdenChat` | Client | Chat AI asistente con /api/ai free-chat |
| `MountainBackground` | Client | SVG paisaje montañas para columna derecha |
| `DashboardBackground` | Client | SVG widescreen montañas angulares + luna + estrellas + pinos (fixed, full viewport) |

### Componentes Owner (`src/components/owner/`):
| Componente | Tipo | Uso |
|------------|------|-----|
| `OwnerShell` | Client | Layout principal owner: sidebar colapsable + main + right column |
| `OwnerRightColumn` | Client | Columna derecha: perfil owner + Eden AI chat |
| `OwnerChat` | Client | Chat AI copiloto plataforma con /api/ai owner-chat |
| `OwnerSupportWidget` | Server | Widget compacto últimos 3 tickets de soporte (patrón RecentMessagesWidget) |
| `OwnerCalendarWidget` | Server | Widget compacto próximos 3 eventos calendario (patrón UpcomingEventsWidget) |
| `OwnerCharts` | Client | 5 gráficas semanales (MRR, clientes, reservas, breakdown, top destinos) |

### Patrones UI:
- **Wrapper pages:** `<div className="space-y-{6,8} animate-fade-in">`
- **Headers:** `<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">`
- **Subtitles:** `<p className="text-gray-400 dark:text-white/40">`
- **Cards:** `panel-card` class (light: bg-white/95, dark: bg-[#0a2a35]/80 backdrop-blur-sm, border, rounded)
- **KPI Cards:** `kpi-card` class (same as panel-card base + hover effects)
- **Inputs:** `panel-input` class (dark: bg-[#0a2a35]/70)
- **Badges:** `badge-success`, `badge-warning`, `badge-danger`, `badge-info`
- **Buttons:** `btn-primary` class
- **Table rows:** `table-row` class with hover
- **Loading:** `loading.tsx` with `animate-pulse` skeletons
- **Delete actions:** Always use `DeleteWithConfirm` component

### Animations (tailwind.config.js):
- `animate-float`, `animate-float-slow`, `animate-float-slower` — floating background orbs
- `animate-pulse-glow` — pulsing glow effect for CTAs
- `animate-shimmer` — shimmer text/gradient effect
- `animate-marquee`, `animate-marquee-reverse` — infinite horizontal scroll (testimonials)
- `animate-gradient-shift` — moving gradient backgrounds
- `animate-spin-slow` — slow rotation (decorative elements)

### CSS Utility Classes (globals.css):
- `.shimmer-text` — animated gradient text shimmer
- `.gradient-border` — animated gradient border with mask-composite
- `.hero-glow-btn` — hover glow pseudo-element for buttons
- `.marquee-mask` — fade edge mask for marquee containers
- `.text-glow` — text shadow glow effect

### Shadows (tailwind.config.js):
- `shadow-100` to `shadow-500` (progressive elevation)
- `shadow-card-hover` for card hover state

---

## VISIÓN DE NEGOCIO (Resumen)

**Misión:** Democratizar la tecnología para agencias de viajes, permitiendo que negocios pequeños y medianos compitan con grandes operadores.

### Roadmap por año:
- **2026-2027 (Consolidación):** 100 agencias, €50K MRR. Rediseño UX, multi-idioma, CRM básico.
- **2027-2028 (Expansión):** 500 agencias, €200K MRR. LATAM, MENA, app móvil, API pública.
- **2028-2029 (Dominio):** 2,000 agencias, €500K MRR. AI-powered, chatbot, pricing dinámico.
- **2029-2030 (Ecosystem):** 5,000+ agencias, €1M+ MRR. Fintech, marketplace, formación.

### ICP (Ideal Customer Profile):
- **Primario:** Agencia pequeña (1-5 empleados, 10-50 reservas/mes) → Plan Start
- **Secundario:** Agencia mediana (5-20 empleados, 50-200 reservas/mes) → Plan Grow/Pro
- **Terciario:** Emprendedor nuevo desde cero → Plan Start + soporte

### Mercados prioritarios:
1. España (~3,000 agencias, objetivo 10%)
2. LATAM - México, Argentina, Colombia (~15,000, objetivo 5%)
3. MENA - EAU, Arabia Saudí, Qatar (~5,000, objetivo 3%)

### Competencia directa:
- TravelgateX (enterprise, caro), Trekksoft (tours), Zaui (outdoors)
- **Ventaja DRB:** 10x más barato, setup 1 día vs 3 meses, todo-en-uno, soporte ES/AR

### GTM Strategy:
- Inbound 70% (SEO, content, webinars, free trial)
- Partnerships 20% (asociaciones, proveedores, influencers)
- Outbound 10% (LinkedIn, cold email, ferias)

### Métricas North Star:
- MRR, Net Revenue Retention >100%, CAC Payback <6 meses, LTV/CAC >3x

---

## ONBOARDING DE CLIENTES (Resumen)

**Meta:** Web publicada + primera reserva en <7 días.

### 5 Fases:
1. **Pre-venta:** Lead → responder <2h → demo 30min → propuesta
2. **Contratación:** Firma contrato → solicitar datos (logo, textos, IBAN) → crear en /owner/clientes → enviar accesos
3. **Setup técnico:** Kickoff call 45min → personalizar contenido → Stripe Connect onboarding → configurar dominio (subdominio DRB o dominio propio vía CNAME a cname.vercel-dns.com)
4. **Testing & Publicación:** Testing interno → testing con cliente (tarjeta test 4242...) → Go Live
5. **Post-launch:** Seguimiento día 1-7 → acompañamiento mes 1 → optimización mes 2-3 → relación largo plazo

### KPIs onboarding:
- Time to publish: <7 días
- Time to first booking: <14 días
- Activation rate: >90%
- 60-day retention: >85%

---

## VENTAS (Resumen)

### Pain points del comprador:
- Sin web o web mala, gestión con Excel/WhatsApp, sin pagos online, competencia grande

### Pricing strategy:
- **Start (29€):** Agencia nueva, <10 reservas/mes
- **Grow (59€):** Agencia establecida, 10-50 reservas/mes (80% de ventas aquí)
- **Pro (99€):** Agencia grande, >50 reservas/mes

### Descuentos permitidos:
- Primer mes 50% (adquisición), pago anual 20% off, referidos 1 mes gratis
- NUNCA bajar pricing base

### Pipeline: Lead → Demo agendada (40%) → Propuesta (70%) → Cierre (50%) = 14% overall

### Secuencia emails: Intro (D0) → Caso éxito (D2) → Video demo (D4) → Oferta (D7) → Breakup (D10)

---

## PARTNERSHIPS (Resumen)

### 5 tipos de partners:
1. **Asociaciones sector** (CEAV, IATA): Awareness, sponsor €2-5K/año
2. **Proveedores tech** (hostings, freelancers): 20% comisión recurrente
3. **Instituciones educativas:** Licencias estudiante 50% off
4. **Influencers:** 30% comisión por 12 meses
5. **Proveedores viajes** (hoteles, aerolíneas): Marketplace futuro

### Programa de afiliados:
- 30% del MRR recurrente por 12 meses
- Pago automático vía Stripe Connect
- Chargeback si cliente cancela en meses 1-3

### Partner tiers (futuro):
- Bronze (1-5 clientes, 20%) → Silver (6-20, 25%) → Gold (21-50, 30%) → Platinum (50+, 35%)

---

## DOCUMENTACIÓN EXTENDIDA

Para contexto profundo, consultar `/docs/`:
- `PROJECT_OVERVIEW.md` - Visión general y propuesta de valor
- `TECH_STACK.md` - Stack tecnológico y convenciones
- `CURRENT_STATE.md` - Estado actual de features
- `DATABASE_SCHEMA.md` - Schema y checklist tablas
- `ARCHITECTURE_DECISIONS.md` - Decisiones arquitectónicas
- `DEVELOPMENT_WORKFLOW.md` - Flujo de desarrollo
- `BUSINESS_VISION.md` - Visión de negocio completa
- `CLIENT_ONBOARDING.md` - Proceso de onboarding detallado
- `SALES_PLAYBOOK.md` - Playbook de ventas completo
- `PARTNERSHIP_STRATEGY.md` - Estrategia de partnerships
