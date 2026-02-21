-- CRM fields: lead pipeline tracking + activity history

-- Add CRM columns to clientes
ALTER TABLE clientes
  ADD COLUMN IF NOT EXISTS lead_status TEXT DEFAULT 'lead',
  ADD COLUMN IF NOT EXISTS client_notes TEXT DEFAULT '';

-- Activity log for CRM
CREATE TABLE IF NOT EXISTS client_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,           -- note, call, email, meeting, status_change
  content TEXT NOT NULL,        -- activity description
  metadata JSONB DEFAULT '{}', -- extra data (e.g. old_status, new_status)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE client_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access to client_activities"
  ON client_activities FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX idx_client_activities_client_id ON client_activities(client_id);
CREATE INDEX idx_client_activities_created_at ON client_activities(created_at DESC);
