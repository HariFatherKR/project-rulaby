import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check the health of each endpoint
  const endpoints = {
    shares: false,
    memory: false
  }

  // Test shares endpoint
  try {
    // Use the deployed domain or localhost
    const baseUrl = process.env.VERCEL_URL 
      ? `https://api.rulaby.dev` 
      : `http://localhost:${process.env.PORT || 3000}`
    
    const sharesResponse = await fetch(`${baseUrl}/api/v1/shares/test-health`, {
      method: 'GET',
      headers: { 'x-health-check': 'true' }
    })
    endpoints.shares = sharesResponse.ok
  } catch (error) {
    console.error('Health check error:', error)
    endpoints.shares = false
  }

  // Memory endpoint is not implemented yet
  endpoints.memory = false

  res.status(200).json({ 
    message: 'Rulaby API - Secure Rule Sharing for AI IDEs',
    version: '1.0.0',
    status: 'healthy',
    endpoints,
    services: {
      shares: {
        description: 'Create and retrieve encrypted rule shares',
        endpoints: [
          'POST /api/v1/shares - Create a new share',
          'GET /api/v1/shares/[shareCode] - Retrieve a share'
        ]
      },
      mcp: {
        description: 'MCP server integration for IDE rule sharing',
        package: '@hyto/rulaby-mcp-server'
      }
    }
  })
}