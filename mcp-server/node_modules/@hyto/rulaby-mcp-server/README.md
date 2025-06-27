# Rulaby MCP Server

Rulaby의 Model Context Protocol (MCP) 서버 구현입니다.

## 기능

### 🧠 메모리 세션 관리
- `create_memory_session`: 새로운 메모리 세션 생성
- `list_memory_sessions`: 모든 메모리 세션 목록 조회
- `add_memory_entry`: 세션에 대화 내용 추가
- `get_memory_session`: 특정 세션 조회
- `delete_memory_session`: 세션 삭제

### 📚 프롬프트 룰 관리
- `create_prompt_rule`: 새로운 프롬프트 룰 생성
- `list_prompt_rules`: 프롬프트 룰 목록 조회 (카테고리 필터링 지원)
- `get_prompt_rule`: 특정 룰 조회
- `update_prompt_rule`: 룰 수정
- `delete_prompt_rule`: 룰 삭제

### 🎭 컨텍스트 프로필 관리
- `create_context_profile`: 새로운 컨텍스트 프로필 생성
- `list_context_profiles`: 프로필 목록 조회 (역할 필터링 지원)
- `get_context_profile`: 특정 프로필 조회
- `update_context_profile`: 프로필 수정
- `delete_context_profile`: 프로필 삭제

## 설치 및 실행

### 1. 의존성 설치
```bash
cd mcp-server
npm install
```

### 2. 빌드
```bash
npm run build
```

### 3. 개발 모드 실행
```bash
npm run dev
```

### 4. 프로덕션 실행
```bash
npm start
```

## Claude Code 연동

1. Claude Code 설정 파일 (`~/.config/claude/claude_desktop_config.json`)에 추가:

```json
{
  "mcpServers": {
    "rulaby": {
      "command": "node",
      "args": ["/path/to/project-rulaby/mcp-server/dist/index.js"]
    }
  }
}
```

2. Claude Code 재시작

3. 사용 가능한 도구 확인:
   - Claude Code에서 `/mcp` 명령어로 연결된 서버 확인
   - 도구 목록이 표시되면 정상 연동 완료

## 데이터 저장 구조

```
data/
├── mcp-memory/         # 메모리 세션 파일
├── prompt-rules/       # 프롬프트 룰 파일
└── context-profiles/   # 컨텍스트 프로필 파일
```

각 데이터는 JSON 파일로 저장되며, 파일명은 고유 ID를 사용합니다.

## 개발 가이드

### 새로운 도구 추가하기

1. `src/tools/` 디렉토리에 새 파일 생성
2. 도구 정의 및 핸들러 함수 구현
3. `src/index.ts`에 도구 import 및 등록

### 테스트

```bash
npm test
```

## 라이선스

MIT License