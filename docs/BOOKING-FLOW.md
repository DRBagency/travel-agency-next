# Flujo de Reservas — DRB Agency

> **Última actualización:** 2026-02-26

## Resumen

El flujo de reservas conecta la landing page del cliente (agencia) con Stripe Connect para procesar pagos. DRB cobra una comisión automática según el plan de la agencia.

## Flujo de 4 Pasos

### 1. Selección de Destino
- Visitante navega la landing de la agencia → ve destinos activos
- Click en destino → `/destino/[slug]` (página de detalle con 8 tabs)
- Click en "Reservar" → abre `BookingModal`

### 2. Datos del Viajero (BookingModal)
- Componente: `src/components/landing/booking/BookingModal.tsx`
- Stepper visual de 4 pasos dentro del modal
- Recoge: nombre, email, teléfono, fecha, número de viajeros, notas
- Soporta ES/EN/AR (prop `lang: string`)

### 3. Pago con Stripe Connect
- API: `POST /api/stripe/connect/checkout`
- Crea Stripe Checkout Session con `payment_intent_data.application_fee_amount` (comisión DRB)
- Comisión según plan: Start 5%, Grow 3%, Pro 1%
- Redirect a Stripe Checkout → success/cancel pages

### 4. Confirmación
- Webhook: `POST /api/stripe/connect/webhook` — evento `checkout.session.completed`
- Crea registro en tabla `reservas`
- Envía emails automáticos:
  - `reserva_cliente` → al viajero (confirmación)
  - `reserva_agencia` → a la agencia (nueva reserva)
- Crea notificación en panel admin

## Gestión de Reservas (Admin)

- **Listado:** `/admin/reservas` — `ReservasTable` (DataTable con search, sort, pagination, filtros colapsables)
- **Detalle:** `/admin/reserva/[id]` — timeline visual de estados
- **Estados:** Pendiente → Confirmada → Completada / Cancelada
- **Cambio de estado:** Inline `StatusCell` en la tabla
- **Export:** CSV + PDF con filtros aplicados
- **KPIs:** 3 cards (total reservas, ingresos, tasa de conversión)

## Tabla `reservas`

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
| `precio_total` | DECIMAL | Precio total cobrado |
| `estado` | TEXT | pendiente/confirmada/completada/cancelada |
| `stripe_session_id` | TEXT | ID de sesión Stripe |
| `notas` | TEXT | Notas adicionales |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

## Pendiente

- **Sistema de depósitos/anticipos (D5/E17):** Configurar % de depósito + fecha límite para pago restante
- **Portal del cliente final (E20/G11):** El viajero accede con email y ve sus reservas, estado de pago, itinerarios

> Última actualización: 2026-02-26
