# Tech Stack - DRB Agency

> **Ultima actualizacion:** 22 Febrero 2026
> **Estado:** Produccion estable - Fases 1-6 + D + E + F completadas

## Stack Tecnologico

### Frontend
- **Framework:** Next.js 16.1.6 (App Router)
- **React:** 19.2.3
- **Styling:** Tailwind CSS (custom shadows, glassmorphism, DRB color palette)
- **UI Components:** shadcn/ui + custom design system (DataTable, KPICard, ConfirmDialog, EmptyState, AnimatedSection, DeleteWithConfirm)
- **i18n:** next-intl (cookie-based, ES/EN/AR, 1000+ keys, RTL support for Arabic with CSS logical properties)
- **Charts:** Recharts
- **Calendar:** FullCalendar (Google Calendar integration)
- **Icons:** Lucide React
- **Animations:** Framer Motion (framer-motion@12.29.2) + Lottie (lottie-react) + CSS animations (fade-in, float, shimmer, marquee)
- **Rive:** @rive-app/react-canvas (login animations)

### Backend
- **Runtime:** Node.js (Edge Runtime en algunas rutas)
- **API Routes:** Next.js App Router API
- **Authentication:** Supabase Auth + Custom cookies (NO NextAuth)
- **AI:** Anthropic Claude API (@anthropic-ai/sdk) - itineraries, recommendations, chatbot
- **Vercel API:** Domain management (add, verify, remove domains via REST API)

### Base de Datos
- **Database:** PostgreSQL (Supabase)
- **ORM:** Supabase Client (@supabase/supabase-js 2.93.2)
- **Migrations:** Supabase CLI (SQL manual)
- **RLS:** Habilitado en TODAS las tablas
- **Service Role:** `supabaseAdmin` para operaciones del servidor

### Pagos
- **Payment Provider:** Stripe
- **SDK:** stripe 20.2.0
- **Stripe Connect:** Para pagos de reservas (agencia -> cliente)
- **Stripe Billing:** Para suscripciones SaaS (DRB -> agencia)

### Email
- **Provider:** Resend (SDK 6.9.1)
- **Templates:** HTML dinamico con tokens en Supabase (NO react-email)
- **Dominio verificado:** contact@drb.agency

### Deployment
- **Hosting:** Vercel (auto-deploy desde main)
- **CI/CD:** GitHub -> Vercel
- **Environment:** Production (LIVE mode)

## Estructura de Carpetas

```
travel-agency-next/
src/
  app/
    admin/             # Panel CLIENTE (agencia)
      loading.tsx      # Skeleton loading state
    owner/             # Panel OWNER (DRB Agency)
      (panel)/
        loading.tsx    # Skeleton loading state
    api/               # API routes (stripe, ai, admin, owner)
    legal/             # Paginas legales dinamicas
  components/
    ui/                # shadcn/ui + DataTable, KPICard, ConfirmDialog, EmptyState, DeleteWithConfirm, AnimatedSection, SearchBar, StarRating, LanguageSelector
    admin/             # Componentes admin (charts, dashboard client components, AI)
      AdminShell      # 3-column layout (sidebar | main | right column)
      EdenChat        # AI assistant chat
      MountainBackground # SVG landscape for right column
      DashboardBackground # SVG widescreen mountains for main area
    owner/             # Componentes owner (charts)
      OwnerShell      # 3-column layout matching AdminShell
      OwnerChat       # AI platform copilot
  i18n/
    request.ts         # Config next-intl (cookie NEXT_LOCALE)
  lib/
    emails/            # Sistema de emails
    billing/           # Funciones de billing
    owner/             # Funciones del owner
    supabase/          # Clients de Supabase
    vercel/            # Vercel API helpers (domain management)
    set-locale.ts      # Server action cambio idioma
  middleware.ts
messages/
  es.json              # Espanol (fuente de verdad, ~1000 keys)
  en.json              # English
  ar.json              # Arabic (RTL)
public/
supabase/migrations/
docs/                  # Documentacion extendida
CLAUDE.md              # Contexto del proyecto
```

## Convenciones de Codigo

### Nomenclatura:
- **Rutas:** kebab-case (`/admin/stripe`, `/owner/emails`)
- **Componentes:** PascalCase (`AdminShell.tsx`, `DataTable.tsx`)
- **Funciones:** camelCase (`getClientByDomain`, `sendBillingEmail`)
- **Server Actions:** camelCase (`createCliente`, `updatePlatformSettings`)
- **Constantes:** UPPER_SNAKE_CASE (`PLAN_PRICES`)

### Patrones:
- Server Components por defecto, `"use client"` solo cuando sea necesario
- `export const dynamic = "force-dynamic"` para paginas con datos en tiempo real
- Server Actions en el mismo archivo cuando son especificos de la pagina
- **CSS RTL:** Propiedades logicas siempre (`text-start`, `ms-`, `ps-`, `start-0`, `end-0`, `border-s`, `border-e`). NUNCA `text-left`, `ml-`, `pl-`, `left-`, `right-`
- **Headers:** `text-2xl font-bold text-gray-900 dark:text-white` para h1, `text-gray-400 dark:text-white/40` para subtitles
- **Page wrappers:** `space-y-{6,8} animate-fade-in`
- **Delete actions:** Siempre usar `DeleteWithConfirm` component

### i18n:
```tsx
// Server Component
import { getTranslations, getLocale } from 'next-intl/server';
const t = await getTranslations('admin.destinos');
const locale = await getLocale();

// Client Component
import { useTranslations, useLocale } from 'next-intl';
const t = useTranslations('admin.destinos');
```

## Dependencias Clave

```json
{
  "next": "16.1.6",
  "react": "19.2.3",
  "@supabase/supabase-js": "2.93.2",
  "stripe": "20.2.0",
  "resend": "6.9.1",
  "@anthropic-ai/sdk": "latest",
  "next-intl": "latest",
  "recharts": "^2.x",
  "@fullcalendar/react": "^6.x",
  "framer-motion": "^11.x",
  "jspdf": "^2.x",
  "date-fns": "^3.x",
  "lucide-react": "latest"
}
```

## Notas Tecnicas

- **Supabase RLS:** Todas las tablas tienen Row Level Security habilitado
- **Service Role:** Se usa `supabaseAdmin` (service_role) para operaciones del servidor
- **Cookies:** Sistema custom de sesiones para admin (`cliente_id`) y owner (`owner_id`)
- **RTL:** `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>` + CSS logical properties everywhere
- **Loading states:** `loading.tsx` en admin/ y owner/(panel)/ con skeleton pulse animation
- **Vercel API:** VERCEL_TOKEN + VERCEL_PROJECT_ID + VERCEL_TEAM_ID env vars for domain management
- **Stripe:** Billing (subscriptions) + Connect (booking commissions) with separate webhooks
