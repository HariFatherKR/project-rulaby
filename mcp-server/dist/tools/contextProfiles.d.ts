export declare const contextProfileTools: ({
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
            role: {
                type: string;
                description: string;
            };
            instructions: {
                type: string;
                description: string;
            };
            constraints: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            preferences: {
                type: string;
                description: string;
            };
            profileId?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            role: {
                type: string;
                description: string;
            };
            name?: undefined;
            description?: undefined;
            instructions?: undefined;
            constraints?: undefined;
            preferences?: undefined;
            profileId?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            profileId: {
                type: string;
                description: string;
            };
            name?: undefined;
            description?: undefined;
            role?: undefined;
            instructions?: undefined;
            constraints?: undefined;
            preferences?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            profileId: {
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
            role: {
                type: string;
                description: string;
            };
            instructions: {
                type: string;
                description: string;
            };
            constraints: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            preferences: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
})[];
export declare function handleContextProfileTool(name: string, args: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=contextProfiles.d.ts.map