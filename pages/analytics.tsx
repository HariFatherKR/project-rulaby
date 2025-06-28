// Analytics dashboard page
import { useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Leaderboard from '../components/Leaderboard'
import AwesomeCursorBrowser from '../components/AwesomeCursorBrowser'
import SecurityComplianceDashboard from '../components/SecurityComplianceDashboard'

type TabType = 'leaderboard' | 'awesome-cursor' | 'security' | 'analytics'

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('leaderboard')

  const tabs = [
    { id: 'leaderboard', label: '🏆 Rule Leaderboard', description: 'Most popular rules by usage' },
    { id: 'awesome-cursor', label: '🎯 Awesome Cursor Rules', description: 'Import community rules' },
    { id: 'security', label: '🛡️ Security Compliance', description: 'Security best practices' },
    { id: 'analytics', label: '📊 Usage Analytics', description: 'Team usage insights' }
  ]

  return (
    <>
      <Head>
        <title>Analytics Dashboard - Rulaby</title>
        <meta name="description" content="Rule analytics, leaderboards, and community integration" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Analytics & Insights
            </h1>
            <p className="text-lg text-gray-600">
              Track rule usage, discover popular community rules, and ensure security compliance
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Tab Description */}
            <div className="px-6 py-4 bg-gray-50">
              <p className="text-sm text-gray-600">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'leaderboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Leaderboard />
                <Leaderboard category="frontend" limit={5} />
              </div>
            )}

            {activeTab === 'awesome-cursor' && (
              <AwesomeCursorBrowser 
                onImport={(rule) => {
                  console.log('Rule imported:', rule.title)
                }}
              />
            )}

            {activeTab === 'security' && (
              <SecurityComplianceDashboard />
            )}

            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Usage Overview */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Team Usage Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-800 font-medium">Total Rule Uses</span>
                      <span className="text-blue-900 font-bold text-xl">1,247</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-green-800 font-medium">Active Rules</span>
                      <span className="text-green-900 font-bold text-xl">23</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-800 font-medium">Team Members</span>
                      <span className="text-purple-900 font-bold text-xl">8</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-yellow-800 font-medium">Avg. Tokens/Session</span>
                      <span className="text-yellow-900 font-bold text-xl">2,150</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🕐 Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { user: 'Alice', rule: 'React TypeScript Best Practices', time: '2 minutes ago' },
                      { user: 'Bob', rule: 'AWS Security Guidelines', time: '15 minutes ago' },
                      { user: 'Charlie', rule: 'Node.js API Development', time: '1 hour ago' },
                      { user: 'Diana', rule: 'Git Security Rules', time: '2 hours ago' },
                      { user: 'Eve', rule: 'Vue.js Composition API', time: '3 hours ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {activity.user.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.user} used "{activity.rule}"
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Usage Distribution */}
                <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Category Usage Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { category: 'Frontend', count: 456, percentage: 37, color: 'bg-blue-500' },
                      { category: 'Backend', count: 321, percentage: 26, color: 'bg-green-500' },
                      { category: 'Security', count: 289, percentage: 23, color: 'bg-red-500' },
                      { category: 'DevOps', count: 181, percentage: 14, color: 'bg-purple-500' }
                    ].map((category) => (
                      <div key={category.category} className="text-center">
                        <div className="mb-2">
                          <div className={`w-full h-2 bg-gray-200 rounded-full mb-1`}>
                            <div 
                              className={`h-2 ${category.color} rounded-full`}
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{category.category}</div>
                        <div className="text-xs text-gray-500">{category.count} uses ({category.percentage}%)</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Token Optimization Insights */}
                <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Token Optimization Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">87%</div>
                      <div className="text-sm text-green-800">Token Efficiency</div>
                      <div className="text-xs text-green-600 mt-1">+5% this week</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">1,850</div>
                      <div className="text-sm text-blue-800">Avg. Context Size</div>
                      <div className="text-xs text-blue-600 mt-1">-200 tokens saved</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">94%</div>
                      <div className="text-sm text-purple-800">Rule Relevance</div>
                      <div className="text-xs text-purple-600 mt-1">High context match</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">💡 Optimization Suggestions</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Consider consolidating similar rules to reduce context overhead</li>
                      <li>• Use more specific rules for React components to improve relevance</li>
                      <li>• Enable auto-pruning of unused context in long sessions</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}