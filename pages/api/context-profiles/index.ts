// API endpoint for Context Profiles collection
import { NextApiRequest, NextApiResponse } from 'next'
import { contextProfilesService } from '../../../lib/firestore'
import { CreateContextProfile } from '../../../lib/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const { role } = req.query
        
        if (role && typeof role === 'string') {
          const profiles = await contextProfilesService.getByRole(role)
          res.status(200).json(profiles)
        } else {
          const profiles = await contextProfilesService.getAll()
          res.status(200).json(profiles)
        }
        break
      }

      case 'POST': {
        const profileData: CreateContextProfile = req.body
        
        // Basic validation
        if (!profileData.role || !profileData.basePrompt || !profileData.maintainedBy) {
          return res.status(400).json({ 
            error: 'Missing required fields: role, basePrompt, maintainedBy' 
          })
        }

        const profileId = await contextProfilesService.create(profileData)
        res.status(201).json({ id: profileId, message: 'Context profile created successfully' })
        break
      }

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error in context-profiles API:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}