// API endpoint for individual Context Profile operations
import { NextApiRequest, NextApiResponse } from 'next'
import { contextProfilesService } from '../../../lib/firestore'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Profile ID is required' })
  }

  try {
    switch (method) {
      case 'GET': {
        const profile = await contextProfilesService.getById(id)
        if (!profile) {
          return res.status(404).json({ error: 'Context profile not found' })
        }
        res.status(200).json(profile)
        break
      }

      case 'PUT': {
        const updates = req.body
        await contextProfilesService.update(id, updates)
        res.status(200).json({ message: 'Context profile updated successfully' })
        break
      }

      case 'DELETE': {
        await contextProfilesService.delete(id)
        res.status(200).json({ message: 'Context profile deleted successfully' })
        break
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error in context-profiles/[id] API:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}