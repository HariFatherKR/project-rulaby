import React from 'react'
import Link from 'next/link'

interface HeaderProps {
  title?: string
}

export default function Header({ title = "Rulaby" }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
            🍓 {title}
          </Link>
          <p className="text-sm text-gray-600 mt-1">
            AI 기반 프롬프트 룰 공유 SaaS
          </p>
        </div>
        <nav className="flex space-x-6">
          <Link 
            href="/rules" 
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            룰 목록
          </Link>
          <Link 
            href="/contexts" 
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            컨텍스트 설정
          </Link>
        </nav>
      </div>
    </header>
  )
}