import React from 'react'
import Link from 'next/link'

interface PromptRule {
  id: string
  title: string
  content: string
  category: string
  createdBy: string
  createdAt: Date
}

interface RuleCardProps {
  rule: PromptRule
}

export default function RuleCard({ rule }: RuleCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {rule.title}
        </h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {rule.category}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {rule.content}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          작성자: {rule.createdBy}
        </span>
        <Link 
          href={`/rules/${rule.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          상세보기 →
        </Link>
      </div>
    </div>
  )
}