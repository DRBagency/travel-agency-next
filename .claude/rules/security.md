# Security Rules

## Stripe
- NUNCA loguear secret keys, webhook secrets o payment intents completos
- Siempre verificar firma de webhooks con `stripe.webhooks.constructEvent()`
- Stripe API version fijada: `2026-01-28.clover`
- Webhooks devuelven 200 incluso si el procesamiento falla (evitar retries infinitos)

## Supabase
- RLS habilitado en TODAS las tablas (30 tablas verificadas)
- `supabaseAdmin` (service_role) SOLO en server-side
- NUNCA exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente
- Anon key solo para Auth + lecturas públicas

## Auth
- Cookies custom para admin, owner y portal viajero (NO NextAuth)
- Middleware protege `/owner/*`, `/admin/clientes/*` y `/portal/*` (excepto `/portal/login`)
- API routes usan `requireAdminClient()`, `requireTraveler()` o `requireValidApiDomain()`
- Portal auth: magic link tokens son single-use, 15 min expiry, rate limited (5/hr)
- NUNCA confiar en datos del cliente sin validar server-side

## Variables de Entorno
- NUNCA commitear `.env.local` o archivos con secretos
- `.gitignore` incluye `.env*`
- Variables sensibles solo en Vercel dashboard

## AI
- Rate limiting en `/api/ai` (20 req/min por clienteId)
- Rate limiting en `/api/chatbot` (chatbot público)
- Rate limiting en `/api/track` (tracking público)
- `maxDuration` en rutas AI para evitar timeouts sin límite

## Uploads
- Validar tipo y tamaño de archivo antes de subir a Supabase Storage
- RLS policies en bucket `profile-photos`
