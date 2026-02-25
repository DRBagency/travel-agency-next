# DRB Agency - Contexto del Proyecto

> **Última actualización:** 24 Febrero 2026
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
- **Styling:** Tailwind CSS + CSS variables (landing theme) + inline styles (template port)
- **UI Components:** shadcn/ui + custom design system (DataTable, KPICard, ConfirmDialog, EmptyState)
- **Theme:** next-themes (dark/light mode toggle, SSR-safe, CSS variable injection)
- **Fonts:** Syne (display headings) + DM Sans (body) via next/font/google
- **i18n:** next-intl (cookie-based, sin prefijo URL)
- **Charts:** Recharts
- **Calendar:** FullCalendar
- **Animations:** Framer Motion (framer-motion@12.29.2) + Lottie (lottie-react)
- **Rive:** @rive-app/react-canvas (interactive login animations only)
- **Icons:** Lucide React
- **AI:** Anthropic Claude API (@anthropic-ai/sdk) — itineraries, recommendations, chatbot config, auto-translation

### Backend
- **Runtime:** Node.js (Edge Runtime selectivo)
- **API Routes:** Next.js App Router API
- **Authentication:** Supabase Auth + Custom cookies (NO NextAuth)

### Base de Datos
- **Database:** PostgreSQL (Supabase)
- **ORM:** Supabase Client (@supabase/supabase-js 2.93.2)
- **Migrations:** Supabase CLI (SQL manual)
- **RLS:** Habilitado en TODAS las 27 tablas (verificado 24 Feb 2026)
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
│   │   ├── destino/[slug]/    # Destination detail page (public)
│   │   ├── legal/             # Páginas legales dinámicas
│   │   └── [otros]
│   ├── components/
│   │   ├── landing/          # Landing components: 9 sections (Navbar, Hero, Stats, Destinations, WhyUs, Testimonials, CTABanner, Contact, Footer) + 7 micro-components (AnimateIn, Img, Accordion, TagChip, StatusBadge, EffortDots, GlowOrb) + theme (LandingThemeProvider, LandingGlobalStyles)
│   │   ├── ui/               # shadcn/ui + DataTable, KPICard, ConfirmDialog, EmptyState, DeleteWithConfirm, AnimatedSection, RiveAnimation
│   │   ├── ai/               # AI components (ItineraryGenerator, ChatbotConfig, AIDescriptionButton, AIEmailGenerator, AIPricingSuggestion, FreeChat, AIRecommendations, AIInsightsCard[compact])
│   │   ├── admin/            # Componentes admin (charts, dashboard, AdminShell, EdenChat, MountainBackground, DashboardBackground, AdminRightColumn)
│   │   ├── owner/            # Componentes owner (charts, LatestAgenciesTable, ExecutionLogsTable, OwnerSupportWidget, OwnerCalendarWidget)
│   │   └── ChatbotWidget.tsx # Widget flotante público para chatbot AI
│   ├── i18n/
│   │   └── request.ts        # Config next-intl (cookie NEXT_LOCALE)
│   ├── hooks/
│   │   └── useAutoTranslate.ts  # Hook auto-traducción AI (plan-gated)
│   ├── lib/
│   │   ├── emails/           # Sistema de emails
│   │   ├── billing/          # Funciones de billing
│   │   ├── social/           # OAuth helpers + API calls (Instagram, TikTok)
│   │   ├── owner/            # Funciones del owner (get-chart-data: 8 semanas, get-dashboard-metrics)
│   │   ├── supabase/         # Clients de Supabase
│   │   ├── vercel/          # Vercel API helpers (domain management)
│   │   ├── auto-translate.ts # Server-side AI translation (Claude Sonnet 4)
│   │   ├── translations.ts   # Translation runtime helpers (tr, makeTr, field maps)
│   │   ├── landing-theme.ts  # Theme palettes (light/dark) with CSS variable mapping
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
- **Landing i18n:** Per-client locale override via `preferred_language` column in `clientes` table. `page.tsx` loads ALL available language messages and wraps `HomeClient` with nested `NextIntlClientProvider`. Configurable in `/admin/mi-web` (marca section)
- **Landing multi-lang switching:** Dynamic `NextIntlClientProvider` inside `HomeClient` — when visitor changes language via Navbar, a `LangWrapper` component re-wraps content with the new locale's messages. All locale messages loaded server-side and passed as `allMessages` prop
- **Landing namespace:** `landing.*` keys (navbar, hero, destinations, testimonials, contact, footer, chatbot) — 80+ keys per locale

### Auto-Translation System (24 Feb 2026)
AI-powered content translation for landing pages. When admin saves content, Claude translates all text fields to selected languages and stores in `translations` JSONB column.

- **Database:** `translations JSONB DEFAULT '{}'` on `clientes`, `destinos`, `opiniones` tables
- **Structure:** `{ "en": { "hero_title": "...", "whyus_items": [...] }, "ar": { ... } }`
- **Server:** `src/lib/auto-translate.ts` — calls Claude Sonnet 4 API for translation, handles strings/JSONB/arrays
- **API:** `POST /api/admin/translate` — plan-gated to Grow/Pro plans
- **Hook:** `src/hooks/useAutoTranslate.ts` — `{ translating, translationError, isEligible, translate(fields) }`
- **Runtime:** `src/lib/translations.ts` — `tr(obj, field, lang, preferredLang)` + `makeTr(obj, lang, preferredLang)` for reading translations at render time
- **Integration:** Auto-fires after save in MiWebContent.tsx and DestinoEditor.tsx. Opiniones auto-translate server-side on insert/update
- **Plan gating:** Only Grow/Pro plans (matches existing `aiLocked` pattern). Start plan saves content but skips translation
- **Error handling:** Fire-and-forget — save always succeeds, translation failure shows amber warning

---

## BASE DE DATOS - TABLAS Y ESTADO (27 tablas, 24 Feb 2026)

### Tablas con CRUD completo (✅):
| Tabla | Panel | Ruta |
|-------|-------|------|
| `clientes` | Owner | `/owner/clientes` — Columnas notables: `domain_verified`, `profile_photo`, `onboarding_completed`, `onboarding_step`, `slug`, `hero_badge`, `hero_cta_text_secondary`, `hero_cta_link_secondary`, `whyus_items` (JSONB), `cta_banner_*`, `footer_description`, `dark_mode_enabled`, `meta_title`, `meta_description`, `translations` (JSONB) |
| `platform_settings` | Owner | `/owner/emails` |
| `billing_email_templates` | Owner | `/owner/emails` |
| `email_templates` | Admin | `/admin/emails` |
| `destinos` | Admin | `/admin/destinos` (card grid) + `/admin/destinos/[id]` (tabbed editor: 11 tabs). Expanded columns: `slug`, `subtitle`, `tagline`, `badge`, `descripcion_larga`, `galeria` (JSONB), `coordinador` (JSONB), `hotel` (JSONB), `vuelos` (JSONB), `incluido` (JSONB), `no_incluido` (JSONB), `salidas` (JSONB), `faqs` (JSONB), `clima` (JSONB), `tags` (JSONB), `highlights` (JSONB), `esfuerzo`, `grupo_max`, `edad_min`, `edad_max`, `precio_original`, `moneda`, `duracion`, `continente`, `dificultad`, `categoria`, `translations` (JSONB) |
| `opiniones` | Admin | `/admin/mi-web` (OpinionesManager, integrado en Mi Web). Expanded: `avatar_url`, `fecha_display`, `translations` (JSONB) |
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

### Tablas CRM (✅):
| Tabla | Panel | Ruta |
|-------|-------|------|
| `agency_customers` | Admin | `/admin/crm` (Kanban board, funnel chart, export CSV) |
| `agency_customer_activities` | Admin | `/admin/crm/[id]` (activity timeline) |

### Tablas Mensajería (✅):
| Tabla | Panel | Ruta |
|-------|-------|------|
| `contact_messages` | Admin | `/admin/mensajes` (MensajesContent — leer, marcar como leído). Landing form → API POST `/api/contact` |

### Tablas Tracking (✅):
| Tabla | Panel | Ruta |
|-------|-------|------|
| `page_visits` | Admin (header badge) | Tracking público via `/api/track`, lectura via `/api/admin/visits/active` + Realtime |
| `notifications` | Admin/Owner | `/api/notifications`, `/api/owner/notifications` |

### Tablas pendientes de limpieza (🗑️):
| Tabla | Estado | Acción |
|-------|--------|--------|
| `newsletter_subscribers` | **OBSOLETA** — era de la antigua landing page. Ahora el formulario de contacto va a `contact_messages` | Eliminar tabla + API route `/api/newsletter/subscribe` |
| `blog_posts` | **HUÉRFANA** — no tiene migración SQL, no tiene CRUD admin, no tiene API routes. Solo hay un `BlogSection.tsx` que lee datos que nunca se pueden crear | Eliminar tabla + componente `BlogSection.tsx` + referencias en `HomeClient.tsx` y `page.tsx`. O implementar CRUD completo si se quiere blog |

### Supabase Health (24 Feb 2026):
- **27 tablas** con RLS habilitado en todas
- **Security advisors:** Esperados — service_role "always true" policies en blog_posts/newsletter_subscribers (a eliminar), anon INSERT en contact_messages/page_visits (requerido para público), leaked password protection disabled (configurar)
- **Performance advisors:** 15 unused indexes en tablas de pocas filas (aceptable), multiple permissive policies en blog_posts (a eliminar con la tabla)
- **Migrations:** 23 archivos SQL en `supabase/migrations/`

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
- Contenido web (hero, CTA banner, why us, contacto, footer + AIDescriptionButton en campos de texto + auto-traducción AI)
- Destinos (CRUD + imágenes + activo/inactivo + visual card grid + DeleteWithConfirm + DestinoDescriptionField AI + DestinoPriceFieldWithAI + auto-traducción AI)
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

### ✅ Auto-Traducción Landing + UI/UX Fixes (24 Feb 2026):
- ✅ **Auto-Translation System**: `translations` JSONB column on `clientes`, `destinos`, `opiniones`. Claude Sonnet 4 translates on save (Grow/Pro only). `autoTranslateRecord()` in `src/lib/auto-translate.ts`. API: `POST /api/admin/translate`. Hook: `useAutoTranslate()`. Runtime: `tr()` + `makeTr()` helpers. Fire-and-forget after save
- ✅ **Multi-language landing switching**: All available language messages loaded server-side, dynamic `NextIntlClientProvider` in `HomeClient.tsx` wraps content with current locale on language change
- ✅ **Navbar persistence in destination pages**: Navbar rendered inside `DestinationDetail.tsx` (client component) with shared `currentLang` state for language switching
- ✅ **Footer in destination pages**: Full Footer component rendered in destination detail pages with all client data (brand, destinos, legal pages, social links)
- ✅ **Gallery redesign**: Split layout (65% main + 35% side thumbnails), 4-second auto-rotation, dot indicators, click-to-pause, "+N more" overlay, responsive mobile stacking
- ✅ **Effort dots centering**: `justifyContent: "center"` on effort dots container
- ✅ **Price badge contrast**: Strikethrough fontSize 13→16, opacity .55→.78, red textDecorationColor
- ✅ **BookingModal stepper**: Circle 34→42, fontSize 14→16, label fontSize 10→12, maxWidth 70→85
- ✅ **Removed "Sobre nosotros"**: Eliminated `about` section from Mi Web admin (was empty/unused)
- ✅ **`homeUrl` prop on Navbar**: Brand logo/name links to correct URL (preview vs production)

### 🐛 Bugs persistentes (pendientes de fix):
- **Bloque A #2 — "Volver" back URL**: En preview mode (`/preview/[slug]/destino/[destinoSlug]`), el botón "Volver" y el click en el nombre de la agencia redirigen al sitio corporativo (`travel-agency-next-ten.vercel.app`) en vez de a la landing del cliente. Necesita verificación del `homeUrl` prop
- **Bloque C #10 — Gallery sizing**: Las imágenes de la galería del destino siguen apareciendo estiradas/grandes. Necesitan dimensiones iguales al hero
- **Bloque D #15 — Multi-language toggle**: El cambio de idioma en la landing puede no funcionar completamente. Necesita testing después del fix del `LangWrapper`

### ⚠️ Fase D — Nuevas Secciones / Integraciones (parcial):
- ⏳ **D1 — Social Media Integration**: Código OAuth listo (social_connections table, OAuth library, API routes, UI). **Pendiente:** env vars Meta/TikTok (`INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET`, `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`), crear apps en Meta Developer + TikTok Developer, gráficas de rendimiento de posts
- ✅ **Más plantillas email**: Bienvenida, Recordatorio de viaje, Seguimiento post-viaje, Promoción (con SendPromocionButton). Total 6 templates (+ reserva_cliente, reserva_agencia)
- ✅ **Merge Opiniones en Mi Web**: OpinionesManager integrado en `/admin/mi-web`, ruta standalone `/admin/opiniones` eliminada (21 Feb 2026), API routes `/api/admin/opiniones` mantenidas para OpinionesManager
- ✅ **D2 — Coordinadores**: Integrado en destinos tabbed editor (tab Coordinador) — coordinador JSONB (nombre, avatar, rol, descripcion, idiomas[])
- ✅ **D3 — Vuelos y hoteles**: Integrado en destinos tabbed editor (tabs Vuelos + Hotel) — vuelos JSONB (arrival/return airports, note) + hotel JSONB (nombre, estrellas, imagen, descripcion, amenidades[])
- ✅ **D4 — FAQs por destino**: Integrado en destinos tabbed editor (tab FAQs) — faqs JSONB (question/answer pairs CRUD)
- 🚧 D5 pendiente (Depósitos/anticipos)

### ✅ Fase E — Plataforma Self-Service COMPLETADA (E1-E7) (22 Feb 2026):
- ✅ **E1 — Registro público**: drb.agency/admin como URL pública con opción de registrarse (email + contraseña), sin depender del owner
- ✅ **E2 — Onboarding wizard**: Flujo guiado post-registro: datos agencia → suscripción Stripe → conectar dominio → personalizar web → publicar
- ✅ **E3 — Conexión dominio self-service**: La agencia configura su propio dominio desde el panel (instrucciones CNAME + verificación automática)
- ✅ **E4 — Redirigir /owner**: Owner en URL definitiva
- ✅ **E5 — Pago suscripción integrado**: Stripe Checkout embebido en el flujo de registro, sin intervención manual
- ✅ **E6 — Setup Stripe Connect autoguiado**: Wizard paso a paso para que la agencia conecte Stripe Connect sola
- ✅ **E7 — Automatización Dominio Vercel**: API route `/api/admin/domain/add` + `/api/admin/domain/remove` + `/api/admin/domain/save` + `/api/admin/domain/verify` con Vercel API integration. Helper `src/lib/vercel/domains.ts` centraliza add/verify/remove/get. OnboardingWizard integra auto-add dominio en step 3. Editar dominio post-onboarding en `/admin/mi-web` (nueva sección Dominio). Env vars: VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_TEAM_ID. i18n: 15+ keys en ES/EN/AR
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

### ✅ Fase G completada — Landing Page Rediseño Completo (23 Feb 2026):
- ✅ **G1-G3 — 100% Landing Replacement**: Entire G2 landing replaced with new template port. 9 landing sections (LandingNavbar, LandingHero, LandingStats, LandingDestinations, LandingWhyUs, LandingTestimonials, LandingCTABanner, LandingContact, LandingFooter). 7 UI micro-components (AnimateIn, Img, Accordion, TagChip, StatusBadge, EffortDots, GlowOrb). Typography: Syne (display) + DM Sans (body) via next/font/google. Theme: next-themes + CSS variables + LandingThemeProvider + LandingGlobalStyles. Dark/light toggle in navbar
- ✅ **Database Migrations (4)**: `expand_destinos_v2` (25+ new columns: slug, subtitle, tagline, badge, descripcion_larga, galeria, coordinador, hotel, vuelos, incluido, no_incluido, salidas, faqs, clima, tags, highlights — all JSONB), `expand_clientes_v2` (hero_badge, hero_cta_text_secondary, whyus_items, cta_banner_*, footer_description, dark_mode_enabled, meta_title/description), `expand_opiniones_v2` (avatar_url, fecha_display), `auto_generate_destino_slug` (trigger function)
- ✅ **Destination Detail Page**: `/destino/[slug]/page.tsx` (server) + `DestinoDetail.tsx` (client). 8-tab layout: Itinerary, Hotel, Flight, Gallery, Included, Departures, Coordinator, FAQ. Split gallery (65%/35% + auto-rotate), quick stats bar, tags + effort dots, bottom CTA, persistent Navbar with lang switching, full Footer. Preview route at `/preview/[slug]/destino/[destinoSlug]`
- ✅ **Admin Destinos Tabbed Editor**: `/admin/destinos/[id]/page.tsx` + `DestinoEditor.tsx` (1460-line client component). 11 tabs: General, Pricing, Gallery, Itinerary, Hotel, Flights, Included, Departures, FAQs, Coordinator, Tags+Clima. API route `/api/admin/destinos/[id]/update` with typed field handling (STRING/NUMBER/BOOLEAN/JSONB). Unsplash picker integration. "Edit full page" link in destinos list
- ✅ **Mi Web Admin Expansion**: New sections in MiWebContent.tsx — WhyUs editor (6 cards × icon/title/desc, add/remove/reorder), CTA Banner (title/desc/cta), expanded Hero (badge + secondary CTA), expanded Footer (description), Global Config (dark_mode_enabled toggle, meta_title, meta_description). ALLOWED_FIELDS + JSONB/boolean handling in update route
- ✅ **i18n Expansion**: ~170 new keys across ES/EN/AR — `landing.*` namespace (stats, destinations, whyus, testimonials, ctaBanner, contact, destino detail), `admin.destinos` (76 keys for tabbed editor), `admin.miWeb` (new sections)
- ✅ **Cleanup**: Deleted 24 old G2 landing components (Hero, About, Contact, Footer, Navbar, Testimonials, DestinationsGrid, DestinationsBento, DestinationsFiltered, EditorialText, FullWidthBreak, NewsletterForm, StatsBar, ImageSlider, HomeClient + 9 landing sub-components: CursorGlow, GradientMesh, FloatingShapes, FloatingParticles, ScrollReveal, SectionDivider, TypewriterText, WordReveal, MagneticButton)

### ⏳ Pendiente config externa (código listo):
- **Social Media OAuth**: Crear app en Meta Developer (Instagram) + TikTok Developer, añadir env vars (`INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET`, `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`) en Vercel. Redirect URIs: `https://drb.agency/api/admin/social/oauth/{instagram,tiktok}/callback`

---

## ROADMAP DE FASES

### Orden de ejecución:
1. ~~Fase F (Visual/UX)~~ — **COMPLETADA**
2. ~~Fase E (Self-service)~~ — **COMPLETADA (E1-E7)** — 22 Feb 2026
3. ~~Fase G (Landing rediseño)~~ — **COMPLETADA (G1-G9)** — 23 Feb 2026
4. ~~Auto-Traducción + UI/UX Fixes~~ — **COMPLETADA** — 24 Feb 2026
5. **SIGUIENTE → Bugs persistentes** (A#2, C#10, D#15) + Limpieza DB (newsletter, blog_posts)
6. **SIGUIENTE → Bloque E** (#17 depósitos, #18 Stripe+Resend live, #19 features D2-D5, #20 portal cliente)
7. Fase D restante (D1 social env vars, D5 depósitos)
8. Fase G restante (G10 página reserva, G11 portal cliente final)
9. Fase H (Técnico) — Notificaciones, búsqueda, RGPD
10. Fase I (Futuro) — Cuando las anteriores estén sólidas

### Bloque E — Prioridades Inmediatas (25 Feb 2026)
| # | Feature | Descripción | Estado |
|---|---------|-------------|--------|
| E17 | Sistema de anticipos/depósitos | La agencia configura % de depósito y fecha límite para pago restante. El cliente final paga anticipo y el resto antes de fecha X | Pendiente |
| E18 | Stripe + Resend en producción | Cambiar de modo test a modo live. Configurar keys de producción, verificar webhooks, dominio Resend | Pendiente |
| E19 | Features D2-D5 mejoras | Revisar y mejorar coordinadores, vuelos, hoteles, FAQs que ya están implementados | Pendiente |
| E20 | Portal del cliente final | En la landing, el viajero accede con email y ve: reservas, itinerarios, estado de pago, chat con agencia | Pendiente |

### Fase D — Nuevas Secciones / Integraciones
| # | Feature | Descripción | Estado |
|---|---------|-------------|--------|
| D1 | Social Media completa | Conectar Instagram, Facebook, TikTok. Estadísticas de cuentas, gráficas de rendimiento de posts, métricas de engagement | Código OAuth listo, faltan env vars Meta/TikTok + gráficas de rendimiento |
| D2 | Sección de Coordinadores | Panel admin para gestionar coordinadores de viaje de la agencia (nombre, foto, bio, idiomas). Se muestran en landing en los destinos asignados | ✅ Integrado en destinos tabbed editor (tab Coordinador) |
| D3 | Vuelos y hoteles en destinos | Opción para que la agencia añade info de vuelos (aeropuertos recomendados, buscar vuelo) y hoteles a cada destino | ✅ Integrado en destinos tabbed editor (tabs Vuelos + Hotel) |
| D4 | FAQs por destino | Preguntas frecuentes editables por destino, visibles en la landing | ✅ Integrado en destinos tabbed editor (tab FAQs) |
| D5 | Sistema de depósitos/anticipos | La agencia configura % de depósito y fecha límite para pago restante. El cliente final paga anticipo (ej: 100€) y el resto antes de fecha X | Pendiente (→ E17) |

### ~~Fase E — Plataforma Self-Service (Autonomía Total)~~ — COMPLETADA (E1-E7) — 22 Feb 2026
| # | Feature | Descripción | Estado |
|---|---------|-------------|--------|
| E1 | Registro público de agencias | drb.agency/admin como URL pública con opción de registrarse por primera vez (email + contraseña), sin depender del owner | ✅ |
| E2 | Onboarding wizard | Flujo guiado post-registro: datos agencia → suscripción Stripe → conectar dominio → personalizar web → publicar | ✅ |
| E3 | Conexión de dominio self-service | La agencia configura su propio dominio desde el panel (instrucciones CNAME + verificación automática) | ✅ |
| E4 | Redirigir /owner | Mover owner a URL definitiva (ej: drb.agency/owner o platform.drb.agency) | ✅ |
| E5 | Pago suscripción integrado en registro | Stripe Checkout embebido en el flujo de registro, sin intervención manual | ✅ |
| E6 | Setup Stripe Connect autoguiado | Wizard paso a paso para que la agencia conecte Stripe Connect sola | ✅ |
| E7 | Automatización dominio Vercel | API route `/api/admin/domain/add` + `/remove` + `/save` + `/verify` con Vercel API integration. Helper `src/lib/vercel/domains.ts`. OnboardingWizard auto-add dominio step 3. Editar dominio post-onboarding en `/admin/mi-web`. Env vars: VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_TEAM_ID | ✅ |

### ~~Fase G — Landing Page Rediseño Completo~~ — COMPLETADA (G1-G9) — 23 Feb 2026
| # | Feature | Descripción | Estado |
|---|---------|-------------|--------|
| G1 | Rediseño UX/UI completo | 100% landing replacement: new template port (Syne + DM Sans, dark/light mode, glass-morphism navbar, parallax hero, glow orbs, 9 sections). next-themes + CSS variables + LandingThemeProvider | ✅ |
| G2 | Página de destino individual | /destino/[slug] with 8-tab detail page (Itinerary, Hotel, Flight, Gallery, Included, Departures, Coordinator, FAQ). Hero gallery, quick stats bar, tags + effort dots, bottom CTA | ✅ |
| G3 | Galería de fotos por destino | `galeria` JSONB column on destinos. Admin tabbed editor (tab Gallery). Carousel in destination detail page | ✅ |
| G4 | Características del destino | `tags` + `highlights` + `esfuerzo` JSONB/int columns. TagChip + EffortDots components. Admin tabbed editor (tab Tags + Clima) | ✅ |
| G5 | Itinerario visual mejorado | Enhanced itinerary tab in detail page with day-by-day timeline. Admin tabbed editor (tab Itinerario) | ✅ |
| G6 | Qué está incluido / No incluido | `incluido` + `no_incluido` JSONB columns. Admin tabbed editor (tab Incluido). Included/NotIncluded tab in detail page | ✅ |
| G7 | Por qué [nombre agencia] | `whyus_items` JSONB on clientes. LandingWhyUs section (6-card grid). Editable from Mi Web admin (WhyUs section editor with add/remove/reorder) | ✅ |
| G8 | Calendario de salidas | `salidas` JSONB column. Admin tabbed editor (tab Salidas with CRUD rows: date, status, price, spots). StatusBadge (confirmed/lastSpots/soldOut) in detail page Departures tab | ✅ |
| G9 | Vuelos + Hotel info | `vuelos` + `hotel` JSONB columns. Admin tabbed editor (tabs Vuelos + Hotel). Detail page tabs with airport info, hotel amenities | ✅ |
| G10 | Página de reserva completa | Flujo: ver destino → reservar → pagar. Cada paso con su propia página/redirección con toda la info | Pendiente (using existing BookingModal with Stripe) |
| G11 | Espacio personal cliente final | En la landing, el viajero accede con sus datos (email) y ve: sus reservas, itinerarios, documentos, estado de pago, chat con agencia | Pendiente |

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

### Componentes Landing (`src/components/landing/`):
| Componente | Tipo | Uso |
|------------|------|-----|
| `LandingNavbar` | Client | Fixed glass-morphism navbar: logo + links + lang/theme toggles + CTA. `homeUrl` prop for correct brand link. `onLangChange` callback for dynamic language switching |
| `LandingHero` | Client | Full-viewport centered hero: parallax bg, glow orbs, gradient text, dual CTAs, scroll indicator |
| `LandingStats` | Client | 4 stat cards (emoji + animated counter + label) |
| `LandingDestinations` | Client | Card grid with overlay text + tags + price. Click → `/destino/[slug]` |
| `LandingWhyUs` | Client | 6-card grid from `whyus_items` JSONB or i18n defaults |
| `LandingTestimonials` | Client | Carousel (1 at a time, auto-advance, dots navigation) |
| `LandingCTABanner` | Client | Full-width gradient card with heading + desc + lime CTA |
| `LandingContact` | Client | Centered card with form (name, email, phone, destination select, message) |
| `LandingFooter` | Client | 4-column (brand+desc, destinations, company, legal) + bottom bar |
| `LandingThemeProvider` | Client | next-themes wrapper + CSS variable injection from `landing-theme.ts` palettes |
| `LandingGlobalStyles` | Client | Template CSS classes (.navl, .dcard, .tab-btn, .glow, .floating, .noise-bg) as `<style>` tag |
| `AnimateIn` | Client | IntersectionObserver scroll animation wrapper (delay, from: bottom/left/right/scale) |
| `Img` | Client | Image with gradient fallback on error |
| `Accordion` | Client | FAQ accordion with chevron, max-height transition |
| `TagChip` | Client | Color-coded tag pill (label→color map) |
| `StatusBadge` | Client | Departure status (confirmed/lastSpots/soldOut) |
| `EffortDots` | Client | 5-dot physical effort indicator |
| `GlowOrb` | Client | Absolute-positioned blurred gradient circle |

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
