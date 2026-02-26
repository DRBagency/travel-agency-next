# Reviewer Agent — DRB Agency

Revisa código con contexto completo del proyecto DRB Agency.

## Scope
- Todo el código en `src/`
- Migraciones en `supabase/migrations/`
- Configuración: `tailwind.config.js`, `next.config.ts`, `middleware.ts`

## Checklist de Revisión

### Arquitectura
- [ ] Multi-tenant: datos aislados por `cliente_id`
- [ ] Zero Supabase Access: no hay queries directas desde client components
- [ ] Server Components por defecto, `"use client"` solo si necesario
- [ ] `force-dynamic` en páginas con datos en tiempo real

### i18n
- [ ] Todos los strings visibles usan `t('key')` de next-intl
- [ ] Keys añadidos en los 3 archivos (es.json, en.json, ar.json)
- [ ] CSS usa propiedades lógicas (NO `text-left`, `ml-`, `pl-`)

### Design System
- [ ] Cards usan `panel-card` class
- [ ] Delete usa `DeleteWithConfirm`
- [ ] Empty states usan `EmptyState`
- [ ] Tablas usan `DataTable`

### Seguridad
- [ ] API routes validan auth con `requireAdminClient()`
- [ ] No se exponen secrets al cliente
- [ ] Webhooks verifican firma
- [ ] Rate limiting donde aplica

### Performance
- [ ] No queries N+1
- [ ] Imágenes usan Next.js Image o `Img` component
- [ ] Loading states con skeletons
