// Firestore data models for Rulaby

// Prompt Rules Collection Model
export interface PromptRule {
  id: string
  title: string
  content: string
  category: string
  createdBy: string
  createdAt: Date
}

// Context Profiles Collection Model  
export interface ContextProfile {
  id: string
  role: string
  basePrompt: string
  maintainedBy: string
}

// Types for creating new documents (without id and auto-generated fields)
export type CreatePromptRule = Omit<PromptRule, 'id' | 'createdAt'>
export type CreateContextProfile = Omit<ContextProfile, 'id'>

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

// Types for creating new MCP memory documents
export type CreateMCPMemoryEntry = Omit<MCPMemoryEntry, 'id' | 'timestamp'>
export type CreateMCPMemorySession = Omit<MCPMemorySession, 'id' | 'createdAt' | 'updatedAt' | 'entries'>

// Collection names constants
export const COLLECTIONS = {
  PROMPT_RULES: 'prompt_rules',
  CONTEXT_PROFILES: 'context_profiles',
  MCP_MEMORY: 'mcp_memory'
} as const