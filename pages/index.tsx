import React, { useEffect, useState } from 'react'
import Head from 'next/head'

interface HealthStatus {
  status: 'checking' | 'healthy' | 'error'
  message?: string
  timestamp?: string
  endpoints?: {
    shares: boolean
    memory: boolean
  }
}

export default function HomePage() {
  const [health, setHealth] = useState<HealthStatus>({ status: 'checking' })

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const checkHealth = async () => {
    try {
      const response = await fetch('/api')
      const data = await response.json()
      
      if (response.ok) {
        setHealth({
          status: 'healthy',
          message: data.message,
          timestamp: new Date().toISOString(),
          endpoints: data.endpoints
        })
      } else {
        setHealth({
          status: 'error',
          message: 'API is not responding correctly',
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      setHealth({
        status: 'error',
        message: 'Failed to connect to API',
        timestamp: new Date().toISOString()
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Head>
        <title>Rulaby API - Health Check</title>
        <meta name="description" content="Rulaby Rule Sharing API Status" />
      </Head>
      
      <div className="max-w-2xl w-full mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            🔄 Rulaby API
          </h1>
          
          <div className="text-center mb-8">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-semibold
              ${health.status === 'healthy' ? 'bg-green-500' : 
                health.status === 'error' ? 'bg-red-500' : 'bg-gray-400'}`}>
              {health.status === 'healthy' ? '✅ Healthy' :
               health.status === 'error' ? '❌ Error' : '⏳ Checking...'}
            </div>
          </div>

          {health.message && (
            <div className="mb-6 text-center text-gray-600">
              {health.message}
            </div>
          )}

          {health.endpoints && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">API Endpoints:</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Share Rules API</span>
                  <span className={health.endpoints.shares ? 'text-green-600' : 'text-red-600'}>
                    {health.endpoints.shares ? '✅ Active' : '❌ Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Memory API</span>
                  <span className={health.endpoints.memory ? 'text-green-600' : 'text-red-600'}>
                    {health.endpoints.memory ? '✅ Active' : '❌ Inactive'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {health.timestamp && (
            <div className="text-sm text-gray-500 text-center">
              Last checked: {new Date(health.timestamp).toLocaleString()}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">
                For MCP integration, use the npm package:
              </p>
              <code className="bg-gray-100 px-2 py-1 rounded">
                npm install -g @hyto/rulaby-mcp-server
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}