// MCP Memory Management Page
import { useState, useEffect } from 'react'
import { MCPMemorySession, CreateMCPMemorySession, CreateMCPMemoryEntry } from '../lib/models'

export default function MCPMemoryPage() {
  const [sessions, setSessions] = useState<MCPMemorySession[]>([])
  const [selectedSession, setSelectedSession] = useState<MCPMemorySession | null>(null)
  const [newSessionTitle, setNewSessionTitle] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Load sessions on component mount
  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/mcp-memory')
      const data = await response.json()
      setSessions(data)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  const createSession = async () => {
    if (!newSessionTitle.trim()) return

    setLoading(true)
    try {
      const sessionData: CreateMCPMemorySession = {
        title: newSessionTitle
      }
      
      const response = await fetch('/api/mcp-memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      })
      
      if (response.ok) {
        setNewSessionTitle('')
        await loadSessions()
      }
    } catch (error) {
      console.error('Failed to create session:', error)
    } finally {
      setLoading(false)
    }
  }

  const addMessage = async (role: 'user' | 'assistant') => {
    if (!selectedSession || !newMessage.trim()) return

    setLoading(true)
    try {
      const entryData: CreateMCPMemoryEntry = {
        role,
        content: newMessage
      }
      
      const response = await fetch(`/api/mcp-memory/${selectedSession.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entryData)
      })
      
      if (response.ok) {
        const result = await response.json()
        setSelectedSession(result.session)
        setNewMessage('')
        await loadSessions()
      }
    } catch (error) {
      console.error('Failed to add message:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSession = async (sessionId: string) => {
    if (!confirm('정말로 이 세션을 삭제하시겠습니까?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/mcp-memory/${sessionId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null)
        }
        await loadSessions()
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/mcp-memory/${sessionId}/export`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${sessionId}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to export session:', error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🧠 MCP 메모리 관리</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">메모리 세션</h2>
          
          {/* Create new session */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="새 세션 제목"
              value={newSessionTitle}
              onChange={(e) => setNewSessionTitle(e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
              disabled={loading}
            />
            <button
              onClick={createSession}
              disabled={loading || !newSessionTitle.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              생성
            </button>
          </div>

          {/* Sessions list */}
          <div className="space-y-2">
            {sessions.map((session) => (
              <div 
                key={session.id}
                className={`p-3 border rounded cursor-pointer ${
                  selectedSession?.id === session.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedSession(session)}
              >
                <div className="font-medium">{session.title}</div>
                <div className="text-sm text-gray-500">
                  {session.entries.length}개 메시지
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      exportSession(session.id)
                    }}
                    className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded"
                  >
                    내보내기
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSession(session.id)
                    }}
                    className="text-sm px-2 py-1 bg-red-100 text-red-700 rounded"
                    disabled={loading}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Detail */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">대화 내용</h2>
          
          {selectedSession ? (
            <>
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <h3 className="font-medium">{selectedSession.title}</h3>
                <p className="text-sm text-gray-600">
                  생성: {new Date(selectedSession.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Messages */}
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {selectedSession.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-3 rounded ${
                      entry.role === 'user' 
                        ? 'bg-blue-100 ml-8' 
                        : entry.role === 'assistant'
                        ? 'bg-gray-100 mr-8'
                        : 'bg-yellow-100'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      {entry.role === 'user' ? '사용자' : entry.role === 'assistant' ? 'AI' : '시스템'}
                    </div>
                    <div>{entry.content}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add new message */}
              <div className="space-y-2">
                <textarea
                  placeholder="새 메시지 입력..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                  disabled={loading}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => addMessage('user')}
                    disabled={loading || !newMessage.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    사용자 메시지 추가
                  </button>
                  <button
                    onClick={() => addMessage('assistant')}
                    disabled={loading || !newMessage.trim()}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    AI 응답 추가
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">세션을 선택하세요</p>
          )}
        </div>
      </div>
    </div>
  )
}