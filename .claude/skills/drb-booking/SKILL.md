# DRB Booking Skill

Trabajar con el flujo de reservas DRB Agency.

## Flujo
1. Visitante ve destino en landing → click "Reservar"
2. `BookingModal` recoge datos (nombre, email, teléfono, fecha, viajeros)
3. `POST /api/stripe/connect/checkout` → Stripe Checkout Session
4. Webhook `checkout.session.completed` → crear reserva + emails + notificación

## Componentes
- `BookingModal` (`src/components/landing/booking/BookingModal.tsx`) — Stepper 4 pasos, i18n (ES/EN/AR)
- `ReservasTable` (`src/app/admin/reservas/ReservasTable.tsx`) — DataTable con StatusCell inline

## API Routes
- `POST /api/stripe/connect/checkout` — Crear sesión
- `POST /api/stripe/connect/webhook` — Procesar pago
- `PATCH /api/admin/reservas/[id]/estado` — Cambiar estado
- `GET /api/admin/export` — Exportar CSV/PDF

## Estados
`pendiente` → `confirmada` → `completada` | `cancelada`

## Comisiones
- Start: 5%, Grow: 3%, Pro: 1%
- `application_fee_amount` en Checkout Session

## Tabla `reservas`
Campos: id, cliente_id, destino_id, nombre_viajero, email_viajero, telefono, fecha_viaje, num_viajeros, precio_total, estado, stripe_session_id, notas, created_at, updated_at

## Emails Automáticos
- `reserva_cliente` → viajero (confirmación)
- `reserva_agencia` → agencia (nueva reserva)
