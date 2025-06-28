# 🍓 Rulaby – Rules for AI, Sweetly Shared

> 🍇 The prompt rulebook your AI team will love.  
> Define, sync, and approve LLM usage rules like a lullaby – smooth, repeatable, and sweet.

![MIT License](https://img.shields.io/badge/license-MIT-green) ![Status](https://img.shields.io/badge/status-MVP-orange) ![Made with LLMs](https://img.shields.io/badge/powered%20by-LLM-blue)

---

## 🎯 What is Rulaby?

**Rulaby** is a lightweight, open-source SaaS that helps teams define and share **prompting rules** and **context configurations** for LLM-based development workflows.  
Think of it as your team's _AI coding convention system_ — like ESLint or Prettier, but for prompts.

---

## 💡 Why Rulaby?

With LLMs now co-piloting development, every team needs:
- 🤖 Consistent prompting habits  
- 🔒 Role-specific context alignment  
- ✅ Prompt-aware PR reviews  

Yet there is no standard. **Rulaby** fills this gap with a simple, intuitive system.

---

## ✨ Core Features

- 📚 **Prompt Rulebook**: Centralized storage of team-approved prompting rules
- 🧠 **Context Templates**: Assign persona/context by role (e.g., Frontend, Backend, AI)
- 🤖 **AI-Powered Review**: Real-time prompt evaluation against team rules
- 📝 **Rule Management**: Create, edit, and organize prompting guidelines
- 🎯 **Context Editor**: Role-based prompt templates and contexts
- 🔍 **AI Review Results**: Detailed feedback and suggestions for prompt improvement
- 💾 **MCP Memory Storage**: File-based LLM conversation memory management with session tracking

### 🚀 Advanced Features (New)

- 📊 **Real-time Analytics**: Track rule usage patterns, token optimization insights
- 🏆 **Rule Leaderboard**: Popular rule rankings with category filtering
- 🎯 **Awesome Cursor Rules Integration**: Browse and import community-verified rules
- 🛡️ **Security Compliance Dashboard**: Built-in security best practices for Git, Firebase, AWS
- 💡 **Smart Recommendations**: Technology stack-based personalized rule suggestions
- 🎨 **Visualization Dashboard**: Team productivity, token efficiency, compliance status visualization
- 🔧 **Developer Experience**: Optimized Claude Code integration, automatic context management

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project (for database)
- OpenAI API key (for AI review features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HariFatherKR/project-rulaby.git
   cd project-rulaby
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   - Firebase credentials
   - OpenAI API key

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Explore Analytics Dashboard**
   Visit [http://localhost:3000/analytics](http://localhost:3000/analytics) to view team insights, rule leaderboards, and security compliance.

7. **Browse Community Rules**
   Access the Awesome Cursor Rules integration to import popular community rules.

8. **Explore MCP Memory Management**
   Visit [http://localhost:3000/mcp-memory](http://localhost:3000/mcp-memory) to manage LLM conversation memory.

---

## 📁 Project Structure

```
/project-rulaby
├── components/          # Reusable React components
│   ├── Header.tsx
│   ├── RuleCard.tsx
│   ├── ContextEditor.tsx
│   └── AIReviewResult.tsx
├── pages/               # Next.js pages and routing
│   ├── rules/           # Rule management pages
│   │   ├── index.tsx    # Rules list
│   │   └── [id].tsx     # Rule detail/edit
│   ├── contexts/        # Context management
│   │   └── index.tsx    # Context settings
│   ├── api/             # API endpoints
│   │   ├── prompt-rules/     # Rule CRUD APIs
│   │   ├── context-profiles/ # Context CRUD APIs
│   │   └── reviewRule.ts     # AI review API
│   └── index.tsx        # Homepage
├── lib/                 # Utilities and configurations
│   ├── firebase.ts      # Firebase setup
│   ├── firestore.ts     # Database services
│   ├── openai.ts        # OpenAI client
│   └── models.ts        # TypeScript interfaces
└── docs/                # Documentation
    ├── FIRESTORE.md     # Database schema
    └── CONTRIBUTING-KR.md
```

---

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Copy your project configuration to `.env`

### OpenAI Setup

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env` file as `OPENAI_API_KEY`

---

## 📚 API Endpoints

### Prompt Rules
- `GET /api/prompt-rules` - Get all rules
- `POST /api/prompt-rules` - Create new rule
- `GET /api/prompt-rules/[id]` - Get specific rule
- `PUT /api/prompt-rules/[id]` - Update rule
- `DELETE /api/prompt-rules/[id]` - Delete rule

### Context Profiles
- `GET /api/context-profiles` - Get all contexts
- `POST /api/context-profiles` - Create new context
- `GET /api/context-profiles/[id]` - Get specific context
- `PUT /api/context-profiles/[id]` - Update context
- `DELETE /api/context-profiles/[id]` - Delete context

### MCP Memory Storage
- `GET /api/mcp-memory` - Get all memory sessions
- `POST /api/mcp-memory` - Create new memory session
- `GET /api/mcp-memory/[id]` - Get specific session
- `POST /api/mcp-memory/[id]` - Add memory entry to session
- `DELETE /api/mcp-memory/[id]` - Delete session
- `GET /api/mcp-memory/[id]/export` - Export session as JSON
- `POST /api/mcp-memory/[id]/export` - Import session from JSON

### Analytics & Insights
- `GET /api/analytics?type=leaderboard` - Get rule popularity leaderboard
- `GET /api/analytics?type=rule-analytics&ruleId={id}` - Get rule usage analytics
- `GET /api/analytics?type=team-stats` - Get team-wide usage statistics
- `POST /api/analytics` - Track rule usage

### Security Compliance
- `GET /api/security-rules` - Get all security rules
- `GET /api/security-rules?category={category}` - Get rules by category
- `POST /api/security-rules` - Create new security rule

### Awesome Cursor Rules
- `GET /api/awesome-cursor-rules?type=trending` - Get trending community rules
- `GET /api/awesome-cursor-rules?type=by-stack&stack={tech}` - Get rules by tech stack
- `POST /api/awesome-cursor-rules` - Import community rule

### AI Review
- `POST /api/reviewRule` - Review prompt against rules
  ```json
  {
    "prompt": "string",
    "ruleIds": ["string[]"]
  }
  ```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING-KR.md](docs/CONTRIBUTING-KR.md) for guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenAI](https://openai.com/)
- Database by [Firebase](https://firebase.google.com/)
- Made with ❤️ by the Rulaby community
