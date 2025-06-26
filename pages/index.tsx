import React from 'react'
import Header from '../components/Header'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="px-6 py-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Welcome to Rulaby
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              팀 단위로 사용하는 프롬프트 룰과 역할 기반 컨텍스트를 공유하고 검토하는 협업 SaaS 도구
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-semibold mb-2">Prompt Rulebook</h3>
                <p className="text-gray-600">팀이 승인한 프롬프트 규칙의 중앙화된 저장소</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-lg font-semibold mb-2">Context Templates</h3>
                <p className="text-gray-600">역할별 페르소나/컨텍스트 할당 (예: Frontend, Backend, AI)</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered PR Bot</h3>
                <p className="text-gray-600">프롬프트 준수를 기반으로 한 PR 승인 또는 플래그</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}