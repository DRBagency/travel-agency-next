# Brand Colors

Siempre usar los colores corporativos DRB:

| Color | Hex | Tailwind Class |
|-------|-----|---------------|
| Turquesa (primario) | #1CABB0 | `drb-turquoise-{50-950}` |
| Lima (acento) | #D4F24D | `drb-lime-{50-900}` |
| Magenta (acento) | #E91E63 | `drb-magenta-{500,600,700}` |

## Design System Classes
- Cards: `panel-card` (bg-white/95 dark:bg-[#0a2a35]/80 backdrop-blur-sm)
- Inputs: `panel-input` (dark:bg-[#0a2a35]/70)
- KPIs: `kpi-card`
- Buttons: `btn-primary`
- Badges: `badge-success`, `badge-warning`, `badge-danger`, `badge-info`
- Table rows: `table-row`
- Pages: `<div className="space-y-6 animate-fade-in">`

## Componentes Obligatorios
- Delete: usar `DeleteWithConfirm`
- Empty states: usar `EmptyState`
- Tablas: usar `DataTable`
- KPIs: usar `KPICard`

## Mountain Backgrounds
- Angular L-path peaks, NO smooth Q-curves
- DashboardBackground para main, MountainBackground para right column
