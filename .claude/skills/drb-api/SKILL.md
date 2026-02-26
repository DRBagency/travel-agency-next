# DRB API Skill

Crear y modificar API routes en DRB Agency.

## Ubicación
`src/app/api/` — 63 route files

## Plantilla: API Route Admin

```ts
// src/app/api/admin/[seccion]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { requireAdminClient } from '@/lib/requireAdminClient';

export async function GET(request: NextRequest) {
  try {
    const { clienteId } = await requireAdminClient(request);

    const { data, error } = await supabaseAdmin
      .from('tabla')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { clienteId } = await requireAdminClient(request);
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('tabla')
      .insert({ ...body, cliente_id: clienteId })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

## Plantilla: Route con maxDuration (AI/traducción)

```ts
export const maxDuration = 180; // Vercel Pro permite hasta 300

export async function POST(request: NextRequest) {
  // ...
}
```

## Patrones
- Admin auth: `requireAdminClient(request)` → `{ clienteId }`
- Domain validation: `requireValidApiDomain(request)`
- Supabase: siempre `supabaseAdmin` (server-side, bypasses RLS)
- Errors: try/catch con NextResponse.json({ error }, { status })
- Webhooks: verificar firma, devolver 200 siempre
