import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only respond to health check requests
  if (req.headers['x-health-check'] !== 'true') {
    return res.status(404).json({ error: 'Not found' })
  }

  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
}