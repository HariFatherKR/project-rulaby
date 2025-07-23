항상 한글로 답변

# 🍓 Rulaby - AI 프롬프트 룰 공유 SaaS

## 프로젝트 개요
**Rulaby**는 팀 단위로 AI 프롬프트 작성 스타일 가이드를 관리하고 공유할 수 있는 SaaS 플랫폼입니다. 
일관된 AI 프롬프트 작성을 위한 규칙 정의, 역할별 컨텍스트 프로필 설정, AI 기반 자동 검토 기능을 제공합니다.

## 기술 스택
- **Frontend**: Next.js 15.3.4, React 19.1.0, TypeScript 5.8.3
- **Backend**: Firebase 11.9.1 (Firestore)
- **AI**: OpenAI API 5.7.0 (GPT-4)
- **MCP**: Model Context Protocol SDK 1.13.1
- **테스트**: Jest, ts-jest

## 프로젝트 구조
```
project-rulaby/
├── components/          # React 컴포넌트
│   ├── AIReviewResult.tsx    # AI 리뷰 결과 표시
│   ├── ContextEditor.tsx     # 컨텍스트 편집기
│   ├── Header.tsx           # 헤더 컴포넌트
│   └── RuleCard.tsx         # 룰 카드 컴포넌트
├── pages/              # Next.js 페이지 및 API 라우트
│   ├── api/           # API 엔드포인트
│   │   ├── context-profiles/  # 컨텍스트 프로필 CRUD
│   │   ├── mcp-memory/       # MCP 메모리 세션 관리
│   │   ├── prompt-rules/     # 프롬프트 룰 CRUD
│   │   └── reviewRule.ts     # AI 리뷰 API
│   ├── contexts/      # 컨텍스트 관리 페이지
│   ├── rules/         # 룰 관리 페이지
│   ├── mcp-memory.tsx # MCP 메모리 관리 페이지
│   └── index.tsx      # 홈페이지
├── lib/               # 유틸리티 및 설정
│   ├── firebase.ts    # Firebase 설정
│   ├── firestore.ts   # Firestore 서비스
│   ├── mcp-memory.ts  # MCP 메모리 관리
│   ├── models.ts      # TypeScript 인터페이스
│   ├── openai.ts      # OpenAI 클라이언트
│   └── utils.ts       # 유틸리티 함수
├── mcp-server/        # MCP 서버 (@hyto/rulaby-mcp-server)
│   └── src/          # MCP 서버 소스 코드
└── data/             # 로컬 데이터 저장
    └── mcp-memory/   # MCP 메모리 세션 파일
```

## 주요 기능

### 1. 프롬프트 룰 관리
- 팀 단위 프롬프트 작성 규칙 정의
- 카테고리별 규칙 분류 및 검색
- CRUD 기능 제공

### 2. 컨텍스트 프로필
- 역할별 AI 대화 컨텍스트 템플릿
- 기본 프롬프트 설정
- 프로필별 관리자 지정

### 3. AI 리뷰 시스템
- OpenAI GPT-4를 활용한 프롬프트 평가
- 팀 규칙 기반 자동 검토
- 승인/수정필요/거절 판정 및 피드백

### 4. MCP 메모리 시스템
- LLM 대화 세션 파일 기반 저장
- 세션별 히스토리 관리
- 컨텍스트 프로필 및 프롬프트 룰 연동
- Claude Code와의 통합 지원

## 개발 가이드

### 실행 명령어
```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test

# 타입 체크
npm run type-check

# 린트
npm run lint
```

### MCP 서버 실행
```bash
cd mcp-server
npm run build
npm start
```

## 코드 스타일 & 포맷팅
- Airbnb 스타일 가이드 준수
- React 컴포넌트 파일명은 PascalCase 사용 (예: UserCard.tsx)
- Named export 선호

## 프로젝트 아키텍처
- Next.js App Router 패턴 사용
- 서버/클라이언트 컴포넌트 적절히 구분
- Firebase Firestore를 통한 데이터 영속성
- 파일 기반 MCP 메모리 저장소

## 데이터 모델

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

## API 엔드포인트
- `/api/prompt-rules` - 프롬프트 룰 CRUD
- `/api/context-profiles` - 컨텍스트 프로필 CRUD  
- `/api/mcp-memory` - MCP 메모리 세션 관리
- `/api/reviewRule` - AI 프롬프트 검토

## 환경 변수
- `FIREBASE_*` - Firebase 설정
- `OPENAI_API_KEY` - OpenAI API 키

## 작업 프로세스
- 작업별로 `task/XXX-description` 형식의 브랜치 생성
- 작업 완료 후 README.md 업데이트
- PR/MR 생성 후 테스트 검증
- main 브랜치에 머지