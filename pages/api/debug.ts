import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const envVars = {
    SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    VERCEL_URL: process.env.VERCEL_URL || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET'
  };

  res.status(200).json({
    message: 'Debug endpoint',
    environment: envVars,
    timestamp: new Date().toISOString()
  });
}