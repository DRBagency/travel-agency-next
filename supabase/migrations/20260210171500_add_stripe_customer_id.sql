-- Añadir columna stripe_customer_id a la tabla clientes
ALTER TABLE clientes
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Añadir índice para búsquedas rápidas por customer_id
CREATE INDEX IF NOT EXISTS idx_clientes_stripe_customer_id
ON clientes(stripe_customer_id);

-- Comentario explicativo
COMMENT ON COLUMN clientes.stripe_customer_id IS 'ID del customer en Stripe para billing/suscripciones del SaaS';
