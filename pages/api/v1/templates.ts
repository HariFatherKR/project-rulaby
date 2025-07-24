import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables: SUPABASE_URL and/or SUPABASE_ANON_KEY');
}

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local templates that are included in npm package
const LOCAL_TEMPLATES = [
  'react', 'typescript', 'nextjs', 'tailwind', 'clean-code', 'python',
  'node-express', 'database', 'fastapi', 'vue', 'svelte', 'gitflow',
  'codequality', 'react-typescript', 'nextjs-typescript', 'fastapi-python'
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/v1/templates - List all templates
  if (req.method === 'GET' && !req.query.id) {
    try {
      // Check if Supabase is configured
      if (!supabase) {
        console.error('Templates API: Supabase client not initialized due to missing environment variables');
        return res.status(500).json({
          success: false,
          error: 'Database configuration error. Please check server logs.'
        });
      }

      const { data: templates, error } = await supabase
        .from('template_metadata')
        .select('*')
        .order('usage_count', { ascending: false });

      if (error) throw error;

      // Group templates by category
      const categorized = templates.reduce((acc: any, template: any) => {
        if (!acc[template.category]) {
          acc[template.category] = [];
        }
        acc[template.category].push({
          id: template.id,
          name: template.name,
          description: template.description,
          lines: template.lines,
          usage_count: template.usage_count,
          is_premium: template.is_premium,
          is_local: LOCAL_TEMPLATES.includes(template.id),
          tags: template.tags
        });
        return acc;
      }, {});

      return res.status(200).json({
        success: true,
        templates: categorized,
        total: templates.length
      });

    } catch (error) {
      console.error('Error fetching templates:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch templates'
      });
    }
  }

  // GET /api/v1/templates?id=xxx - Get specific template
  if (req.method === 'GET' && req.query.id) {
    const templateId = req.query.id as string;
    
    try {
      // Check if it's a local template
      if (LOCAL_TEMPLATES.includes(templateId)) {
        // For local templates, just log the usage if Supabase is available
        if (supabase) {
          await logTemplateUsage(templateId, 'local', req);
        }
        
        return res.status(200).json({
          success: true,
          template: {
            id: templateId,
            name: templateId,
            is_local: true,
            message: 'Local template - content available in npm package'
          }
        });
      }

      // Check if Supabase is configured
      if (!supabase) {
        console.error('Templates API: Cannot fetch remote template - Supabase not configured');
        return res.status(500).json({
          success: false,
          error: 'Database configuration error. Please check server logs.'
        });
      }

      // For remote templates, fetch content and log usage
      const { data: template, error } = await supabase
        .from('template_contents')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error || !template) {
        return res.status(404).json({
          success: false,
          error: 'Template not found'
        });
      }

      // Log usage
      await logTemplateUsage(templateId, 'remote', req);

      return res.status(200).json({
        success: true,
        template: {
          id: template.id,
          name: template.name,
          content: template.content,
          category: template.category,
          is_local: false
        }
      });

    } catch (error) {
      console.error('Error fetching template:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch template'
      });
    }
  }

  // POST /api/v1/templates - Log template usage
  if (req.method === 'POST') {
    const { templateId, source, ide } = req.body;

    if (!templateId) {
      return res.status(400).json({
        success: false,
        error: 'Template ID is required'
      });
    }

    // Check if Supabase is configured
    if (!supabase) {
      console.error('Templates API: Cannot log template usage - Supabase not configured');
      return res.status(500).json({
        success: false,
        error: 'Database configuration error. Please check server logs.'
      });
    }

    try {
      await logTemplateUsage(
        templateId, 
        source || (LOCAL_TEMPLATES.includes(templateId) ? 'local' : 'remote'),
        req,
        ide
      );

      return res.status(200).json({
        success: true,
        message: 'Template usage logged successfully'
      });

    } catch (error) {
      console.error('Error logging template usage:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to log template usage'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Helper function to log template usage
async function logTemplateUsage(
  templateId: string,
  source: string,
  req: NextApiRequest,
  ide?: string
) {
  if (!supabase) {
    console.error('Cannot log template usage - Supabase not configured');
    return;
  }

  // Ensure template exists in metadata
  const { data: existingTemplate } = await supabase
    .from('template_metadata')
    .select('id')
    .eq('id', templateId)
    .single();

  if (!existingTemplate) {
    // Create metadata entry if it doesn't exist (for local templates)
    const { error: insertError } = await supabase
      .from('template_metadata')
      .insert({
        id: templateId,
        name: templateId,
        category: getTemplateCategory(templateId),
        lines: 0,
        usage_count: 0,
        is_premium: false,
        tags: []
      });

    if (insertError && insertError.code !== '23505') {
      console.error('Error creating template metadata:', insertError);
    }
  }

  // Increment usage count
  const { error: updateError } = await supabase.rpc('increment_template_usage', {
    template_id: templateId
  });

  if (updateError) {
    console.error('Error updating usage count:', updateError);
  }

  // Log access
  const { error: logError } = await supabase.from('template_access_logs').insert({
    template_id: templateId,
    accessed_at: new Date().toISOString(),
    user_agent: req.headers['user-agent'] || 'unknown',
    ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    source: source,
    ide: ide || req.body.ide || 'unknown'
  });

  if (logError) {
    console.error('Error logging template access:', logError);
  }
}

// Helper function to determine template category
function getTemplateCategory(templateId: string): string {
  const categoryMap: Record<string, string> = {
    'react': 'framework',
    'vue': 'framework',
    'svelte': 'framework',
    'nextjs': 'framework',
    'typescript': 'language',
    'python': 'language',
    'tailwind': 'style',
    'clean-code': 'style',
    'codequality': 'style',
    'node-express': 'backend',
    'fastapi': 'backend',
    'database': 'backend',
    'gitflow': 'workflow',
    'react-typescript': 'composite',
    'nextjs-typescript': 'composite',
    'fastapi-python': 'composite'
  };

  return categoryMap[templateId] || 'other';
}