# 🤝 Contributing to Rulaby

Thank you for considering contributing to **Rulaby** — a collaborative open-source SaaS for sharing AI prompt rules across teams.

We welcome all kinds of contributions, from code and documentation to bug reports and feature suggestions. Whether you're a seasoned developer or just getting started, you're welcome here. 💜

---

## 📦 Project Overview

**Rulaby** helps teams:
- Define and store prompt usage rules
- Share role-based context configurations
- Automate AI-based PR reviews
- Operate within the [MCP](https://makecodingplayful.com) ecosystem

---

## 🚀 Getting Started

### 1. Fork the Repository

Click the **Fork** button on the top right of this repo and clone it to your local machine:

```bash
git clone https://github.com/your-username/rulaby.git
cd rulaby
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

Copy the example env file and configure your keys:

```bash
cp .env.example .env
```

Fill in:
- `OPENAI_API_KEY`
- Firebase credentials (if used)

---

## 🧠 Contribution Types

### 🛠 Code Contributions
- Implement a feature from the `DEVELOPMENT_TASKS.md` list
- Fix a bug (look for `good first issue` label)
- Write or improve unit tests

### 📝 Documentation
- Improve README
- Add examples or usage guides
- Translate documentation

### 🧪 Prompt Engineering
- Submit a new rule template
- Propose a better AI review structure
- Improve AI system prompts

### 🐛 Bug Reports / Suggestions
- Use [GitHub Issues](https://github.com/your-org/rulaby/issues)
- Label clearly: `bug`, `enhancement`, `question`

---

## 🧪 Dev Flow (for Code)

```bash
git checkout -b feat/my-feature
# make your changes
git commit -m "feat: add [your change]"
git push origin feat/my-feature
```

Then, open a Pull Request (PR) from your branch.

---

## ✅ Pull Request Checklist

- [ ] Code is clean and linted
- [ ] Functionality is working as described
- [ ] No hardcoded secrets
- [ ] Relevant docs are updated
- [ ] Description explains the **why** of the change

---

## 💬 Community & Help

- MCP Discord: [discord.gg/mcp](https://discord.gg/mcp)
- GitHub Discussions: Coming soon!
- Issue or PR comments — we respond fast 🐇

---

## 📄 License

By contributing, you agree that your code will be licensed under the [MIT License](./LICENSE).

Happy building! 🧡
