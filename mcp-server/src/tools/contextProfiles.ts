import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTEXTS_DIR = path.join(__dirname, '../../../data/context-profiles');

interface ContextProfile {
  id: string;
  name: string;
  description: string;
  role: string;
  instructions: string;
  constraints?: string[];
  preferences?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Ensure contexts directory exists
async function ensureContextsDir() {
  try {
    await fs.mkdir(CONTEXTS_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create contexts directory:', error);
  }
}

export const contextProfileTools = [
  {
    name: 'create_context_profile',
    description: 'Create a new context profile for AI interactions',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the context profile',
        },
        description: {
          type: 'string',
          description: 'Description of the context profile',
        },
        role: {
          type: 'string',
          description: 'Role definition (e.g., "Senior Developer", "Technical Writer")',
        },
        instructions: {
          type: 'string',
          description: 'Specific instructions for this context',
        },
        constraints: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional constraints or limitations',
        },
        preferences: {
          type: 'object',
          description: 'Optional preferences as key-value pairs',
        },
      },
      required: ['name', 'description', 'role', 'instructions'],
    },
  },
  {
    name: 'list_context_profiles',
    description: 'List all context profiles',
    inputSchema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          description: 'Optional filter by role',
        },
      },
    },
  },
  {
    name: 'get_context_profile',
    description: 'Get a specific context profile by ID',
    inputSchema: {
      type: 'object',
      properties: {
        profileId: {
          type: 'string',
          description: 'ID of the context profile',
        },
      },
      required: ['profileId'],
    },
  },
  {
    name: 'update_context_profile',
    description: 'Update an existing context profile',
    inputSchema: {
      type: 'object',
      properties: {
        profileId: {
          type: 'string',
          description: 'ID of the context profile to update',
        },
        name: {
          type: 'string',
          description: 'Updated name',
        },
        description: {
          type: 'string',
          description: 'Updated description',
        },
        role: {
          type: 'string',
          description: 'Updated role',
        },
        instructions: {
          type: 'string',
          description: 'Updated instructions',
        },
        constraints: {
          type: 'array',
          items: { type: 'string' },
          description: 'Updated constraints',
        },
        preferences: {
          type: 'object',
          description: 'Updated preferences',
        },
      },
      required: ['profileId'],
    },
  },
  {
    name: 'delete_context_profile',
    description: 'Delete a context profile',
    inputSchema: {
      type: 'object',
      properties: {
        profileId: {
          type: 'string',
          description: 'ID of the context profile to delete',
        },
      },
      required: ['profileId'],
    },
  },
];

export async function handleContextProfileTool(name: string, args: any) {
  await ensureContextsDir();

  switch (name) {
    case 'create_context_profile': {
      const profileId = `context-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const profile: ContextProfile = {
        id: profileId,
        name: args.name,
        description: args.description,
        role: args.role,
        instructions: args.instructions,
        constraints: args.constraints,
        preferences: args.preferences,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const filePath = path.join(CONTEXTS_DIR, `${profileId}.json`);
      await fs.writeFile(filePath, JSON.stringify(profile, null, 2));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(profile, null, 2),
          },
        ],
      };
    }

    case 'list_context_profiles': {
      const files = await fs.readdir(CONTEXTS_DIR);
      const profiles = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await fs.readFile(path.join(CONTEXTS_DIR, file), 'utf-8');
          const profile = JSON.parse(content);
          
          if (!args.role || profile.role === args.role) {
            profiles.push(profile);
          }
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(profiles, null, 2),
          },
        ],
      };
    }

    case 'get_context_profile': {
      const filePath = path.join(CONTEXTS_DIR, `${args.profileId}.json`);
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

    case 'update_context_profile': {
      const filePath = path.join(CONTEXTS_DIR, `${args.profileId}.json`);
      const existing = await fs.readFile(filePath, 'utf-8');
      const profile: ContextProfile = JSON.parse(existing);

      // Update only provided fields
      if (args.name !== undefined) profile.name = args.name;
      if (args.description !== undefined) profile.description = args.description;
      if (args.role !== undefined) profile.role = args.role;
      if (args.instructions !== undefined) profile.instructions = args.instructions;
      if (args.constraints !== undefined) profile.constraints = args.constraints;
      if (args.preferences !== undefined) profile.preferences = args.preferences;
      
      profile.updatedAt = new Date().toISOString();

      await fs.writeFile(filePath, JSON.stringify(profile, null, 2));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(profile, null, 2),
          },
        ],
      };
    }

    case 'delete_context_profile': {
      const filePath = path.join(CONTEXTS_DIR, `${args.profileId}.json`);
      await fs.unlink(filePath);

      return {
        content: [
          {
            type: 'text',
            text: `Context profile ${args.profileId} deleted successfully`,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown context profile tool: ${name}`);
  }
}