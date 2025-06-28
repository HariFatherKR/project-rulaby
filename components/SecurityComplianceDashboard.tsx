// Security compliance dashboard component
import { useState, useEffect } from 'react'

interface SecurityComplianceRule {
  id: string
  title: string
  description: string
  category: 'git' | 'firebase' | 'aws' | 'general'
  severity: 'low' | 'medium' | 'high' | 'critical'
  rule: string
  examples: string[]
  autoFix?: boolean
  enabled: boolean
}

const severityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
}

const categoryIcons = {
  git: '🔧',
  firebase: '🔥',
  aws: '☁️',
  general: '🛡️'
}

const categoryLabels = {
  git: 'Git Security',
  firebase: 'Firebase Security',
  aws: 'AWS Security',
  general: 'General Security'
}

export default function SecurityComplianceDashboard() {
  const [rules, setRules] = useState<SecurityComplianceRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedRule, setExpandedRule] = useState<string | null>(null)
  const [initializing, setInitializing] = useState(false)

  useEffect(() => {
    fetchSecurityRules()
  }, [selectedCategory])

  const fetchSecurityRules = async () => {
    try {
      setLoading(true)
      let url = '/api/security-rules'
      
      if (selectedCategory !== 'all') {
        url += `?category=${selectedCategory}`
      }
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch security rules')
      }
      
      const data = await response.json()
      setRules(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const initializeDefaultRules = async () => {
    try {
      setInitializing(true)
      const response = await fetch('/api/security-rules?initialize=true')
      
      if (!response.ok) {
        throw new Error('Failed to initialize security rules')
      }
      
      await fetchSecurityRules()
      alert('Default security rules initialized successfully!')
    } catch (err) {
      console.error('Error initializing rules:', err)
      alert('Failed to initialize security rules. Please try again.')
    } finally {
      setInitializing(false)
    }
  }

  const toggleRuleExpansion = (ruleId: string) => {
    setExpandedRule(expandedRule === ruleId ? null : ruleId)
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨'
      case 'high': return '⚠️'
      case 'medium': return '🔸'
      case 'low': return '🔹'
      default: return '🔹'
    }
  }

  const getRulesByCategory = () => {
    return rules.reduce((acc, rule) => {
      const category = rule.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(rule)
      return acc
    }, {} as Record<string, SecurityComplianceRule[]>)
  }

  const getComplianceStats = () => {
    const total = rules.length
    const enabled = rules.filter(rule => rule.enabled).length
    const bySeverity = rules.reduce((acc, rule) => {
      acc[rule.severity] = (acc[rule.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      total,
      enabled,
      compliance: total > 0 ? Math.round((enabled / total) * 100) : 0,
      bySeverity
    }
  }

  const stats = getComplianceStats()
  const rulesByCategory = getRulesByCategory()

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">🛡️ Security Compliance Dashboard</h2>
          {rules.length === 0 && !loading && (
            <button
              onClick={initializeDefaultRules}
              disabled={initializing}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                initializing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
            >
              {initializing ? 'Initializing...' : 'Initialize Default Rules'}
            </button>
          )}
        </div>
        
        {/* Compliance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-800">Total Rules</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.enabled}</div>
            <div className="text-sm text-green-800">Enabled Rules</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.compliance}%</div>
            <div className="text-sm text-yellow-800">Compliance Rate</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.bySeverity.critical || 0}</div>
            <div className="text-sm text-red-800">Critical Issues</div>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          
          {Object.keys(categoryLabels).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryIcons[category as keyof typeof categoryIcons]} {categoryLabels[category as keyof typeof categoryLabels]}
            </button>
          ))}
        </div>
      </div>

      {/* Security Rules */}
      <div className="bg-white rounded-lg shadow">
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
                onClick={fetchSecurityRules}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No security rules found</p>
              <p className="text-sm text-gray-400">Click "Initialize Default Rules" to get started with security best practices</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedCategory === 'all' ? (
                // Group by category when showing all
                Object.entries(rulesByCategory).map(([category, categoryRules]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                      {categoryIcons[category as keyof typeof categoryIcons]} {categoryLabels[category as keyof typeof categoryLabels]}
                    </h3>
                    {categoryRules.map((rule) => (
                      <SecurityRuleCard
                        key={rule.id}
                        rule={rule}
                        isExpanded={expandedRule === rule.id}
                        onToggleExpansion={toggleRuleExpansion}
                      />
                    ))}
                  </div>
                ))
              ) : (
                // Show filtered rules
                rules.map((rule) => (
                  <SecurityRuleCard
                    key={rule.id}
                    rule={rule}
                    isExpanded={expandedRule === rule.id}
                    onToggleExpansion={toggleRuleExpansion}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Security Rule Card Component
interface SecurityRuleCardProps {
  rule: SecurityComplianceRule
  isExpanded: boolean
  onToggleExpansion: (ruleId: string) => void
}

function SecurityRuleCard({ rule, isExpanded, onToggleExpansion }: SecurityRuleCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getSeverityIcon(rule.severity)}</span>
            <h4 className="font-semibold text-gray-900">{rule.title}</h4>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityColors[rule.severity]}`}>
              {rule.severity.toUpperCase()}
            </span>
            {rule.autoFix && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Auto-fix
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
          
          <button
            onClick={() => onToggleExpansion(rule.id)}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {isExpanded ? 'Hide details' : 'Show details'}
          </button>
        </div>
        
        <div className="ml-4 flex items-center space-x-2">
          <span className="text-xs text-gray-500">{categoryLabels[rule.category]}</span>
          <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-green-400' : 'bg-gray-300'}`}></div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Rule Details:</h5>
            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-800 whitespace-pre-wrap">
              {rule.rule}
            </div>
          </div>
          
          {rule.examples.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Examples:</h5>
              <ul className="space-y-1">
                {rule.examples.map((example, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'critical': return '🚨'
    case 'high': return '⚠️'
    case 'medium': return '🔸'
    case 'low': return '🔹'
    default: return '🔹'
  }
}