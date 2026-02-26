# Deployment — DRB Agency

> **Última actualización:** 2026-02-26

## Flujo: VS Code → GitHub → Vercel

```
VS Code (desarrollo local)
    ↓ git push origin main
GitHub (repositorio)
    ↓ auto-deploy (webhook)
Vercel (producción)
```

## URLs

| Entorno | URL |
|---------|-----|
| Producción | https://drb.agency |
| Staging | https://travel-agency-next-ten.vercel.app |
| Local | http://localhost:3000 |

## Vercel Config

**`vercel.json`:**
```json
{
  "crons": [
    { "path": "/api/cron/email-automation", "schedule": "0 9 * * *" },
    { "path": "/api/cron/social-token-refresh", "schedule": "0 3 * * *" }
  ]
}
```

**Funciones con maxDuration:**
- `/api/admin/translate/record` — `maxDuration = 180` (Vercel Pro permite hasta 300)

## Variables de Entorno (Vercel)

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_BILLING_WEBHOOK_SECRET=
STRIPE_PRICE_START=
STRIPE_PRICE_GROW=
STRIPE_PRICE_PRO=

# AI
ANTHROPIC_API_KEY=

# Email
RESEND_API_KEY=
EMAIL_ADMIN=
EMAIL_FROM=

# Google Calendar
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Unsplash
UNSPLASH_ACCESS_KEY=

# Vercel API (domain management)
VERCEL_TOKEN=
VERCEL_PROJECT_ID=
VERCEL_TEAM_ID=

# Auth
ADMIN_PASSWORD=
OWNER_EMAIL=
NEXT_PUBLIC_BASE_URL=

# Social (pendiente configurar)
# INSTAGRAM_CLIENT_ID=
# INSTAGRAM_CLIENT_SECRET=
# TIKTOK_CLIENT_KEY=
# TIKTOK_CLIENT_SECRET=
```

## Pre-deploy Checklist

- [ ] `npm run build` funciona sin errores
- [ ] Sin errores TypeScript
- [ ] Migraciones Supabase aplicadas (`supabase db push`)
- [ ] Variables de entorno configuradas en Vercel
- [ ] Testing manual completado
- [ ] i18n: keys añadidos en los 3 archivos (es/en/ar)

## Comandos

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Deploy (auto via push)
git push origin main

# Supabase
supabase db push
supabase migration list

# Stripe webhooks locales
stripe listen --forward-to localhost:3000/api/stripe/billing/webhook
stripe listen --forward-to localhost:3000/api/stripe/connect/webhook
```

## Dominios de Agencias

Cada agencia puede conectar su propio dominio via:
1. **Self-service:** Desde `/admin/mi-web` (sección Dominio)
2. **Onboarding:** Step 3 del wizard de onboarding
3. **API:** `src/lib/vercel/domains.ts` — add/verify/remove/get via Vercel API
4. **DNS:** CNAME apuntando a `cname.vercel-dns.com`

> Última actualización: 2026-02-26
