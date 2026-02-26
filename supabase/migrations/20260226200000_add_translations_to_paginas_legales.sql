-- Add translations JSONB column to paginas_legales (for auto-translating titulo)
ALTER TABLE paginas_legales
  ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}';
