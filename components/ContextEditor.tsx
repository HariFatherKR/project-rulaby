import React, { useState } from 'react'

interface ContextProfile {
  id?: string
  role: string
  basePrompt: string
  maintainedBy?: string
}

interface ContextEditorProps {
  context?: ContextProfile
  onSave: (context: Omit<ContextProfile, 'id' | 'maintainedBy'>) => Promise<void>
  onCancel: () => void
  isEditing?: boolean
}

export default function ContextEditor({ 
  context, 
  onSave, 
  onCancel, 
  isEditing = false 
}: ContextEditorProps) {
  const [formData, setFormData] = useState({
    role: context?.role || '',
    basePrompt: context?.basePrompt || ''
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.role.trim() || !formData.basePrompt.trim()) return

    setIsSaving(true)
    try {
      await onSave(formData)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? '컨텍스트 편집' : '새 컨텍스트 작성'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            역할 *
          </label>
          <input
            type="text"
            required
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: Frontend Engineer, Backend Developer, AI Specialist"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            기본 프롬프트 *
          </label>
          <textarea
            required
            value={formData.basePrompt}
            onChange={(e) => setFormData({...formData, basePrompt: e.target.value})}
            rows={6}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이 역할에 대한 기본 컨텍스트 프롬프트를 입력하세요..."
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-2 px-4 rounded"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}