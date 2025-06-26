// MCP Memory Storage Service for file-based LLM memory management
import fs from 'fs/promises'
import path from 'path'
import { 
  MCPMemorySession, 
  MCPMemoryEntry, 
  CreateMCPMemorySession, 
  CreateMCPMemoryEntry 
} from './models'

export class MCPMemoryService {
  private dataDir: string

  constructor(dataDir: string = './data/mcp-memory') {
    this.dataDir = dataDir
  }

  /**
   * 새로운 MCP 메모리 세션을 생성합니다
   */
  async createSession(sessionData: CreateMCPMemorySession): Promise<string> {
    // 고유한 ID 생성을 위해 더 정확한 타임스탬프와 랜덤 값 사용
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date()
    
    const session: MCPMemorySession = {
      id: sessionId,
      title: sessionData.title,
      createdAt: now,
      updatedAt: now,
      entries: [],
      contextProfile: sessionData.contextProfile,
      rules: sessionData.rules
    }

    await this.ensureDataDir()
    await this.saveSession(session)
    
    return sessionId
  }

  /**
   * 세션에 메모리 엔트리를 추가합니다
   */
  async addMemoryEntry(sessionId: string, entry: CreateMCPMemoryEntry): Promise<string> {
    const session = await this.getSession(sessionId)
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }

    // 고유한 엔트리 ID 생성
    const entryId = `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const memoryEntry: MCPMemoryEntry = {
      id: entryId,
      timestamp: new Date(),
      role: entry.role,
      content: entry.content,
      contextId: entry.contextId,
      metadata: entry.metadata
    }

    session.entries.push(memoryEntry)
    session.updatedAt = new Date()
    
    await this.saveSession(session)
    
    return entryId
  }

  /**
   * 세션 ID로 메모리 세션을 조회합니다
   */
  async getSession(sessionId: string): Promise<MCPMemorySession | null> {
    try {
      const filePath = path.join(this.dataDir, `${sessionId}.json`)
      const fileContent = await fs.readFile(filePath, 'utf8')
      const session = JSON.parse(fileContent)
      
      // Date 객체로 변환
      session.createdAt = new Date(session.createdAt)
      session.updatedAt = new Date(session.updatedAt)
      session.entries = session.entries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }))
      
      return session
    } catch (error) {
      // 파일이 없거나 읽기 오류 시 null 반환
      return null
    }
  }

  /**
   * 모든 메모리 세션을 나열합니다
   */
  async listSessions(): Promise<MCPMemorySession[]> {
    try {
      await this.ensureDataDir()
      const files = await fs.readdir(this.dataDir)
      const jsonFiles = files.filter(file => file.endsWith('.json'))
      
      const sessions: MCPMemorySession[] = []
      
      for (const file of jsonFiles) {
        const sessionId = file.replace('.json', '')
        const session = await this.getSession(sessionId)
        if (session) {
          sessions.push(session)
        }
      }
      
      // 최신 업데이트 순으로 정렬
      return sessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    } catch (error) {
      return []
    }
  }

  /**
   * 세션을 삭제합니다
   */
  async deleteSession(sessionId: string): Promise<void> {
    const filePath = path.join(this.dataDir, `${sessionId}.json`)
    await fs.unlink(filePath)
  }

  /**
   * 세션을 JSON 형태로 내보냅니다
   */
  async exportSession(sessionId: string): Promise<string> {
    const session = await this.getSession(sessionId)
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }
    
    return JSON.stringify(session, null, 2)
  }

  /**
   * JSON 데이터에서 세션을 가져옵니다
   */
  async importSession(jsonData: string): Promise<string> {
    const session = JSON.parse(jsonData)
    
    // 필수 필드 검증
    if (!session.id || !session.title || !session.entries) {
      throw new Error('Invalid session data')
    }
    
    await this.ensureDataDir()
    await this.saveSession(session)
    
    return session.id
  }

  /**
   * 세션의 대화 히스토리를 OpenAI 형식으로 변환합니다
   */
  async getOpenAIMessages(sessionId: string): Promise<Array<{role: string, content: string}>> {
    const session = await this.getSession(sessionId)
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }
    
    return session.entries.map(entry => ({
      role: entry.role,
      content: entry.content
    }))
  }

  /**
   * 세션에 컨텍스트 프로필을 적용합니다
   */
  async applyContextProfile(sessionId: string, contextProfile: string): Promise<void> {
    const session = await this.getSession(sessionId)
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }
    
    session.contextProfile = contextProfile
    session.updatedAt = new Date()
    
    await this.saveSession(session)
  }

  /**
   * 세션에 프롬프트 룰을 적용합니다
   */
  async applyRules(sessionId: string, rules: string[]): Promise<void> {
    const session = await this.getSession(sessionId)
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }
    
    session.rules = rules
    session.updatedAt = new Date()
    
    await this.saveSession(session)
  }

  /**
   * 데이터 디렉토리가 존재하는지 확인하고 생성합니다
   */
  private async ensureDataDir(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true })
    } catch (error) {
      // 디렉토리가 이미 존재하는 경우 무시
    }
  }

  /**
   * 세션을 파일에 저장합니다
   */
  private async saveSession(session: MCPMemorySession): Promise<void> {
    const filePath = path.join(this.dataDir, `${session.id}.json`)
    const jsonContent = JSON.stringify(session, null, 2)
    await fs.writeFile(filePath, jsonContent, 'utf8')
  }
}

// 서비스 인스턴스
export const mcpMemoryService = new MCPMemoryService()