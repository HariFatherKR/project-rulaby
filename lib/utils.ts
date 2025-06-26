// Database connection utilities
export interface RulabyConfig {
  apiVersion: string
  description: string
}

export const config: RulabyConfig = {
  apiVersion: '0.1.0',
  description: 'AI 기반 프롬프트 룰 공유 SaaS - 팀 단위 프롬프트 스타일 가이드 제공'
}

// Utility functions for the Rulaby project
export function formatDescription(description: string): string {
  return description.trim()
}

export function validatePromptRule(rule: string): boolean {
  return rule.length > 0 && rule.length <= 1000
}