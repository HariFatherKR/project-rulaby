// Firestore data models for Rulaby

// Prompt Rules Collection Model
export interface PromptRule {
  id: string
  title: string
  content: string
  category: string
  createdBy: string
  createdAt: Date
  usageCount?: number
  lastUsed?: Date
  popularity?: number
  tags?: string[]
  source?: 'internal' | 'awesome-cursor-rules' | 'security-template'
  securityLevel?: 'basic' | 'recommended' | 'strict'
}

// Context Profiles Collection Model  
export interface ContextProfile {
  id: string
  role: string
  basePrompt: string
  maintainedBy: string
}

// MCP Memory Models for file-based LLM memory storage
export interface MCPMemoryEntry {
  id: string
  timestamp: Date
  role: 'user' | 'assistant' | 'system'
  content: string
  contextId?: string
  metadata?: Record<string, any>
}

export interface MCPMemorySession {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  entries: MCPMemoryEntry[]
  contextProfile?: string
  rules?: string[]
}

export interface MCPMemoryStorage {
  sessionId: string
  filePath: string
  session: MCPMemorySession
}

// Rule Usage Analytics Models
export interface RuleUsageAnalytics {
  id: string
  ruleId: string
  userId: string
  sessionId?: string
  timestamp: Date
  context?: string
  success?: boolean
  tokensUsed?: number
}

export interface RuleLeaderboard {
  id: string
  ruleId: string
  title: string
  category: string
  usageCount: number
  popularity: number
  averageRating?: number
  lastUpdated: Date
  source: 'internal' | 'awesome-cursor-rules' | 'security-template'
}

export interface SecurityComplianceRule {
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

export interface TokenOptimization {
  sessionId: string
  totalTokens: number
  contextTokens: number
  promptTokens: number
  responseTokens: number
  optimizationSuggestions: string[]
  efficiency: number
  timestamp: Date
}

// Types for creating new documents (without id and auto-generated fields)
export type CreatePromptRule = Omit<PromptRule, 'id' | 'createdAt' | 'usageCount' | 'lastUsed' | 'popularity'>
export type CreateContextProfile = Omit<ContextProfile, 'id'>
export type CreateMCPMemoryEntry = Omit<MCPMemoryEntry, 'id' | 'timestamp'>
export type CreateMCPMemorySession = Omit<MCPMemorySession, 'id' | 'createdAt' | 'updatedAt' | 'entries'>
export type CreateRuleUsageAnalytics = Omit<RuleUsageAnalytics, 'id' | 'timestamp'>
export type CreateSecurityComplianceRule = Omit<SecurityComplianceRule, 'id'>

// Collection names constants
export const COLLECTIONS = {
  PROMPT_RULES: 'prompt_rules',
  CONTEXT_PROFILES: 'context_profiles',
  MCP_MEMORY: 'mcp_memory',
  RULE_USAGE: 'rule_usage_analytics',
  RULE_LEADERBOARD: 'rule_leaderboard',
  SECURITY_RULES: 'security_compliance_rules',
  TOKEN_OPTIMIZATION: 'token_optimization'
} as const