항상 한글로 답변

# 🍓 Rulaby - AI Prompt Rule Sharing SaaS

## Project Overview
**Rulaby** is a SaaS platform that enables teams to manage and share AI prompt writing style guides.
It provides rule definitions for consistent AI prompt creation, role-based context profile settings, and AI-based automatic review features.

## Tech Stack
- **Frontend**: Next.js 15.3.4, React 19.1.0, TypeScript 5.8.3
- **Backend**: Firebase 11.9.1 (Firestore)
- **AI**: OpenAI API 5.7.0 (GPT-4)
- **MCP**: Model Context Protocol SDK 1.13.1
- **Testing**: Jest, ts-jest

## Project Structure
```
project-rulaby/
├── components/          # React components
│   ├── AIReviewResult.tsx    # AI review result display
│   ├── ContextEditor.tsx     # Context editor
│   ├── Header.tsx           # Header component
│   └── RuleCard.tsx         # Rule card component
├── pages/              # Next.js pages and API routes
│   ├── api/           # API endpoints
│   │   ├── context-profiles/  # Context profile CRUD
│   │   ├── mcp-memory/       # MCP memory session management
│   │   ├── prompt-rules/     # Prompt rule CRUD
│   │   └── reviewRule.ts     # AI review API
│   ├── contexts/      # Context management pages
│   ├── rules/         # Rule management pages
│   ├── mcp-memory.tsx # MCP memory management page
│   └── index.tsx      # Homepage
├── lib/               # Utilities and configurations
│   ├── firebase.ts    # Firebase configuration
│   ├── firestore.ts   # Firestore services
│   ├── mcp-memory.ts  # MCP memory management
│   ├── models.ts      # TypeScript interfaces
│   ├── openai.ts      # OpenAI client
│   └── utils.ts       # Utility functions
├── mcp-server/        # MCP server (@hyto/rulaby-mcp-server)
│   └── src/          # MCP server source code
└── data/             # Local data storage
    └── mcp-memory/   # MCP memory session files
```

## Key Features

### 1. Prompt Rule Management
- Define team-wide prompt writing rules
- Categorize and search rules by category
- Full CRUD functionality

### 2. Context Profiles
- Role-based AI conversation context templates
- Default prompt settings
- Profile-specific maintainer designation

### 3. AI Review System
- Prompt evaluation using OpenAI GPT-4
- Automatic review based on team rules
- Approval/Needs Revision/Rejection status with feedback

### 4. MCP Memory System
- File-based LLM conversation session storage
- Session-based history management
- Integration with context profiles and prompt rules
- Claude Code integration support

## Development Guide

### Commands
```bash
# Run development server
npm run dev

# Production build
npm run build

# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

### MCP Server Setup
```bash
cd mcp-server
npm run build
npm start
```

## Code Style & Formatting
- Follow Airbnb style guide
- Use PascalCase for React component filenames (e.g., UserCard.tsx)
- Prefer named exports

## Project Architecture
- Uses Next.js App Router pattern
- Proper separation of server/client components
- Data persistence through Firebase Firestore
- File-based MCP memory storage

## Data Models

### PromptRule
- id: string
- title: string  
- content: string
- category: string
- createdBy: string
- createdAt: Date

### ContextProfile
- id: string
- role: string
- basePrompt: string
- maintainedBy: string

### MCPMemorySession
- id: string
- title: string
- createdAt: Date
- updatedAt: Date
- contextProfile?: string
- promptRules?: string[]
- entries: MCPMemoryEntry[]

## API Endpoints
- `/api/prompt-rules` - Prompt rule CRUD
- `/api/context-profiles` - Context profile CRUD  
- `/api/mcp-memory` - MCP memory session management
- `/api/reviewRule` - AI prompt review

## Environment Variables
- `FIREBASE_*` - Firebase configuration
- `OPENAI_API_KEY` - OpenAI API key

## Work Process
- Create branch in `task/XXX-description` format for each task
- Update README.md after task completion
- Create PR/MR after test verification
- Merge to main branch