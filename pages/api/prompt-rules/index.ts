// API endpoint for Prompt Rules collection
import { NextApiRequest, NextApiResponse } from 'next'
import { promptRulesService } from '../../../lib/firestore'
import { CreatePromptRule } from '../../../lib/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const { category } = req.query
        
        if (category && typeof category === 'string') {
          const rules = await promptRulesService.getByCategory(category)
          res.status(200).json(rules)
        } else {
          const rules = await promptRulesService.getAll()
          res.status(200).json(rules)
        }
        break
      }

      case 'POST': {
        const ruleData: CreatePromptRule = req.body
        
        // Basic validation
        if (!ruleData.title || !ruleData.content || !ruleData.category || !ruleData.createdBy) {
          return res.status(400).json({ 
            error: 'Missing required fields: title, content, category, createdBy' 
          })
        }

        const ruleId = await promptRulesService.create(ruleData)
        res.status(201).json({ id: ruleId, message: 'Prompt rule created successfully' })
        break
      }

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error in prompt-rules API:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}