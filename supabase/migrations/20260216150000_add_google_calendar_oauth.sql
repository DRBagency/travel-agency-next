-- Add Google Calendar OAuth columns to clientes
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS google_calendar_refresh_token TEXT;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS google_calendar_connected BOOLEAN DEFAULT false;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS google_calendar_email TEXT;
