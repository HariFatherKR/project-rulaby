// API endpoint for analytics and leaderboard functionality
import { NextApiRequest, NextApiResponse } from 'next'
import { analyticsService } from '../../../lib/analytics'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const { type, category, limit, ruleId, days } = req.query
        
        if (type === 'leaderboard') {
          const limitCount = limit ? parseInt(limit as string) : 10
          const categoryFilter = category as string
          const topRules = await analyticsService.getTopRules(limitCount, categoryFilter)
          res.status(200).json(topRules)
        } else if (type === 'rule-analytics' && ruleId) {
          const daysCount = days ? parseInt(days as string) : 30
          const analytics = await analyticsService.getRuleAnalytics(ruleId as string, daysCount)
          res.status(200).json(analytics)
        } else if (type === 'team-stats') {
          const stats = await analyticsService.getTeamUsageStats()
          res.status(200).json(stats)
        } else {
          res.status(400).json({ error: 'Invalid type parameter. Use: leaderboard, rule-analytics, or team-stats' })
        }
        break
      }

      case 'POST': {
        const { type } = req.body
        
        if (type === 'track-usage') {
          const { ruleId, userId, sessionId, context, success, tokensUsed } = req.body
          
          if (!ruleId || !userId) {
            return res.status(400).json({ 
              error: 'Missing required fields: ruleId, userId' 
            })
          }

          const analyticsId = await analyticsService.trackRuleUsage({
            ruleId,
            userId,
            sessionId,
            context,
            success,
            tokensUsed
          })
          
          res.status(201).json({ 
            id: analyticsId, 
            message: 'Usage tracked successfully' 
          })
        } else {
          res.status(400).json({ error: 'Invalid type. Use: track-usage' })
        }
        break
      }

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error in analytics API:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}