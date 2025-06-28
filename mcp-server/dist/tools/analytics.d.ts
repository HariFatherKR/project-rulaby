export declare const analyticsTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            ruleId: {
                type: string;
                description: string;
            };
            userId: {
                type: string;
                description: string;
            };
            sessionId: {
                type: string;
                description: string;
            };
            context: {
                type: string;
                description: string;
            };
            success: {
                type: string;
                description: string;
            };
            tokensUsed: {
                type: string;
                description: string;
            };
            category?: undefined;
            limit?: undefined;
            days?: undefined;
            teamId?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            category: {
                type: string;
                description: string;
            };
            limit: {
                type: string;
                description: string;
                default: number;
            };
            ruleId?: undefined;
            userId?: undefined;
            sessionId?: undefined;
            context?: undefined;
            success?: undefined;
            tokensUsed?: undefined;
            days?: undefined;
            teamId?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            ruleId: {
                type: string;
                description: string;
            };
            days: {
                type: string;
                description: string;
                default: number;
            };
            userId?: undefined;
            sessionId?: undefined;
            context?: undefined;
            success?: undefined;
            tokensUsed?: undefined;
            category?: undefined;
            limit?: undefined;
            teamId?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            teamId: {
                type: string;
                description: string;
            };
            ruleId?: undefined;
            userId?: undefined;
            sessionId?: undefined;
            context?: undefined;
            success?: undefined;
            tokensUsed?: undefined;
            category?: undefined;
            limit?: undefined;
            days?: undefined;
        };
        required?: undefined;
    };
})[];
export declare function handleAnalyticsTool(name: string, args: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=analytics.d.ts.map