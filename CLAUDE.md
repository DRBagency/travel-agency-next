# DRB Agency - Contexto del Proyecto

> **Última actualización:** 18 Febrero 2026
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
- **UI Components:** shadcn/ui
- **i18n:** next-intl (cookie-based, sin prefijo URL)
- **Charts:** Recharts
- **Calendar:** FullCalendar
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (Edge Runtime selectivo)
- **API Routes:** Next.js App Router API
- **Authentication:** Supabase Auth + Custom cookies (NO NextAuth)

### Base de Datos
- **Database:** PostgreSQL (Supabase)
- **ORM:** Supabase Client (@supabase/supabase-js 2.93.2)
- **Migrations:** Supabase CLI (SQL manual)
- **RLS:** Habilitado en TODAS las 14 tablas (verificado 18 Feb 2026)
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
│   │   ├── ui/               # shadcn/ui + LanguageSelector
│   │   ├── admin/            # Componentes admin
│   │   └── owner/            # Componentes owner (charts)
│   ├── i18n/
│   │   └── request.ts        # Config next-intl (cookie NEXT_LOCALE)
│   ├── lib/
│   │   ├── emails/           # Sistema de emails
│   │   ├── billing/          # Funciones de billing
│   │   ├── owner/            # Funciones del owner
│   │   ├── supabase/         # Clients de Supabase
│   │   └── set-locale.ts     # Server action cambio idioma
│   └── middleware.ts
├── messages/
│   ├── es.json                # Español (fuente de verdad, ~780 keys)
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
- **Archivos:** `messages/es.json`, `messages/en.json`, `messages/ar.json` (~780 keys cada uno)
- **RTL:** `<html dir={locale === 'ar' ? 'rtl' : 'ltr'}>`, fuente Noto Sans Arabic, CSS logical properties
- **Selector:** `<LanguageSelector />` en header de AdminShell y OwnerShell
- **Fechas:** `toLocaleDateString(locale)` con locale dinámico, date-fns con locale map

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
| `opiniones` | Admin | `/admin/opiniones` |
| `paginas_legales` | Admin | `/admin/legales` |
| `calendar_events` | Admin | `/admin/calendario` |
| `documents` | Admin | `/admin/documentos` (crear, editar, eliminar, PDF) |
| `support_tickets` | Admin | `/admin/soporte` (crear, detalle, cerrar/reabrir) |
| `ticket_messages` | Admin | `/admin/soporte/[id]` (chat en tiempo real) |

### Tablas con UI parcial (⚠️):
| Tabla | Estado |
|-------|--------|
| `reservas` | Solo lectura en `/admin/reservas` |

### Tablas con CRUD en Owner (✅):
| Tabla | Panel | Ruta |
|-------|-------|------|
| `automations` | Owner | `/owner/automatizaciones` (crear, activar/desactivar, eliminar) |
| `automation_executions` | Owner | `/owner/automatizaciones` (tabla de logs) |

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
- Dashboard con métricas (clientes, MRR, reservas, comisiones) + 3 gráficas (MRR, clientes, reservas)
- Gestión de clientes (CRUD + auto-creación templates)
- Emails de billing (3 templates + preview en modal)
- Monetización (MRR, desglose por planes, top comisiones, comparativa mensual, proyección ingresos)
- Configuración Stripe (modo, keys, price IDs, webhooks)
- Automatizaciones (CRUD + logs de ejecuciones)

### ✅ Panel CLIENTE completado:
- Contenido web (hero, nosotros, contacto)
- Destinos (CRUD + imágenes + activo/inactivo)
- Reservas (visualización + filtrado + export CSV/PDF)
- Opiniones (CRUD + rating + moderación)
- Emails (2 templates: reserva_cliente, reserva_agencia + preview en modal)
- Páginas legales (CRUD + editor HTML)
- Stripe/Pagos (Connect onboarding, suscripción, cambio plan, cancelar, reactivar)
- Documentos (presupuestos, contratos, facturas — crear, editar, eliminar, generar PDF con jsPDF)
- Soporte (tickets con chat — crear, ver detalle, enviar mensajes, cerrar/reabrir)

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
- ✅ Multi-idioma completo (ES/EN/AR) con next-intl — 780+ keys traducidos
- ✅ LanguageSelector en header de ambos paneles
- ✅ RTL support para Árabe (CSS logical properties, fuente Noto Sans Arabic)
- ✅ Formateo de fechas/números locale-aware en todas las páginas
- ✅ Todas las páginas admin + owner + landing traducidas

### 🔄 Futuro (Fase 4):
- Rediseño UX/UI premium (animaciones, micro-interacciones, feel premium)
- Versión móvil optimizada

### 🚫 No implementado (Roadmap futuro):
CRM, marketing automation, gestión equipo, app nativa, API pública, white-label, multi-moneda, pagos offline

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
- `messages/{es,en,ar}.json` — ~780 keys organizados por dominio
- `src/lib/set-locale.ts` — server action para cambiar idioma
- `src/components/ui/LanguageSelector.tsx` — dropdown con banderas

### Estructura de keys:
```json
{
  "common": { "save", "cancel", "delete", ... },
  "auth": { "adminLogin": { ... }, "ownerLogin": { ... } },
  "admin": { "nav", "dashboard", "destinos", "reservas", "stripe", ... },
  "owner": { "nav", "dashboard", "clientes", "monetization", ... },
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

## DISEÑO (ROADMAP VISUAL)

**Estado actual:** Templates básicos funcionales
**Próximo rediseño:**
- Colores: Turquesa (#1CABB0) + Lima (#D4F24D)
- Más ancho, más espacio, menos saturación
- Gradientes, animaciones, hover effects, micro-interacciones

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
