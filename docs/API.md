# Rulaby Share API Documentation

## Base URL

Production: `https://api.rulaby.dev/api`
Development: `http://localhost:3000/api`

## Authentication

Currently, the API is open for MVP. Future versions will support API key authentication via `X-API-Key` header.

## Endpoints

### 1. Create Share

Create a new encrypted rule share.

**Endpoint:** `POST /shares`

**Request Body:**
```json
{
  "encryptedData": "string",
  "encryptionMetadata": {
    "salt": "string",
    "iv": "string",
    "authTag": "string"
  },
  "sourceIDE": "string",
  "ruleMetadata": {
    "fileCount": 1,
    "totalSize": 4096,
    "preview": "string (optional)"
  },
  "expiresInDays": 30,
  "maxUses": null
}
```

**Response:**
```json
{
  "shareCode": "RULABY-XXXX-XXXX",
  "expiresAt": "2025-08-22T12:00:00Z"
}
```

**Status Codes:**
- `201`: Share created successfully
- `400`: Invalid request data
- `429`: Rate limit exceeded
- `500`: Server error

### 2. Retrieve Share

Get encrypted rule data using a share code.

**Endpoint:** `GET /shares/{shareCode}`

**Path Parameters:**
- `shareCode`: The share code (e.g., RULABY-XXXX-XXXX)

**Response:**
```json
{
  "encryptedData": "string",
  "encryptionMetadata": {
    "salt": "string",
    "iv": "string",
    "authTag": "string"
  },
  "sourceIDE": "string",
  "ruleMetadata": {
    "fileCount": 1,
    "totalSize": 4096,
    "preview": "string"
  }
}
```

**Status Codes:**
- `200`: Share retrieved successfully
- `400`: Invalid share code format
- `403`: Share has reached usage limit
- `404`: Share not found or expired
- `429`: Rate limit exceeded
- `500`: Server error

### 3. Increment Access Count

Record that a share has been accessed (optional endpoint).

**Endpoint:** `POST /shares/{shareCode}/access`

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200`: Always returns success (non-critical operation)

## Rate Limiting

- **Create Share**: 10 requests per hour per IP (configurable)
- **Retrieve Share**: 20 requests per hour per IP (configurable)

Rate limits are enforced per IP address with a 1-hour rolling window.

## CORS

The API supports CORS with the following configuration:
- **Allowed Origins**: `*` (all origins)
- **Allowed Methods**: `GET`, `POST`, `OPTIONS`
- **Allowed Headers**: `Content-Type`, `X-API-Key`

## Error Responses

All error responses follow this format:
```json
{
  "error": "Error message description"
}
```

## Security Notes

1. **Encryption**: All rule data is encrypted client-side before transmission
2. **No Storage**: The API never stores passwords or decrypted content
3. **Automatic Expiration**: Shares expire after the specified period
4. **Usage Limits**: Optional limits on how many times a share can be accessed

## Example Usage

### JavaScript/TypeScript
```typescript
// Create a share
const response = await fetch('https://api.rulaby.dev/shares', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    encryptedData: encryptedData,
    encryptionMetadata: metadata,
    sourceIDE: 'claude-code',
    expiresInDays: 30
  })
});

const { shareCode } = await response.json();
```

### cURL
```bash
# Create a share
curl -X POST https://api.rulaby.dev/shares \
  -H "Content-Type: application/json" \
  -d '{
    "encryptedData": "...",
    "encryptionMetadata": {...},
    "sourceIDE": "cursor",
    "expiresInDays": 30
  }'

# Retrieve a share
curl https://api.rulaby.dev/shares/RULABY-XXXX-XXXX
```