# DRB Database Skill

Queries y migraciones Supabase para DRB Agency.

## Principio: Zero Supabase Access
Todo acceso via `supabaseAdmin` en server-side. NUNCA desde client components.

## Plantilla: Migración SQL

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_descripcion.sql

-- Crear tabla
CREATE TABLE IF NOT EXISTS nueva_tabla (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  -- campos...
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE nueva_tabla ENABLE ROW LEVEL SECURITY;

-- Policy para service_role (bypasses RLS pero es buena práctica)
CREATE POLICY "service_role_all" ON nueva_tabla
  FOR ALL USING (true) WITH CHECK (true);

-- Trigger updated_at
CREATE TRIGGER update_nueva_tabla_updated_at
  BEFORE UPDATE ON nueva_tabla
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Checklist Nueva Tabla
1. Migración SQL en `supabase/migrations/`
2. `supabase db push`
3. RLS habilitado + policies
4. Trigger `updated_at`
5. UI CRUD completa
6. Server actions / API routes
7. Validaciones frontend
8. Actualizar DATABASE_SCHEMA.md

## Queries Comunes

```ts
// Select con join
const { data } = await supabaseAdmin
  .from('reservas')
  .select('*, destinos(nombre, precio)')
  .eq('cliente_id', clienteId)
  .order('created_at', { ascending: false });

// Upsert
const { data } = await supabaseAdmin
  .from('tabla')
  .upsert({ id, ...fields }, { onConflict: 'id' })
  .select()
  .single();

// JSONB update
const { error } = await supabaseAdmin
  .from('clientes')
  .update({ translations: nuevoJsonb })
  .eq('id', clienteId);
```

## Migraciones Existentes
24 archivos en `supabase/migrations/` (desde 20260209 hasta 20260224).

## Tablas Principales
27 tablas con RLS. Ver `docs/DATABASE_SCHEMA.md` para schema completo.
