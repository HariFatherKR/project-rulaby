import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ANALYTICS_DIR = path.join(__dirname, '../../../data/analytics');
// Ensure analytics directory exists
async function ensureAnalyticsDir() {
    try {
        await fs.mkdir(ANALYTICS_DIR, { recursive: true });
    }
    catch (error) {
        console.error('Failed to create analytics directory:', error);
    }
}
export const analyticsTools = [
    {
        name: 'track_rule_usage',
        description: 'Track usage of a specific rule',
        inputSchema: {
            type: 'object',
            properties: {
                ruleId: {
                    type: 'string',
                    description: 'ID of the rule being used',
                },
                userId: {
                    type: 'string',
                    description: 'ID of the user using the rule',
                },
                sessionId: {
                    type: 'string',
                    description: 'Optional session ID',
                },
                context: {
                    type: 'string',
                    description: 'Context where the rule was used',
                },
                success: {
                    type: 'boolean',
                    description: 'Whether the rule application was successful',
                },
                tokensUsed: {
                    type: 'number',
                    description: 'Number of tokens used',
                },
            },
            required: ['ruleId', 'userId'],
        },
    },
    {
        name: 'get_rule_leaderboard',
        description: 'Get the rule popularity leaderboard',
        inputSchema: {
            type: 'object',
            properties: {
                category: {
                    type: 'string',
                    description: 'Optional filter by category',
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of rules to return',
                    default: 10,
                },
            },
        },
    },
    {
        name: 'get_usage_analytics',
        description: 'Get usage analytics for a specific rule',
        inputSchema: {
            type: 'object',
            properties: {
                ruleId: {
                    type: 'string',
                    description: 'ID of the rule to analyze',
                },
                days: {
                    type: 'number',
                    description: 'Number of days to analyze (default: 30)',
                    default: 30,
                },
            },
            required: ['ruleId'],
        },
    },
    {
        name: 'get_team_stats',
        description: 'Get team-wide usage statistics',
        inputSchema: {
            type: 'object',
            properties: {
                teamId: {
                    type: 'string',
                    description: 'Optional team ID filter',
                },
            },
        },
    },
];
export async function handleAnalyticsTool(name, args) {
    await ensureAnalyticsDir();
    switch (name) {
        case 'track_rule_usage': {
            const usageId = `usage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const usage = {
                id: usageId,
                ruleId: args.ruleId,
                userId: args.userId,
                sessionId: args.sessionId,
                timestamp: new Date().toISOString(),
                context: args.context,
                success: args.success,
                tokensUsed: args.tokensUsed,
            };
            const filePath = path.join(ANALYTICS_DIR, `${usageId}.json`);
            await fs.writeFile(filePath, JSON.stringify(usage, null, 2));
            // Update leaderboard
            await updateLeaderboard(args.ruleId);
            return {
                content: [
                    {
                        type: 'text',
                        text: `Rule usage tracked: ${args.ruleId} by ${args.userId}`,
                    },
                ],
            };
        }
        case 'get_rule_leaderboard': {
            const limit = args.limit || 10;
            const category = args.category;
            // Read all usage files and calculate popularity
            const files = await fs.readdir(ANALYTICS_DIR);
            const usageFiles = files.filter(f => f.startsWith('usage-'));
            const usageData = {};
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 7); // Recent = last 7 days
            for (const file of usageFiles) {
                try {
                    const content = await fs.readFile(path.join(ANALYTICS_DIR, file), 'utf-8');
                    const usage = JSON.parse(content);
                    if (!usageData[usage.ruleId]) {
                        usageData[usage.ruleId] = { count: 0, recent: 0 };
                    }
                    usageData[usage.ruleId].count++;
                    if (new Date(usage.timestamp) > cutoffDate) {
                        usageData[usage.ruleId].recent++;
                    }
                }
                catch (error) {
                    console.error(`Error reading usage file ${file}:`, error);
                }
            }
            // Create leaderboard entries (simplified - would normally fetch rule details)
            const leaderboard = Object.entries(usageData)
                .map(([ruleId, data]) => ({
                ruleId,
                title: `Rule ${ruleId}`, // Would fetch actual title from rules
                category: 'general', // Would fetch actual category
                usageCount: data.count,
                popularity: data.count + (data.recent * 0.5), // Weight recent usage
                lastUpdated: new Date().toISOString(),
                source: 'internal',
            }))
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, limit);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(leaderboard, null, 2),
                    },
                ],
            };
        }
        case 'get_usage_analytics': {
            const { ruleId, days = 30 } = args;
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            const files = await fs.readdir(ANALYTICS_DIR);
            const usageFiles = files.filter(f => f.startsWith('usage-'));
            const analytics = [];
            for (const file of usageFiles) {
                try {
                    const content = await fs.readFile(path.join(ANALYTICS_DIR, file), 'utf-8');
                    const usage = JSON.parse(content);
                    if (usage.ruleId === ruleId && new Date(usage.timestamp) > cutoffDate) {
                        analytics.push(usage);
                    }
                }
                catch (error) {
                    console.error(`Error reading usage file ${file}:`, error);
                }
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(analytics, null, 2),
                    },
                ],
            };
        }
        case 'get_team_stats': {
            const files = await fs.readdir(ANALYTICS_DIR);
            const usageFiles = files.filter(f => f.startsWith('usage-'));
            let totalUsage = 0;
            const uniqueRules = new Set();
            const uniqueUsers = new Set();
            let totalTokens = 0;
            let tokenCount = 0;
            for (const file of usageFiles) {
                try {
                    const content = await fs.readFile(path.join(ANALYTICS_DIR, file), 'utf-8');
                    const usage = JSON.parse(content);
                    totalUsage++;
                    uniqueRules.add(usage.ruleId);
                    uniqueUsers.add(usage.userId);
                    if (usage.tokensUsed) {
                        totalTokens += usage.tokensUsed;
                        tokenCount++;
                    }
                }
                catch (error) {
                    console.error(`Error reading usage file ${file}:`, error);
                }
            }
            const stats = {
                totalUsage,
                uniqueRules: uniqueRules.size,
                uniqueUsers: uniqueUsers.size,
                averageTokens: tokenCount > 0 ? Math.round(totalTokens / tokenCount) : 0,
                efficiency: tokenCount > 0 ? Math.round((1 - (totalTokens / (tokenCount * 4000))) * 100) : 0, // Assuming 4k token limit
            };
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(stats, null, 2),
                    },
                ],
            };
        }
        default:
            throw new Error(`Unknown analytics tool: ${name}`);
    }
}
// Helper function to update leaderboard
async function updateLeaderboard(ruleId) {
    // This would typically update a persistent leaderboard file
    // For now, we'll just track that this was called
    const leaderboardFile = path.join(ANALYTICS_DIR, 'leaderboard.json');
    try {
        let leaderboard = {};
        try {
            const content = await fs.readFile(leaderboardFile, 'utf-8');
            leaderboard = JSON.parse(content);
        }
        catch {
            // File doesn't exist yet, start with empty leaderboard
        }
        leaderboard[ruleId] = (leaderboard[ruleId] || 0) + 1;
        await fs.writeFile(leaderboardFile, JSON.stringify(leaderboard, null, 2));
    }
    catch (error) {
        console.error('Error updating leaderboard:', error);
    }
}
//# sourceMappingURL=analytics.js.map