export class RulabyAPIClient {
    constructor() {
        // Use environment variable or default to production API
        this.baseURL = process.env.RULABY_API_URL || 'https://rulaby.com/api';
        this.apiKey = process.env.RULABY_API_KEY;
    }
    async createShare(data) {
        const response = await fetch(`${this.baseURL}/shares`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.apiKey && { 'X-API-Key': this.apiKey })
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to create share: ${error}`);
        }
        return response.json();
    }
    async retrieveShare(shareCode) {
        const response = await fetch(`${this.baseURL}/shares/${shareCode}`, {
            method: 'GET',
            headers: {
                ...(this.apiKey && { 'X-API-Key': this.apiKey })
            }
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Share code not found or expired');
            }
            const error = await response.text();
            throw new Error(`Failed to retrieve share: ${error}`);
        }
        return response.json();
    }
    async incrementAccessCount(shareCode) {
        const response = await fetch(`${this.baseURL}/shares/${shareCode}/access`, {
            method: 'POST',
            headers: {
                ...(this.apiKey && { 'X-API-Key': this.apiKey })
            }
        });
        if (!response.ok) {
            // Don't throw - access count is not critical
            console.error('Failed to increment access count');
        }
    }
}
//# sourceMappingURL=apiClient.js.map