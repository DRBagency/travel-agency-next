-- Traveler sessions for magic link auth (Portal del Viajero)
CREATE TABLE IF NOT EXISTS traveler_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast token lookup
CREATE INDEX idx_traveler_sessions_token ON traveler_sessions(token);
-- Rate limiting: email + cliente_id + created_at
CREATE INDEX idx_traveler_sessions_rate_limit ON traveler_sessions(email, cliente_id, created_at);

-- RLS
ALTER TABLE traveler_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on traveler_sessions"
  ON traveler_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);
