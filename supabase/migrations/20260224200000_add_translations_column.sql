-- Add translations JSONB column to support auto-translation of content
-- Structure: { "en": { "field_name": "translated value", ... }, "ar": { ... } }

ALTER TABLE clientes
  ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}';

ALTER TABLE destinos
  ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}';

ALTER TABLE opiniones
  ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}';
