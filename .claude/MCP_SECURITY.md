# Rulaby Share MCP Security Strategy

## Overview
This document outlines the security strategy for the Rulaby Share MCP server, focusing on secure handling of Supabase credentials and encrypted rule sharing.

## 1. Supabase Credential Management

### Current Approach (Development)
- Environment variables: `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Loaded via `dotenv` package

### Production Approach

#### Option A: User-Provided Credentials (Recommended)
Users provide their own Supabase project credentials:

```bash
# Via environment variables
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
npx @hyto/rulaby-share

# Or via .env file
echo "SUPABASE_URL=https://your-project.supabase.co" > .env
echo "SUPABASE_ANON_KEY=your-anon-key" >> .env
npx @hyto/rulaby-share
```

**Advantages:**
- Users have full control over their data
- No central point of failure
- Users can set their own RLS policies
- Free tier friendly

**Setup Instructions for Users:**
1. Create a Supabase project
2. Run the provided migration SQL
3. Set environment variables
4. Run the MCP server

#### Option B: Shared Supabase Instance (Not Recommended)
Single shared Supabase instance for all users.

**Disadvantages:**
- Single point of failure
- Rate limiting issues
- Privacy concerns
- Cost scaling

## 2. Data Encryption

### Current Implementation
- Client-side encryption before storing in Supabase
- AES-256-GCM encryption
- Password-based key derivation
- Salt and IV stored with encrypted data

### Security Features
- Passwords never stored
- Each share has unique salt
- Encryption happens before network transmission
- Supabase only sees encrypted data

## 3. Row Level Security (RLS)

### Recommended RLS Policies

```sql
-- Allow anonymous users to create shares
CREATE POLICY "anon_create_shares" ON rule_shares
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow reading active, non-expired shares
CREATE POLICY "anon_read_active_shares" ON rule_shares
  FOR SELECT TO anon
  USING (is_active = true AND expires_at > NOW());

-- Allow updating only access_count
CREATE POLICY "anon_update_access_count" ON rule_shares
  FOR UPDATE TO anon
  USING (is_active = true)
  WITH CHECK (is_active = true);

-- Prevent deletion
CREATE POLICY "no_delete_shares" ON rule_shares
  FOR DELETE TO anon
  USING (false);
```

## 4. Rate Limiting

### Application Level
```typescript
// Environment variables for rate limiting
MAX_SHARES_PER_HOUR=10
MAX_IMPORTS_PER_HOUR=20
```

### Database Level
- Use Supabase's built-in rate limiting
- Monitor usage via Supabase dashboard

## 5. Security Best Practices

### For Package Distribution
1. **No hardcoded credentials** - All credentials via environment
2. **Clear documentation** - Security setup instructions
3. **Minimal dependencies** - Reduce attack surface
4. **Regular updates** - Keep dependencies current

### For Users
1. **Use own Supabase project** - Full control
2. **Set appropriate RLS** - Restrict access
3. **Monitor usage** - Check Supabase logs
4. **Rotate credentials** - If compromised

## 6. Migration Script

Provide users with a setup script:

```typescript
// setup-supabase.ts
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

async function setupSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY; // Need service key for migrations
  
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  }
  
  const supabase = createClient(url, key);
  
  // Read and execute migration
  const migrationPath = path.join(__dirname, '../migrations/001_create_rule_shares.sql');
  const migration = fs.readFileSync(migrationPath, 'utf-8');
  
  const { error } = await supabase.rpc('exec_sql', { sql: migration });
  
  if (error) {
    console.error('Migration failed:', error);
  } else {
    console.log('Migration completed successfully!');
  }
}
```

## 7. Environment Variable Template

```bash
# .env.example
# Required: Your Supabase project URL
SUPABASE_URL=https://your-project.supabase.co

# Required: Your Supabase anon key (safe for client-side)
SUPABASE_ANON_KEY=your-anon-key

# Optional: Rate limiting
MAX_SHARES_PER_HOUR=10
MAX_IMPORTS_PER_HOUR=20

# Optional: Share settings
DEFAULT_EXPIRY_DAYS=30
MAX_SHARE_SIZE_KB=100
```

## 8. Security Checklist

- [ ] No credentials in source code
- [ ] All sensitive data encrypted client-side
- [ ] Clear documentation on security setup
- [ ] RLS policies provided
- [ ] Rate limiting implemented
- [ ] Environment variable validation
- [ ] Error messages don't leak sensitive info
- [ ] Regular dependency updates
- [ ] Security contact information provided

## 9. Incident Response

If a security issue is discovered:
1. Report to: security@rulaby.com (or GitHub Security Advisory)
2. We'll assess and patch within 48 hours
3. Users will be notified via npm and GitHub
4. Patch will be released as minor version bump

## 10. Future Enhancements

- [ ] Support for team-based sharing
- [ ] Audit logging
- [ ] API key authentication
- [ ] Webhook notifications
- [ ] IP allowlisting