// API endpoint for awesome-cursor-rules integration
import { NextApiRequest, NextApiResponse } from 'next'
import { awesomeCursorRulesService } from '../../../lib/awesome-cursor-rules'
import { promptRulesService } from '../../../lib/firestore'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const { type, category, stack, query, limit } = req.query
        
        if (type === 'trending') {
          const limitCount = limit ? parseInt(limit as string) : 10
          const rules = await awesomeCursorRulesService.getTrendingRules(limitCount)
          res.status(200).json(rules)
        } else if (type === 'by-category' && category) {
          const rules = await awesomeCursorRulesService.getRulesByCategory(category as string)
          res.status(200).json(rules)
        } else if (type === 'by-stack' && stack) {
          const stackArray = (stack as string).split(',')
          const rules = await awesomeCursorRulesService.getRulesByStack(stackArray)
          res.status(200).json(rules)
        } else if (type === 'search' && query) {
          const rules = await awesomeCursorRulesService.searchRules(query as string)
          res.status(200).json(rules)
        } else {
          const rules = await awesomeCursorRulesService.fetchPopularRules()
          res.status(200).json(rules)
        }
        break
      }

      case 'POST': {
        const { action, ruleId } = req.body
        
        if (action === 'import') {
          if (!ruleId) {
            return res.status(400).json({ error: 'ruleId is required for import' })
          }
          
          // Get the awesome cursor rule
          const allRules = await awesomeCursorRulesService.fetchPopularRules()
          const awesomeRule = allRules.find(rule => 
            rule.title.toLowerCase().replace(/\s+/g, '-') === ruleId.toLowerCase()
          )
          
          if (!awesomeRule) {
            return res.status(404).json({ error: 'Rule not found' })
          }
          
          // Convert and save to our system
          const promptRule = awesomeCursorRulesService.convertToPromptRule(awesomeRule)
          const newRuleId = await promptRulesService.create(promptRule)
          
          res.status(201).json({ 
            id: newRuleId, 
            message: 'Rule imported successfully',
            importedRule: {
              id: newRuleId,
              title: awesomeRule.title,
              category: awesomeRule.category
            }
          })
        } else {
          res.status(400).json({ error: 'Invalid action. Use: import' })
        }
        break
      }

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error in awesome-cursor-rules API:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}