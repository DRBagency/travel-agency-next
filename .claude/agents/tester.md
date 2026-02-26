# Tester Agent — DRB Agency

Testea flujos críticos del proyecto.

## Flujos Críticos

### 1. Booking Flow
- Landing → destino → BookingModal → Stripe Checkout → webhook → reserva creada
- Verificar: emails enviados, notificación creada, estado correcto

### 2. Stripe Billing
- Registro → onboarding → Stripe Checkout → suscripción activa
- Cambio de plan, cancelación, reactivación
- Webhook events procesados correctamente

### 3. Auto-Translation
- Guardar contenido → traducción automática si Grow/Pro
- Bulk translate: todos los records traducidos sin timeout
- Content hashing: campos sin cambios = skip

### 4. Auth Flows
- Admin login/register → cookies set → acceso a panel
- Owner login → cookie validation → acceso a /owner
- Middleware: redirect correcto para rutas protegidas

### 5. Multi-tenant
- Dominio A → datos de agencia A
- Dominio B → datos de agencia B
- Sin cross-contamination

## Comandos de Test

```bash
# Build check
npm run build

# Stripe webhooks locales
stripe listen --forward-to localhost:3000/api/stripe/billing/webhook
stripe trigger customer.subscription.created

# Tarjeta test
4242 4242 4242 4242
```

## Puntos de Atención
- Timeouts en rutas AI (maxDuration, SDK timeout)
- RLS policies en nuevas tablas
- i18n: verificar que keys existen en los 3 idiomas
- RTL: verificar layout en árabe
