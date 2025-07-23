export interface ShareRequest {
    encryptedData: string;
    encryptionMetadata: {
        salt: string;
        iv: string;
        authTag: string;
    };
    sourceIDE: string;
    ruleMetadata?: {
        fileCount: number;
        totalSize: number;
        preview?: string;
    };
    expiresInDays: number;
    maxUses: number | null;
}
export interface ShareResponse {
    shareCode: string;
    expiresAt: string;
}
export interface RetrieveResponse {
    encryptedData: string;
    encryptionMetadata: {
        salt: string;
        iv: string;
        authTag: string;
    };
    sourceIDE: string;
    ruleMetadata?: {
        fileCount: number;
        totalSize: number;
        preview?: string;
    };
}
export declare class RulabyAPIClient {
    private baseURL;
    constructor();
    createShare(data: ShareRequest): Promise<ShareResponse>;
    retrieveShare(shareCode: string): Promise<RetrieveResponse>;
    incrementAccessCount(shareCode: string): Promise<void>;
}
//# sourceMappingURL=apiClient.d.ts.map