# 🔄 Rulaby MCP Server - Secure AI IDE Rule Sharing via MCP

Share and import your AI IDE rules (Claude, Cursor, Windsurf, etc.) securely using the Model Context Protocol.

## ✨ Features

- 🔐 **Secure Sharing** - End-to-end encryption with password protection
- 🤖 **Multi-IDE Support** - Claude Code, Cursor, Windsurf, Gemini CLI, and more
- 🔄 **Format Conversion** - Automatically converts rules between different IDE formats
- 📦 **MCP Integration** - Works seamlessly with MCP-enabled environments
- ⏰ **Expiration Control** - Set expiration dates and usage limits
- 📚 **Template Library** - Access curated rule templates for various frameworks and languages
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

### Adding Template Rules

Browse and add pre-configured template rules to your project:

```
# List all available templates (local + remote)
list_templates()

# Add specific template by ID
add_template_rule({
  templateId: "react"        // Uses local cache if available
})

# Add remote template from server
add_template_rule({
  templateId: "advanced-react-patterns"  // Fetches from server
})

# Add templates by category (local only)
add_template_rule({
  category: "framework",     // Options: framework, language, style, backend, workflow
  targetPath: "/path/to/project"
})
```

**Template System:**
- **🏠 Local Templates**: 16 essential templates included in npm package (44KB)
- **☁️ Remote Templates**: Full library available from server with usage analytics
- **📊 Analytics**: Tracks template usage to show popular choices
- **⚡ Smart Loading**: Uses local cache first, falls back to server

**Popular Templates:**
- React, TypeScript, Next.js, Tailwind CSS
- Python, FastAPI, Node.js, Express
- Clean Code, Git Flow, Database patterns
- And 100+ more on the server...

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
- **Email**: insanityskan@gmail.com

## 🔗 Links

- [GitHub Repository](https://github.com/HariFatherKR/project-rulaby)
- [NPM Package](https://www.npmjs.com/package/@hyto/rulaby-mcp-server)
- [Documentation](https://docs.rulaby.dev)

## 📝 Changelog

### v1.1.2 (2025-07-24)
- Enhanced template list display with better formatting and organization
- Improved template name formatting (removed redundant suffixes)
- Added usage statistics and popularity indicators (🔥 for 100+ uses, ⭐ for 500+ uses)

### v1.1.0 (2025-07-24)
- Added hybrid template system with local cache and remote server
- 16 essential templates included in npm package (44KB)
- Remote template fetching with usage analytics
- New `add_template_rule` tool with templateId support
- Enhanced `list_templates` showing local + remote templates

### v1.0.1 (2025-07-23)
- Removed debug endpoints after successful deployment
- Fixed health check endpoint URL for Vercel deployment
- Enhanced rule sharing system with 24-hour expiration
- Improved security features
- Removed Firebase dependencies and migrated to Serverless API

### v1.0.0 (2025-07-23)
- Initial release with MCP server for secure rule sharing
- Support for multiple AI IDEs (Claude Code, Cursor, Windsurf, etc.)
- End-to-end encryption with password protection
- Automatic format conversion between IDEs
- Expiration control and usage limits

---

Made with ❤️ by the Rulaby team