// API endpoint for security compliance rules
import { NextApiRequest, NextApiResponse } from 'next'
import { securityComplianceService } from '../../../lib/security'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const { category, initialize } = req.query
        
        if (initialize === 'true') {
          // Initialize default security rules
          await securityComplianceService.initializeDefaultSecurityRules()
          res.status(200).json({ message: 'Default security rules initialized' })
        } else if (category) {
          const rules = await securityComplianceService.getSecurityRulesByCategory(category as string)
          res.status(200).json(rules)
        } else {
          const rules = await securityComplianceService.getAllSecurityRules()
          res.status(200).json(rules)
        }
        break
      }

      case 'POST': {
        const ruleData = req.body
        
        // Basic validation
        if (!ruleData.title || !ruleData.description || !ruleData.category || !ruleData.rule) {
          return res.status(400).json({ 
            error: 'Missing required fields: title, description, category, rule' 
          })
        }

        const ruleId = await securityComplianceService.createSecurityRule(ruleData)
        res.status(201).json({ id: ruleId, message: 'Security rule created successfully' })
        break
      }

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error in security-rules API:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}