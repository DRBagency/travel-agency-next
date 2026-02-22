# DRB Agency — Project Memory

> Contexto persistente para sesiones futuras de Claude Code.

---

## Decisiones de Diseño Tomadas

### SVG Backgrounds (Fase F, 21 Feb 2026)
- **Montañas**: Usar L-paths (líneas rectas, picos angulares). NUNCA Q-curves (parecen nubes redondeadas).
- **Luna**: Técnica crescent = disco brillante + círculo oscuro superpuesto como sombra + cráteres pequeños + radialGradient glow lima.
- **DashboardBackground.tsx**: ViewBox 1600×900, fixed inset-0, z-0. Dark: sky gradient 4 colores + 4 capas montañas + pinos + 24 estrellas + luna. Light: sky gradient 3 colores + 3 capas montañas.
- **MountainBackground.tsx**: Para columna derecha (300px), más vívido. NO copiar al dashboard (diferentes proporciones).

### Opacidad de Widgets (21 Feb 2026)
- Los widgets sobre mountain background necesitan fondo sólido para legibilidad.
- Dark mode: `bg-[#0a2a35]/80` (NO `bg-white/[0.06]` que es demasiado transparente).
- Light mode: `bg-white/95` (NO `bg-white` opaco al 100%).
- Siempre añadir `backdrop-blur-sm` para efecto frosted glass sutil.

### Gráficas (Fase F, 21 Feb 2026)
- Agrupación por SEMANA (8 semanas), NO por mes.
- `weekStartsOn: 1` (Lunes) en todas las funciones date-fns.
- Labels formato: `"dd MMM"` (ej: "10 Feb").
- Proyección: regresión lineal 4 semanas futuras.

### Owner Dashboard (Fase F, 21 Feb 2026)
- Layout compacto SIN scroll. 3 filas: KPIs → Charts|Agencies|Charts → AI|Support|Calendar.
- `AIInsightsCard` tiene prop `compact` para versión widget cuadrada.
- `OwnerSupportWidget` y `OwnerCalendarWidget` siguen patrón de widgets admin (RecentMessagesWidget, UpcomingEventsWidget).

### Eden AI Chat (Fase F, 21 Feb 2026)
- Header compacto: icono 12×12, título text-lg.
- Bubbles assistant: `bg-white/20 border border-white/15`.
- Se intentó Rive animation (fondo negro) y Spline 3D (watermark) — ambos descartados. Queda icono+gradiente simple.

### Analytics (Fase F, 21 Feb 2026)
- `/admin/analytics` fue ELIMINADO. Los KPIs y charts están en el dashboard principal.
- No recrear esta página.

### Filtros Reservas (Fase F, 21 Feb 2026)
- Colapsados por defecto con `<details>/<summary>`.
- Usar `[&::-webkit-details-marker]:hidden` para limpiar el marker del summary.

### Vercel Domain Automation (Fase E7, 22 Feb 2026)
- Helper centralizado en `src/lib/vercel/domains.ts` — NO usar @vercel/sdk, solo `fetch()` directo.
- Env vars: `VERCEL_TOKEN` (bearer token), `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`.
- Flujo: guardar dominio en DB → POST `/api/admin/domain/add` (Vercel API) → si no verificado, mostrar TXT record → verificar con `/api/admin/domain/verify` (DNS + Vercel).
- Cambio de dominio: eliminar anterior de Vercel (`/api/admin/domain/remove`) → guardar nuevo → añadir a Vercel.
- `domain_verified` se resetea a `false` cada vez que se cambia el dominio.

### SubmitButton Pattern (Fase E, 22 Feb 2026)
- Para server action forms, usar `useFormStatus` de `react-dom`.
- Patrón: `<SubmitButton>` que muestra spinner cuando `pending` es true.

### Dynamic Host URLs (Fase E, 22 Feb 2026)
- NO usar `NEXT_PUBLIC_BASE_URL` para construir URLs dinámicas.
- En su lugar, usar `headers()` de next para obtener host dinámicamente.

### Bug: revalidatePath en render (22 Feb 2026)
- `revalidatePath()` NO se puede llamar durante render. Solo en server actions o API routes.
- Si necesitas revalidar tras un fetch del cliente, hacerlo en la API route del servidor.

### Bug: Owner calendar_events (22 Feb 2026)
- Owner calendar NO debe leer `calendar_events` — esa es la tabla del admin.
- Owner tiene sus propios eventos via Google Calendar.

---

## Patrones Recurrentes del Usuario

- Prefiere layouts compactos sin scroll (todo visible en una pantalla).
- Valora la estética: montañas reales, no nubes; luna realista, no círculo gris.
- Pide commit + push después de cada set de cambios.
- Comunica en español, quiere respuestas en español.
- Revisa visualmente cada cambio y da feedback específico.
- Cuando dice "es todo tuyo" = libertad creativa para mejorar.

---

## Errores a Evitar

| Error | Solución |
|-------|----------|
| Q-curves en montañas SVG | Usar solo L-paths (líneas rectas, picos angulares) |
| Luna como círculo gris | Crescent: disc + shadow overlay + craters + glow |
| Widgets transparentes sobre fondo | `bg-[#0a2a35]/80 backdrop-blur-sm` en dark mode |
| Gráficas mensuales | Siempre semanales (8 semanas, weekStartsOn: 1) |
| Duplicar match en i18n JSON | Dar más contexto surrounding al Edit tool |
| `bg-white/[0.06]` en dark cards | Usar `bg-[#0a2a35]/80` para legibilidad |
| Crear /admin/analytics | Fue eliminado — NO recrear |

---

## Estado de Fases

| Fase | Estado | Fecha |
|------|--------|-------|
| Fase 1 (Gráficas, Calendario, Docs, Tickets) | ✅ Completada | — |
| Fase 2 (Analytics, Automatizaciones) | ✅ Completada | — |
| Fase 3 (i18n ES/EN/AR + RTL) | ✅ Completada | — |
| Fase 4 (AI + Design System + UX) | ✅ Completada | — |
| Fase 5 (Landing Premium + i18n) | ✅ Completada | — |
| Fase 6 (Admin Layout + Eden AI) | ✅ Completada | — |
| Fase D (Social, Emails, Opiniones merge) | ✅ Completada | 21 Feb 2026 |
| Fase E (Self-Service Platform, E1-E7) | ✅ Completada | 22 Feb 2026 |
| Fase F (Visual / UX Premium) | ✅ Completada | 21 Feb 2026 |

---

## Supabase Project

- **ID del proyecto**: Buscar en `.env.local` o `src/lib/supabase/`
- **Tablas principales**: clientes, reservas, destinos, opiniones, calendar_events, documents, support_tickets, ticket_messages, email_templates, billing_email_templates, platform_settings, automations, automation_executions, ai_chatbot_config, ai_itinerarios, social_connections, paginas_legales
- **RLS**: Habilitado en TODAS las tablas (17+)
- **Storage buckets**: profile-photos (avatares admin)
