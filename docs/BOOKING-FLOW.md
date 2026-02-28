# Flujo de Reservas — DRB Agency

> **Última actualización:** 2026-02-28

## Resumen

El flujo de reservas conecta la landing page del cliente (agencia) con Stripe Connect para procesar pagos. DRB cobra una comisión automática según el plan de la agencia. Soporta 3 modelos de cobro configurables por agencia.

## 3 Modelos de Cobro (E17)

La agencia configura su modelo desde `/admin/cobros-pagos`:

| Modelo | Descripción | Botón Step 3 | Stripe |
|--------|-------------|--------------|--------|
| `pago_completo` | El viajero paga el 100% al reservar | "Pagar total X€" | Checkout por total |
| `deposito_resto` | Paga un anticipo ahora, el resto antes de fecha límite | "Pagar anticipo X€" | Checkout por depósito |
| `solo_reserva` | Solo envía solicitud, sin pago online | "Enviar solicitud →" | Sin Stripe |

### Configuración del depósito (`deposito_resto`)
- **Tipo:** Porcentaje o cantidad fija (`depositType: "percentage" | "fixed"`)
- **Valor:** `depositValue` (ej: 30 = 30% o 200 = 200€ fijo)
- **Fecha límite pago resto:** `paymentDeadlineType` × `paymentDeadlineDays`
  - `before_departure`: N días antes de la fecha de salida
  - `after_booking`: N días después de la reserva

### Interfaz BookingConfig
```typescript
interface BookingConfig {
  clienteId: string;
  bookingModel: "pago_completo" | "deposito_resto" | "solo_reserva";
  depositType: "percentage" | "fixed";
  depositValue: number;
  paymentDeadlineType: "before_departure" | "after_booking";
  paymentDeadlineDays: number;
  stripeChargesEnabled: boolean;
}
```

## Flujo de 3 Pasos (BookingModal)

Componente: `src/components/landing/booking/BookingModal.tsx`
Soporta ES/EN/AR (prop `lang: string`). Traducciones inline (no i18n system).

### Step 1 — Salida y viajeros
- Selección de fecha de salida (de `salidas` JSONB)
- Contador de adultos y niños
- Muestra precio, plazas disponibles, estado (Confirmado/Últimas plazas/Agotado)

### Step 2 — Datos de pasajeros
- Contacto principal: nombre, email, teléfono
- Por cada pasajero: nombre (auto-fill del contacto), tipo documento, nº documento, fecha nacimiento, nacionalidad
- Selección de hotel/habitación si disponible

### Step 3 — Resumen + Acción
- Resumen: destino, fecha, duración, viajeros, hotel, precio unitario × cantidad
- **pago_completo:** Muestra total → botón "Pagar total X€" → Stripe Checkout
- **deposito_resto:** Muestra depósito + resto pendiente + fecha límite resto → botón "Pagar anticipo X€" → Stripe Checkout
- **solo_reserva:** Muestra total (referencia) → botón "Enviar solicitud →" → POST `/api/stripe/connect/book`

## API Routes

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/stripe/connect/checkout` | POST | Crear sesión Stripe Checkout (pago_completo o deposito_resto) |
| `/api/stripe/connect/book` | POST | Crear reserva sin pago (solo_reserva) |
| `/api/stripe/connect/webhook` | POST | Webhook Stripe Connect |
| `/api/admin/cobros-pagos` | GET/POST | Leer/guardar configuración de booking model |

## Webhook y Estados

### Flujo por modelo:
- **pago_completo:** `checkout.session.completed` → estado `confirmada`
- **deposito_resto:** `checkout.session.completed` → estado `deposito_pagado` (esperando resto)
- **solo_reserva:** POST `/api/stripe/connect/book` → estado `pendiente_confirmacion`

### Estados posibles de reserva:
`pendiente` → `confirmada` → `completada` / `cancelada`
`pendiente_confirmacion` (solo_reserva, esperando confirmación agencia)
`deposito_pagado` (deposito_resto, anticipo cobrado, esperando resto)

## Gestión de Reservas (Admin)

- **Configuración:** `/admin/cobros-pagos` — `BookingModelConfig` (3 radio buttons + campos depósito)
- **Listado:** `/admin/reservas` — `ReservasTable` (DataTable con search, sort, pagination, filtros colapsables)
- **Detalle:** `/admin/reserva/[id]` — timeline visual de estados, info depósito, botón confirmar
- **Cambio de estado:** Inline `StatusCell` en la tabla
- **Export:** CSV + PDF con filtros aplicados
- **KPIs:** 3 cards (total reservas, ingresos, tasa de conversión)

## Tabla `reservas` (campos principales)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK |
| `cliente_id` | UUID | FK → clientes |
| `destino_id` | UUID | FK → destinos |
| `nombre_viajero` | TEXT | Nombre del viajero |
| `email_viajero` | TEXT | Email del viajero |
| `telefono` | TEXT | Teléfono |
| `fecha_viaje` | DATE | Fecha del viaje |
| `num_viajeros` | INT | Número de viajeros |
| `precio_total` | DECIMAL | Precio total del viaje |
| `estado` | TEXT | pendiente/confirmada/completada/cancelada/deposito_pagado/pendiente_confirmacion |
| `stripe_session_id` | TEXT | ID de sesión Stripe |
| `booking_model` | TEXT | pago_completo/deposito_resto/solo_reserva |
| `deposito_pagado` | DECIMAL | Monto del depósito cobrado |
| `deposito_fecha` | TIMESTAMP | Fecha en que se cobró el depósito |
| `resto_pendiente` | DECIMAL | Monto pendiente por cobrar |
| `fecha_limite_resto` | DATE | Fecha límite para pagar el resto |
| `passengers` | JSONB | Array de pasajeros con datos completos |
| `booking_details` | JSONB | Hotel, habitación, suplementos |
| `notas` | TEXT | Notas adicionales |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

## Pendiente

- **Portal del cliente final (E20/G11):** El viajero accede con email y ve sus reservas, estado de pago, itinerarios

> Última actualización: 2026-02-28
