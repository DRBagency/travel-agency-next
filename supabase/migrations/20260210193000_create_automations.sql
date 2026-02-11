-- Tabla de automatizaciones
CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB,
  action_type TEXT NOT NULL,
  action_config JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de ejecuciones de automatizaciones
CREATE TABLE IF NOT EXISTS automation_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  error_message TEXT,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_automations_active ON automations(active);
CREATE INDEX idx_automation_executions_automation ON automation_executions(automation_id);

ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access to automations"
  ON automations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service_role full access to automation_executions"
  ON automation_executions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
