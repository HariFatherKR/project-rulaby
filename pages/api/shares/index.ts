import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rate limiting (simple in-memory implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number = 10): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  
  if (!record || record.resetTime < now) {
    requestCounts.set(ip, { count: 1, resetTime: now + 3600000 }); // 1 hour
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key')
      .end();
    return;
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Get client IP
  const ip = req.headers['x-forwarded-for'] as string || 
             req.headers['x-real-ip'] as string || 
             req.socket.remoteAddress || 
             'unknown';

  // Rate limiting
  if (!checkRateLimit(ip, process.env.MAX_SHARES_PER_HOUR ? parseInt(process.env.MAX_SHARES_PER_HOUR) : 10)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  if (req.method === 'POST') {
    try {
      const {
        encryptedData,
        encryptionMetadata,
        sourceIDE,
        ruleMetadata,
        expiresInDays = 30,
        maxUses = null
      } = req.body;

      // Validate required fields
      if (!encryptedData || !encryptionMetadata || !sourceIDE) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Generate share code
      const shareCode = generateShareCode();
      
      // Calculate expiration
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      // Insert into database
      const { data, error } = await supabase
        .from('rule_shares')
        .insert({
          share_code: shareCode,
          encrypted_data: encryptedData,
          encryption_metadata: encryptionMetadata,
          source_ide: sourceIDE,
          rule_metadata: ruleMetadata,
          expires_at: expiresAt.toISOString(),
          max_access_count: maxUses,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Failed to create share' });
      }

      return res.status(201).json({
        shareCode: data.share_code,
        expiresAt: data.expires_at
      });

    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function generateShareCode(): string {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let part1 = '';
  let part2 = '';
  
  for (let i = 0; i < 4; i++) {
    part1 += charset[Math.floor(Math.random() * charset.length)];
    part2 += charset[Math.floor(Math.random() * charset.length)];
  }
  
  return `RULABY-${part1}-${part2}`;
}