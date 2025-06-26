// MCP Memory Storage Service Tests
import { MCPMemoryService } from '../lib/mcp-memory'
import { CreateMCPMemorySession, CreateMCPMemoryEntry } from '../lib/models'
import fs from 'fs/promises'
import path from 'path'

// Mock fs module
jest.mock('fs/promises')
const mockFs = fs as jest.Mocked<typeof fs>

describe('MCPMemoryService', () => {
  let service: MCPMemoryService
  const testDataDir = '/tmp/test-mcp-memory'

  beforeEach(() => {
    service = new MCPMemoryService(testDataDir)
    jest.clearAllMocks()
  })

  describe('createSession', () => {
    it('새로운 MCP 메모리 세션을 생성해야 합니다', async () => {
      const sessionData: CreateMCPMemorySession = {
        title: 'Test Session',
        contextProfile: 'Frontend Engineer',
        rules: ['rule1', 'rule2']
      }

      mockFs.mkdir.mockResolvedValue(undefined)
      mockFs.writeFile.mockResolvedValue(undefined)

      const sessionId = await service.createSession(sessionData)

      expect(sessionId).toMatch(/^session-\d{13}-[a-z0-9]{9}$/) // timestamp-based ID with random suffix
      expect(mockFs.mkdir).toHaveBeenCalledWith(testDataDir, { recursive: true })
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining(`${sessionId}.json`),
        expect.stringContaining(sessionData.title),
        'utf8'
      )
    })

    it('세션 생성 중 파일 쓰기 오류를 처리해야 합니다', async () => {
      const sessionData: CreateMCPMemorySession = {
        title: 'Test Session'
      }

      mockFs.mkdir.mockResolvedValue(undefined)
      mockFs.writeFile.mockRejectedValue(new Error('Write failed'))

      await expect(service.createSession(sessionData)).rejects.toThrow('Write failed')
    })
  })

  describe('addMemoryEntry', () => {
    it('세션에 메모리 엔트리를 추가해야 합니다', async () => {
      const sessionId = 'test-session-123'
      const entry: CreateMCPMemoryEntry = {
        role: 'user',
        content: 'Hello, how are you?',
        contextId: 'ctx-1'
      }

      const mockSession = {
        id: sessionId,
        title: 'Test Session',
        createdAt: new Date(),
        updatedAt: new Date(),
        entries: []
      }

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockSession))
      mockFs.writeFile.mockResolvedValue(undefined)

      const entryId = await service.addMemoryEntry(sessionId, entry)

      expect(entryId).toMatch(/^entry-\d{13}-[a-z0-9]{9}$/)
      expect(mockFs.readFile).toHaveBeenCalledWith(
        path.join(testDataDir, `${sessionId}.json`),
        'utf8'
      )
      expect(mockFs.writeFile).toHaveBeenCalled()
    })

    it('존재하지 않는 세션에 엔트리 추가 시 오류를 발생해야 합니다', async () => {
      const sessionId = 'non-existent-session'
      const entry: CreateMCPMemoryEntry = {
        role: 'user',
        content: 'Hello'
      }

      mockFs.readFile.mockRejectedValue(new Error('File not found'))

      await expect(service.addMemoryEntry(sessionId, entry)).rejects.toThrow('Session not found')
    })
  })

  describe('getSession', () => {
    it('세션 ID로 메모리 세션을 조회해야 합니다', async () => {
      const sessionId = 'test-session-123'
      const mockSession = {
        id: sessionId,
        title: 'Test Session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        entries: []
      }

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockSession))

      const session = await service.getSession(sessionId)

      expect(session).toBeDefined()
      expect(session?.id).toBe(sessionId)
      expect(session?.title).toBe('Test Session')
      expect(mockFs.readFile).toHaveBeenCalledWith(
        path.join(testDataDir, `${sessionId}.json`),
        'utf8'
      )
    })

    it('존재하지 않는 세션 조회 시 null을 반환해야 합니다', async () => {
      const sessionId = 'non-existent-session'

      mockFs.readFile.mockRejectedValue(new Error('File not found'))

      const session = await service.getSession(sessionId)

      expect(session).toBeNull()
    })
  })

  describe('listSessions', () => {
    it('모든 메모리 세션을 나열해야 합니다', async () => {
      const mockFiles = ['session-1.json', 'session-2.json', 'not-session.txt']
      const mockSession1 = {
        id: 'session-1',
        title: 'Session 1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        entries: []
      }
      const mockSession2 = {
        id: 'session-2', 
        title: 'Session 2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        entries: []
      }

      mockFs.readdir.mockResolvedValue(mockFiles as any)
      mockFs.readFile
        .mockResolvedValueOnce(JSON.stringify(mockSession1))
        .mockResolvedValueOnce(JSON.stringify(mockSession2))

      const sessions = await service.listSessions()

      expect(sessions).toHaveLength(2)
      expect(sessions[0].id).toBe('session-1')
      expect(sessions[1].id).toBe('session-2')
      expect(mockFs.readdir).toHaveBeenCalledWith(testDataDir)
    })

    it('빈 디렉토리에서는 빈 배열을 반환해야 합니다', async () => {
      mockFs.readdir.mockResolvedValue([])

      const sessions = await service.listSessions()

      expect(sessions).toEqual([])
    })
  })

  describe('deleteSession', () => {
    it('세션 파일을 삭제해야 합니다', async () => {
      const sessionId = 'test-session-123'

      mockFs.unlink.mockResolvedValue(undefined)

      await service.deleteSession(sessionId)

      expect(mockFs.unlink).toHaveBeenCalledWith(
        path.join(testDataDir, `${sessionId}.json`)
      )
    })

    it('존재하지 않는 세션 삭제 시 오류를 발생해야 합니다', async () => {
      const sessionId = 'non-existent-session'

      mockFs.unlink.mockRejectedValue(new Error('File not found'))

      await expect(service.deleteSession(sessionId)).rejects.toThrow('File not found')
    })
  })

  describe('exportSession', () => {
    it('세션을 JSON 형태로 내보내야 합니다', async () => {
      const sessionId = 'test-session-123'
      const mockSession = {
        id: sessionId,
        title: 'Test Session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        entries: [
          {
            id: 'entry-1',
            timestamp: new Date().toISOString(),
            role: 'user',
            content: 'Hello'
          }
        ]
      }

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockSession))

      const exportData = await service.exportSession(sessionId)

      expect(exportData).toContain(sessionId)
      expect(exportData).toContain('Test Session')
      expect(exportData).toContain('Hello')
    })
  })

  describe('importSession', () => {
    it('JSON 데이터에서 세션을 가져와야 합니다', async () => {
      const sessionData = {
        id: 'imported-session',
        title: 'Imported Session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        entries: []
      }

      mockFs.mkdir.mockResolvedValue(undefined)
      mockFs.writeFile.mockResolvedValue(undefined)

      const sessionId = await service.importSession(JSON.stringify(sessionData))

      expect(sessionId).toBe('imported-session')
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        path.join(testDataDir, 'imported-session.json'),
        expect.any(String),
        'utf8'
      )
    })

    it('잘못된 JSON 데이터 가져오기 시 오류를 발생해야 합니다', async () => {
      const invalidJson = 'invalid json data'

      await expect(service.importSession(invalidJson)).rejects.toThrow()
    })
  })
})