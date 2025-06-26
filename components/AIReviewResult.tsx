import React from 'react'

interface AIReviewResult {
  status: 'approved' | 'needs_revision' | 'rejected'
  feedback: string
  suggestions?: string[]
  score?: number
}

interface AIReviewResultProps {
  result: AIReviewResult | null
  isLoading?: boolean
}

export default function AIReviewResult({ result, isLoading }: AIReviewResultProps) {
  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">AI가 프롬프트를 검토 중입니다...</span>
        </div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          color: 'text-green-700',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200',
          icon: '✅',
          label: '승인됨'
        }
      case 'needs_revision':
        return {
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-200',
          icon: '⚠️',
          label: '수정 필요'
        }
      case 'rejected':
        return {
          color: 'text-red-700',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200',
          icon: '❌',
          label: '거절됨'
        }
      default:
        return {
          color: 'text-gray-700',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200',
          icon: '📝',
          label: '검토 중'
        }
    }
  }

  const statusConfig = getStatusConfig(result.status)

  return (
    <div className={`border rounded-lg p-6 ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl">{statusConfig.icon}</span>
        <div>
          <h3 className={`text-lg font-semibold ${statusConfig.color}`}>
            AI 리뷰 결과: {statusConfig.label}
          </h3>
          {result.score && (
            <p className="text-sm text-gray-600">
              점수: {result.score}/100
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">피드백:</h4>
          <p className={`text-sm ${statusConfig.color} whitespace-pre-wrap`}>
            {result.feedback}
          </p>
        </div>

        {result.suggestions && result.suggestions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">개선 제안:</h4>
            <ul className="space-y-1">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className={`text-sm ${statusConfig.color}`}>
                  • {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}