# MCP (Model Context Protocol) 통합 개발 태스크

## 목표
Rulaby의 Memory Control Protocol을 실제 Model Context Protocol (MCP) 서버로 전환하여 Claude Code와 직접 연동 가능하도록 개발

## 개발 진행 상황

### ✅ Task 1: git pull로 최신 버전 업데이트
- **상태**: 완료
- **날짜**: 2025-06-26
- **내용**: 
  - main 브랜치에서 최신 변경사항 pull
  - 새로운 파일 추가: `docs/competitive-analysis.md`

### 🔄 Task 2: TASK.md 파일 생성 및 개발 계획 수립
- **상태**: 진행중
- **날짜**: 2025-06-26
- **계획**:
  - [x] TASK.md 파일 생성
  - [ ] 세부 개발 계획 작성
  - [ ] 각 태스크별 체크리스트 정의

### ✅ Task 3: MCP SDK 설치 및 프로젝트 설정
- **상태**: 완료
- **날짜**: 2025-06-26
- **완료 작업**:
  - [x] `@modelcontextprotocol/sdk` 패키지 설치
  - [x] TypeScript 타입 정의 추가
  - [x] MCP 서버 디렉토리 구조 생성 (`mcp-server/`)
  - [x] `tsconfig.json` 설정 완료

### ✅ Task 4: MCP 서버 기본 구조 구현
- **상태**: 완료
- **날짜**: 2025-06-26
- **완료 작업**:
  - [x] stdio 기반 통신 인터페이스 구현
  - [x] JSON-RPC 2.0 핸들러 구현 (SDK 제공)
  - [x] 기본 MCP 메서드 구현:
    - `list_tools`: 5개 도구 등록
    - `list_resources`: 메모리 세션 리소스 목록
    - `read_resource`: 메모리 세션 읽기
    - `call_tool`: 도구 실행 핸들러

### ✅ Task 5: 기존 Memory Control 기능을 MCP 도구로 변환
- **상태**: 완료
- **날짜**: 2025-06-26
- **완료 작업**:
  - [x] 프롬프트 룰 관리를 MCP 도구로 변환 (5개 도구)
    - create_prompt_rule, list_prompt_rules, get_prompt_rule, update_prompt_rule, delete_prompt_rule
  - [x] 컨텍스트 프로필 관리를 MCP 도구로 변환 (5개 도구)
    - create_context_profile, list_context_profiles, get_context_profile, update_context_profile, delete_context_profile
  - [x] 메모리 세션 관리 도구 구현 (5개 도구)
    - create_memory_session, list_memory_sessions, add_memory_entry, get_memory_session, delete_memory_session
  - [x] 파일 기반 저장소 구조 구현

### ✅ Task 6: MCP 매니페스트 파일 작성
- **상태**: 완료
- **날짜**: 2025-06-26
- **완료 작업**:
  - [x] `mcp.json` 파일 생성
  - [x] MCP 서버 실행 설정 정의
  - [x] `mcp-server/README.md` 문서 작성
  - [x] Claude Code 연동 가이드 포함

### ✅ Task 7: 테스트 및 Claude Code 연동 확인
- **상태**: 완료
- **날짜**: 2025-06-26
- **완료 작업**:
  - [x] TypeScript 빌드 성공
  - [x] MCP 서버 실행 테스트 완료
  - [x] stdio 통신 인터페이스 정상 작동 확인
  - [x] Claude Code 연동 가이드 문서화 완료

**Claude Code 연동 방법**:
1. Claude Code 설정 파일 편집: `~/.config/claude/claude_desktop_config.json`
2. 다음 내용 추가:
   ```json
   {
     "mcpServers": {
       "rulaby": {
         "command": "node",
         "args": ["/Users/tom/Documents/HyperTokki/project-rulaby/mcp-server/dist/index.js"]
       }
     }
   }
   ```
3. Claude Code 재시작
4. `/mcp` 명령어로 연결 확인

## 기술 스택
- **기존**: Next.js, TypeScript, Firebase, OpenAI
- **추가 예정**: @modelcontextprotocol/sdk, JSON-RPC 2.0

## 주요 변경사항
1. REST API → MCP 프로토콜 기반 통신
2. 웹 기반 인터페이스 → CLI/stdio 기반 서버
3. HTTP 엔드포인트 → MCP 도구 및 리소스

## 참고사항
- MCP 서버는 별도 프로세스로 실행됨
- 기존 웹 UI는 유지하되, MCP 서버와 통신하도록 수정 필요
- Claude Code 설정 파일에 MCP 서버 등록 필요