# Code Style Rules

## Naming
- Rutas: kebab-case (`/admin/stripe`)
- Componentes: PascalCase (`AdminShell.tsx`)
- Funciones: camelCase (`getClientByDomain`)
- Server Actions: camelCase (`createCliente`)
- Constantes: UPPER_SNAKE_CASE (`PLAN_PRICES`)

## Server vs Client
- Server Components por defecto
- `"use client"` solo cuando sea necesario (hooks, event handlers, browser APIs)
- `export const dynamic = "force-dynamic"` en páginas con datos en tiempo real

## i18n
- Server: `const t = await getTranslations('namespace');` (from `next-intl/server`)
- Client: `const t = useTranslations('namespace');` (from `next-intl`)
- SIEMPRE añadir keys en los 3 archivos: `es.json`, `en.json`, `ar.json`
- `es.json` es la fuente de verdad

## CSS RTL (OBLIGATORIO)
Usar propiedades lógicas. NUNCA usar las físicas:
- `text-start` / `text-end` (NO `text-left` / `text-right`)
- `ms-` / `me-` (NO `ml-` / `mr-`)
- `ps-` / `pe-` (NO `pl-` / `pr-`)
- `start-` / `end-` (NO `left-` / `right-`)
- `border-s` / `border-e` (NO `border-l` / `border-r`)

## Charts
- Agrupación semanal (8 semanas), date-fns con `weekStartsOn: 1` (Lunes)

## Supabase
- `supabaseAdmin` (service_role) para queries server-side
- Anon key solo client-side para Supabase Auth
