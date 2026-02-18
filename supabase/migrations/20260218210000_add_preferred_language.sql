-- Add preferred_language column to clientes
-- Controls the language of the public landing page (es, en, ar)
ALTER TABLE clientes
ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(5) DEFAULT 'es';
