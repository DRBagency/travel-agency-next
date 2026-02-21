-- Fix advisor warnings

-- 1. Fix function search_path mutable for update_social_connections_updated_at
ALTER FUNCTION public.update_social_connections_updated_at() SET search_path = public;

-- 2. Fix contact_messages overlapping policies
-- Scope each policy to its intended role to avoid multiple permissive overlap
DROP POLICY IF EXISTS "Service role full access on contact_messages" ON contact_messages;
CREATE POLICY "Service role full access on contact_messages"
  ON contact_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can insert contact_messages" ON contact_messages;
CREATE POLICY "Anon can insert contact_messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);
