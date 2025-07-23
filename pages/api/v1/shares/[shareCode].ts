import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number = 20): boolean {
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

  const { shareCode } = req.query;

  if (!shareCode || typeof shareCode !== 'string') {
    return res.status(400).json({ error: 'Invalid share code' });
  }

  // Validate share code format
  if (!/^RULABY-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(shareCode)) {
    return res.status(400).json({ error: 'Invalid share code format' });
  }

  // Get client IP
  const ip = req.headers['x-forwarded-for'] as string || 
             req.headers['x-real-ip'] as string || 
             req.socket.remoteAddress || 
             'unknown';

  // Rate limiting
  if (!checkRateLimit(ip, process.env.MAX_IMPORTS_PER_HOUR ? parseInt(process.env.MAX_IMPORTS_PER_HOUR) : 20)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch share from database
      const { data, error } = await supabase
        .from('rule_shares')
        .select('*')
        .eq('share_code', shareCode)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Share code not found or expired' });
      }

      // Check access limit
      if (data.max_access_count && data.access_count >= data.max_access_count) {
        return res.status(403).json({ error: 'Share code has reached maximum usage' });
      }

      // Log access (non-blocking)
      supabase
        .from('share_access_logs')
        .insert({
          share_id: data.id,
          success: true,
          ip_address: ip,
          user_agent: req.headers['user-agent'] || null
        })
        .then(() => {
          // Increment access count
          supabase
            .from('rule_shares')
            .update({ access_count: (data.access_count || 0) + 1 })
            .eq('share_code', shareCode)
            .then(() => {});
        });

      // Return share data
      return res.status(200).json({
        encryptedData: data.encrypted_data,
        encryptionMetadata: data.encryption_metadata,
        sourceIDE: data.source_ide,
        ruleMetadata: data.rule_metadata
      });

    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST' && req.url?.endsWith('/access')) {
    // Handle access count increment
    try {
      const { error } = await supabase.rpc('increment', {
        table_name: 'rule_shares',
        column_name: 'access_count',
        row_id: shareCode,
        id_column: 'share_code'
      });

      if (error) {
        // Fallback to manual update
        const { data: currentShare } = await supabase
          .from('rule_shares')
          .select('access_count')
          .eq('share_code', shareCode)
          .single();
        
        if (currentShare) {
          await supabase
            .from('rule_shares')
            .update({ access_count: (currentShare.access_count || 0) + 1 })
            .eq('share_code', shareCode);
        }
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      // Don't fail the request for access count errors
      return res.status(200).json({ success: true });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}