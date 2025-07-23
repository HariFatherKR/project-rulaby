import crypto from 'crypto';
export class RuleEncryptor {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.iterations = 100000;
        this.keyLength = 32;
    }
    async encrypt(data, password) {
        // Generate salt for key derivation
        const salt = crypto.randomBytes(16).toString('hex');
        // Derive key from password using PBKDF2
        const key = crypto.pbkdf2Sync(password, salt, this.iterations, this.keyLength, 'sha256');
        // Generate initialization vector
        const iv = crypto.randomBytes(16);
        // Create cipher
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        // Encrypt data
        const encrypted = Buffer.concat([
            cipher.update(data, 'utf8'),
            cipher.final()
        ]);
        // Get authentication tag (cast to any to access getAuthTag)
        const authTag = cipher.getAuthTag();
        return {
            encryptedData: encrypted.toString('hex'),
            salt: salt,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }
    async decrypt(encryptionData, password) {
        try {
            // Derive key from password using same salt
            const key = crypto.pbkdf2Sync(password, encryptionData.salt, this.iterations, this.keyLength, 'sha256');
            // Create decipher
            const decipher = crypto.createDecipheriv(this.algorithm, key, Buffer.from(encryptionData.iv, 'hex'));
            // Set authentication tag (cast to any to access setAuthTag)
            decipher.setAuthTag(Buffer.from(encryptionData.authTag, 'hex'));
            // Decrypt
            const decrypted = Buffer.concat([
                decipher.update(Buffer.from(encryptionData.encryptedData, 'hex')),
                decipher.final()
            ]);
            return decrypted.toString('utf8');
        }
        catch (error) {
            throw new Error('Failed to decrypt: Invalid password or corrupted data');
        }
    }
}
//# sourceMappingURL=encryption.js.map