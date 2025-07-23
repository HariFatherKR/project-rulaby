export interface EncryptionResult {
    encryptedData: string;
    salt: string;
    iv: string;
    authTag: string;
}
export declare class RuleEncryptor {
    private algorithm;
    private iterations;
    private keyLength;
    encrypt(data: string, password: string): Promise<EncryptionResult>;
    decrypt(encryptionData: EncryptionResult, password: string): Promise<string>;
}
//# sourceMappingURL=encryption.d.ts.map