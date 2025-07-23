# Rulaby Share Architecture

## Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   MCP Client    │────▶│ Serverless API   │────▶│    Supabase     │
│ (Local Machine) │     │  (Vercel/Netlify)│     │   (Database)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Components

### 1. MCP Server (npm package)
- Runs locally on user's machine
- Handles file detection and encryption
- Calls Serverless API endpoints
- No direct database access

### 2. Serverless API
- Hosted on Vercel, Netlify, or similar
- Handles all Supabase interactions
- Rate limiting and validation
- API key authentication

### 3. Supabase
- Stores encrypted rule shares
- Row Level Security enabled
- Access logs

## Security Benefits

1. **No exposed credentials** - API keys stay on server
2. **Rate limiting** - Enforced at API level
3. **Validation** - Server-side validation
4. **Audit trail** - All requests logged

## API Endpoints

### POST /api/shares
Create a new share
```json
{
  "encryptedData": "...",
  "encryptionMetadata": {...},
  "sourceIDE": "claude-code",
  "ruleMetadata": {...},
  "expiresInDays": 30,
  "maxUses": null
}
```

### GET /api/shares/:shareCode
Retrieve a share
```json
{
  "encryptedData": "...",
  "encryptionMetadata": {...},
  "sourceIDE": "cursor"
}
```

## Implementation Plan

1. Create Next.js API routes in main project
2. Update MCP server to use fetch() instead of Supabase SDK
3. Add API key management (optional for MVP)
4. Deploy to Vercel