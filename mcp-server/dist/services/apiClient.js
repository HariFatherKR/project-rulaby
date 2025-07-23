export class RulabyAPIClient {
    constructor() {
        // Production API endpoint
        this.baseURL = 'https://api.rulaby.dev/api/v1';
    }
    async createShare(data) {
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
        return response.json();
    }
    async retrieveShare(shareCode) {
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
        return response.json();
    }
    async incrementAccessCount(shareCode) {
        const response = await fetch(`${this.baseURL}/shares/${shareCode}/access`, {
            method: 'POST'
        });
        if (!response.ok) {
            // Don't throw - access count is not critical
            console.error('Failed to increment access count');
        }
    }
}
//# sourceMappingURL=apiClient.js.map