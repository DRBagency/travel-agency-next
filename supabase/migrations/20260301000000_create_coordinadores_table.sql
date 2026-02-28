-- Create coordinadores library table
CREATE TABLE IF NOT EXISTS coordinadores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  rol TEXT DEFAULT '',
  descripcion TEXT DEFAULT '',
  idiomas JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK column to destinos
ALTER TABLE destinos ADD COLUMN IF NOT EXISTS coordinador_id UUID REFERENCES coordinadores(id) ON DELETE SET NULL;

-- RLS
ALTER TABLE coordinadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on coordinadores"
  ON coordinadores FOR ALL
  USING (true)
  WITH CHECK (true);

-- Updated_at trigger
CREATE TRIGGER update_coordinadores_updated_at
  BEFORE UPDATE ON coordinadores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_coordinadores_cliente_id ON coordinadores(cliente_id);
CREATE INDEX IF NOT EXISTS idx_destinos_coordinador_id ON destinos(coordinador_id);
