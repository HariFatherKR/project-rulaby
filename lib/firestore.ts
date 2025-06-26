// Firestore service utilities for Rulaby
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'
import { 
  PromptRule, 
  ContextProfile, 
  CreatePromptRule, 
  CreateContextProfile, 
  COLLECTIONS 
} from './models'

// Prompt Rules Service
export class PromptRulesService {
  private collectionRef = collection(db, COLLECTIONS.PROMPT_RULES)

  async getAll(): Promise<PromptRule[]> {
    const snapshot = await getDocs(query(this.collectionRef, orderBy('createdAt', 'desc')))
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as PromptRule[]
  }

  async getById(id: string): Promise<PromptRule | null> {
    const docRef = doc(db, COLLECTIONS.PROMPT_RULES, id)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) return null
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt.toDate()
    } as PromptRule
  }

  async getByCategory(category: string): Promise<PromptRule[]> {
    const q = query(
      this.collectionRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as PromptRule[]
  }

  async create(rule: CreatePromptRule): Promise<string> {
    const docRef = await addDoc(this.collectionRef, {
      ...rule,
      createdAt: Timestamp.now()
    })
    return docRef.id
  }

  async update(id: string, updates: Partial<Omit<PromptRule, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PROMPT_RULES, id)
    await updateDoc(docRef, updates)
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PROMPT_RULES, id)
    await deleteDoc(docRef)
  }
}

// Context Profiles Service
export class ContextProfilesService {
  private collectionRef = collection(db, COLLECTIONS.CONTEXT_PROFILES)

  async getAll(): Promise<ContextProfile[]> {
    const snapshot = await getDocs(this.collectionRef)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ContextProfile[]
  }

  async getById(id: string): Promise<ContextProfile | null> {
    const docRef = doc(db, COLLECTIONS.CONTEXT_PROFILES, id)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) return null
    
    return {
      id: snapshot.id,
      ...snapshot.data()
    } as ContextProfile
  }

  async getByRole(role: string): Promise<ContextProfile[]> {
    const q = query(this.collectionRef, where('role', '==', role))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ContextProfile[]
  }

  async create(profile: CreateContextProfile): Promise<string> {
    const docRef = await addDoc(this.collectionRef, profile)
    return docRef.id
  }

  async update(id: string, updates: Partial<Omit<ContextProfile, 'id'>>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CONTEXT_PROFILES, id)
    await updateDoc(docRef, updates)
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CONTEXT_PROFILES, id)
    await deleteDoc(docRef)
  }
}

// Service instances
export const promptRulesService = new PromptRulesService()
export const contextProfilesService = new ContextProfilesService()