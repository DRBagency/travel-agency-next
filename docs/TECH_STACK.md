# Tech Stack - DRB Agency

> **Última actualización:** 10 Febrero 2026
> **Estado:** Producción estable

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 16.1.6 (App Router)
- **React:** 19.2.3
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charts:** Recharts (para gráficas)
- **Calendar:** FullCalendar (integración Google Calendar)
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (Edge Runtime en algunas rutas)
- **API Routes:** Next.js App Router API
- **Authentication:** Supabase Auth + Custom sessions

### Base de Datos
- **Database:** PostgreSQL (Supabase)
- **ORM:** Supabase Client (@supabase/supabase-js 2.93.2)
- **Migrations:** Supabase CLI

### Pagos
- **Payment Provider:** Stripe
- **SDK:** stripe 20.2.0
- **Stripe Connect:** Para pagos de reservas (agencia → cliente)
- **Stripe Billing:** Para suscripciones SaaS (DRB → agencia)

### Email
- **Provider:** Resend
- **SDK:** resend 6.9.1
- **Templates:** HTML dinámico con tokens (NO react-email)
- **Dominio verificado:** contact@drb.agency

### Deployment
- **Hosting:** Vercel
- **CI/CD:** GitHub → Vercel auto-deploy
- **Environment:** Production (LIVE mode)

### Development Tools
- **IDE:** VS Code
- **AI Assistant:** Claude Code (integrado en VS Code)
- **Version Control:** Git + GitHub
- **Testing:** Stripe CLI para webhooks locales

## 📁 Estructura de Carpetas

travel-agency-next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Panel CLIENTE (agencia)
│   │   ├── owner/             # Panel OWNER (DRB Agency)
│   │   ├── api/               # API routes
│   │   ├── legal/             # Páginas legales dinámicas
│   │   └── [otros]
│   ├── components/            # Componentes React
│   │   ├── ui/               # shadcn/ui components
│   │   └── admin/            # Componentes específicos admin
│   ├── lib/                   # Utilidades y funciones
│   │   ├── emails/           # Sistema de emails
│   │   ├── billing/          # Funciones de billing
│   │   ├── owner/            # Funciones del owner
│   │   └── supabase/         # Clients de Supabase
│   └── middleware.ts          # Next.js middleware
├── public/                    # Assets estáticos
│   └── logo.png              # Logo de DRB Agency
├── supabase/
│   └── migrations/           # Migraciones SQL
├── docs/                      # Documentación (este directorio)
└── [config files]

## 🔧 Convenciones de Código

### Nomenclatura:
- **Rutas:** kebab-case (`/admin/stripe`, `/owner/emails`)
- **Componentes:** PascalCase (`AdminShell.tsx`, `EmailTemplate.tsx`)
- **Funciones:** camelCase (`getClientByDomain`, `sendBillingEmail`)
- **Server Actions:** camelCase (`createCliente`, `updatePlatformSettings`)
- **Constantes:** UPPER_SNAKE_CASE (`PLAN_PRICES`, `STRIPE_SECRET_KEY`)

### Patrones:
- Server Components por defecto
- `"use client"` solo cuando sea necesario
- `export const dynamic = "force-dynamic"` para páginas con datos en tiempo real
- Server Actions en el mismo archivo de la página cuando son específicos

## 🌍 Preparación Multi-idioma

### A implementar:
- **next-intl** (recomendado) o **react-i18next**
- Tabla `translations` en Supabase
- Archivos de idioma en `/locales/[lang].json`
- Middleware para detección automática
- Componente `<LanguageSelector />`

### Estructura propuesta:
locales/
├── es.json
├── en.json
└── ar.json

## 📦 Dependencias Clave

{
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "@supabase/supabase-js": "2.93.2",
    "stripe": "20.2.0",
    "resend": "6.9.1",
    "recharts": "^2.x",
    "@fullcalendar/react": "^6.x",
    "jspdf": "^2.x",
    "date-fns": "^3.x"
  }
}

## ⚠️ Notas Técnicas

- **API Version Stripe:** Usar siempre la misma versión en todos los webhooks
- **Supabase RLS:** Todas las tablas tienen Row Level Security habilitado
- **Service Role:** Se usa `supabaseAdmin` (service_role) para operaciones del servidor
- **Cookies:** Sistema custom de sesiones para admin y owner
