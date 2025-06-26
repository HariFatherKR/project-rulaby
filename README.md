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
- 🤖 **AI-Powered PR Bot**: Approves or flags pull requests based on prompt compliance
- 🧩 **VSCode / MCP Plugin**: In-editor prompt auto-fill and rule sync
- ⏪ **Version History**: Audit and rollback of prompt and context changes

---

## 🧠 Architecture Overview

```text
Developer
   │
[Editor Plugin] ←→ [Rulaby API Server] ←→ [MongoDB + AI Agent]
   │                             │
   └───────── GitHub / GitLab (PR Hooks)
