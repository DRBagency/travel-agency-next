# Landing Pages — DRB Agency

> **Última actualización:** 2026-02-26

## Arquitectura

Cada agencia cliente tiene su propia landing page pública, servida desde su dominio personalizado. El middleware detecta el dominio → busca el cliente → carga sus datos.

## Componentes Landing (`src/components/landing/`)

### 9 Secciones Principales
| Componente | Archivo | Descripción |
|------------|---------|-------------|
| `LandingNavbar` | `sections/Navbar.tsx` | Navbar glass-morphism fija: logo + links + lang/theme toggles + CTA |
| `LandingHero` | `sections/Hero.tsx` | Hero full-viewport: parallax, glow orbs, gradient text, dual CTAs |
| `LandingStats` | `sections/Stats.tsx` | 4 stat cards con animated counters |
| `LandingDestinations` | `sections/DestinationsGrid.tsx` | Card grid: overlay text + tags + precio. Click → `/destino/[slug]` |
| `LandingWhyUs` | `sections/WhyUs.tsx` | 6-card grid desde `whyus_items` JSONB |
| `LandingTestimonials` | `sections/Testimonials.tsx` | Carousel auto-advance con dots |
| `LandingCTABanner` | `sections/CtaBanner.tsx` | Full-width gradient card con CTA |
| `LandingContact` | `sections/ContactForm.tsx` | Formulario: nombre, email, teléfono, destino, mensaje |
| `LandingFooter` | `sections/Footer.tsx` | 4 columnas + bottom bar |

### 7 Micro-componentes (`landing/ui/`)
`AnimateIn`, `Img`, `Accordion`, `TagChip`, `StatusBadge`, `EffortDots`, `GlowOrb`

### Theme System
- `LandingThemeProvider` — next-themes wrapper + CSS variable injection
- `LandingGlobalStyles` — Template CSS classes (`.navl`, `.dcard`, `.tab-btn`, `.glow`, `.floating`, `.noise-bg`)
- `landing-theme.ts` — Palettes light/dark con CSS variable mapping
- Tipografía: **Syne** (display headings) + **DM Sans** (body) via `next/font/google`

## Página de Destino Individual

- **Ruta:** `/destino/[slug]/page.tsx` (server) + `DestinationDetail.tsx` (client)
- **8 tabs:** Itinerario, Hotel, Vuelos, Galería, Incluido, Salidas, Coordinador, FAQ
- **Features:** Split gallery (65%/35% + auto-rotate), quick stats bar, tags + effort dots, bottom CTA
- **Navbar + Footer** persistentes con lang switching
- **Preview:** `/preview/[slug]/destino/[destinoSlug]`

## Multi-idioma Landing

- Cookie separada: `LANDING_LOCALE` (landing) vs `NEXT_LOCALE` (admin panel)
- Server pages cargan TODOS los mensajes de idiomas disponibles
- `HomeClient.tsx` wraps con `NextIntlClientProvider` dinámico
- `LangWrapper` re-wraps content cuando el visitante cambia idioma
- Namespace: `landing.*` (~80+ keys por locale)

## Auto-traducción de Contenido

El contenido dinámico (textos de hero, destinos, opiniones) se traduce automáticamente via Claude Haiku. Ver `docs/AI-FEATURES.md` y `docs/MULTI-LANGUAGE.md`.

## Admin: Personalización (`/admin/mi-web`)

`MiWebContent.tsx` — 3 tabs:
1. **Configuración:** Dominio + dark mode + meta SEO + idiomas
2. **Contenido:** Hero, WhyUs, CTA Banner, Opiniones, Footer
3. **Conversión:** Contacto + otros

Cada sección es editable con campos de texto + `AIDescriptionButton` para generar textos con IA.

## Datos en Base de Datos

### Tabla `clientes` (campos landing)
- `hero_title`, `hero_subtitle`, `hero_description`, `hero_badge`, `hero_cta_text`, `hero_cta_text_secondary`, `hero_cta_link_secondary`
- `whyus_items` (JSONB: `[{icon, title, desc}]`)
- `cta_banner_title`, `cta_banner_description`, `cta_banner_cta_text`
- `footer_description`
- `dark_mode_enabled`, `meta_title`, `meta_description`
- `preferred_language`, `available_languages`
- `translations` (JSONB con traducciones por idioma)

### Tabla `destinos` (campos detalle)
25+ columnas: `slug`, `subtitle`, `tagline`, `badge`, `descripcion_larga`, `galeria`, `coordinador`, `hotel`, `vuelos`, `incluido`, `no_incluido`, `salidas`, `faqs`, `clima`, `tags`, `highlights`, `esfuerzo`, etc.

## Bugs Conocidos
- **Bloque A #2:** Botón "Volver" en preview redirige al sitio corporativo en vez de a la landing del cliente
- **Bloque C #10:** Imágenes de galería aparecen estiradas

> Última actualización: 2026-02-26
