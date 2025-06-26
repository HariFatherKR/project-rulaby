// API endpoint for individual MCP Memory session operations
import { NextApiRequest, NextApiResponse } from 'next'
import { mcpMemoryService } from '../../../lib/mcp-memory'
import { CreateMCPMemoryEntry } from '../../../lib/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  const sessionId = Array.isArray(id) ? id[0] : id

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' })
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get specific memory session
        const session = await mcpMemoryService.getSession(sessionId)
        
        if (!session) {
          return res.status(404).json({ error: 'Session not found' })
        }
        
        res.status(200).json(session)
        break

      case 'POST':
        // Add memory entry to session
        const entryData: CreateMCPMemoryEntry = req.body
        
        if (!entryData.role || !entryData.content) {
          return res.status(400).json({ error: 'Role and content are required' })
        }
        
        const entryId = await mcpMemoryService.addMemoryEntry(sessionId, entryData)
        const updatedSession = await mcpMemoryService.getSession(sessionId)
        
        res.status(201).json({ entryId, session: updatedSession })
        break

      case 'DELETE':
        // Delete memory session
        await mcpMemoryService.deleteSession(sessionId)
        res.status(200).json({ message: 'Session deleted successfully' })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
        res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('MCP Memory API error:', error)
    
    if (error instanceof Error && error.message.includes('Session not found')) {
      return res.status(404).json({ error: error.message })
    }
    
    res.status(500).json({ error: 'Internal server error' })
  }
}