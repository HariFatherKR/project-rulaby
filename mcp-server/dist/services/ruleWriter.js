import fs from "fs/promises";
import path from "path";
import os from "os";
export class RuleWriter {
    static async writeRules(convertedRule, customPath) {
        const basePath = customPath ? path.resolve(customPath) : os.homedir();
        console.log(`[RuleWriter] basePath: ${basePath}`);
        for (const file of convertedRule.files) {
            const fullPath = path.join(basePath, file.path);
            console.log(`[RuleWriter] fullPath: ${fullPath}`);
            const dir = path.dirname(fullPath);
            // Ensure directory exists
            await this.ensureDirectory(dir);
            // Write file
            await fs.writeFile(fullPath, file.content, "utf-8");
        }
    }
    static async ensureDirectory(dirPath) {
        try {
            await fs.access(dirPath);
        }
        catch {
            // Directory doesn't exist, create it
            await fs.mkdir(dirPath, { recursive: true });
        }
    }
    static async backupExistingRules(ide, customPath) {
        const basePath = customPath ? path.resolve(customPath) : os.homedir();
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        // Define rule files to backup based on IDE
        const ruleFiles = this.getRuleFilesByIDE(ide);
        for (const ruleFile of ruleFiles) {
            const sourcePath = path.join(basePath, ruleFile);
            try {
                await fs.access(sourcePath);
                // File exists, create backup
                const backupPath = `${sourcePath}.backup-${timestamp}`;
                await fs.copyFile(sourcePath, backupPath);
            }
            catch {
                // File doesn't exist, skip backup
            }
        }
    }
    static getRuleFilesByIDE(ide) {
        switch (ide) {
            case "cursor":
                return [".cursorrules"];
            case "windsurf":
                return [".windsurfrules"];
            case "claude-code":
                return [".claude/CLAUDE.md"];
            case "gemini-cli":
                return [".gemini/rules.md"];
            case "kiro":
                return [".kiro/prompts.md"];
            default:
                return [];
        }
    }
}
//# sourceMappingURL=ruleWriter.js.map