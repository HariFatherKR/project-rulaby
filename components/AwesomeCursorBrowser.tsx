// Component for browsing and importing awesome cursor rules
import { useState, useEffect } from 'react'

interface AwesomeCursorRule {
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  language?: string
  framework?: string
  popularity?: number
  source: 'awesome-cursor-rules'
}

interface AwesomeCursorBrowserProps {
  onImport?: (rule: AwesomeCursorRule) => void
}

const techStackOptions = [
  { label: 'React', value: 'react' },
  { label: 'Vue.js', value: 'vue' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'Python', value: 'python' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'DevOps', value: 'devops' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Backend', value: 'backend' },
  { label: 'Frontend', value: 'frontend' }
]

export default function AwesomeCursorBrowser({ onImport }: AwesomeCursorBrowserProps) {
  const [rules, setRules] = useState<AwesomeCursorRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStack, setSelectedStack] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewType, setViewType] = useState<'trending' | 'category' | 'search'>('trending')
  const [importingRules, setImportingRules] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchRules()
  }, [viewType, selectedStack, searchQuery])

  const fetchRules = async () => {
    try {
      setLoading(true)
      
      let url = '/api/awesome-cursor-rules'
      const params = new URLSearchParams()
      
      if (viewType === 'trending') {
        params.append('type', 'trending')
        params.append('limit', '20')
      } else if (viewType === 'category' && selectedStack) {
        params.append('type', 'by-stack')
        params.append('stack', selectedStack)
      } else if (viewType === 'search' && searchQuery) {
        params.append('type', 'search')
        params.append('query', searchQuery)
      }
      
      if (params.toString()) {
        url += `?${params}`
      }
      
      const response = await fetch(url)
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

  const handleImportRule = async (rule: AwesomeCursorRule) => {
    const ruleId = rule.title.toLowerCase().replace(/\s+/g, '-')
    
    try {
      setImportingRules(prev => new Set(prev).add(ruleId))
      
      const response = await fetch('/api/awesome-cursor-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'import',
          ruleId
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to import rule')
      }
      
      const result = await response.json()
      
      if (onImport) {
        onImport(rule)
      }
      
      // Show success feedback
      alert(`Rule "${rule.title}" imported successfully!`)
      
    } catch (err) {
      console.error('Error importing rule:', err)
      alert('Failed to import rule. Please try again.')
    } finally {
      setImportingRules(prev => {
        const newSet = new Set(prev)
        newSet.delete(ruleId)
        return newSet
      })
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setViewType('search')
    }
  }

  const getPopularityColor = (popularity?: number) => {
    if (!popularity) return 'bg-gray-100 text-gray-800'
    if (popularity >= 90) return 'bg-green-100 text-green-800'
    if (popularity >= 80) return 'bg-yellow-100 text-yellow-800'
    return 'bg-blue-100 text-blue-800'
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🎯 Awesome Cursor Rules
        </h3>
        
        {/* Search and Filter Controls */}
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rules by technology or keyword..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </form>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewType('trending')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                viewType === 'trending' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔥 Trending
            </button>
            
            {techStackOptions.map((stack) => (
              <button
                key={stack.value}
                onClick={() => {
                  setSelectedStack(stack.value)
                  setViewType('category')
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  viewType === 'category' && selectedStack === stack.value
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {stack.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">Error: {error}</p>
            <button
              onClick={fetchRules}
              className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No rules found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule, index) => {
              const ruleId = rule.title.toLowerCase().replace(/\s+/g, '-')
              const isImporting = importingRules.has(ruleId)
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{rule.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {rule.category}
                        </span>
                        
                        {rule.language && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {rule.language}
                          </span>
                        )}
                        
                        {rule.framework && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {rule.framework}
                          </span>
                        )}
                        
                        {rule.popularity && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPopularityColor(rule.popularity)}`}>
                            {rule.popularity}% popular
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {rule.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-50 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleImportRule(rule)}
                      disabled={isImporting}
                      className={`ml-4 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        isImporting
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                      }`}
                    >
                      {isImporting ? 'Importing...' : 'Import'}
                    </button>
                  </div>
                  
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                      View rule content
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm font-mono text-gray-800 whitespace-pre-wrap overflow-x-auto">
                      {rule.content.substring(0, 500)}
                      {rule.content.length > 500 && '...'}
                    </div>
                  </details>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}