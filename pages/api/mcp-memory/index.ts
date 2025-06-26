// API endpoint for MCP Memory sessions
import { NextApiRequest, NextApiResponse } from 'next'
import { mcpMemoryService } from '../../../lib/mcp-memory'
import { CreateMCPMemorySession } from '../../../lib/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        // Get all memory sessions
        const sessions = await mcpMemoryService.listSessions()
        res.status(200).json(sessions)
        break

      case 'POST':
        // Create new memory session
        const sessionData: CreateMCPMemorySession = req.body
        
        if (!sessionData.title) {
          return res.status(400).json({ error: 'Title is required' })
        }
        
        const sessionId = await mcpMemoryService.createSession(sessionData)
        const session = await mcpMemoryService.getSession(sessionId)
        
        res.status(201).json(session)
        break

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('MCP Memory API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}