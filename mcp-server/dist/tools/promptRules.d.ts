export declare const promptRuleTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            name: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            category: {
                type: string;
                description: string;
            };
            content: {
                type: string;
                description: string;
            };
            examples: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            tags: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            ruleId?: undefined;
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
            name?: undefined;
            description?: undefined;
            content?: undefined;
            examples?: undefined;
            tags?: undefined;
            ruleId?: undefined;
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
            name?: undefined;
            description?: undefined;
            category?: undefined;
            content?: undefined;
            examples?: undefined;
            tags?: undefined;
        };
        required: string[];
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
            name: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            category: {
                type: string;
                description: string;
            };
            content: {
                type: string;
                description: string;
            };
            examples: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            tags: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
        };
        required: string[];
    };
})[];
export declare function handlePromptRuleTool(name: string, args: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=promptRules.d.ts.map