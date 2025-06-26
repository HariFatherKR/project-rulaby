import React from 'react'

interface HeaderProps {
  title?: string
}

export default function Header({ title = "Rulaby" }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <h1 className="text-2xl font-bold text-gray-900">
        🍓 {title}
      </h1>
      <p className="text-sm text-gray-600 mt-1">
        AI 기반 프롬프트 룰 공유 SaaS
      </p>
    </header>
  )
}