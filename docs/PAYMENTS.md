# Sistema de Pagos — DRB Agency

> **Última actualización:** 2026-02-26

## Arquitectura Dual Stripe

DRB usa dos integraciones Stripe completamente separadas:

### 1. Stripe Connect (Reservas de viajes)
- **Flujo:** Viajero → paga en landing → Stripe Connect → agencia recibe pago − comisión DRB
- **Webhook:** `POST /api/stripe/connect/webhook` (secret: `STRIPE_WEBHOOK_SECRET`)
- **Comisiones automáticas:**
  - Plan Start: 5%
  - Plan Grow: 3%
  - Plan Pro: 1%
- **Onboarding:** Wizard autoguiado en `/admin/stripe` (StripeTabs → tab Connect)
- **API Routes:**
  - `POST /api/stripe/connect/checkout` — Crear sesión de pago
  - `POST /api/stripe/connect/create-account` — Crear cuenta Connect
  - `POST /api/stripe/connect/onboarding` — Generar link de onboarding
  - `POST/GET /api/stripe/connect/start` — Iniciar flujo

### 2. Stripe Billing (Suscripciones SaaS)
- **Flujo:** Agencia → elige plan → Stripe Checkout → suscripción recurrente
- **Webhook:** `POST /api/stripe/billing/webhook` (secret: `STRIPE_BILLING_WEBHOOK_SECRET`)
- **Planes:**
  - Start: 29€/mes (`STRIPE_PRICE_START`)
  - Grow: 59€/mes (`STRIPE_PRICE_GROW`)
  - Pro: 99€/mes (`STRIPE_PRICE_PRO`)
- **Operaciones:** Crear suscripción, cambiar plan, cancelar, reactivar
- **API Routes:**
  - `POST /api/stripe/billing/create-subscription`
  - `POST /api/stripe/billing/change-plan`
  - `POST /api/stripe/billing/cancel-subscription`
  - `POST /api/stripe/billing/reactivate-subscription`

## Webhook Events Manejados

### Connect Webhook
| Evento | Acción |
|--------|--------|
| `checkout.session.completed` | Crear reserva, enviar emails (viajero + agencia), crear notificación |

### Billing Webhook
| Evento | Acción |
|--------|--------|
| `customer.subscription.created` | Activar plan, enviar email bienvenida |
| `customer.subscription.updated` | Actualizar plan en BD, enviar email cambio |
| `customer.subscription.deleted` | Desactivar plan, enviar email cancelación |
| `invoice.payment_succeeded` | Registrar pago |
| `invoice.payment_failed` | Notificar fallo de pago |

## UI Admin

- **`/admin/stripe`** — `StripeTabs` con 3 tabs:
  - **Connect:** Estado de cuenta, onboarding wizard, dashboard link
  - **Suscripción:** Plan actual, cambiar plan, cancelar/reactivar
  - **Tarifas:** Comisiones configurables por destino

## Variables de Entorno

```
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BILLING_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_START=price_...
STRIPE_PRICE_GROW=price_...
STRIPE_PRICE_PRO=price_...
```

## Stripe API Version

`2026-01-28.clover` — fijada en ambos webhooks.

## Testing

```bash
# Escuchar webhooks en local
stripe listen --forward-to localhost:3000/api/stripe/billing/webhook
stripe listen --forward-to localhost:3000/api/stripe/connect/webhook

# Trigger eventos de test
stripe trigger customer.subscription.created
stripe trigger checkout.session.completed

# Tarjeta de test
4242 4242 4242 4242 (cualquier fecha futura, cualquier CVC)
```

## Pendiente
- **E18:** Cambiar de modo test a modo live (keys de producción, verificar webhooks, dominio Resend)
- **D5/E17:** Sistema de depósitos/anticipos

> Última actualización: 2026-02-26
