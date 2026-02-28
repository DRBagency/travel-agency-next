-- E17: Booking Model System
-- Adds configurable booking models to clientes and tracking columns to reservas

-- === Clientes: booking configuration ===
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS booking_model TEXT DEFAULT 'pago_completo';
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS deposit_type TEXT DEFAULT 'percentage';
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS deposit_value NUMERIC DEFAULT 30;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS payment_deadline_type TEXT DEFAULT 'before_departure';
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS payment_deadline_days INTEGER DEFAULT 30;

-- === Reservas: per-booking tracking ===
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC;
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC;
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS remaining_due_date TIMESTAMPTZ;
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS remaining_paid BOOLEAN DEFAULT FALSE;
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS remaining_stripe_session_id TEXT;
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS agency_confirmed BOOLEAN DEFAULT FALSE;
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS booking_model TEXT;
