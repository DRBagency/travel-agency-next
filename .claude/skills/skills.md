# DRB Agency — Skills Reference

> Patrones y recetas reutilizables para tareas comunes en el proyecto.

---

## Skill: Nueva Página Admin

```bash
# 1. Crear page.tsx en src/app/admin/{seccion}/
# 2. Patrón:
```

```tsx
import { getTranslations } from "next-intl/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NuevaPagina() {
  const t = await getTranslations("admin.seccion");

  const { data } = await supabaseAdmin
    .from("tabla")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {t("title")}
        </h1>
        <p className="text-gray-400 dark:text-white/40">{t("subtitle")}</p>
      </div>
      {/* Contenido */}
    </div>
  );
}
```

```
# 3. Añadir nav item en AdminShell.tsx (grupo correcto)
# 4. Añadir i18n keys en es.json, en.json, ar.json
# 5. Crear loading.tsx con skeleton
```

---

## Skill: Nuevo Widget Dashboard

```tsx
// Patrón: Server component, panel-card, max 3-5 items
import { getTranslations } from "next-intl/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  items: Array<{ id: string; title: string; date: string }>;
}

export default async function MiWidget({ items }: Props) {
  const t = await getTranslations("admin.miWidget");

  return (
    <div className="panel-card p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-white/80">
          {t("title")}
        </h3>
        <Link href="/admin/seccion" className="text-xs text-drb-turquoise-500 hover:underline">
          {t("viewAll")}
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-white/30">{t("empty")}</p>
      ) : (
        <div className="space-y-2">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-xs">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="truncate text-gray-600 dark:text-white/60">{item.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Skill: Añadir i18n Keys

```
# Siempre añadir en los 3 archivos:
# 1. messages/es.json (fuente de verdad)
# 2. messages/en.json (traducción inglés)
# 3. messages/ar.json (traducción árabe)
#
# Estructura de namespace: "panel.seccion.key"
# Ejemplo: "admin.crm.title", "owner.dashboard.supportTickets"
#
# IMPORTANTE: Cuando se edita JSON, dar suficiente contexto
# surrounding al Edit tool para evitar duplicados.
```

---

## Skill: Nueva Gráfica Semanal

```tsx
// Patrón para datos semanales (8 semanas)
import { subWeeks, startOfWeek, endOfWeek, format } from "date-fns";

const now = new Date();
const weeklyData = [];

for (let i = 7; i >= 0; i--) {
  const weekDate = subWeeks(now, i);
  const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 }); // Lunes
  const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 });
  const label = format(weekStart, "dd MMM");

  // Filtrar datos entre weekStart y weekEnd
  const count = data.filter(
    (d) => new Date(d.created_at) >= weekStart && new Date(d.created_at) <= weekEnd
  ).length;

  weeklyData.push({ label, value: count });
}

// Proyección: 4 semanas futuras con regresión lineal
```

---

## Skill: SVG Mountain Path

```
# Montañas con picos angulares (L-paths, NUNCA Q-curves):
# Patrón: M0 {base} L{x1} {peak1} L{x2} {valley1} L{x3} {peak2} ... L1600 {end} L1600 900 L0 900Z
#
# Tips:
# - Peaks: y entre 340-480 (más alto = más arriba)
# - Valleys: y entre 420-540
# - Incrementos x: 70-100px entre puntos
# - 4 capas dark mode (opacity 0.15-0.22), 3 capas light mode (0.14-0.30)
# - Colores dark: #33CFD7, #1CABB0, #126771, #0C4551
# - Colores light: #B3EFF2, #80E5E9, #4DD8DE
```

---

## Skill: Collapsible Filter

```tsx
// Patrón: <details> con summary estilizado
<details className="panel-card">
  <summary className="flex items-center gap-2 p-4 cursor-pointer list-none text-sm font-medium text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70 transition-colors [&::-webkit-details-marker]:hidden">
    <Filter className="w-4 h-4" />
    {t("filters")}
  </summary>
  <div className="px-4 pb-4 border-t border-gray-100 dark:border-white/[0.06]">
    <form method="get" className="flex flex-wrap items-center gap-3 pt-3">
      {/* inputs */}
    </form>
  </div>
</details>
```

---

## Skill: Supabase Query con Join

```tsx
// Patrón: Query con relación (ej: tickets con cliente)
const { data: tickets } = await supabaseAdmin
  .from("support_tickets")
  .select("id, subject, status, created_at, clientes(nombre)")
  .order("created_at", { ascending: false })
  .limit(3);

// Acceso: ticket.clientes?.nombre
```

---

## Skill: Nuevo Componente Client

```tsx
"use client";

import { useTranslations } from "next-intl";

interface Props {
  // typed props
}

export default function MiComponente({ ...props }: Props) {
  const t = useTranslations("admin.seccion");

  return (
    <div className="panel-card p-4">
      {/* usar logical properties: text-start, ms-2, ps-4 */}
      {/* NUNCA: text-left, ml-2, pl-4 */}
    </div>
  );
}
```

---

## Skill: Añadir Dominio a Vercel via API

```typescript
// Helper: src/lib/vercel/domains.ts
import { addDomainToVercel, verifyDomainOnVercel, removeDomainFromVercel } from "@/lib/vercel/domains";

// Añadir dominio:
const result = await addDomainToVercel("tuagencia.com");
// → { added: true, verified: false, verification: [{ type: "TXT", domain: "_vercel.tuagencia.com", value: "vc-..." }] }

// Verificar:
const verify = await verifyDomainOnVercel("tuagencia.com");
// → { verified: true/false }

// Eliminar:
const remove = await removeDomainFromVercel("tuagencia.com");
// → { removed: true }

// Env vars necesarias: VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_TEAM_ID
```

---

## Skill: SubmitButton para Server Action Forms

```tsx
"use client";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-50 flex items-center gap-2">
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
```

---

## Skill: Domain Verification Flow (DNS + Vercel)

```typescript
// 1. Save domain to DB (reset domain_verified)
// POST /api/admin/domain/save { domain: "new.com" }

// 2. Add domain to Vercel project
// POST /api/admin/domain/add → calls Vercel API POST /v10/projects/{id}/domains

// 3. If not auto-verified, show TXT/CNAME instructions to user

// 4. User configures DNS, clicks "Verify"
// POST /api/admin/domain/verify → dns.resolveCname() + Vercel API POST /v9/projects/{id}/domains/{domain}/verify

// 5. If changing domain: remove old from Vercel first
// POST /api/admin/domain/remove { domain: "old.com" } → Vercel API DELETE /v9/projects/{id}/domains/{domain}
```
