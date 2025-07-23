# 🔄 Rulaby MCP Server - Secure AI IDE Rule Sharing via MCP

Share and import your AI IDE rules (Claude, Cursor, Windsurf, etc.) securely using the Model Context Protocol.

## ✨ Features

- 🔐 **Secure Sharing** - End-to-end encryption with password protection
- 🤖 **Multi-IDE Support** - Claude Code, Cursor, Windsurf, Gemini CLI, and more
- 🔄 **Format Conversion** - Automatically converts rules between different IDE formats
- 📦 **MCP Integration** - Works seamlessly with MCP-enabled environments
- ⏰ **Expiration Control** - Set expiration dates and usage limits
- 🚀 **Simple CLI** - Easy to use command-line interface

## 📋 Prerequisites

- Node.js 18+ 
- An MCP-compatible client (Claude Desktop, VS Code with MCP extension, etc.)
- Internet connection (for API access)

## 🚀 Quick Start

### Installation

```bash
# Install globally
npm install -g @hyto/rulaby-mcp-server

# Or use directly with npx
npx @hyto/rulaby-mcp-server
```

### MCP Configuration

Add to your MCP settings (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "rulaby-mcp-server": {
      "command": "npx",
      "args": ["@hyto/rulaby-mcp-server"]
    }
  }
}
```

## 📖 Usage

### Sharing Rules

1. Navigate to your project directory containing IDE rule files
2. Use the `share_rules` tool in your MCP client:

```
share_rules({
  includeProjectSpecific: true,  // Include project-specific rules
  expiresInDays: 1,             // Expiration (default: 1 day = 24 hours)
  maxUses: null                 // Usage limit (null = unlimited)
})
```

You'll receive:
- **Share Code**: `RULABY-XXXX-XXXX`
- **Password**: `SecurePassword123!`

### Importing Rules

Use the `import_rules` tool with the share credentials:

```
import_rules({
  shareCode: "RULABY-XXXX-XXXX",
  password: "SecurePassword123!",
  targetIDE: "claude-code"  // Optional: auto-detected if not specified
})
```

## 🛠️ Supported IDEs

| IDE | Rule File | Auto-Detection |
|-----|-----------|----------------|
| Claude Code | `.claude/CLAUDE.md` | ✅ |
| Cursor | `.cursorrules` | ✅ |
| Windsurf | `.windsurfrules` | ✅ |
| Gemini CLI | `.gemini/rules.md` | ✅ |
| Kiro | `.kiro/prompts.md` | ✅ |

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   MCP Client    │────▶│  Rulaby API      │────▶│    Database     │
│ (Your Machine)  │     │  (Serverless)    │     │   (Encrypted)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

- **Local Processing**: File detection and encryption happen on your machine
- **Secure API**: Only encrypted data is sent to the server
- **No Credentials Stored**: Passwords are never stored on the server

## 🔒 Security

- **End-to-End Encryption**: AES-256-GCM encryption with password-based key derivation
- **Client-Side Encryption**: All encryption happens locally before transmission
- **No Plain Text Storage**: Server never sees unencrypted rules
- **Automatic Expiration**: Shares expire after the specified period
- **Access Limiting**: Optional usage limits for shares

## 🤝 Contributing

Contributions are welcome!

## 📄 License

MIT © HariFatherKR

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/HariFatherKR/project-rulaby/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HariFatherKR/project-rulaby/discussions)
- **Email**: support@rulaby.com

## 🔗 Links

- [GitHub Repository](https://github.com/HariFatherKR/project-rulaby)
- [NPM Package](https://www.npmjs.com/package/@hyto/rulaby-mcp-server)
- [Documentation](https://docs.rulaby.com)

## 📝 Changelog

### v1.0.1 (2025-07-23)
- Removed debug endpoints after successful deployment
- Fixed health check endpoint URL for Vercel deployment
- Enhanced rule sharing system with 24-hour expiration
- Improved security features
- Removed Firebase dependencies and migrated to Serverless API

### v1.0.0 (2025-07-22)
- Initial release with MCP server for secure rule sharing
- Support for multiple AI IDEs (Claude Code, Cursor, Windsurf, etc.)
- End-to-end encryption with password protection
- Automatic format conversion between IDEs
- Expiration control and usage limits

---

Made with ❤️ by the Rulaby team