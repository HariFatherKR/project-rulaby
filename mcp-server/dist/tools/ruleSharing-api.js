import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { RuleDetector } from "../services/ruleDetector.js";
import { RuleParser } from "../services/ruleParser.js";
import { RuleConverter } from "../services/ruleConverter.js";
import { RuleWriter } from "../services/ruleWriter.js";
import { RuleEncryptor } from "../utils/encryption.js";
import { ShareCodeGenerator, PasswordGenerator } from "../utils/generators.js";
import { RulabyAPIClient } from "../services/apiClient.js";
export async function handleShareRules(request) {
    try {
        const args = request.params.arguments || {};
        const { includeProjectSpecific = true, expiresInDays = 1, // Default to 24 hours
        maxUses = null, } = args;
        // Step 1: Detect current IDE and find rule files
        const currentIDE = await RuleDetector.detectCurrentIDE();
        const detectedRules = await RuleDetector.findRuleFiles();
        if (detectedRules.length === 0) {
            throw new McpError(ErrorCode.InvalidRequest, "No rule files found in the current directory. Please ensure you have IDE rule files (e.g., .cursorrules, .windsurfrules, etc.)");
        }
        // Step 2: Parse rules to Universal Rule Format
        const urf = await RuleParser.parseToURF(detectedRules);
        // Step 3: Generate password (share code will come from API)
        const passwordGen = new PasswordGenerator();
        const password = passwordGen.generate();
        // Step 4: Encrypt the rules
        const encryptor = new RuleEncryptor();
        const encryptionResult = await encryptor.encrypt(JSON.stringify(urf), password);
        // Step 5: Call API to create share
        const apiClient = new RulabyAPIClient();
        const shareResponse = await apiClient.createShare({
            encryptedData: encryptionResult.encryptedData,
            encryptionMetadata: {
                salt: encryptionResult.salt,
                iv: encryptionResult.iv,
                authTag: encryptionResult.authTag,
            },
            sourceIDE: currentIDE,
            ruleMetadata: {
                fileCount: urf.metadata.fileCount,
                totalSize: urf.metadata.totalSize,
                preview: detectedRules[0].content.substring(0, 100) + "...",
            },
            expiresInDays,
            maxUses,
        });
        // Step 6: Return success response
        return {
            content: [
                {
                    type: "text",
                    text: `✅ Your ${currentIDE} rules have been shared successfully!\n\n` +
                        `📋 **Share Code**: \`${shareResponse.shareCode}\`\n` +
                        `🔐 **Password**: \`${password}\`\n\n` +
                        `📁 **Files shared**: ${detectedRules
                            .map((r) => r.filePath)
                            .join(", ")}\n` +
                        `📊 **Total size**: ${(urf.metadata.totalSize / 1024).toFixed(2)} KB\n` +
                        `⏰ **Expires**: ${new Date(shareResponse.expiresAt).toLocaleDateString()}\n` +
                        `${maxUses ? `🔢 **Max uses**: ${maxUses}` : "♾️ **Unlimited uses**"}\n\n` +
                        `Share these credentials with others to let them import your rules into their IDE.\n\n` +
                        `🌐 Visit https://rulaby.dev for more features and capabilities!`,
                },
            ],
        };
    }
    catch (error) {
        throw new McpError(ErrorCode.InternalError, `Failed to share rules: ${error.message}`);
    }
}
export async function handleImportRules(request) {
    try {
        const args = request.params.arguments || {};
        const { shareCode, password, targetIDE } = args;
        const path = args.path || process.env.CWD;
        // Validate inputs
        if (!shareCode || !password) {
            throw new McpError(ErrorCode.InvalidParams, "Both shareCode and password are required");
        }
        // Validate share code format
        const shareCodeGen = new ShareCodeGenerator();
        if (!shareCodeGen.validate(shareCode)) {
            throw new McpError(ErrorCode.InvalidParams, "Invalid share code format. Expected: RULABY-XXXX-XXXX");
        }
        // Step 1: Fetch share from API
        const apiClient = new RulabyAPIClient();
        const share = await apiClient.retrieveShare(shareCode);
        // Step 2: Decrypt the rules
        const encryptor = new RuleEncryptor();
        let decryptedData;
        try {
            decryptedData = await encryptor.decrypt({
                encryptedData: share.encryptedData,
                salt: share.encryptionMetadata.salt,
                iv: share.encryptionMetadata.iv,
                authTag: share.encryptionMetadata.authTag,
            }, password);
        }
        catch (error) {
            throw new McpError(ErrorCode.InvalidRequest, "Invalid password. Please check and try again.");
        }
        // Step 3: Parse URF
        const urf = JSON.parse(decryptedData);
        // Step 4: Detect or use specified target IDE
        const detectedIDE = targetIDE || (await RuleDetector.detectCurrentIDE());
        if (detectedIDE === "unknown" && !targetIDE) {
            throw new McpError(ErrorCode.InvalidRequest, "Could not detect your IDE. Please specify targetIDE parameter.");
        }
        // Step 5: Backup existing rules (if any)
        await RuleWriter.backupExistingRules(detectedIDE, path);
        // Step 6: Convert rules to target format
        const convertedRules = RuleConverter.fromURF(urf, detectedIDE);
        // Step 7: Write rule files
        await RuleWriter.writeRules(convertedRules, path);
        // Step 8: Update access count (non-blocking)
        apiClient.incrementAccessCount(shareCode).catch(() => {
            // Ignore errors
        });
        // Step 9: Return success response
        return {
            content: [
                {
                    type: "text",
                    text: `✅ Rules imported successfully!\n\n` +
                        `🎯 **Target IDE**: ${detectedIDE}\n` +
                        `📥 **Source IDE**: ${share.sourceIDE}\n` +
                        `📁 **Files created**: ${convertedRules.files
                            .map((f) => f.path)
                            .join(", ")}\n\n` +
                        `Your ${detectedIDE} is now configured with the shared rules.\n` +
                        `${share.sourceIDE !== detectedIDE
                            ? `\n⚠️ Note: Rules were converted from ${share.sourceIDE} format to ${detectedIDE} format. ` +
                                `Some adjustments may be needed for optimal compatibility.`
                            : ""}`,
                },
            ],
        };
    }
    catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        throw new McpError(ErrorCode.InternalError, `Failed to import rules: ${error.message}`);
    }
}
//# sourceMappingURL=ruleSharing-api.js.map