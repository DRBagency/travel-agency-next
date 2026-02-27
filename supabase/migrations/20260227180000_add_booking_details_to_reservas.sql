-- Add booking_details JSONB column to reservas
-- Stores hotel, room, supplements, unit price, deposit info from BookingModal
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS booking_details JSONB DEFAULT '{}';

-- Structure:
-- {
--   "hotel": { "nombre": "...", "estrellas": 5, "suplemento": 50 },
--   "habitacion": { "tipo": "...", "suplemento": 20 },
--   "precio_unitario": 599,
--   "suplemento_total": 70,
--   "deposito_por_persona": 200
-- }
