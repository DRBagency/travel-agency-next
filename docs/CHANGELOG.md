# Changelog — DRB Agency

> **Última actualización:** 2026-03-01

## 1 Marzo 2026
- **E19 — Mejoras Features Existentes completado:**
  - **Auto-decrementar plazas en reservas:** Helper `decrement-departure-spots.ts` reutilizable. Se llama automáticamente desde webhook (pago_completo/deposito_resto) y book route (solo_reserva). Auto-cambia estado a `soldOut` (0 plazas) o `lastSpots` (≤3)
  - **Biblioteca de coordinadores:** Nueva tabla `coordinadores` con FK en `destinos.coordinador_id`. CRUD completo en `/admin/coordinadores`. Dropdown selector en DestinoEditor reemplaza formulario inline. Landing muestra coordinador por FK
  - **Galería de hotel:** Campo `galeria: string[]` en JSONB hotel. Thumbnails clicables en landing (TabHotel). Admin UI con lista URLs + Unsplash picker
  - **Badge "Recomendado":** Campo `es_recomendado: boolean` en JSONB hotel. Toggle en admin. Badge verde en landing
  - **Tipo de vuelo:** Campo `tipo: "ida"|"retorno"|"conexion"` en segmentos. Dropdown en admin. Label dinámico en landing (TabFlight) basado en tipo en vez de índice
  - **Botón "Notifícame" funcional:** En TabDepartures, email inline → POST `/api/contact` con mensaje pre-rellenado
  - Migración: `20260301000000_create_coordinadores_table.sql`
  - i18n: ~20 keys nuevas en ES/EN/AR (coordinadores, hotel gallery, flight type, notifícame)
- Sentry error monitoring integrado

## 28 Febrero 2026
- **E17 — Sistema de anticipos/depósitos completado:**
  - 3 modelos de cobro: pago_completo, deposito_resto, solo_reserva
  - Nueva página `/admin/cobros-pagos` con BookingModelConfig + Stripe tabs
  - BookingModal adaptado: flujo dinámico de 3 pasos según modelo
  - `POST /api/stripe/connect/book` para reservas sin pago (solo_reserva)
  - Checkout route con cálculo de depósito y fecha límite
  - Webhook configura estado correcto por modelo
  - Detalle reserva: info depósito, botón confirmar, timeline dinámica
  - ReservasTable + filtros con nuevos estados
  - i18n completo ES/EN/AR para todas las keys nuevas
  - Migración DB: config clientes + columnas tracking reservas
- Fix: auto-fill nombre pasajero copiaba solo primer carácter (useRef tracking)
- Fix: "Fecha límite resto" no aparecía en Step 3 (solo estaba en Step 4)
- Fix: texto blanco sobre blanco en BookingModal light mode (`data-glass-skip`)
- Fix: 15 tildes faltantes en traducciones españolas del BookingModal
- **CRM, Mensajería, Soporte Owner:**
  - CRM funnel percentages corregidos (% del total, no del stage anterior)
  - CRM traveler profile enriquecido con datos de reserva
  - Landing contact form visible en light mode + fallback clienteId
  - Mensajes reply system via Resend con branding
  - Owner soporte detail con chat bidireccional

## 26 Febrero 2026
- Reorganizar Mi Web en 3 tabs: Configuración, Contenido, Conversión
- Cambiar campo destino en opiniones a texto libre "Ciudad, País"
- Fix opiniones: usar nombres correctos de columnas DB (texto, ciudad)
- Fix opiniones CRUD: reparar API update, añadir dropdown destinos
- Añadir funcionalidad de edición inline en OpinionesManager
- Fix opiniones no mostrando en landing: mapear comentario→texto, ubicacion→destino
- Eliminar campo footer_text no usado, mantener solo footer_description
- Merge Dominio + Global Config en una sección en Mi Web
- Añadir diálogo de confirmación antes de traducción masiva con checklist
- Reordenar secciones Mi Web para coincidir con orden de landing, merge footer

## 25 Febrero 2026
- Sistema de auto-traducción completo con Claude Haiku 4.5
- Content hashing para skip de campos sin cambios
- Traducción masiva "Traducir todo" con orquestación client-side
- fieldGroup splitting para evitar timeouts
- Rediseño galería: split layout 65%/35% con auto-rotación

## 24 Febrero 2026
- Auto-traducción landing + UI/UX fixes
- Multi-language landing switching con NextIntlClientProvider dinámico
- Cookie separada LANDING_LOCALE vs NEXT_LOCALE
- Navbar persistente en páginas de destino
- Footer completo en páginas de destino
- BookingModal i18n completo (AR ~50 strings)
- TagChip colores preservados entre idiomas
- Itinerary images preservadas en traducciones

## 23 Febrero 2026 — Fase G (Landing Rediseño Completo)
- 100% landing replacement: 9 secciones + 7 micro-componentes
- Tipografía Syne + DM Sans, dark/light mode con next-themes
- Página destino individual con 8 tabs
- Admin destinos tabbed editor (11 tabs)
- Mi Web admin expandido (WhyUs, CTA Banner, Footer, Global Config)
- 4 migraciones DB (expand destinos/clientes/opiniones + auto-slug)
- ~170 nuevas keys i18n

## 22 Febrero 2026 — Fase E (Self-Service E1-E7)
- Registro público de agencias
- Onboarding wizard 5 pasos
- Pago suscripción integrado (Stripe Checkout)
- Conexión de dominio self-service + Vercel API
- Setup Stripe Connect autoguiado
- OwnerShell rewrite (3-column layout)
- OwnerChat (Eden AI copiloto)

## 21 Febrero 2026 — Fase F (Visual/UX Premium)
- DashboardBackground SVG con montañas angulares + luna + estrellas
- Owner Dashboard compacto sin scroll
- Gráficas cambiadas de 6 meses a 8 semanas
- Eliminar /admin/analytics
- Filtros reservas colapsados
- Contador de visitas en vivo (Realtime + polling)
- Widget opacity fix para dark mode

## 20 Febrero 2026 — Fase D + Admin Layout
- AdminShell 3-column layout + sidebar colapsable
- Eden AI Chat en right column
- Mountain landscape backgrounds (SVG)
- Profile photo system + Supabase Storage
- Social Media integration (código OAuth)

## 18-19 Febrero 2026 — Fases 3-4
- Multi-idioma completo ES/EN/AR con next-intl (1000+ keys)
- RTL support para Árabe
- AI Features: itinerarios, chatbot, recomendaciones, asistente
- Design System: DataTable, KPICard, ConfirmDialog, EmptyState
- Login premium con Rive animation

## Anteriores
- Fase 1: Gráficas, calendario, documentos PDF, tickets
- Fase 2: Analytics, automatizaciones
- Setup inicial: Next.js, Supabase, Stripe, multi-tenant

> Última actualización: 2026-02-26
