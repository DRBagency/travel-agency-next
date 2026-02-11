ALTER TABLE clientes
ADD COLUMN IF NOT EXISTS subscription_cancel_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN clientes.subscription_cancel_at IS 'Fecha en que se cancelará la suscripción (si está marcada para cancelación)';
