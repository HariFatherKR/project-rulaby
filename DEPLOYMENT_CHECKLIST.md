# 🚀 Deployment Checklist

## Vercel Deployment (API Server)

### 1. Environment Variables
Set these in Vercel Dashboard (Project Settings → Environment Variables):

**Required:**
- `SUPABASE_URL` = `https://your-project-id.supabase.co`
- `SUPABASE_ANON_KEY` = `your-anon-key-from-supabase-dashboard`

**Optional:**
- `MAX_SHARES_PER_HOUR` = `10` (default)
- `MAX_IMPORTS_PER_HOUR` = `20` (default)

**Note:** Get these values from Supabase Dashboard → Settings → API

### 2. Database Setup
Run migrations in Supabase:
```sql
-- Run files in order:
-- 1. supabase/migrations/001_create_rule_shares.sql
-- 2. supabase/migrations/002_fix_share_code_length.sql
```

### 3. Deploy Command
```bash
vercel --prod
```

### 4. Post-Deployment
- Update your domain DNS to point to Vercel
- Test API endpoints:
  - `GET /api` - Health check
  - `POST /api/v1/shares` - Create share
  - `GET /api/v1/shares/[shareCode]` - Retrieve share

## npm Deployment (MCP Server)

### 1. Pre-publish Checklist
- ✅ Package name: `@hyto/rulaby-mcp-server`
- ✅ Version: 1.0.0
- ✅ Dependencies: Only `@modelcontextprotocol/sdk`
- ✅ API URL: `https://api.rulaby.dev/api/v1` (hardcoded)

### 2. Build & Test
```bash
cd mcp-server
npm run build
npm pack --dry-run
```

### 3. Publish
```bash
npm login
npm publish --access public
```

### 4. Post-Deployment
- Verify installation: `npm install -g @hyto/rulaby-mcp-server`
- Update MCP client configuration:
```json
{
  "mcpServers": {
    "rulaby-mcp-server": {
      "command": "npx",
      "args": ["@hyto/rulaby-mcp-server"]
    }
  }
}
```

## Security Notes
- Never commit `.env.local` file
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Monitor rate limits in production
- Set up Supabase RLS policies correctly

## Monitoring
- Check Vercel Functions logs
- Monitor Supabase database usage
- Track API rate limit hits
- Review share expiration cleanup