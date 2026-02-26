# Estado Actual del Proyecto

> **Ultima actualizacion:** 26 Febrero 2026
> **Estado:** Produccion activa - Fase E completada (E1-E7) + Fase F + G + Auto-Traduccion completadas

## FUNCIONALIDADES COMPLETADAS

### Panel OWNER (/owner)

#### Dashboard (`/owner`)
- Dashboard compacto sin scroll: 5 KPIs + graficas semanales (8 semanas: MRR, clientes, reservas, RevenueBreakdown, TopDestinos)
- LatestAgenciesTable + AIInsightsCard (compact) + OwnerSupportWidget + OwnerCalendarWidget
- Premium greeting con fecha locale-aware

#### Gestion de Clientes (`/owner/clientes`)
- DataTable con search, sort, pagination
- Crear nueva agencia (`/owner/clientes/nuevo`)
- Detalle con ClienteTabs: Info | Destinos | Reservas | AI (con AIRecommendations)
- Auto-creacion de templates por defecto
- Estado Stripe y suscripciones visibles

#### Emails de Billing (`/owner/emails`)
- Configuracion global (logo, email from, footer)
- 3 templates: bienvenida, cambio plan, cancelacion
- Tokens dinamicos documentados
- Preview en modal iframe
- Fully i18n (ES/EN/AR)

#### Monetizacion (`/owner/monetizacion`)
- 3 KPICards (MRR, comisiones total, count planes)
- Desglose por planes (Start/Grow/Pro)
- CommissionsTable con DataTable (top agencias)
- ComparisonChart + ProjectionChart

#### Soporte (`/owner/soporte`)
- DataTable con tickets de todas las agencias
- KPI cards (open, in_progress, closed)

#### Automatizaciones (`/owner/automatizaciones`)
- CRUD completo con DeleteWithConfirm
- Logs de ejecuciones (ExecutionLogsTable con DataTable)
- Activar/desactivar automations

#### Calendario (`/owner/calendario`)
- Google Calendar integration (shared CalendarioContent component)

#### Configuracion Stripe (`/owner/stripe`)
- Modo actual (TEST/LIVE), API Keys, Price IDs
- Webhook secrets, enlaces a Stripe Dashboard

### Panel CLIENTE (/admin)

#### Dashboard (`/admin`)
- 4 KPICards animados (facturado, reservas, ticket medio, destinos activos)
- 3 charts semanales (reservas, ingresos, proyeccion revenue — 8 semanas)
- Navigation cards a todas las secciones
- Ultimas reservas
- Live visitor tracking badge (emerald pill, pulsing dot, Realtime + polling)

#### Contenido Web (`/admin/mi-web`)
- Editor completo: hero, WhyUs, CTA Banner, contacto, redes sociales, footer, global config
- Color picker, logo upload, Unsplash image picker
- AIDescriptionButton en campos de texto
- OpinionesManager integrado (star rating distribution, visual review cards, CRUD + publish/unpublish + DeleteWithConfirm)
- Domain management section (edit domain, Vercel API automation, CNAME/TXT verification)
- **Idiomas:** Selector de idioma preferido + idiomas disponibles (ES/EN/AR)
- **Traducir todo:** Boton bulk translate con progreso en vivo, orchestracion client-side, fieldGroup splitting
- Auto-traduccion on save por seccion (Grow/Pro only)

#### Destinos (`/admin/destinos`)
- Visual card grid con imagenes, hover effects, gradient overlays
- CRUD completo + DeleteWithConfirm
- Activar/desactivar
- DestinoDescriptionField AI + DestinoPriceFieldWithAI

#### Reservas (`/admin/reservas`)
- KPICards (facturado, pagadas, ticket medio)
- Filtros colapsados (estado, busqueda, fecha) en `<details>/<summary>`
- Export CSV + PDF
- Detalle de reserva (`/admin/reserva/[id]`) con timeline visual
- ReservasTable con DataTable + inline StatusCell

#### Emails (`/admin/emails`)
- 6 templates: reserva_cliente, reserva_agencia, bienvenida, recordatorio_viaje, seguimiento, promocion
- Preview en modal iframe
- Tokens dinamicos
- EmailBodyWithAI + SendPromocionButton

#### Paginas Legales (`/admin/legales`)
- CRUD completo collapsible con editor HTML
- DeleteWithConfirm

#### Documentos (`/admin/documentos`)
- 3 tipos: presupuesto, contrato, factura
- DocumentosTable con DataTable
- Crear, editar, eliminar + PDF generation (jsPDF)
- DeleteWithConfirm en detalle

#### Soporte (`/admin/soporte`)
- Tickets con KPI cards
- Crear ticket, ver detalle, chat en tiempo real
- Cerrar/reabrir tickets

#### Calendario (`/admin/calendario`)
- Google Calendar integration
- Crear/editar/eliminar eventos

#### Stripe/Pagos (`/admin/stripe`)
- StripeTabs: Connect | Suscripcion | Tarifas
- Connect onboarding, estado, verificacion
- Suscripcion: activar, cambiar plan, cancelar, reactivar
- Fee breakdown por plan

#### AI Features (`/admin/ai`)
- Generador de itinerarios con Claude API + PDF export (`/admin/ai/itinerarios`)
- Configuracion de chatbot AI (`/admin/ai/chatbot`)
- Asistente libre (FreeChat)
- AI inline helpers: AIDescriptionButton, AIPricingSuggestion, AIEmailGenerator en campos de texto
- Dashboard AI quick access card
- EdenChat (right column assistant via /api/ai free-chat)

#### Social Media (`/admin/social`)
- Instagram + TikTok OAuth connect/disconnect (codigo listo, pendiente env vars Meta/TikTok)
- Profile/stats caching, recent posts grid, sync
- Facebook: URL only via Mi Web
- Table: `social_connections`

### Integrations

#### Vercel API Domain Management
- Automatizacion de dominios via API de Vercel
- Alta automatica de dominio custom al proyecto Vercel
- Configuracion SSL automatica
- CNAME/TXT verification desde `/admin/mi-web`
- Eliminacion de paso manual de CNAME

#### Stripe
- **Stripe Connect:** Onboarding, cobro reservas, comision automatica, webhook (`/api/stripe/connect/webhook`)
- **Stripe Billing:** 3 planes (Start/Grow/Pro), checkout, cambio, cancelacion, reactivacion, webhook (`/api/stripe/billing/webhook`)
- Stripe Billing + Connect integrados en onboarding wizard (Fase E)

#### Anthropic Claude AI (`/api/ai` + `/api/admin/translate`)
- Generador de itinerarios
- Recomendaciones AI para agencias (en ClienteTabs)
- Configuracion de chatbot AI
- Chatbot publico (ChatbotWidget) con rate limiting y contexto de agencia
- Asistente libre (FreeChat)
- AI inline helpers (descripcion, pricing, emails, mi-web)
- Owner copilot (OwnerChat) con metricas de plataforma
- **Auto-traduccion landing**: Claude Haiku 4.5 traduce contenido a idiomas seleccionados. Endpoints: `/api/admin/translate` (per-section), `/api/admin/translate/list` (list records), `/api/admin/translate/record` (per-fieldGroup). Content hashing, client-side orchestration, 1 AI call per serverless invocation

#### Resend Email
- Provider: Resend (SDK 6.9.1)
- Dominio: contact@drb.agency
- Templates HTML dinamicos con tokens en Supabase

### Design System

#### Componentes UI (`src/components/ui/`)
| Componente | Tipo | Uso |
|------------|------|-----|
| `DataTable` | Client | Tabla con search, sort, pagination, export CSV, empty state |
| `KPICard` | Client | Card con animated counter, icon, accent color, gradient variant |
| `ConfirmDialog` | Client | Modal confirmacion con variants (danger/warning), spinner pending state |
| `DeleteWithConfirm` | Client | Wrapper de ConfirmDialog para server actions |
| `EmptyState` | Client | Estado vacio con icon, title, description, action + framer-motion entrance |
| `AnimatedSection` | Client | Viewport-triggered animation (framer-motion, up/down/left/right) |
| `DashboardCard` | Server | Card de navegacion con icon + hover |
| `RiveAnimation` | Client | Rive interactive animation (login screens) |

#### Componentes Admin (`src/components/admin/`)
| Componente | Tipo | Uso |
|------------|------|-----|
| `AdminShell` | Client | Layout 3 columnas: sidebar colapsable + main + right column |
| `AdminRightColumn` | Client | Columna derecha: perfil + Eden AI chat |
| `EdenChat` | Client | Chat AI asistente con /api/ai free-chat |
| `MountainBackground` | Client | SVG paisaje montanas vivido para columna derecha |
| `DashboardBackground` | Client | SVG widescreen montanas angulares + luna + estrellas + pinos (fixed, full viewport) |

#### Componentes Owner (`src/components/owner/`)
| Componente | Tipo | Uso |
|------------|------|-----|
| `OwnerShell` | Client | Layout 3 columnas: sidebar colapsable + main + right column |
| `OwnerRightColumn` | Client | Columna derecha: perfil owner + Eden AI chat |
| `OwnerChat` | Client | Chat AI copiloto plataforma con /api/ai owner-chat |
| `OwnerSupportWidget` | Server | Widget compacto ultimos 3 tickets |
| `OwnerCalendarWidget` | Server | Widget compacto proximos 3 eventos |
| `OwnerCharts` | Client | 5 graficas semanales (MRR, clientes, reservas, breakdown, top destinos) |

### Cross-cutting
- **i18n Panel**: 1000+ keys en ES/EN/AR con next-intl (cookie-based `NEXT_LOCALE`, sin prefijo URL)
- **i18n Landing**: Per-client locale via `preferred_language` + `available_languages` en tabla clientes. Cookie separada `LANDING_LOCALE`. 80+ keys en `landing.*` namespace
- **Auto-Traduccion**: Contenido dinamico (textos, itinerarios, FAQs, hotel, etc.) traducido con Claude Haiku 4.5 y almacenado en columna `translations` JSONB. Content hashing para evitar re-traducir contenido sin cambios. Plan-gated Grow/Pro
- **RTL**: CSS logical properties en TODOS los componentes (shadcn + custom). 0 violations
- **Loading**: Skeleton loading.tsx para admin y owner
- **Animations**: animate-fade-in en TODAS las paginas, framer-motion AnimatedSection
- **Headers**: Consistente text-2xl + text-gray-400 en todas las paginas

### Sistema de Emails
- Emails de reservas (cliente + agencia, templates editables, tokens, branding)
- Emails de billing (bienvenida, cambio plan, cancelacion, dominio verificado)
- Emails de agencia: bienvenida, recordatorio_viaje, seguimiento, promocion (con SendPromocionButton)
- Preview en modal para ambos paneles

### Sistema de Pagos
- Stripe Connect (onboarding, cobro reservas, comision automatica, webhook)
- Stripe Billing (3 planes, checkout, cambio, cancelacion, reactivacion, webhook)

### Base de Datos - Tablas con UI completa

#### Tablas con CRUD completo:
| Tabla | Panel | Ruta |
|-------|-------|------|
| `clientes` | Owner | `/owner/clientes` (CRUD + tabs + AI) |
| `platform_settings` | Owner | `/owner/emails` |
| `billing_email_templates` | Owner | `/owner/emails` |
| `email_templates` | Admin | `/admin/emails` |
| `destinos` | Admin | `/admin/destinos` |
| `opiniones` | Admin | `/admin/mi-web` (OpinionesManager, integrado en Mi Web) |
| `paginas_legales` | Admin | `/admin/legales` |
| `calendar_events` | Admin+Owner | `/admin/calendario` + `/owner/calendario` |
| `documents` | Admin | `/admin/documentos` (CRUD + PDF) |
| `support_tickets` | Admin+Owner | `/admin/soporte` + `/owner/soporte` |
| `ticket_messages` | Admin | `/admin/soporte/[id]` |
| `automations` | Owner | `/owner/automatizaciones` (CRUD) |
| `automation_executions` | Owner | `/owner/automatizaciones` (logs) |

#### Tablas con UI parcial:
| Tabla | Estado |
|-------|--------|
| `reservas` | Lectura + cambio estado inline en `/admin/reservas` (ReservasTable con DataTable) |

#### Tablas AI:
| Tabla | Panel | Ruta |
|-------|-------|------|
| `ai_chatbot_config` | Admin | `/admin/ai/chatbot` (configurar chatbot publico) |
| `ai_itinerarios` | Admin | `/admin/ai/itinerarios` (guardar itinerarios generados) |

#### Tablas Social:
| Tabla | Panel | Ruta |
|-------|-------|------|
| `social_connections` | Admin | `/admin/social` (OAuth connect/disconnect, sync stats, recent posts) |

#### Tablas Tracking:
| Tabla | Panel | Ruta |
|-------|-------|------|
| `page_visits` | Admin (header badge) | Tracking publico via `/api/track`, lectura via `/api/admin/visits/active` + Realtime |

## FASES COMPLETADAS

### Fase 1 completada:
- Graficas avanzadas en ambos paneles (KPIs, desglose mensual, reservas owner)
- Calendario completo con Google Calendar
- Generador de documentos (presupuestos, contratos, facturas) con PDF
- Sistema de tickets completo con chat

### Fase 2 completada:
- Analytics avanzado con KPIs, filtros de fecha, tabla mensual y exports CSV/PDF
- Automatizaciones funcionales (CRUD + logs de ejecuciones)

### Fase 3 completada:
- Multi-idioma completo (ES/EN/AR) con next-intl — 1000+ keys traducidos
- LanguageSelector en header de ambos paneles
- RTL support para Arabe (CSS logical properties, fuente Noto Sans Arabic)
- Formateo de fechas/numeros locale-aware en todas las paginas
- Todas las paginas admin + owner + landing traducidas

### Fase 4 completada (AI + Design System + UX Upgrade):
- **AI Features** (Anthropic Claude API): Generador de itinerarios con PDF export, recomendaciones AI, configuracion chatbot, chatbot publico, asistente libre, AI inline helpers (descripcion, pricing, emails, mi-web)
- **AI Database**: ai_chatbot_config + ai_itinerarios tables con RLS
- **ChatbotWidget**: Widget flotante publico con rate limiting, contexto de agencia, FAQs
- **Design System**: DataTable, KPICard, ConfirmDialog, EmptyState, AnimatedSection, DeleteWithConfirm, RiveAnimation
- **Tailwind Premium**: Custom shadows (100-500), glassmorphism, premium border-radius
- **Owner Panel Upgrade**: 5 KPIs, 5 charts, LatestAgenciesTable, ClienteTabs (4 tabs), CommissionsTable, ExecutionLogsTable, DataTable everywhere
- **Admin Panel Upgrade**: ReservasTable con inline StatusCell, StripeTabs (3 tabs), legales collapsible, status timeline en detalle reserva, DestinosChart en dashboard, AI quick access card
- **Cross-cutting**: RTL logical properties in ALL custom components (0 violations), loading.tsx skeletons
- **Login Premium**: Rive animation full-screen + glassmorphism form + logo + welcome message

### Fase 5 completada (Landing Page Premium + i18n):
- **Hero Premium**: Animated floating orbs, conic-gradient, grid pattern overlay, animated stat counters, shimmer text glow, pulsing CTA, staggered badge entrance, scroll indicator
- **Testimonials Marquee**: Infinite horizontal scroll with two rows, CSS mask fade edges
- **DestinationsGrid Premium**: Staggered card entrance, hover lift with glow, image zoom on hover
- **About Premium**: Animated stat counters, 6 feature icon cards with hover rotate, floating background orbs
- **Contact Premium**: Hover animations on contact items, success animation, glow button effect
- **Footer Premium**: Gradient accent line, social links with hover glow + scale
- **Landing i18n**: Per-client language via `preferred_language`, 80+ keys in `landing.*` namespace

### Fase 6 completada (Admin Layout Redesign + Eden AI + Visual Upgrade):
- **AdminShell**: 3-column layout (sidebar | main | right column), collapsible sidebar with pin/unpin
- **AdminRightColumn**: Profile card with avatar upload, edit profile modal, notification bell, glassmorphism cards
- **Eden AI Chat**: AI assistant in right column, free-chat, suggestion chips, typing indicator
- **MountainBackground + DashboardBackground**: SVG mountain landscapes
- **Profile Photo System**: Separate `profile_photo` column, Supabase Storage bucket, upload API
- **OwnerShell Rewrite**: 3-column layout matching AdminShell, collapsible sidebar with Framer Motion
- **OwnerRightColumn + OwnerChat**: Platform copilot with metrics context

### Fase D completada (parcial):
- **D1 — Social Media Integration**: Codigo OAuth listo (social_connections table, OAuth library, API routes, UI para Instagram + TikTok). **Pendiente:** env vars Meta/TikTok en Vercel, crear apps en Meta Developer + TikTok Developer
- **6 templates email**: reserva_cliente, reserva_agencia, bienvenida, recordatorio_viaje, seguimiento, promocion (con SendPromocionButton + EmailBodyWithAI)
- **Opiniones merged en Mi Web**: OpinionesManager integrado en `/admin/mi-web`, ruta standalone `/admin/opiniones` eliminada

### Fase E completada (E1-E7) — Plataforma Self-Service:
- **E1 — Registro publico**: drb.agency/admin como URL publica con opcion de registrarse (email + contrasena)
- **E2 — Onboarding wizard**: Flujo guiado post-registro: datos agencia -> suscripcion Stripe -> conectar dominio -> personalizar web -> publicar
- **E3 — Dominio self-service**: La agencia configura su propio dominio desde el panel (instrucciones CNAME + verificacion automatica)
- **E4 — Redirigir /owner**: Owner en URL definitiva
- **E5 — Stripe Billing en registro**: Stripe Checkout embebido en el flujo de registro
- **E6 — Stripe Connect autoguiado**: Wizard paso a paso en onboarding
- **E7 — Automatizacion dominio Vercel**: Llamada automatica a API de Vercel para anadir dominio al proyecto + SSL. Domain editing en `/admin/mi-web`

### Fase F completada — Visual / UX Premium:
- **F1 — DashboardBackground Rewrite**: SVG widescreen (1600x900) con angular peaked mountains, crescent moon, 24 stars, pine trees. Dark/light mode variants
- **F2 — Owner Dashboard Compacto**: Layout sin scroll en 3 filas: Header+KPIs | Charts+LatestAgencies | AIInsights+SupportWidget+CalendarWidget
- **F4 — Eden AI Visual Fixes**: Header compacto, bubbles glassmorphism, chips mas pequenos
- **F5 — Graficas Semanales**: Admin + Owner charts cambiados de 6 meses a 8 semanas (lunes-domingo). Proyeccion: 4 semanas futuras (regresion lineal)
- **F6 — Eliminar /admin/analytics**: Pagina eliminada, nav item eliminado de AdminShell. KPIs y charts integrados en dashboard principal
- **F7 — Filtros Reservas Colapsados**: Form de filtros en `<details>/<summary>` con i18n
- **F8 — Contador de Visitas en Vivo**: `page_visits` table + Realtime + RPC, `/api/track` publico, LiveVisitorBadge en header
- **Widget Opacity Fix**: panel-card/kpi-card dark mode: `bg-[#0a2a35]/80 backdrop-blur-sm`. Light mode: `bg-white/95`

## PENDIENTE CONFIG EXTERNA (codigo listo)

- **Social Media OAuth**: Crear app en Meta Developer (Instagram) + TikTok Developer, anadir env vars (`INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET`, `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`) en Vercel. Redirect URIs: `https://drb.agency/api/admin/social/oauth/{instagram,tiktok}/callback`

## NO IMPLEMENTADO (Roadmap futuro)

- CRM de clientes finales
- Marketing automation
- Gestion de equipo/empleados
- App movil nativa
- API publica para integraciones
- White-label personalizado
- Multi-moneda
- Pagos offline
- Sistema de depositos/anticipos (Fase D5)
- Notificaciones en tiempo real (Fase H1)
- Busqueda global mejorada (Fase H2)
- Dashboard drag & drop (Fase H3)
- Legal / RGPD (Fase H4)

### Fase G completada (Landing Page Rediseno + Auto-Traduccion):
- Rediseno completo landing page (9 secciones, nuevo template, dark/light mode)
- Pagina detalle destino con 8 tabs (itinerario, hotel, vuelos, galeria, incluido, salidas, coordinador, FAQ)
- Admin destinos tabbed editor (11 tabs)
- D2 Coordinadores, D3 Vuelos/Hotel, D4 FAQs — integrados en destinos

### Auto-Traduccion completada (24-26 Feb 2026):
- Auto-traduccion con Claude Haiku 4.5 (on save + bulk "Traducir todo")
- Columna `translations` JSONB en clientes, destinos, opiniones
- Content hashing para evitar re-traducir contenido sin cambios
- Client-side orchestration con fieldGroup splitting (1 AI call por funcion serverless)
- Un idioma por llamada (evita truncamiento por limite output tokens)
- Tag colors preservados entre idiomas
- Imagenes de itinerario/hotel/coordinador preservadas en traducciones
- BookingModal traducido a arabe
- Footer traducido con descripcion + nombres destinos
- Cookie separada LANDING_LOCALE para evitar interferencia con panel admin
