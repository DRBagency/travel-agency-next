# Zero Supabase Access

**NUNCA** acceder a Supabase directamente desde el navegador (excepto Auth login).

## Regla
- Todo acceso a datos debe pasar por API routes o server actions
- Usar `supabaseAdmin` (service_role) en el servidor — bypasses RLS
- Anon key (`supabase`) solo para Supabase Auth login + lectura pública de destinos activos
- Cada tabla DEBE tener UI completa de gestión (CRUD) en los paneles correspondientes

## Patrón Server
```ts
import { supabaseAdmin } from "@/lib/supabase-server";
const { data, error } = await supabaseAdmin.from("tabla").select("*");
```

## Patrón Auth Admin
```ts
import { requireAdminClient } from "@/lib/requireAdminClient";
const { clienteId } = await requireAdminClient(request);
```

## Patrón Auth Portal (Viajero)
```ts
import { requireTraveler } from "@/lib/requireTraveler";
const { email, clienteId, client } = await requireTraveler();
```
