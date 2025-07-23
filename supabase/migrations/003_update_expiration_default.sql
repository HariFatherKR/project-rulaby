-- Update default expiration time from 30 days to 24 hours
ALTER TABLE rule_shares 
ALTER COLUMN expires_at 
SET DEFAULT NOW() + INTERVAL '24 hours';

-- Update the comment to reflect the new default
COMMENT ON COLUMN rule_shares.expires_at IS 'Share expiration time (default: 24 hours after creation)';