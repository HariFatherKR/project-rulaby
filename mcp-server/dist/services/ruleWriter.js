import fs from 'fs/promises';
import path from 'path';
export class RuleWriter {
    static async writeRules(convertedRule) {
        const cwd = process.cwd();
        for (const file of convertedRule.files) {
            const fullPath = path.join(cwd, file.path);
            const dir = path.dirname(fullPath);
            // Ensure directory exists
            await this.ensureDirectory(dir);
            // Write file
            await fs.writeFile(fullPath, file.content, 'utf-8');
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
    static async backupExistingRules(ide) {
        const cwd = process.cwd();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        // Define rule files to backup based on IDE
        const ruleFiles = this.getRuleFilesByIDE(ide);
        for (const ruleFile of ruleFiles) {
            const sourcePath = path.join(cwd, ruleFile);
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
            case 'cursor':
                return ['.cursorrules'];
            case 'windsurf':
                return ['.windsurfrules'];
            case 'claude-code':
                return ['.claude/CLAUDE.md'];
            case 'gemini-cli':
                return ['.gemini/rules.md'];
            case 'kiro':
                return ['.kiro/prompts.md'];
            default:
                return [];
        }
    }
}
//# sourceMappingURL=ruleWriter.js.map