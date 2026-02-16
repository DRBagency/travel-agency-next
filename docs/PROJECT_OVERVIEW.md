# DRB Agency - Project Overview

> **Última actualización:** 10 Febrero 2026
> **Estado:** En producción - Mejora continua activa

## 📌 TL;DR

DRB Agency es una plataforma SaaS multi-tenant B2B que proporciona software all-in-one para agencias de viajes pequeñas y medianas. Centraliza gestión web, reservas, pagos, operaciones y automatizaciones bajo un único panel.

## 🎯 Propuesta de Valor

**Para agencias de viajes:** "Everything your agency needs, in one panel"

- ✅ Web completa personalizable
- ✅ Sistema de reservas integrado
- ✅ Pagos con Stripe Connect
- ✅ Gestión de contenido (destinos, opiniones, páginas legales)
- ✅ Emails automatizados
- ✅ Panel de administración completo
- 🔄 Analytics y reportes (en desarrollo)
- 🔄 CRM y calendario (en desarrollo)
- 🔄 Generador de documentos (en desarrollo)

## 🏢 Modelo de Negocio

### Revenue Streams:
1. **Suscripciones SaaS** (mensual):
   - Start: 29€/mes (comisión 5%)
   - Grow: 59€/mes (comisión 3%)
   - Pro: 99€/mes (comisión 1%)

2. **Comisiones por reserva:**
   - Se aplica % según plan sobre cada reserva procesada
   - Cobro automático vía Stripe Connect

### Público Objetivo:
- Agencias de viajes pequeñas (1-5 empleados)
- Agencias medianas (5-20 empleados)
- Emprendedores del sector turismo
- Enfoque: España, LATAM, mercado internacional

## 🎨 Filosofía de Diseño

### Estado Actual:
- Templates básicos funcionales
- Enfoque en funcionalidad sobre estética
- Testing de features core

### Roadmap Visual:
- **Fase Actual:** Funcionalidad completa
- **Próximo:** Rediseño UX/UI premium
  - Colores corporativos: Turquesa (#1CABB0) + Lima (#D4F24D)
  - Más ancho, más espacio, menos saturación
  - Gradientes y animaciones interactivas
  - Hover effects y micro-interacciones

## 🌍 Multi-idioma (Prioridad AHORA)

**Idiomas objetivo:**
- Español (ES) - Principal
- Inglés (EN) - Internacional
- Árabe (AR) - Mercado objetivo
- Otros bajo demanda

**Implementación:**
- Sistema i18n a implementar (next-intl o react-i18next)
- Tabla `translations` en Supabase
- Selector de idioma en UI
- Auto-detección de idioma del navegador

## ⚠️ Principios Fundamentales

1. **Zero Supabase Access:** Ni owner ni clientes acceden a Supabase directamente
2. **Todo editable desde UI:** Cada tabla debe tener CRUD completo en panel
3. **Mejora continua:** Nada es definitivo, todo es mejorable
4. **Multi-tenant estricto:** Aislamiento total entre clientes
5. **B2B profesional:** Tono serio, confiable, no overselling

## 🔗 Referencias

- Producción: https://drb.agency
- Staging: https://travel-agency-next-ten.vercel.app
- Repo: GitHub (conectado con Vercel auto-deploy)
