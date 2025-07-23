-- Create rule_shares table for MVP
CREATE TABLE IF NOT EXISTS rule_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_code VARCHAR(14) UNIQUE NOT NULL,
  encrypted_data TEXT NOT NULL,
  encryption_metadata JSONB NOT NULL, -- {salt, iv, authTag}
  source_ide VARCHAR(20) NOT NULL,
  rule_metadata JSONB, -- {fileCount, totalSize, preview}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours',
  access_count INTEGER DEFAULT 0,
  max_access_count INTEGER DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  CONSTRAINT valid_share_code CHECK (share_code ~ '^RULABY-[A-Z0-9]{4}-[A-Z0-9]{4}$')
);

-- Create access logs table
CREATE TABLE IF NOT EXISTS share_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id UUID REFERENCES rule_shares(id) ON DELETE CASCADE,
  target_ide VARCHAR(20),
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  success BOOLEAN NOT NULL,
  error_message TEXT,
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX idx_share_code ON rule_shares(share_code) WHERE is_active = true;
CREATE INDEX idx_expires_at ON rule_shares(expires_at) WHERE is_active = true;
CREATE INDEX idx_created_at ON rule_shares(created_at DESC);
CREATE INDEX idx_share_access_logs_share_id ON share_access_logs(share_id);

-- Enable Row Level Security
ALTER TABLE rule_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_access_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (MVP)
CREATE POLICY "Allow anonymous insert on rule_shares" ON rule_shares
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on rule_shares" ON rule_shares
  FOR SELECT TO anon
  USING (is_active = true AND expires_at > NOW());

CREATE POLICY "Allow anonymous update on rule_shares" ON rule_shares
  FOR UPDATE TO anon
  USING (is_active = true)
  WITH CHECK (is_active = true);

CREATE POLICY "Allow anonymous insert on share_access_logs" ON share_access_logs
  FOR INSERT TO anon
  WITH CHECK (true);

-- Function to clean up expired shares
CREATE OR REPLACE FUNCTION cleanup_expired_shares()
RETURNS void AS $$
BEGIN
  UPDATE rule_shares
  SET is_active = false
  WHERE expires_at < NOW() AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup (requires pg_cron extension)
-- This should be set up in Supabase dashboard
-- SELECT cron.schedule('cleanup-expired-shares', '0 */6 * * *', 'SELECT cleanup_expired_shares();');