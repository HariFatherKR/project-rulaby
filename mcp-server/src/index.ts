#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promptRuleTools, handlePromptRuleTool } from './tools/promptRules.js';
import { contextProfileTools, handleContextProfileTool } from './tools/contextProfiles.js';
import { analyticsTools, handleAnalyticsTool } from './tools/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory for memory storage
const DATA_DIR = path.join(__dirname, '../../data/mcp-memory');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create data directory:', error);
  }
}

// Memory session interface
interface MemorySession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  entries: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  contextProfile?: string;
  promptRules?: string[];
}

class RulabyMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'rulaby-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // Handle list tools request
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        // Memory session tools
        {
          name: 'create_memory_session',
          description: 'Create a new memory session for LLM conversations',
          inputSchema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description: 'Title for the memory session',
              },
              contextProfile: {
                type: 'string',
                description: 'Optional context profile ID',
              },
              promptRules: {
                type: 'array',
                items: { type: 'string' },
                description: 'Optional array of prompt rule IDs',
              },
            },
            required: ['title'],
          },
        },
        {
          name: 'list_memory_sessions',
          description: 'List all memory sessions',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'add_memory_entry',
          description: 'Add a new entry to a memory session',
          inputSchema: {
            type: 'object',
            properties: {
              sessionId: {
                type: 'string',
                description: 'ID of the memory session',
              },
              role: {
                type: 'string',
                enum: ['user', 'assistant'],
                description: 'Role of the message sender',
              },
              content: {
                type: 'string',
                description: 'Content of the message',
              },
            },
            required: ['sessionId', 'role', 'content'],
          },
        },
        {
          name: 'get_memory_session',
          description: 'Get a specific memory session by ID',
          inputSchema: {
            type: 'object',
            properties: {
              sessionId: {
                type: 'string',
                description: 'ID of the memory session',
              },
            },
            required: ['sessionId'],
          },
        },
        {
          name: 'delete_memory_session',
          description: 'Delete a memory session',
          inputSchema: {
            type: 'object',
            properties: {
              sessionId: {
                type: 'string',
                description: 'ID of the memory session to delete',
              },
            },
            required: ['sessionId'],
          },
        },
        // Prompt rule tools
        ...promptRuleTools,
        // Context profile tools
        ...contextProfileTools,
        // Analytics tools
        ...analyticsTools,
      ],
    }));

    // Handle list resources request
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      await ensureDataDir();
      const files = await fs.readdir(DATA_DIR);
      const resources = files
        .filter(file => file.endsWith('.json'))
        .map(file => ({
          uri: `memory://sessions/${file.replace('.json', '')}`,
          name: file.replace('.json', ''),
          description: 'Memory session file',
          mimeType: 'application/json',
        }));

      return { resources };
    });

    // Handle read resource request
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const match = request.params.uri.match(/^memory:\/\/sessions\/(.+)$/);
      if (!match) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Invalid resource URI: ${request.params.uri}`
        );
      }

      const sessionId = match[1];
      const filePath = path.join(DATA_DIR, `${sessionId}.json`);

      try {
        const content = await fs.readFile(filePath, 'utf-8');
        return {
          contents: [
            {
              uri: request.params.uri,
              mimeType: 'application/json',
              text: content,
            },
          ],
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to read session: ${error}`
        );
      }
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      await ensureDataDir();

      switch (request.params.name) {
        case 'create_memory_session': {
          const { title, contextProfile, promptRules } = request.params.arguments as any;
          
          const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const session: MemorySession = {
            id: sessionId,
            title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            entries: [],
            contextProfile,
            promptRules,
          };

          const filePath = path.join(DATA_DIR, `${sessionId}.json`);
          await fs.writeFile(filePath, JSON.stringify(session, null, 2));

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(session, null, 2),
              },
            ],
          };
        }

        case 'list_memory_sessions': {
          const files = await fs.readdir(DATA_DIR);
          const sessions = [];

          for (const file of files) {
            if (file.endsWith('.json')) {
              const content = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
              sessions.push(JSON.parse(content));
            }
          }

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(sessions, null, 2),
              },
            ],
          };
        }

        case 'add_memory_entry': {
          const { sessionId, role, content } = request.params.arguments as any;
          const filePath = path.join(DATA_DIR, `${sessionId}.json`);

          try {
            const sessionData = await fs.readFile(filePath, 'utf-8');
            const session: MemorySession = JSON.parse(sessionData);

            session.entries.push({
              role,
              content,
              timestamp: new Date().toISOString(),
            });
            session.updatedAt = new Date().toISOString();

            await fs.writeFile(filePath, JSON.stringify(session, null, 2));

            return {
              content: [
                {
                  type: 'text',
                  text: 'Entry added successfully',
                },
              ],
            };
          } catch (error) {
            throw new McpError(
              ErrorCode.InternalError,
              `Failed to add entry: ${error}`
            );
          }
        }

        case 'get_memory_session': {
          const { sessionId } = request.params.arguments as any;
          const filePath = path.join(DATA_DIR, `${sessionId}.json`);

          try {
            const content = await fs.readFile(filePath, 'utf-8');
            return {
              content: [
                {
                  type: 'text',
                  text: content,
                },
              ],
            };
          } catch (error) {
            throw new McpError(
              ErrorCode.InternalError,
              `Failed to get session: ${error}`
            );
          }
        }

        case 'delete_memory_session': {
          const { sessionId } = request.params.arguments as any;
          const filePath = path.join(DATA_DIR, `${sessionId}.json`);

          try {
            await fs.unlink(filePath);
            return {
              content: [
                {
                  type: 'text',
                  text: `Session ${sessionId} deleted successfully`,
                },
              ],
            };
          } catch (error) {
            throw new McpError(
              ErrorCode.InternalError,
              `Failed to delete session: ${error}`
            );
          }
        }

        default: {
          // Check if it's a prompt rule tool
          if (promptRuleTools.some(tool => tool.name === request.params.name)) {
            return await handlePromptRuleTool(request.params.name, request.params.arguments);
          }
          
          // Check if it's a context profile tool
          if (contextProfileTools.some(tool => tool.name === request.params.name)) {
            return await handleContextProfileTool(request.params.name, request.params.arguments);
          }
          
          // Check if it's an analytics tool
          if (analyticsTools.some(tool => tool.name === request.params.name)) {
            return await handleAnalyticsTool(request.params.name, request.params.arguments);
          }
          
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
        }
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Rulaby MCP server running on stdio');
  }
}

// Main entry point
const server = new RulabyMCPServer();
server.run().catch(console.error);