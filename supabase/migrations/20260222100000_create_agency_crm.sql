-- ============================================================
-- Agency CRM: agency_customers + agency_customer_activities
-- ============================================================

-- 1. agency_customers
CREATE TABLE agency_customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  lead_status TEXT DEFAULT 'nuevo',
  notes TEXT DEFAULT '',
  total_bookings INTEGER DEFAULT 0,
  total_spent NUMERIC(10,2) DEFAULT 0,
  first_booking_at TIMESTAMPTZ,
  last_booking_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Unique per agency + email (case-insensitive)
CREATE UNIQUE INDEX agency_customers_cliente_email_uniq
  ON agency_customers(cliente_id, LOWER(email)) WHERE email IS NOT NULL;

-- Indexes
CREATE INDEX agency_customers_cliente_id_idx ON agency_customers(cliente_id);
CREATE INDEX agency_customers_lead_status_idx ON agency_customers(lead_status);
CREATE INDEX agency_customers_updated_at_idx ON agency_customers(updated_at DESC);

-- RLS
ALTER TABLE agency_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role full access on agency_customers"
  ON agency_customers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- updated_at trigger
CREATE TRIGGER update_agency_customers_updated_at
  BEFORE UPDATE ON agency_customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 2. agency_customer_activities
CREATE TABLE agency_customer_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES agency_customers(id) ON DELETE CASCADE NOT NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX agency_customer_activities_customer_id_idx ON agency_customer_activities(customer_id);
CREATE INDEX agency_customer_activities_cliente_id_idx ON agency_customer_activities(cliente_id);
CREATE INDEX agency_customer_activities_created_at_idx ON agency_customer_activities(created_at DESC);

-- RLS
ALTER TABLE agency_customer_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role full access on agency_customer_activities"
  ON agency_customer_activities
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
