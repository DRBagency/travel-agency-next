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
| `checkout.session.completed` | Crear reserva, enviar emails (viajero + agencia), crear notificación. Si metadata `is_remaining_payment`: actualiza remaining_paid + estado_pago (E20) |

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

## Sistema de Depósitos/Anticipos (E17 — Completado)

La agencia configura su modelo de cobro desde `/admin/cobros-pagos`:

### 3 Modelos
- **pago_completo:** Cobro del 100% al reservar
- **deposito_resto:** Cobro parcial (% o fijo), resto antes de fecha límite
- **solo_reserva:** Sin pago online, solo solicitud

### Config en tabla `clientes`
```
booking_model: "pago_completo" | "deposito_resto" | "solo_reserva"
deposit_type: "percentage" | "fixed"
deposit_value: number (ej: 30 para 30%, o 200 para 200€)
payment_deadline_type: "before_departure" | "after_booking"
payment_deadline_days: number (ej: 30)
stripe_charges_enabled: boolean
```

### API Route
- `POST /api/stripe/connect/book` — Crear reserva sin pago (solo_reserva)

Ver `docs/BOOKING-FLOW.md` para detalles completos del flujo.

## Auto-Decrement Plazas (E19, 1 Mar 2026)

Cuando se completa una reserva, las plazas disponibles de la salida correspondiente se decrementan automáticamente.

### Helper
`src/lib/decrement-departure-spots.ts` — `decrementDepartureSpots({ clienteId, destinoId, fechaSalida, personas })`

### Lógica
1. Busca la salida en `destinos.salidas` JSONB por fecha normalizada (YYYY-MM-DD)
2. Resta `personas` de `plazas_disponibles`
3. Auto-actualiza estado: `soldOut` si 0 plazas, `lastSpots` si ≤3 plazas
4. Guarda el JSONB actualizado en la DB

### Puntos de integración
- **Webhook (pago_completo + deposito_resto):** Se llama en `checkout.session.completed` después de actualizar estado de reserva. Metadata Stripe: `destino_id`, `fecha_salida`, `personas`
- **Book route (solo_reserva):** Se llama en `POST /api/stripe/connect/book` después de crear la reserva
- **Resiliencia:** Envuelto en `.catch()` para que un fallo no afecte la reserva

## Pago Resto Pendiente — Portal del Viajero (E20)

Cuando una reserva tiene modelo `deposito_resto` y el resto no está pagado, el viajero puede pagar desde el portal.

### Flujo
1. Viajero accede a `/portal/reserva/[id]` y ve CTA "Pagar resto"
2. Click → POST `/api/portal/pay-remaining` con `reserva_id`
3. API valida: session cookies, email match, booking_model = deposito_resto, remaining_paid = false
4. Crea Stripe Checkout Session por `remaining_amount` con metadata `is_remaining_payment: "true"`
5. Viajero paga en Stripe
6. Webhook `checkout.session.completed` detecta metadata `is_remaining_payment`
7. Actualiza reserva: `remaining_paid = true`, `remaining_stripe_session_id`, `estado_pago = "pagado"`
8. NO decrementa plazas (ya se hizo en el primer pago)

### API Route
- `POST /api/portal/pay-remaining` — requiere cookies `traveler_session` + `traveler_email`

## Pendiente
- **E18:** Cambiar de modo test a modo live (keys de producción, verificar webhooks, dominio Resend)

> Última actualización: 2026-03-01
