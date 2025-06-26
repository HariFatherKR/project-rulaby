// API endpoint for AI-powered prompt rule review
import { NextApiRequest, NextApiResponse } from 'next'
import { openai, SYSTEM_PROMPT } from '../../lib/openai'
import { promptRulesService } from '../../lib/firestore'

interface ReviewRequest {
  prompt: string
  ruleIds: string[]
}

interface ReviewResponse {
  status: 'approved' | 'needs_revision' | 'rejected'
  feedback: string
  suggestions?: string[]
  score?: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReviewResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, ruleIds }: ReviewRequest = req.body

    if (!prompt || !ruleIds || !Array.isArray(ruleIds)) {
      return res.status(400).json({ 
        error: 'Missing required fields: prompt and ruleIds array' 
      })
    }

    // Fetch the relevant rules
    const rules = await Promise.all(
      ruleIds.map(id => promptRulesService.getById(id))
    )
    const validRules = rules.filter(rule => rule !== null)

    if (validRules.length === 0) {
      return res.status(400).json({ 
        error: 'No valid rules found for the provided rule IDs' 
      })
    }

    // Prepare the context for AI review
    const rulesContext = validRules
      .map(rule => `Rule: ${rule.title}\nCategory: ${rule.category}\nContent: ${rule.content}`)
      .join('\n\n')

    const userPrompt = `Please review the following prompt against these team rules:

TEAM RULES:
${rulesContext}

PROMPT TO REVIEW:
${prompt}

Please evaluate this prompt and provide:
1. A status (approved/needs_revision/rejected)
2. Detailed feedback explaining your decision
3. Specific suggestions for improvement (if applicable)
4. A score from 0-100

Respond in JSON format with fields: status, feedback, suggestions (array), score (number).`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('No response from OpenAI')
    }

    // Parse the AI response
    let aiReview: ReviewResponse
    try {
      aiReview = JSON.parse(responseContent)
    } catch (parseError) {
      // Fallback: Extract information from text response
      aiReview = {
        status: responseContent.toLowerCase().includes('approved') 
          ? 'approved' 
          : responseContent.toLowerCase().includes('rejected') 
            ? 'rejected' 
            : 'needs_revision',
        feedback: responseContent,
        suggestions: [],
        score: 50
      }
    }

    // Validate the response structure
    const validStatuses = ['approved', 'needs_revision', 'rejected']
    if (!validStatuses.includes(aiReview.status)) {
      aiReview.status = 'needs_revision'
    }

    res.status(200).json(aiReview)

  } catch (error) {
    console.error('Error in reviewRule API:', error)
    
    if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' 
      })
    }

    res.status(500).json({ 
      error: 'Internal server error during prompt review' 
    })
  }
}