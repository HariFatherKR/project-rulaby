#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import {
  handleShareRules,
  handleImportRules,
} from "./tools/ruleSharing-api.js";
import {
  handleAddTemplateRule,
  handleListTemplates,
} from "./tools/templateRules.js";

class RulabyMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "rulaby-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
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
        {
          name: "share_rules",
          description:
            "Share your IDE rules with others via encrypted share code",
          inputSchema: {
            type: "object",
            properties: {
              includeProjectSpecific: {
                type: "boolean",
                description: "Include project-specific rules",
                default: true,
              },
              expiresInDays: {
                type: "number",
                description:
                  "Number of days before share expires (default: 1 day = 24 hours)",
                default: 1,
              },
              maxUses: {
                type: "number",
                description:
                  "Maximum number of times rules can be imported (null for unlimited)",
                default: null,
              },
            },
          },
        },
        {
          name: "import_rules",
          description: "Import shared rules into your IDE",
          inputSchema: {
            type: "object",
            properties: {
              shareCode: {
                type: "string",
                description: "The share code (e.g., RULABY-XXXX-XXXX)",
              },
              password: {
                type: "string",
                description: "The password for decryption",
              },
              targetIDE: {
                type: "string",
                description: "Target IDE (auto-detected if not specified)",
                enum: [
                  "cursor",
                  "windsurf",
                  "claude-code",
                  "gemini-cli",
                  "kiro",
                ],
              },
            },
            required: ["shareCode", "password"],
          },
        },
        {
          name: "add_template_rule",
          description: "Add template rules to your project from local cache or remote server",
          inputSchema: {
            type: "object",
            properties: {
              templateId: {
                type: "string",
                description: "Specific template ID to add (e.g., 'react', 'advanced-react-patterns')",
              },
              category: {
                type: "string",
                description: "Category of rules to add (local only) (e.g., 'framework', 'language', 'style')",
              },
              projectType: {
                type: "string",
                description: "Type of project (e.g., 'web', 'api', 'mobile')",
              },
              targetPath: {
                type: "string",
                description: "Target path for the rule file (defaults to current directory)",
              },
            },
          },
        },
        {
          name: "list_templates",
          description: "List all available template rules organized by category",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case "share_rules":
          return await handleShareRules(request);

        case "import_rules":
          return await handleImportRules(request);

        case "add_template_rule":
          return await handleAddTemplateRule(request);

        case "list_templates":
          return await handleListTemplates();

        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Rulaby Share MCP server running on stdio");
  }
}

// Main entry point
const server = new RulabyMCPServer();
server.run().catch(console.error);
