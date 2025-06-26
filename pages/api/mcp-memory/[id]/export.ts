// API endpoint for MCP Memory session export/import operations
import { NextApiRequest, NextApiResponse } from 'next'
import { mcpMemoryService } from '../../../../lib/mcp-memory'

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
        // Export session as JSON
        const exportData = await mcpMemoryService.exportSession(sessionId)
        
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Content-Disposition', `attachment; filename="${sessionId}.json"`)
        res.status(200).send(exportData)
        break

      case 'POST':
        // Import session from JSON
        const { jsonData } = req.body
        
        if (!jsonData) {
          return res.status(400).json({ error: 'JSON data is required' })
        }
        
        const importedSessionId = await mcpMemoryService.importSession(jsonData)
        const session = await mcpMemoryService.getSession(importedSessionId)
        
        res.status(201).json({ sessionId: importedSessionId, session })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('MCP Memory Export/Import API error:', error)
    
    if (error instanceof Error && error.message.includes('Session not found')) {
      return res.status(404).json({ error: error.message })
    }
    
    if (error instanceof SyntaxError) {
      return res.status(400).json({ error: 'Invalid JSON data' })
    }
    
    res.status(500).json({ error: 'Internal server error' })
  }
}