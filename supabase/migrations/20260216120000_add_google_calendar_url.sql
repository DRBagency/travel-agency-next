-- Add google_calendar_url field to clientes table
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS google_calendar_url text;
