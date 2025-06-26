import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../../components/Header'
import AIReviewResult from '../../components/AIReviewResult'

interface PromptRule {
  id: string
  title: string
  content: string
  category: string
  createdBy: string
  createdAt: Date
}

export default function RuleDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [rule, setRule] = useState<PromptRule | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: ''
  })
  const [aiReview, setAiReview] = useState(null)
  const [isReviewing, setIsReviewing] = useState(false)
  const [testPrompt, setTestPrompt] = useState('')

  useEffect(() => {
    if (id && id !== 'new') {
      fetchRule(id as string)
    } else if (id === 'new') {
      setIsEditing(true)
      setLoading(false)
    }
  }, [id])

  const fetchRule = async (ruleId: string) => {
    try {
      const response = await fetch(`/api/prompt-rules/${ruleId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch rule')
      }
      const data = await response.json()
      setRule(data)
      setFormData({
        title: data.title,
        content: data.content,
        category: data.category
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const method = id === 'new' ? 'POST' : 'PUT'
      const url = id === 'new' ? '/api/prompt-rules' : `/api/prompt-rules/${id}`
      
      const body = id === 'new' 
        ? { ...formData, createdBy: 'current-user' } // TODO: Replace with actual user
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Failed to save rule')
      }

      if (id === 'new') {
        const result = await response.json()
        router.push(`/rules/${result.id}`)
      } else {
        await fetchRule(id as string)
        setIsEditing(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    }
  }

  const handleTestReview = async () => {
    if (!testPrompt.trim() || !rule) return

    setIsReviewing(true)
    setAiReview(null)

    try {
      const response = await fetch('/api/reviewRule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: testPrompt,
          ruleIds: [rule.id]
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to review prompt')
      }

      const result = await response.json()
      setAiReview(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI review failed')
    } finally {
      setIsReviewing(false)
    }
  }

  const handleDelete = async () => {
    if (!rule || !confirm('정말로 이 룰을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/prompt-rules/${rule.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete rule')
      }

      router.push('/rules')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">Error: {error}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <Link href="/rules" className="text-blue-600 hover:text-blue-800">
                  ← 목록으로
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900">
                  {id === 'new' ? '새 룰 작성' : '룰 상세'}
                </h1>
              </div>
              {!isEditing && rule && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    편집
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="룰 제목을 입력하세요"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="카테고리를 입력하세요"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    내용
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={10}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="룰 내용을 입력하세요"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      if (rule) {
                        setFormData({
                          title: rule.title,
                          content: rule.content,
                          category: rule.category
                        })
                      }
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : rule ? (
              <div>
                <div className="mb-4">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {rule.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {rule.title}
                </h2>
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {rule.content}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>작성자: {rule.createdBy}</p>
                  <p>작성일: {new Date(rule.createdAt).toLocaleDateString('ko-KR')}</p>
                </div>

                {/* AI 리뷰 테스트 섹션 */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    🤖 AI 리뷰 테스트
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    이 룰을 기준으로 프롬프트를 테스트해보세요.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        테스트할 프롬프트
                      </label>
                      <textarea
                        value={testPrompt}
                        onChange={(e) => setTestPrompt(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="AI가 검토할 프롬프트를 입력하세요..."
                      />
                    </div>
                    
                    <button
                      onClick={handleTestReview}
                      disabled={!testPrompt.trim() || isReviewing}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-2 px-4 rounded"
                    >
                      {isReviewing ? 'AI 리뷰 중...' : 'AI 리뷰 시작'}
                    </button>
                    
                    {(aiReview || isReviewing) && (
                      <AIReviewResult 
                        result={aiReview} 
                        isLoading={isReviewing} 
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}