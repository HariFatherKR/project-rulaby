export class RuleParser {
    static async parseToURF(detectedRules) {
        if (detectedRules.length === 0) {
            throw new Error("No rules detected to parse");
        }
        const sourceIDE = detectedRules[0].ide;
        const totalSize = detectedRules.reduce((sum, rule) => sum + rule.fileSize, 0);
        // For Claude Code, parse its content
        if (sourceIDE === "claude-code" && detectedRules.length === 1) {
            const rawContent = detectedRules[0].content;
            const parsedRules = this.parseRulesByIDE(sourceIDE, rawContent);
            return {
                version: "1.0",
                metadata: {
                    sourceIDE,
                    created: new Date().toISOString(),
                    totalSize,
                    fileCount: detectedRules.length,
                },
                rules: {
                    ...parsedRules,
                    raw: rawContent,
                },
            };
        }
        // Combine all rule contents for other IDEs
        const combinedContent = detectedRules
            .map((rule) => `### File: ${rule.filePath}\n\n${rule.content}`)
            .join("\n\n---\n\n");
        // Parse rules based on IDE type
        const parsedRules = this.parseRulesByIDE(sourceIDE, combinedContent);
        return {
            version: "1.0",
            metadata: {
                sourceIDE,
                created: new Date().toISOString(),
                totalSize,
                fileCount: detectedRules.length,
            },
            rules: {
                ...parsedRules,
                raw: combinedContent,
            },
        };
    }
    static parseRulesByIDE(ide, content) {
        const lines = content.split("\n");
        const rules = {
            general: [],
            codeStyle: [],
            behavior: [],
            projectSpecific: [],
        };
        let currentSection = "";
        let inCodeBlock = false;
        // Parse based on markdown structure
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Handle code blocks
            if (trimmedLine.startsWith("```")) {
                inCodeBlock = !inCodeBlock;
                continue;
            }
            // Skip lines in code blocks
            if (inCodeBlock)
                continue;
            // Detect section headers
            if (trimmedLine.startsWith("##") && !trimmedLine.startsWith("###")) {
                currentSection = trimmedLine.replace(/^#+\s*/, "").toLowerCase();
                continue;
            }
            // Skip empty lines, file markers, and metadata
            if (!trimmedLine ||
                trimmedLine.startsWith("###") ||
                trimmedLine.startsWith("---") ||
                trimmedLine.startsWith("*") ||
                trimmedLine === "```")
                continue;
            // Extract list items
            const ruleMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
            if (ruleMatch) {
                const ruleContent = ruleMatch[1];
                // Categorize based on current section or content
                if (currentSection.includes("code") ||
                    currentSection.includes("style") ||
                    currentSection.includes("format")) {
                    rules.codeStyle.push(ruleContent);
                }
                else if (currentSection.includes("behavior") ||
                    currentSection.includes("response")) {
                    rules.behavior.push(ruleContent);
                }
                else if (currentSection.includes("project") ||
                    currentSection.includes("context") ||
                    currentSection.includes("specific")) {
                    rules.projectSpecific.push(ruleContent);
                }
                else if (currentSection.includes("general") ||
                    currentSection.includes("guideline")) {
                    rules.general.push(ruleContent);
                }
                else {
                    // Use keyword-based categorization as fallback
                    const lowerContent = ruleContent.toLowerCase();
                    if (this.isCodeStyleRule(lowerContent)) {
                        rules.codeStyle.push(ruleContent);
                    }
                    else if (this.isBehaviorRule(lowerContent)) {
                        rules.behavior.push(ruleContent);
                    }
                    else if (this.isProjectSpecificRule(lowerContent)) {
                        rules.projectSpecific.push(ruleContent);
                    }
                    else {
                        rules.general.push(ruleContent);
                    }
                }
            }
        }
        return rules;
    }
    static isCodeStyleRule(line) {
        const codeStyleKeywords = [
            "indent",
            "space",
            "tab",
            "semicolon",
            "quote",
            "bracket",
            "camelcase",
            "pascalcase",
            "snake_case",
            "naming",
            "style",
            "format",
            "lint",
            "prettier",
            "eslint",
            "typescript",
            "javascript",
        ];
        return codeStyleKeywords.some((keyword) => line.includes(keyword));
    }
    static isBehaviorRule(line) {
        const behaviorKeywords = [
            "always",
            "never",
            "must",
            "should",
            "avoid",
            "prefer",
            "don't",
            "do not",
            "be",
            "act",
            "respond",
            "explain",
            "concise",
            "verbose",
            "detailed",
            "brief",
        ];
        return behaviorKeywords.some((keyword) => line.includes(keyword));
    }
    static isProjectSpecificRule(line) {
        const projectKeywords = [
            "project",
            "directory",
            "structure",
            "architecture",
            "framework",
            "library",
            "dependency",
            "module",
            "api",
            "database",
            "schema",
            "model",
        ];
        return projectKeywords.some((keyword) => line.includes(keyword));
    }
}
//# sourceMappingURL=ruleParser.js.map