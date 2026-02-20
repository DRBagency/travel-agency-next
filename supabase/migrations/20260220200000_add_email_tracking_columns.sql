-- Add email tracking columns to reservas
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS email_recordatorio_sent BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS email_seguimiento_sent BOOLEAN NOT NULL DEFAULT FALSE;
