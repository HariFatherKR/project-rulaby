import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ 
    message: 'Rulaby API - AI 기반 프롬프트 룰 공유 SaaS',
    version: '0.1.0',
    status: 'initialized'
  })
}