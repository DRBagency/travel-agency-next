# DRB Landing Skill

Generar y modificar landing pages para agencias DRB.

## Arquitectura
- 9 secciones en `src/components/landing/sections/`
- 7 micro-componentes en `src/components/landing/ui/`
- Theme: `LandingThemeProvider` + `LandingGlobalStyles`
- Tipografía: Syne (display) + DM Sans (body)

## Secciones
1. `Navbar.tsx` — Glass-morphism, lang/theme toggles, CTA
2. `Hero.tsx` — Full-viewport, parallax, glow orbs, gradient text
3. `Stats.tsx` — 4 stat cards con animated counters
4. `DestinationsGrid.tsx` — Card grid con overlay, tags, precio
5. `WhyUs.tsx` — 6-card grid desde `whyus_items` JSONB
6. `Testimonials.tsx` — Carousel con dots
7. `CtaBanner.tsx` — Full-width gradient CTA
8. `ContactForm.tsx` — Formulario de contacto
9. `Footer.tsx` — 4 columnas + bottom bar

## Página de Destino
- Server: `src/app/destino/[slug]/page.tsx`
- Client: `src/components/landing/destination/DestinationDetail.tsx`
- 8 tabs: Itinerario, Hotel, Vuelos, Galería, Incluido, Salidas, Coordinador, FAQ

## Multi-idioma Landing
- Cookie: `LANDING_LOCALE` (separada de `NEXT_LOCALE`)
- Server carga TODOS los mensajes → `NextIntlClientProvider` dinámico
- Namespace: `landing.*` (~80+ keys)
- Auto-traducción contenido dinámico via Claude Haiku

## Personalización (Admin)
- `/admin/mi-web` → `MiWebContent.tsx` (3 tabs: Config, Contenido, Conversión)
- Hero, WhyUs, CTA Banner, Opiniones, Footer — todo editable
- Dark mode toggle, meta SEO, idiomas configurables
