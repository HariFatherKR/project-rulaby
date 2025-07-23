# MVP User Scenarios - Rulaby Rule Sharing System

## 📋 Overview

Rulaby MVP focuses on enabling developers to share their AI prompt rules across different AI-powered IDEs through a simple, secure sharing mechanism.

## 🎯 Target IDEs

1. **Cursor** - `.cursorrules` file in project root
2. **Windsurf** - `.windsurfrules` file in project root  
3. **Claude-Code** - `.claude/CLAUDE.md` file
4. **Gemini-CLI** - `.gemini/rules.md` file
5. **Kiro** - `.kiro/prompts.md` file

## 👥 User Personas for MVP

### Sarah - The Rule Creator
- Uses Cursor for development
- Has refined prompt rules over 6 months
- Wants to share her rules with new team members
- Values security and ease of sharing

### Mike - The Rule Consumer
- New to AI-powered development
- Uses Windsurf IDE
- Wants to adopt best practices quickly
- Needs rules to work seamlessly in his IDE

## 🔄 Core User Flows

### Flow 1: Sharing Rules

**User Request:**
```
"I want to share my rules through rulaby"
```

**System Response:**
1. MCP server detects current IDE
2. Reads relevant rule files:
   - Cursor: `.cursorrules`
   - Windsurf: `.windsurfrules`
   - Claude-Code: `.claude/CLAUDE.md`
   - Gemini-CLI: `.gemini/rules.md`
   - Kiro: `.kiro/prompts.md`
3. Shows detected rules to user
4. Encrypts rules with generated password
5. Stores encrypted data in Rulaby database
6. Returns:
   - Share Code: `RULABY-XXXX-XXXX`
   - Password: `SecurePass123`

**Success Message:**
```
Your rules have been shared successfully!
Share Code: RULABY-A7B2-K9M4
Password: Thunder$torm42
Share these with your team to let them import your rules.
```

### Flow 2: Importing Rules

**User Request:**
```
"Import rules through rulaby, code is RULABY-A7B2-K9M4 and password is Thunder$torm42"
```

**System Response:**
1. Fetches encrypted data from Rulaby database
2. Decrypts using provided password
3. Detects user's current IDE
4. Converts rules to appropriate format
5. Creates/updates rule files in correct location
6. Confirms successful import

**Success Message:**
```
Rules imported successfully to Windsurf!
Created: .windsurfrules
Your IDE is now configured with the shared rules.
```

## 🗂️ IDE Rule File Structures

### Cursor (.cursorrules)
```
# Cursor Rules
You are an AI assistant...
Always follow these guidelines:
- Use TypeScript
- Follow ESLint rules
```

### Windsurf (.windsurfrules)
```
# Windsurf Configuration
assistant_behavior:
  - Be concise
  - Use functional programming
```

### Claude-Code (.claude/CLAUDE.md)
```
# Claude Instructions
## Project Context
This is a Next.js project...
## Coding Standards
- Always use named exports
```

### Gemini-CLI (.gemini/rules.md)
```
# Gemini Rules
## Response Format
Always respond in markdown...
## Code Style
Follow Google style guide...
```

### Kiro (.kiro/prompts.md)
```
# Kiro Prompts
## Default Behavior
Act as a senior developer...
## Project Rules
- Test-driven development
```

## 🔐 Security Model

### Encryption
- Algorithm: AES-256-GCM
- Password: Auto-generated 12+ characters
- Salt: Unique per share
- IV: Random for each encryption

### Share Codes
- Format: `RULABY-XXXX-XXXX`
- Expiration: 30 days (configurable)
- One-time use option available
- Rate limiting: 10 shares per day

## 📊 MVP Success Metrics

1. **Sharing Success Rate**: >95%
2. **Import Success Rate**: >90%
3. **Cross-IDE Compatibility**: 100%
4. **Time to Share**: <5 seconds
5. **Time to Import**: <10 seconds

## 🚀 Implementation Phases

### Phase 1: Core Sharing (Week 1-2)
- [ ] Rule file detection for all 5 IDEs
- [ ] Basic encryption/decryption
- [ ] Database schema for shares
- [ ] MCP tool implementation

### Phase 2: Format Conversion (Week 3-4)
- [ ] Rule format parser
- [ ] Cross-IDE conversion engine
- [ ] Validation system
- [ ] Error handling

### Phase 3: User Experience (Week 5-6)
- [ ] Share code generation
- [ ] Password strength requirements
- [ ] Success/error messages
- [ ] Basic analytics

## 🔧 Technical Requirements

### MCP Server Tools

1. **share_rules**
   - Detects IDE and rule files
   - Encrypts and stores rules
   - Returns share code and password

2. **import_rules**
   - Validates share code and password
   - Decrypts rules
   - Converts to target IDE format
   - Creates rule files

### Database Schema
```sql
CREATE TABLE rule_shares (
  id UUID PRIMARY KEY,
  share_code VARCHAR(14) UNIQUE,
  encrypted_data TEXT,
  salt VARCHAR(32),
  iv VARCHAR(32),
  source_ide VARCHAR(20),
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  access_count INTEGER DEFAULT 0,
  max_access INTEGER DEFAULT NULL
);
```

## 🎯 MVP Limitations

1. **No user accounts** - Anonymous sharing only
2. **No versioning** - Latest rules only
3. **No editing** - Direct file sharing
4. **No collaboration** - One-way sharing
5. **No rule validation** - Trust-based system

## 📈 Future Enhancements

1. User accounts and teams
2. Rule versioning and history
3. Web interface for viewing/editing
4. Rule marketplace
5. AI-powered rule suggestions
6. Integration with CI/CD pipelines

## 🏁 Definition of Done

- [ ] All 5 IDEs supported
- [ ] Encryption working reliably
- [ ] Share codes generated uniquely
- [ ] Import works across IDEs
- [ ] Basic error handling
- [ ] User documentation
- [ ] 90% test coverage

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-23  
**Status**: Ready for Implementation