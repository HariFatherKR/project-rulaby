-- Fix share_code length issue
ALTER TABLE rule_shares 
DROP CONSTRAINT valid_share_code;

ALTER TABLE rule_shares 
ALTER COLUMN share_code TYPE VARCHAR(16);

ALTER TABLE rule_shares 
ADD CONSTRAINT valid_share_code CHECK (share_code ~ '^RULABY-[A-Z0-9]{4}-[A-Z0-9]{4}$');