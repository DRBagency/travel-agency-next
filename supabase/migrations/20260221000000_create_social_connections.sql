-- Social media connections for agencies (Instagram, TikTok)
-- Stores OAuth tokens, cached profile data and recent posts

CREATE TABLE IF NOT EXISTS social_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok')),

  -- OAuth tokens
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,

  -- Cached profile info
  platform_user_id TEXT,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  profile_url TEXT,

  -- Cached stats
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,

  -- Recent posts (max 12, JSONB array)
  recent_posts JSONB DEFAULT '[]'::jsonb,

  -- Sync tracking
  last_synced_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT social_connections_cliente_platform_unique UNIQUE (cliente_id, platform)
);

-- Indexes
CREATE INDEX idx_social_connections_cliente ON social_connections(cliente_id);
CREATE INDEX idx_social_connections_platform ON social_connections(platform);
CREATE INDEX idx_social_connections_token_expires ON social_connections(token_expires_at);

-- Enable RLS
ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Allow service_role full access to social_connections"
  ON social_connections FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_social_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_social_connections_updated_at
  BEFORE UPDATE ON social_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_social_connections_updated_at();
