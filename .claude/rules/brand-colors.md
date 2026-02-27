# Brand Colors

Siempre usar los colores corporativos DRB:

| Color | Hex | Tailwind Class |
|-------|-----|---------------|
| Turquesa (primario) | #1CABB0 | `drb-turquoise-{50-950}` |
| Lima (acento) | #D4F24D | `drb-lime-{50-900}` |
| Magenta (acento) | #E91E63 | `drb-magenta-{500,600,700}` |

## Design System Classes
- Cards: `panel-card` — Dark: `bg-[#0a2a35]/80 backdrop-blur-sm`, Light: `bg-white/[0.52] border rgba(28,171,176,0.08)` + turquoise hover glow
- KPIs: `kpi-card` — Same base as panel-card + turquoise hover box-shadow in light
- Inputs: `panel-input` — Dark: `bg-[#0a2a35]/70`, Light: `border rgba(28,171,176,0.12)` + turquoise focus glow
- Buttons: `btn-primary`
- Badges: `badge-success`, `badge-warning`, `badge-danger`, `badge-info`
- Table rows: `table-row`
- Pages: `<div className="space-y-6 animate-fade-in">`
- Gradient text: `.gradient-text` — Light: `#0a7a7e→#5a7a08`, Dark: `#3dd8dd→#c8ec60`

## Light Mode "Opción C" (27 Feb 2026)
- **Default theme:** "dark" (layout.tsx)
- **Page background:** `#EFF3F8`
- **Sidebar:** Always dark with turquoise border `rgba(28,171,176,0.15)`
- **Header:** Glass `rgba(255,255,255,0.68)` + turquoise border `rgba(28,171,176,0.08)`
- **Cards/KPIs:** Turquoise-tinted borders + hover glow
- **Inputs:** Turquoise borders + focus glow
- **Typography:** Darker gradient text for legibility on light bg

## Componentes Obligatorios
- Delete: usar `DeleteWithConfirm`
- Empty states: usar `EmptyState`
- Tablas: usar `DataTable`
- KPIs: usar `KPICard`

## Mountain Backgrounds
- Angular L-path peaks, NO smooth Q-curves
- DashboardBackground para main, MountainBackground para right column
