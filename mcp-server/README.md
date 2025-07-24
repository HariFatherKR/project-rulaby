# 🔄 Rulaby MCP 서버 - MCP를 통한 안전한 AI IDE 규칙 공유

모델 컨텍스트 프로토콜(MCP)을 사용하여 AI IDE 규칙(Claude, Cursor, Windsurf 등)을 안전하게 공유하고 가져올 수 있습니다.

## ✨ 주요 기능

- 🔐 **안전한 공유** - 비밀번호 보호 기능이 있는 종단 간 암호화
- 🤖 **다중 IDE 지원** - Claude Code, Cursor, Windsurf, Gemini CLI 등 지원
- 🔄 **포맷 변환** - 다른 IDE 포맷 간 규칙 자동 변환
- 📦 **MCP 통합** - MCP 지원 환경과 원활하게 연동
- ⏰ **만료 제어** - 만료 날짜 및 사용 횟수 제한 설정
- 📚 **템플릿 라이브러리** - 다양한 프레임워크와 언어를 위한 큐레이션된 규칙 템플릿 접근
- 🚀 **간단한 CLI** - 사용하기 쉬운 명령줄 인터페이스

## 📋 사전 요구사항

- Node.js 18+
- MCP 호환 클라이언트 (Claude Desktop, MCP 확장 기능이 설치된 VS Code 등)
- 인터넷 연결 (API 접근용)

## 🚀 빠른 시작

### 설치

```bash
# 전역 설치
npm install -g @hyto/rulaby-mcp-server

# 또는 npx로 바로 사용
npx @hyto/rulaby-mcp-server
```

### MCP 설정

MCP 설정에 추가 (예: Claude Desktop):

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

## 📖 사용법

### 규칙 공유하기

1. IDE 규칙 파일이 있는 프로젝트 디렉터리로 이동합니다.
2. MCP 클라이언트에서 `share_rules` 도구를 사용합니다:

```
share_rules({
  includeProjectSpecific: true,  // 프로젝트별 규칙 포함
  expiresInDays: 1,             // 만료 기간 (기본값: 1일 = 24시간)
  maxUses: null                 // 사용 횟수 제한 (null = 무제한)
})
```

다음 정보를 받게 됩니다:

- **공유 코드**: `RULABY-XXXX-XXXX`
- **비밀번호**: `SecurePassword123!`

### 규칙 가져오기

공유된 정보와 함께 `import_rules` 도구를 사용합니다:

```
import_rules({
  shareCode: "RULABY-XXXX-XXXX",
  password: "SecurePassword123!",
  targetIDE: "claude-code"  // 선택 사항: 지정하지 않으면 자동으로 감지됨
})
```

### 템플릿 규칙 추가하기

미리 구성된 템플릿 규칙을 찾아 프로젝트에 추가합니다:

```
# 사용 가능한 모든 템플릿 목록 보기 (로컬 + 원격)
list_templates()

# ID로 특정 템플릿 추가
add_template_rule({
  templateId: "react"        // 로컬 캐시가 있으면 사용
})

# 서버에서 원격 템플릿 추가
add_template_rule({
  templateId: "advanced-react-patterns"  // 서버에서 가져옴
})

# 카테고리별로 템플릿 추가 (로컬 전용)
add_template_rule({
  category: "framework",     // 옵션: framework, language, style, backend, workflow
  targetPath: "/path/to/project"
})
```

**템플릿 시스템:**

- **🏠 로컬 템플릿**: npm 패키지에 16개의 필수 템플릿 포함 (44KB)
- **☁️ 원격 템플릿**: 서버에서 전체 라이브러리 사용 가능 (사용 통계 포함)
- **📊 분석**: 템플릿 사용량을 추적하여 인기 있는 선택지를 보여줌
- **⚡ 스마트 로딩**: 로컬 캐시를 먼저 사용하고, 없으면 서버에서 가져옴

**인기 템플릿:**

- React, TypeScript, Next.js, Tailwind CSS
- Python, FastAPI, Node.js, Express
- Clean Code, Git Flow, Database patterns
- 그 외 100개 이상의 템플릿이 서버에 있습니다...

## ⚠️ 알려진 문제 및 주의사항

- **규칙 가져오기 버그**: 현재 `import_rules` 기능에 심각한 버그가 있습니다. API 서버에서 데이터를 성공적으로 가져오지만, 클라이언트 측에서 데이터를 파일로 올바르게 쓰지 못하는 문제가 있습니다. 이로 인해 내용이 비어있는 규칙 파일이 생성될 수 있습니다. 이 문제가 해결되기 전까지 규칙 가져오기 기능은 정상적으로 작동하지 않을 수 있습니다.
- **`path` 인수 동작**: `import_rules`에 문서화되지 않은 `path` 인수가 있습니다. 이 인수를 사용하면, 제공된 경로를 이름으로 하는 **폴더**가 생성되고 그 안에 규칙 파일이 생성됩니다. 이는 예상과 다른 동작일 수 있으므로 사용에 주의가 필요합니다.

## 🛠️ 지원되는 IDE

| IDE         | 규칙 파일           | 자동 감지 |
| ----------- | ------------------- | --------- |
| Claude Code | `.claude/CLAUDE.md` | ✅        |
| Cursor      | `.cursorrules`      | ✅        |
| Windsurf    | `.windsurfrules`    | ✅        |
| Gemini CLI  | `.gemini/rules.md`  | ✅        |
| Kiro        | `.kiro/prompts.md`  | ✅        |

## 🔒 보안

- **종단 간 암호화**: 비밀번호 기반 키 유도를 사용하는 AES-256-GCM 암호화
- **클라이언트 측 암호화**: 모든 암호화는 전송 전에 로컬에서 이루어집니다.
- **평문 저장 없음**: 서버는 암호화되지 않은 규칙을 볼 수 없습니다.
- **자동 만료**: 공유는 지정된 기간 후에 만료됩니다.
- **접근 제한**: 공유에 대한 선택적 사용 횟수 제한

## 🤝 기여

기여를 환영합니다!

## 📄 라이선스

MIT © HariFatherKR

## 🆘 지원

- **이슈**: [GitHub Issues](https://github.com/HariFatherKR/project-rulaby/issues)
- **토론**: [GitHub Discussions](https://github.com/HariFatherKR/project-rulaby/discussions)
- **이메일**: insanityskan@gmail.com

## 🔗 링크

- [GitHub 저장소](https://github.com/HariFatherKR/project-rulaby)
- [NPM 패키지](https://www.npmjs.com/package/@hyto/rulaby-mcp-server)
- [문서](https://docs.rulaby.dev)

## 📝 변경 로그

### v1.1.4 (2025-07-24)

- `import_rules` 경로 문제 수정: 홈 디렉토리 대신 현재 작업 디렉토리에 규칙 파일 생성
- process.env.CWD를 process.cwd()로 변경하여 올바른 작업 디렉토리 감지
- RuleWriter의 기본 경로를 os.homedir() 대신 process.cwd()로 변경
- URF 파싱 및 규칙 변환 추적을 위한 디버그 로깅 추가

### v1.1.3 (2025-07-24)

- MCP 서버의 규칙 파서 버그를 수정하여 claude-code 형식의 규칙을 올바르게 파싱하도록 개선
- `import_rules`가 raw 필드를 처리하지 못하던 문제 해결
- 불완전한 빌드로 인해 누락되었던 `templateRules` 모듈 문제 수정 (빌드 재실행으로 해결)
- README.md 파일을 전체적으로 한국어로 번역하고, 발견된 버그에 대한 "알려진 문제" 섹션을 추가하여 문서의 정확성 향상

### v1.1.2 (2025-07-24)

- 더 나은 서식과 구성을 통해 템플릿 목록 표시 향상
- 템플릿 이름 서식 개선 (중복 접미사 제거)
- 사용 통계 및 인기 지표 추가 (🔥 100회 이상 사용, ⭐ 500회 이상 사용)

### v1.1.0 (2025-07-24)

- 로컬 캐시와 원격 서버를 갖춘 하이브리드 템플릿 시스템 추가
- npm 패키지에 16개의 필수 템플릿 포함 (44KB)
- 사용 통계를 포함한 원격 템플릿 가져오기
- templateId를 지원하는 새로운 `add_template_rule` 도구
- 로컬 + 원격 템플릿을 보여주는 향상된 `list_templates`

### v1.0.1 (2025-07-23)

- 성공적인 배포 후 디버그 엔드포인트 제거
- Vercel 배포를 위한 상태 확인 엔드포인트 URL 수정
- 24시간 만료 기능으로 규칙 공유 시스템 개선
- 보안 기능 향상
- Firebase 종속성 제거 및 서버리스 API로 마이그레이션

### v1.0.0 (2025-07-23)

- 안전한 규칙 공유를 위한 MCP 서버 초기 릴리스
- 다중 AI IDE 지원 (Claude Code, Cursor, Windsurf 등)
- 종단 간 암호화 및 비밀번호 보호
- IDE 간 자동 포맷 변환
- 만료 제어 및 사용 횟수 제한

---

Rulaby 팀이 ❤️를 담아 만들었습니다.
