import fs from 'fs/promises';
import path from 'path';
import os from 'os';
export class RuleDetector {
    static async detectCurrentIDE() {
        // Check environment variables
        const envKeys = Object.keys(process.env);
        for (const config of this.IDE_CONFIGS) {
            for (const pattern of config.detectPatterns) {
                if (envKeys.some(key => key.toLowerCase().includes(pattern))) {
                    return config.name;
                }
            }
        }
        // Check for IDE-specific files in home directory
        const homeDir = os.homedir();
        for (const config of this.IDE_CONFIGS) {
            for (const pattern of config.detectPatterns) {
                try {
                    await fs.access(path.join(homeDir, pattern));
                    return config.name;
                }
                catch {
                    // File doesn't exist, continue
                }
            }
        }
        // Check current working directory for rule files
        const cwd = process.cwd();
        for (const config of this.IDE_CONFIGS) {
            for (const ruleFile of config.ruleFiles) {
                try {
                    await fs.access(path.join(cwd, ruleFile));
                    return config.name;
                }
                catch {
                    // File doesn't exist, continue
                }
            }
        }
        // Default fallback
        return 'unknown';
    }
    static async findRuleFiles(ide) {
        const detectedRules = [];
        const cwd = process.cwd();
        // If specific IDE is provided, only check its files
        const configs = ide
            ? this.IDE_CONFIGS.filter(c => c.name === ide)
            : this.IDE_CONFIGS;
        for (const config of configs) {
            for (const ruleFile of config.ruleFiles) {
                const filePath = path.join(cwd, ruleFile);
                try {
                    const stats = await fs.stat(filePath);
                    if (stats.isFile()) {
                        const content = await fs.readFile(filePath, 'utf-8');
                        detectedRules.push({
                            ide: config.name,
                            filePath: ruleFile,
                            content: content,
                            fileSize: stats.size
                        });
                    }
                }
                catch {
                    // File doesn't exist or can't be read, skip
                }
            }
        }
        return detectedRules;
    }
    static getIDEConfig(ide) {
        return this.IDE_CONFIGS.find(config => config.name === ide);
    }
}
RuleDetector.IDE_CONFIGS = [
    {
        name: 'cursor',
        ruleFiles: ['.cursorrules'],
        detectPatterns: ['cursor', 'cursorless', '.cursor']
    },
    {
        name: 'windsurf',
        ruleFiles: ['.windsurfrules'],
        detectPatterns: ['windsurf', 'codeium', '.windsurf']
    },
    {
        name: 'claude-code',
        ruleFiles: ['.claude/CLAUDE.md', 'CLAUDE.md'],
        detectPatterns: ['claude-code', 'anthropic', '.claude']
    },
    {
        name: 'gemini-cli',
        ruleFiles: ['.gemini/rules.md'],
        detectPatterns: ['gemini', 'google-ai', '.gemini']
    },
    {
        name: 'kiro',
        ruleFiles: ['.kiro/prompts.md'],
        detectPatterns: ['kiro', '.kiro']
    }
];
//# sourceMappingURL=ruleDetector.js.map