#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
import { handleShareRules, handleImportRules } from './tools/ruleSharing-api.js';
class RulabyShareMCPServer {
    constructor() {
        this.server = new Server({
            name: 'rulaby-share',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupHandlers();
    }
    setupHandlers() {
        // Handle list tools request
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'share_rules',
                    description: 'Share your IDE rules with others via encrypted share code',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            includeProjectSpecific: {
                                type: 'boolean',
                                description: 'Include project-specific rules',
                                default: true
                            },
                            expiresInDays: {
                                type: 'number',
                                description: 'Number of days before share expires (default: 30)',
                                default: 30
                            },
                            maxUses: {
                                type: 'number',
                                description: 'Maximum number of times rules can be imported (null for unlimited)',
                                default: null
                            }
                        }
                    }
                },
                {
                    name: 'import_rules',
                    description: 'Import shared rules into your IDE',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            shareCode: {
                                type: 'string',
                                description: 'The share code (e.g., RULABY-XXXX-XXXX)'
                            },
                            password: {
                                type: 'string',
                                description: 'The password for decryption'
                            },
                            targetIDE: {
                                type: 'string',
                                description: 'Target IDE (auto-detected if not specified)',
                                enum: ['cursor', 'windsurf', 'claude-code', 'gemini-cli', 'kiro']
                            }
                        },
                        required: ['shareCode', 'password']
                    }
                },
            ],
        }));
        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case 'share_rules':
                    return await handleShareRules(request);
                case 'import_rules':
                    return await handleImportRules(request);
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Rulaby Share MCP server running on stdio');
    }
}
// Main entry point
const server = new RulabyShareMCPServer();
server.run().catch(console.error);
//# sourceMappingURL=index-minimal.js.map