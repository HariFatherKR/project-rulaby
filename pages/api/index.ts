import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ 
    message: 'Rulaby API - AI 기반 프롬프트 룰 공유 SaaS',
    version: '0.1.0',
    status: 'initialized',
    endpoints: {
      'prompt-rules': '/api/prompt-rules',
      'context-profiles': '/api/context-profiles'
    },
    collections: {
      prompt_rules: {
        description: 'Team-approved prompting rules',
        fields: ['id', 'title', 'content', 'category', 'createdBy', 'createdAt']
      },
      context_profiles: {
        description: 'Role-based context templates',
        fields: ['id', 'role', 'basePrompt', 'maintainedBy']
      }
    }
  })
}