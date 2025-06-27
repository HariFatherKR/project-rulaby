import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RULES_DIR = path.join(__dirname, '../../../data/prompt-rules');

interface PromptRule {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  examples?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Ensure rules directory exists
async function ensureRulesDir() {
  try {
    await fs.mkdir(RULES_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create rules directory:', error);
  }
}

export const promptRuleTools = [
  {
    name: 'create_prompt_rule',
    description: 'Create a new prompt rule',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the prompt rule',
        },
        description: {
          type: 'string',
          description: 'Description of the rule',
        },
        category: {
          type: 'string',
          description: 'Category of the rule (e.g., "coding", "writing", "analysis")',
        },
        content: {
          type: 'string',
          description: 'The actual rule content',
        },
        examples: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional examples of rule application',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional tags for categorization',
        },
      },
      required: ['name', 'description', 'category', 'content'],
    },
  },
  {
    name: 'list_prompt_rules',
    description: 'List all prompt rules',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Optional filter by category',
        },
      },
    },
  },
  {
    name: 'get_prompt_rule',
    description: 'Get a specific prompt rule by ID',
    inputSchema: {
      type: 'object',
      properties: {
        ruleId: {
          type: 'string',
          description: 'ID of the prompt rule',
        },
      },
      required: ['ruleId'],
    },
  },
  {
    name: 'update_prompt_rule',
    description: 'Update an existing prompt rule',
    inputSchema: {
      type: 'object',
      properties: {
        ruleId: {
          type: 'string',
          description: 'ID of the prompt rule to update',
        },
        name: {
          type: 'string',
          description: 'Updated name',
        },
        description: {
          type: 'string',
          description: 'Updated description',
        },
        category: {
          type: 'string',
          description: 'Updated category',
        },
        content: {
          type: 'string',
          description: 'Updated rule content',
        },
        examples: {
          type: 'array',
          items: { type: 'string' },
          description: 'Updated examples',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Updated tags',
        },
      },
      required: ['ruleId'],
    },
  },
  {
    name: 'delete_prompt_rule',
    description: 'Delete a prompt rule',
    inputSchema: {
      type: 'object',
      properties: {
        ruleId: {
          type: 'string',
          description: 'ID of the prompt rule to delete',
        },
      },
      required: ['ruleId'],
    },
  },
];

export async function handlePromptRuleTool(name: string, args: any) {
  await ensureRulesDir();

  switch (name) {
    case 'create_prompt_rule': {
      const ruleId = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const rule: PromptRule = {
        id: ruleId,
        name: args.name,
        description: args.description,
        category: args.category,
        content: args.content,
        examples: args.examples,
        tags: args.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const filePath = path.join(RULES_DIR, `${ruleId}.json`);
      await fs.writeFile(filePath, JSON.stringify(rule, null, 2));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(rule, null, 2),
          },
        ],
      };
    }

    case 'list_prompt_rules': {
      const files = await fs.readdir(RULES_DIR);
      const rules = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await fs.readFile(path.join(RULES_DIR, file), 'utf-8');
          const rule = JSON.parse(content);
          
          if (!args.category || rule.category === args.category) {
            rules.push(rule);
          }
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(rules, null, 2),
          },
        ],
      };
    }

    case 'get_prompt_rule': {
      const filePath = path.join(RULES_DIR, `${args.ruleId}.json`);
      const content = await fs.readFile(filePath, 'utf-8');
      
      return {
        content: [
          {
            type: 'text',
            text: content,
          },
        ],
      };
    }

    case 'update_prompt_rule': {
      const filePath = path.join(RULES_DIR, `${args.ruleId}.json`);
      const existing = await fs.readFile(filePath, 'utf-8');
      const rule: PromptRule = JSON.parse(existing);

      // Update only provided fields
      if (args.name !== undefined) rule.name = args.name;
      if (args.description !== undefined) rule.description = args.description;
      if (args.category !== undefined) rule.category = args.category;
      if (args.content !== undefined) rule.content = args.content;
      if (args.examples !== undefined) rule.examples = args.examples;
      if (args.tags !== undefined) rule.tags = args.tags;
      
      rule.updatedAt = new Date().toISOString();

      await fs.writeFile(filePath, JSON.stringify(rule, null, 2));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(rule, null, 2),
          },
        ],
      };
    }

    case 'delete_prompt_rule': {
      const filePath = path.join(RULES_DIR, `${args.ruleId}.json`);
      await fs.unlink(filePath);

      return {
        content: [
          {
            type: 'text',
            text: `Prompt rule ${args.ruleId} deleted successfully`,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown prompt rule tool: ${name}`);
  }
}