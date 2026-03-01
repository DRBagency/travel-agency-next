-- Portal messages for traveler-agency chat
CREATE TABLE IF NOT EXISTS portal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('traveler', 'agency')),
  sender_email TEXT NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Messages by reserva (chat thread)
CREATE INDEX idx_portal_messages_reserva ON portal_messages(reserva_id, created_at);
-- Messages by client (admin overview)
CREATE INDEX idx_portal_messages_cliente ON portal_messages(cliente_id, created_at);

-- RLS
ALTER TABLE portal_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on portal_messages"
  ON portal_messages
  FOR ALL
  USING (true)
  WITH CHECK (true);
