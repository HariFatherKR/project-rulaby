// Leaderboard component for displaying popular rules
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RuleLeaderboard {
  id: string
  ruleId: string
  title: string
  category: string
  usageCount: number
  popularity: number
  averageRating?: number
  lastUpdated: Date
  source: 'internal' | 'awesome-cursor-rules' | 'security-template'
}

interface LeaderboardProps {
  category?: string
  limit?: number
  showSource?: boolean
}

const getSourceBadgeColor = (source: string) => {
  switch (source) {
    case 'awesome-cursor-rules':
      return 'bg-purple-100 text-purple-800'
    case 'security-template':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-blue-100 text-blue-800'
  }
}

const getSourceLabel = (source: string) => {
  switch (source) {
    case 'awesome-cursor-rules':
      return 'Awesome Cursor'
    case 'security-template':
      return 'Security'
    default:
      return 'Internal'
  }
}

export default function Leaderboard({ category, limit = 10, showSource = true }: LeaderboardProps) {
  const [rules, setRules] = useState<RuleLeaderboard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [category, limit])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        type: 'leaderboard',
        limit: limit.toString()
      })
      
      if (category) {
        params.append('category', category)
      }
      
      const response = await fetch(`/api/analytics?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard')
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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded mb-2"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600 text-center">
          <p>Error loading leaderboard: {error}</p>
          <button
            onClick={fetchLeaderboard}
            className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          🏆 Rule Leaderboard
          {category && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              - {category}
            </span>
          )}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Most popular rules based on usage and community feedback
        </p>
      </div>
      
      <div className="p-6">
        {rules.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No rules found for leaderboard</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'}
                    `}>
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <Link href={`/rules/${rule.ruleId}`}>
                      <a className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate">
                        {rule.title}
                      </a>
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {rule.category}
                      </span>
                      {showSource && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceBadgeColor(rule.source)}`}>
                          {getSourceLabel(rule.source)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{rule.usageCount}</div>
                    <div className="text-xs">uses</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{Math.round(rule.popularity)}</div>
                    <div className="text-xs">score</div>
                  </div>
                  {rule.averageRating && (
                    <div className="text-center">
                      <div className="font-medium text-gray-900">⭐ {rule.averageRating.toFixed(1)}</div>
                      <div className="text-xs">rating</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}