# DRB Component Skill

Crear componentes UI siguiendo el design system DRB Agency.

## Plantilla: Nueva Página Admin

```tsx
// src/app/admin/[seccion]/page.tsx
import { getTranslations } from 'next-intl/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";

export default async function SeccionPage() {
  const t = await getTranslations('admin.seccion');
  const cookieStore = await cookies();
  const clienteId = cookieStore.get('clienteId')?.value;

  const { data } = await supabaseAdmin
    .from('tabla')
    .select('*')
    .eq('cliente_id', clienteId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {t('title')}
        </h1>
        <p className="text-gray-400 dark:text-white/40">{t('subtitle')}</p>
      </div>
      {/* Content */}
    </div>
  );
}
```

## Plantilla: Client Component

```tsx
"use client";
import { useTranslations } from 'next-intl';

export function MiComponente({ data }: { data: any[] }) {
  const t = useTranslations('admin.seccion');

  return (
    <div className="panel-card p-6">
      {/* Content */}
    </div>
  );
}
```

## Classes Obligatorias
- Cards: `panel-card`
- Inputs: `panel-input`
- KPIs: `kpi-card`
- Buttons: `btn-primary`
- Badges: `badge-success/warning/danger/info`
- Table rows: `table-row`
- RTL: Siempre propiedades lógicas CSS
