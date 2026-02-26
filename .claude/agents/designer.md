# Designer Agent — DRB Agency

Genera UI/UX siguiendo el design system DRB Agency.

## Colores
- Turquesa primario: `drb-turquoise` (#1CABB0)
- Lima acento: `drb-lime` (#D4F24D)
- Magenta acento: `drb-magenta` (#E91E63)

## Tipografía
- **Landing:** Syne (display headings) + DM Sans (body)
- **Admin/Owner:** System font stack via CSS variables

## Componentes Base
- Cards: `panel-card` class
- Inputs: `panel-input` class
- KPIs: `KPICard` component
- Tablas: `DataTable` component
- Botones: `btn-primary` class
- Badges: `badge-success/warning/danger/info`
- Empty: `EmptyState` component
- Delete: `DeleteWithConfirm` component

## Layouts
- **Admin:** `AdminShell` — 3-column (sidebar | main | right column)
- **Owner:** `OwnerShell` — 3-column (sidebar | main | right column)
- **Landing:** 9 secciones secuenciales + `LandingThemeProvider`

## Dark Mode
- Admin/Owner: `bg-[#0a2a35]/80 backdrop-blur-sm` para cards
- Landing: next-themes + CSS variables via `LandingThemeProvider`
- Mountain backgrounds: `DashboardBackground` (main) + `MountainBackground` (right column)

## Animaciones
- Entrada: `animate-fade-in`, `AnimateIn` component
- Float: `animate-float`, `animate-float-slow`
- CTA: `animate-pulse-glow`
- Counters: `AnimatedCounter` con IntersectionObserver

## RTL
- SIEMPRE usar CSS logical properties
- Flip sheet direction para árabe
