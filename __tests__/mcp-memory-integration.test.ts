// Integration tests for MCP Memory functionality
import { MCPMemoryService } from '../lib/mcp-memory'
import { CreateMCPMemorySession, CreateMCPMemoryEntry } from '../lib/models'
import fs from 'fs/promises'
import path from 'path'

// 통합 테스트에서는 실제 fs 사용
jest.unmock('fs/promises')

describe('MCP Memory Integration Tests', () => {
  let service: MCPMemoryService
  const testDataDir = '/tmp/mcp-integration-test'

  beforeAll(async () => {
    service = new MCPMemoryService(testDataDir)
    // 테스트 디렉토리 생성
    try {
      await fs.mkdir(testDataDir, { recursive: true })
    } catch (error) {
      // 이미 존재하는 경우 무시
    }
  })

  afterAll(async () => {
    // 테스트 후 정리
    try {
      await fs.rm(testDataDir, { recursive: true })
    } catch (error) {
      // 디렉토리가 없는 경우 무시
    }
  })

  beforeEach(async () => {
    // 각 테스트 전에 디렉토리 정리
    try {
      const files = await fs.readdir(testDataDir)
      await Promise.all(
        files.map(file => fs.unlink(path.join(testDataDir, file)))
      )
    } catch (error) {
      // 파일이 없는 경우 무시
    }
  })

  it('완전한 MCP 메모리 세션 워크플로우를 테스트해야 합니다', async () => {
    // 1. 새 세션 생성
    const sessionData: CreateMCPMemorySession = {
      title: 'AI 개발 상담 세션',
      contextProfile: 'Frontend Engineer',
      rules: ['use-given-when-then', 'include-context']
    }

    const sessionId = await service.createSession(sessionData)
    expect(sessionId).toMatch(/^session-\d{13}-[a-z0-9]{9}$/)

    // 2. 세션 조회
    let session = await service.getSession(sessionId)
    expect(session).toBeDefined()
    expect(session?.title).toBe('AI 개발 상담 세션')
    expect(session?.contextProfile).toBe('Frontend Engineer')
    expect(session?.rules).toEqual(['use-given-when-then', 'include-context'])
    expect(session?.entries).toHaveLength(0)

    // 3. 사용자 메시지 추가
    const userEntry: CreateMCPMemoryEntry = {
      role: 'user',
      content: 'React 컴포넌트에서 상태 관리 방법을 알려주세요',
      contextId: 'react-state-management'
    }

    const userEntryId = await service.addMemoryEntry(sessionId, userEntry)
    expect(userEntryId).toMatch(/^entry-\d{13}-[a-z0-9]{9}$/)

    // 4. AI 응답 추가
    const assistantEntry: CreateMCPMemoryEntry = {
      role: 'assistant',
      content: 'React에서 상태 관리는 useState, useReducer, Context API 등을 사용할 수 있습니다...',
      metadata: { model: 'gpt-4', tokens: 150 }
    }

    const assistantEntryId = await service.addMemoryEntry(sessionId, assistantEntry)
    expect(assistantEntryId).toMatch(/^entry-\d{13}-[a-z0-9]{9}$/)

    // 5. 업데이트된 세션 확인
    session = await service.getSession(sessionId)
    expect(session?.entries).toHaveLength(2)
    expect(session?.entries[0].role).toBe('user')
    expect(session?.entries[1].role).toBe('assistant')
    expect(session?.entries[0].content).toContain('React 컴포넌트')
    expect(session?.entries[1].metadata?.model).toBe('gpt-4')

    // 6. OpenAI 메시지 형식으로 변환
    const openAIMessages = await service.getOpenAIMessages(sessionId)
    expect(openAIMessages).toHaveLength(2)
    expect(openAIMessages[0]).toEqual({
      role: 'user',
      content: 'React 컴포넌트에서 상태 관리 방법을 알려주세요'
    })
    expect(openAIMessages[1]).toEqual({
      role: 'assistant',
      content: 'React에서 상태 관리는 useState, useReducer, Context API 등을 사용할 수 있습니다...'
    })

    // 7. 세션 내보내기/가져오기 테스트
    const exportData = await service.exportSession(sessionId)
    expect(exportData).toContain(sessionId)
    expect(exportData).toContain('AI 개발 상담 세션')

    // 새 세션 ID로 가져오기
    const importData = JSON.parse(exportData)
    importData.id = 'imported-session-123'
    
    const importedSessionId = await service.importSession(JSON.stringify(importData))
    expect(importedSessionId).toBe('imported-session-123')

    const importedSession = await service.getSession(importedSessionId)
    expect(importedSession?.title).toBe('AI 개발 상담 세션')
    expect(importedSession?.entries).toHaveLength(2)

    // 8. 세션 목록 확인
    const sessions = await service.listSessions()
    expect(sessions).toHaveLength(2)
    expect(sessions.map(s => s.id).sort()).toEqual([sessionId, importedSessionId].sort())

    // 9. 컨텍스트 프로필 적용
    await service.applyContextProfile(sessionId, 'Backend Engineer')
    session = await service.getSession(sessionId)
    expect(session?.contextProfile).toBe('Backend Engineer')

    // 10. 룰 적용
    await service.applyRules(sessionId, ['new-rule-1', 'new-rule-2'])
    session = await service.getSession(sessionId)
    expect(session?.rules).toEqual(['new-rule-1', 'new-rule-2'])

    // 11. 세션 삭제
    await service.deleteSession(sessionId)
    const deletedSession = await service.getSession(sessionId)
    expect(deletedSession).toBeNull()

    // 12. 파일 시스템 확인
    const files = await fs.readdir(testDataDir)
    expect(files).not.toContain(`${sessionId}.json`)
    expect(files).toContain(`${importedSessionId}.json`)
  })

  it('실제 파일 저장 및 로드를 테스트해야 합니다', async () => {
    // 실제 파일 시스템에 저장되는지 확인
    const sessionData: CreateMCPMemorySession = {
      title: '파일 저장 테스트 세션'
    }

    const sessionId = await service.createSession(sessionData)
    
    // 파일이 실제로 생성되었는지 확인
    const filePath = path.join(testDataDir, `${sessionId}.json`)
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false)
    expect(fileExists).toBe(true)

    // 파일 내용 직접 읽기
    const fileContent = await fs.readFile(filePath, 'utf8')
    const savedSession = JSON.parse(fileContent)
    expect(savedSession.id).toBe(sessionId)
    expect(savedSession.title).toBe('파일 저장 테스트 세션')

    // 메시지 추가 후 파일 업데이트 확인
    await service.addMemoryEntry(sessionId, {
      role: 'user',
      content: '테스트 메시지'
    })

    const updatedFileContent = await fs.readFile(filePath, 'utf8')
    const updatedSession = JSON.parse(updatedFileContent)
    expect(updatedSession.entries).toHaveLength(1)
    expect(updatedSession.entries[0].content).toBe('테스트 메시지')
  })

  it('동시성 처리를 테스트해야 합니다', async () => {
    // 여러 세션을 동시에 생성
    const sessionPromises = Array.from({ length: 5 }, (_, i) =>
      service.createSession({
        title: `동시 세션 ${i + 1}`
      })
    )

    const sessionIds = await Promise.all(sessionPromises)
    expect(sessionIds).toHaveLength(5)
    expect(new Set(sessionIds).size).toBe(5) // 모든 ID가 고유한지 확인

    // 모든 세션이 올바르게 저장되었는지 확인
    const sessions = await service.listSessions()
    expect(sessions).toHaveLength(5)

    // 각 세션에 동시에 메시지 추가
    const messagePromises = sessionIds.map(sessionId =>
      service.addMemoryEntry(sessionId, {
        role: 'user',
        content: `${sessionId}에 대한 테스트 메시지`
      })
    )

    await Promise.all(messagePromises)

    // 모든 세션에 메시지가 추가되었는지 확인
    for (const sessionId of sessionIds) {
      const session = await service.getSession(sessionId)
      expect(session?.entries).toHaveLength(1)
      expect(session?.entries[0].content).toContain(sessionId)
    }
  })
})