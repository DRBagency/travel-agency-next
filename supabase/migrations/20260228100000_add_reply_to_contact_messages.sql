-- Add reply fields to contact_messages
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS replied BOOLEAN DEFAULT FALSE;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS reply_message TEXT;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;
