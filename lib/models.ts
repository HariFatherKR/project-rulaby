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

// Types for creating new documents (without id)
export type CreatePromptRule = Omit<PromptRule, 'id'>
export type CreateContextProfile = Omit<ContextProfile, 'id'>

// Collection names constants
export const COLLECTIONS = {
  PROMPT_RULES: 'prompt_rules',
  CONTEXT_PROFILES: 'context_profiles'
} as const