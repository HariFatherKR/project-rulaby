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

export class RulabyAPIClient {
  private baseURL: string;

  constructor() {
    // Production API endpoint
    this.baseURL = 'https://api.rulaby.dev/api/v1';
  }

  async createShare(data: ShareRequest): Promise<ShareResponse> {
    const response = await fetch(`${this.baseURL}/shares`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create share: ${error}`);
    }

    return response.json() as Promise<ShareResponse>;
  }

  async retrieveShare(shareCode: string): Promise<RetrieveResponse> {
    const response = await fetch(`${this.baseURL}/shares/${shareCode}`, {
      method: 'GET'
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Share code not found or expired');
      }
      const error = await response.text();
      throw new Error(`Failed to retrieve share: ${error}`);
    }

    return response.json() as Promise<RetrieveResponse>;
  }

  async incrementAccessCount(shareCode: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/shares/${shareCode}/access`, {
      method: 'POST'
    });

    if (!response.ok) {
      // Don't throw - access count is not critical
      console.error('Failed to increment access count');
    }
  }
}