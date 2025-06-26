// API endpoint for individual Prompt Rule operations
import { NextApiRequest, NextApiResponse } from 'next'
import { promptRulesService } from '../../../lib/firestore'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Rule ID is required' })
  }

  try {
    switch (method) {
      case 'GET': {
        const rule = await promptRulesService.getById(id)
        if (!rule) {
          return res.status(404).json({ error: 'Prompt rule not found' })
        }
        res.status(200).json(rule)
        break
      }

      case 'PUT': {
        const updates = req.body
        await promptRulesService.update(id, updates)
        res.status(200).json({ message: 'Prompt rule updated successfully' })
        break
      }

      case 'DELETE': {
        await promptRulesService.delete(id)
        res.status(200).json({ message: 'Prompt rule deleted successfully' })
        break
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error in prompt-rules/[id] API:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}