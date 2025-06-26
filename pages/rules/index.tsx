import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import RuleCard from '../../components/RuleCard'

interface PromptRule {
  id: string
  title: string
  content: string
  category: string
  createdBy: string
  createdAt: Date
}

export default function RulesPage() {
  const [rules, setRules] = useState<PromptRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/prompt-rules')
      if (!response.ok) {
        throw new Error('Failed to fetch rules')
      }
      const data = await response.json()
      setRules(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">Error: {error}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-extrabold text-gray-900">
                프롬프트 룰 목록
              </h1>
              <Link 
                href="/rules/new"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                새 룰 추가
              </Link>
            </div>
            
            {rules.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">등록된 룰이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rules.map((rule) => (
                  <RuleCard key={rule.id} rule={rule} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}