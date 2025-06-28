// Analytics service for rule usage tracking and leaderboards
import { 
  RuleUsageAnalytics, 
  RuleLeaderboard, 
  CreateRuleUsageAnalytics, 
  COLLECTIONS,
  PromptRule 
} from './models'
import { db } from './firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'

export class AnalyticsService {
  
  // Track rule usage
  async trackRuleUsage(data: CreateRuleUsageAnalytics): Promise<string> {
    try {
      const analyticsData = {
        ...data,
        timestamp: serverTimestamp()
      }
      
      const docRef = await addDoc(
        collection(db, COLLECTIONS.RULE_USAGE), 
        analyticsData
      )
      
      // Update rule popularity
      await this.updateRulePopularity(data.ruleId)
      
      return docRef.id
    } catch (error) {
      console.error('Error tracking rule usage:', error)
      throw error
    }
  }

  // Update rule popularity based on usage
  async updateRulePopularity(ruleId: string): Promise<void> {
    try {
      // Get usage count for this rule
      const usageQuery = query(
        collection(db, COLLECTIONS.RULE_USAGE),
        where('ruleId', '==', ruleId)
      )
      
      const usageSnapshot = await getDocs(usageQuery)
      const usageCount = usageSnapshot.size
      
      // Calculate popularity score (usage count + recency factor)
      const recentUsageQuery = query(
        collection(db, COLLECTIONS.RULE_USAGE),
        where('ruleId', '==', ruleId),
        orderBy('timestamp', 'desc'),
        limit(10)
      )
      
      const recentSnapshot = await getDocs(recentUsageQuery)
      const recentUsageCount = recentSnapshot.size
      const popularity = usageCount + (recentUsageCount * 0.5) // Weight recent usage more
      
      // Update rule document
      const ruleRef = doc(db, COLLECTIONS.PROMPT_RULES, ruleId)
      await updateDoc(ruleRef, {
        usageCount,
        popularity,
        lastUsed: serverTimestamp()
      })
      
      // Update leaderboard
      await this.updateLeaderboard(ruleId, usageCount, popularity)
      
    } catch (error) {
      console.error('Error updating rule popularity:', error)
      throw error
    }
  }

  // Update leaderboard entry
  async updateLeaderboard(ruleId: string, usageCount: number, popularity: number): Promise<void> {
    try {
      // Get rule details
      const ruleRef = doc(db, COLLECTIONS.PROMPT_RULES, ruleId)
      const ruleDoc = await getDoc(ruleRef)
      
      if (!ruleDoc.exists()) {
        throw new Error(`Rule ${ruleId} not found`)
      }
      
      const ruleData = ruleDoc.data() as PromptRule
      
      // Check if leaderboard entry exists
      const leaderboardQuery = query(
        collection(db, COLLECTIONS.RULE_LEADERBOARD),
        where('ruleId', '==', ruleId)
      )
      
      const leaderboardSnapshot = await getDocs(leaderboardQuery)
      
      const leaderboardData: Partial<RuleLeaderboard> = {
        ruleId,
        title: ruleData.title,
        category: ruleData.category,
        usageCount,
        popularity,
        lastUpdated: serverTimestamp() as any,
        source: ruleData.source || 'internal'
      }
      
      if (leaderboardSnapshot.empty) {
        // Create new leaderboard entry
        await addDoc(collection(db, COLLECTIONS.RULE_LEADERBOARD), {
          ...leaderboardData,
          id: `${ruleId}-leaderboard`
        })
      } else {
        // Update existing entry
        const docId = leaderboardSnapshot.docs[0].id
        await updateDoc(doc(db, COLLECTIONS.RULE_LEADERBOARD, docId), leaderboardData)
      }
      
    } catch (error) {
      console.error('Error updating leaderboard:', error)
      throw error
    }
  }

  // Get top rules from leaderboard
  async getTopRules(limitCount: number = 10, category?: string): Promise<RuleLeaderboard[]> {
    try {
      let leaderboardQuery = query(
        collection(db, COLLECTIONS.RULE_LEADERBOARD),
        orderBy('popularity', 'desc'),
        limit(limitCount)
      )
      
      if (category) {
        leaderboardQuery = query(
          collection(db, COLLECTIONS.RULE_LEADERBOARD),
          where('category', '==', category),
          orderBy('popularity', 'desc'),
          limit(limitCount)
        )
      }
      
      const snapshot = await getDocs(leaderboardQuery)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
      })) as RuleLeaderboard[]
      
    } catch (error) {
      console.error('Error getting top rules:', error)
      throw error
    }
  }

  // Get usage analytics for a specific rule
  async getRuleAnalytics(ruleId: string, days: number = 30): Promise<RuleUsageAnalytics[]> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      
      const analyticsQuery = query(
        collection(db, COLLECTIONS.RULE_USAGE),
        where('ruleId', '==', ruleId),
        where('timestamp', '>=', Timestamp.fromDate(cutoffDate)),
        orderBy('timestamp', 'desc')
      )
      
      const snapshot = await getDocs(analyticsQuery)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as RuleUsageAnalytics[]
      
    } catch (error) {
      console.error('Error getting rule analytics:', error)
      throw error
    }
  }

  // Get team-wide usage statistics
  async getTeamUsageStats(teamId?: string): Promise<any> {
    try {
      let usageQuery = query(
        collection(db, COLLECTIONS.RULE_USAGE),
        orderBy('timestamp', 'desc'),
        limit(100)
      )
      
      if (teamId) {
        // Note: We'd need to add teamId to the usage analytics model
        // For now, we'll get all usage data
      }
      
      const snapshot = await getDocs(usageQuery)
      const usageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as RuleUsageAnalytics[]
      
      // Calculate statistics
      const totalUsage = usageData.length
      const uniqueRules = new Set(usageData.map(u => u.ruleId)).size
      const averageTokens = usageData
        .filter(u => u.tokensUsed)
        .reduce((sum, u) => sum + (u.tokensUsed || 0), 0) / 
        usageData.filter(u => u.tokensUsed).length || 0
      
      const categoryStats = usageData.reduce((acc, usage) => {
        // We'd need to join with rules to get category
        // For now, return basic stats
        return acc
      }, {} as Record<string, number>)
      
      return {
        totalUsage,
        uniqueRules,
        averageTokens,
        categoryStats,
        recentActivity: usageData.slice(0, 10)
      }
      
    } catch (error) {
      console.error('Error getting team usage stats:', error)
      throw error
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService()