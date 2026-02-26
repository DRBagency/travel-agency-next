# DRB Agency - Project Overview

> **Ultima actualizacion:** 26 Febrero 2026
> **Estado:** En produccion - Fases 1-6 + D + E + F + G + Auto-Traduccion completadas

## TL;DR

DRB Agency es una plataforma SaaS multi-tenant B2B que proporciona software all-in-one para agencias de viajes pequenas y medianas. Centraliza gestion web, reservas, pagos, operaciones, AI, multi-idioma y automatizaciones bajo un unico panel.

## Propuesta de Valor

**Para agencias de viajes:** "Everything your agency needs, in one panel"

- ✅ Web completa personalizable
- ✅ Sistema de reservas integrado
- ✅ Pagos con Stripe Connect
- ✅ Gestion de contenido (destinos, opiniones, paginas legales)
- ✅ Emails automatizados (6 templates + billing)
- ✅ Panel de administracion completo
- ✅ Analytics y reportes (integrado en dashboards con KPIs y graficas semanales)
- ✅ CRM y calendario (Google Calendar + pagina CRM)
- ✅ Generador de documentos (presupuestos, contratos, facturas con PDF)
- ✅ AI-powered tools (itinerarios, chatbot publico, recomendaciones, asistente libre, helpers inline)
- ✅ Multi-idioma (ES/EN/AR con soporte RTL completo)
- ✅ Self-service registration & onboarding
- ✅ Automated domain management (Vercel API)
- ✅ Social media integration (codigo listo, pendiente env vars)
- ✅ Premium design system con animaciones (Framer Motion, Lottie, glassmorphism)

## Modelo de Negocio

### Revenue Streams:
1. **Suscripciones SaaS** (mensual):
   - Start: 29EUR/mes (comision 5%)
   - Grow: 59EUR/mes (comision 3%)
   - Pro: 99EUR/mes (comision 1%)

2. **Comisiones por reserva:**
   - Se aplica % segun plan sobre cada reserva procesada
   - Cobro automatico via Stripe Connect

### Publico Objetivo:
- Agencias de viajes pequenas (1-5 empleados)
- Agencias medianas (5-20 empleados)
- Emprendedores del sector turismo
- Enfoque: Espana, LATAM, mercado internacional

## Filosofia de Diseno

### Estado Actual:
- Premium design system implementado
- Colores corporativos: Turquesa (#1CABB0) + Lima (#D4F24D) + Magenta (#E91E63)
- Glassmorphism, gradientes y animaciones interactivas
- Hover effects y micro-interacciones
- DashboardBackground SVG (montanas angulares, luna, estrellas, pinos)
- MountainBackground SVG en columna derecha
- Layout 3 columnas (sidebar colapsable | main | right column con Eden AI)

### Roadmap Visual:
- **Fase Actual:** Todas las features core completas, premium design implementado
- **Proximo:** Fase G (Landing page rediseno completo), Fase H (Mejoras tecnicas e infraestructura)

## Multi-idioma (COMPLETADO)

**Idiomas implementados:**
- Espanol (ES) - Principal / Default
- Ingles (EN) - Internacional
- Arabe (AR) - Mercado MENA (con RTL completo)

### i18n Estatico (Panel Admin/Owner)
- next-intl con cookie-based routing (`NEXT_LOCALE`), sin prefijo URL
- ~1000+ keys traducidos en `messages/es.json`, `en.json`, `ar.json`
- LanguageSelector con banderas en header de AdminShell y OwnerShell
- RTL completo para Arabe: CSS logical properties, fuente Noto Sans Arabic, SheetContent side flip
- Formateo de fechas/numeros locale-aware en todas las paginas

### i18n Dinamico (Landing Pages — Auto-Traduccion con IA)
- Cada agencia configura `preferred_language` (idioma fuente) + `available_languages` (idiomas habilitados)
- Cookie separada `LANDING_LOCALE` para no interferir con el panel admin
- Landing namespace con 80+ keys estaticos (navbar, hero, destinations, testimonials, about, contact, footer, chatbot)
- **Contenido dinamico** (textos, itinerarios, hotel, FAQs, etc.) traducido automaticamente con Claude Haiku 4.5
- Traducciones almacenadas en columna `translations` JSONB en tablas `clientes`, `destinos`, `opiniones`
- **Content hashing** para evitar re-traducir contenido sin cambios (ahorro de tokens)
- **Bulk translate "Traducir todo"** con progreso en vivo y orchestracion client-side
- Runtime helpers: `tr(obj, field, lang)` + `makeTr(obj, lang)` para leer traducciones
- Preservacion de imagenes (URLs de itinerario/hotel/coordinador se mergean del original)
- Tag colors preservados entre idiomas (ES/EN/AR mapeados al mismo color)
- BookingModal con traducciones completas a arabe
- Plan-gated: solo Grow/Pro. Start plan guarda contenido pero no traduce

## Principios Fundamentales

1. **Zero Supabase Access:** Ni owner ni clientes acceden a Supabase directamente
2. **Todo editable desde UI:** Cada tabla debe tener CRUD completo en panel
3. **Mejora continua:** Nada es definitivo, todo es mejorable
4. **Multi-tenant estricto:** Aislamiento total entre clientes
5. **B2B profesional:** Tono serio, confiable, no overselling
6. **Server Components First:** "use client" solo cuando sea necesario

## Referencias

- Produccion: https://drb.agency
- Staging: https://travel-agency-next-ten.vercel.app
- Repo: GitHub (conectado con Vercel auto-deploy)
