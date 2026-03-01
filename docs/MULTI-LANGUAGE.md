# Multi-idioma — DRB Agency

> **Última actualización:** 2026-02-26

## Idiomas Soportados

| Idioma | Código | Dirección | Fuente |
|--------|--------|-----------|--------|
| Español | `es` | LTR | Default, fuente de verdad |
| English | `en` | LTR | Traducido |
| العربية | `ar` | RTL | Traducido, fuente Noto Sans Arabic |

## Arquitectura i18n

### Librería: next-intl 4.8.3
- **Routing:** Cookie-based (`NEXT_LOCALE`), sin prefijo URL
- **Config:** `src/i18n/request.ts`
- **Archivos:** `messages/{es,en,ar}.json` (~1000 keys cada uno)
- **Server action:** `src/lib/set-locale.ts` — cambio de idioma
- **Selector:** `src/components/ui/LanguageSelector.tsx` — dropdown con banderas

### Estructura de Keys
```json
{
  "common": { "save", "cancel", "delete", ... },
  "auth": { "adminLogin", "ownerLogin", ... },
  "admin": { "nav", "dashboard", "destinos", "reservas", "stripe", ... },
  "owner": { "nav", "dashboard", "clientes", "monetization", ... },
  "landing": { "navbar", "hero", "destinations", "testimonials", "contact", "footer", "chatbot" },
  "notifications": { ... },
  "booking": { ... }
}
```

### Uso en Código

```tsx
// Server Component
import { getTranslations, getLocale } from 'next-intl/server';
const t = await getTranslations('admin.destinos');
const locale = await getLocale();

// Client Component
import { useTranslations, useLocale } from 'next-intl';
const t = useTranslations('admin.destinos');
const locale = useLocale();

// Interpolación
t('greeting', { name: 'DRB' })  // "Hola, {name}" → "Hola, DRB"
```

## RTL Support (Árabe)

### HTML
```tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

### CSS Logical Properties (OBLIGATORIO)
| NO usar | Usar en su lugar |
|---------|-----------------|
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `ml-`, `mr-` | `ms-`, `me-` |
| `pl-`, `pr-` | `ps-`, `pe-` |
| `left-`, `right-` | `start-`, `end-` |
| `border-l`, `border-r` | `border-s`, `border-e` |

### Sheet Direction Flip
```tsx
<SheetContent side={locale === "ar" ? "right" : "left"}>
```

### Fuente Árabe
`Noto Sans Arabic` aplicada via `[dir="rtl"]` selector.

## Landing Multi-idioma

### Cookies Separadas
- `LANDING_LOCALE` — Cookie para landing pages (visitantes)
- `NEXT_LOCALE` — Cookie para panel admin/owner
- Evita interferencia entre panel y landing

### Carga de Mensajes
1. Server page carga TODOS los mensajes de idiomas disponibles
2. Pasa como `allMessages` prop a `HomeClient.tsx`
3. `NextIntlClientProvider` dinámico wraps el contenido
4. `LangWrapper` re-wraps cuando visitante cambia idioma via Navbar

### Namespace Landing
`landing.*` — ~150+ keys por locale (navbar, hero, stats, destinations, whyus, testimonials, ctaBanner, contact, footer, chatbot, destino detail, portal)

### Namespace Portal (E20)
`landing.portal.*` — ~67 keys por locale. Incluye:
- `login.*` — Formulario magic link, estados, errores
- `nav.*` — Navbar del portal (mis reservas, chat, logout)
- `bookings.*` — Lista de reservas (saludo, fecha, viajeros, precio, estado)
- `detail.*` — Detalle de reserva (timeline, pasajeros, hotel, precio, pagar resto)
- `chat.*` — Chat bidireccional (lista, thread, placeholder)
- `status.*` — Estados de reserva (pendiente, confirmada, deposito pagado, etc.)

También: `admin.reserva.portalChat`, `admin.reserva.noPortalMessages`, `admin.reserva.replyPlaceholder`

## Auto-Traducción de Contenido Dinámico

El contenido que las agencias escriben (textos, destinos, opiniones) se traduce automáticamente con Claude Haiku.

### Estructura en BD
```json
// Columna `translations` (JSONB) en clientes, destinos, opiniones
{
  "en": { "hero_title": "...", "itinerario": {...} },
  "ar": { "hero_title": "...", "itinerario": {...} },
  "_hashes": { "hero_title": "abc123", "itinerario": "def456" }
}
```

### Content Hashing
- Cada campo se hashea antes de traducir (`contentHash()` en auto-translate.ts)
- Hash almacenado en `translations._hashes`
- Si el hash no cambió → skip (0 tokens, 0 API calls)

### Optimizaciones
- **1 idioma por llamada** — Haiku max output 8192 tokens
- **1 llamada por invocación serverless** — Evita timeouts de Vercel
- **fieldGroup splitting** — strings por separado, cada JSONB field individualmente
- **maxDuration = 180** en endpoint de traducción
- **SDK timeout = 150s**, maxRetries = 2

### Runtime
```tsx
import { tr, makeTr } from '@/lib/translations';

// Uso directo
const titulo = tr(destino, 'nombre', currentLang, preferredLang);

// Crear helper reutilizable
const t = makeTr(destino, currentLang, preferredLang);
const titulo = t('nombre');
```

### Image URLs
Las traducciones JSONB pierden URLs de imágenes (no son texto traducible). `DestinationDetail.tsx` merge `imagen`/`avatar` desde el JSONB original.

### Tag Colors
`TagChip.tsx` mapea labels ES/EN/AR al mismo color para mantener consistencia visual.

> Última actualización: 2026-03-01
