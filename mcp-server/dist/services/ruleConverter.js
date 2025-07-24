export class RuleConverter {
    static fromURF(urf, targetIDE) {
        switch (targetIDE) {
            case 'cursor':
                return this.toCursor(urf);
            case 'windsurf':
                return this.toWindsurf(urf);
            case 'claude-code':
                return this.toClaudeCode(urf);
            case 'gemini-cli':
                return this.toGeminiCLI(urf);
            case 'kiro':
                return this.toKiro(urf);
            default:
                // Fallback to raw format
                return {
                    ide: targetIDE,
                    files: [{
                            path: '.ai-rules',
                            content: urf.rules.raw
                        }]
                };
        }
    }
    static toCursor(urf) {
        console.error('[RuleConverter] toCursor - URF rules:', JSON.stringify(urf.rules, null, 2));
        const sections = [
            '# Cursor Rules',
            `# Imported from ${urf.metadata.sourceIDE} on ${new Date().toLocaleDateString()}`,
            ''
        ];
        // If no categorized rules but we have raw content, use raw content
        const hasCategories = urf.rules.general.length > 0 ||
            urf.rules.codeStyle.length > 0 ||
            urf.rules.behavior.length > 0 ||
            urf.rules.projectSpecific.length > 0;
        if (!hasCategories && urf.rules.raw) {
            sections.push(urf.rules.raw);
        }
        else {
            if (urf.rules.general.length > 0) {
                sections.push('## General Guidelines');
                sections.push(...urf.rules.general.map(rule => `- ${rule}`));
                sections.push('');
            }
            if (urf.rules.codeStyle.length > 0) {
                sections.push('## Code Style');
                sections.push(...urf.rules.codeStyle.map(rule => `- ${rule}`));
                sections.push('');
            }
            if (urf.rules.behavior.length > 0) {
                sections.push('## Assistant Behavior');
                sections.push(...urf.rules.behavior.map(rule => `- ${rule}`));
                sections.push('');
            }
            if (urf.rules.projectSpecific.length > 0) {
                sections.push('## Project Specific');
                sections.push(...urf.rules.projectSpecific.map(rule => `- ${rule}`));
            }
        }
        return {
            ide: 'cursor',
            files: [{
                    path: '.cursorrules',
                    content: sections.join('\n')
                }]
        };
    }
    static toWindsurf(urf) {
        const sections = [
            '# Windsurf Configuration',
            `# Imported from ${urf.metadata.sourceIDE} on ${new Date().toLocaleDateString()}`,
            ''
        ];
        // Check if we have categorized rules
        const hasCategories = urf.rules.general.length > 0 ||
            urf.rules.codeStyle.length > 0 ||
            urf.rules.behavior.length > 0 ||
            urf.rules.projectSpecific.length > 0;
        if (!hasCategories && urf.rules.raw) {
            // Use raw content if no categories
            sections.push(urf.rules.raw);
        }
        else {
            sections.push('assistant_behavior:');
            // Combine all rules for Windsurf format
            const allRules = [
                ...urf.rules.general,
                ...urf.rules.behavior,
                ...urf.rules.codeStyle,
                ...urf.rules.projectSpecific
            ];
            sections.push(...allRules.map(rule => `  - ${rule}`));
        }
        return {
            ide: 'windsurf',
            files: [{
                    path: '.windsurfrules',
                    content: sections.join('\n')
                }]
        };
    }
    static toClaudeCode(urf) {
        // If source is already claude-code, preserve the original format
        if (urf.metadata.sourceIDE === 'claude-code') {
            // Remove any file markers that might have been added
            const cleanedContent = urf.rules.raw
                .replace(/^### File: .*$/gm, '')
                .replace(/^---$/gm, '')
                .trim();
            return {
                ide: 'claude-code',
                files: [{
                        path: '.claude/CLAUDE.md',
                        content: cleanedContent
                    }]
            };
        }
        // For other IDEs, convert to Claude format
        const sections = [
            '# Claude Instructions',
            `*Imported from ${urf.metadata.sourceIDE} on ${new Date().toLocaleDateString()}*`,
            ''
        ];
        if (urf.rules.general.length > 0) {
            sections.push('## General Guidelines');
            urf.rules.general.forEach(rule => {
                sections.push(`- ${rule}`);
            });
            sections.push('');
        }
        if (urf.rules.codeStyle.length > 0) {
            sections.push('## Code Style & Formatting');
            urf.rules.codeStyle.forEach(rule => {
                sections.push(`- ${rule}`);
            });
            sections.push('');
        }
        if (urf.rules.behavior.length > 0) {
            sections.push('## Response Behavior');
            urf.rules.behavior.forEach(rule => {
                sections.push(`- ${rule}`);
            });
            sections.push('');
        }
        if (urf.rules.projectSpecific.length > 0) {
            sections.push('## Project Context');
            urf.rules.projectSpecific.forEach(rule => {
                sections.push(`- ${rule}`);
            });
        }
        return {
            ide: 'claude-code',
            files: [{
                    path: '.claude/CLAUDE.md',
                    content: sections.join('\n')
                }]
        };
    }
    static toGeminiCLI(urf) {
        const sections = [
            '# Gemini Rules',
            `*Imported from ${urf.metadata.sourceIDE} on ${new Date().toLocaleDateString()}*`,
            ''
        ];
        // Check if we have categorized rules
        const hasCategories = urf.rules.general.length > 0 ||
            urf.rules.codeStyle.length > 0 ||
            urf.rules.behavior.length > 0 ||
            urf.rules.projectSpecific.length > 0;
        if (!hasCategories && urf.rules.raw) {
            // Use raw content if no categories
            sections.push(urf.rules.raw);
        }
        else {
            sections.push('## Response Format');
            sections.push('Always follow these guidelines when responding:');
            sections.push('');
            if (urf.rules.behavior.length > 0) {
                urf.rules.behavior.forEach(rule => {
                    sections.push(`* ${rule}`);
                });
                sections.push('');
            }
            if (urf.rules.codeStyle.length > 0) {
                sections.push('## Code Style');
                sections.push('When writing code, adhere to:');
                urf.rules.codeStyle.forEach(rule => {
                    sections.push(`* ${rule}`);
                });
                sections.push('');
            }
            if (urf.rules.general.length > 0 || urf.rules.projectSpecific.length > 0) {
                sections.push('## Additional Context');
                [...urf.rules.general, ...urf.rules.projectSpecific].forEach(rule => {
                    sections.push(`* ${rule}`);
                });
            }
        }
        return {
            ide: 'gemini-cli',
            files: [{
                    path: '.gemini/rules.md',
                    content: sections.join('\n')
                }]
        };
    }
    static toKiro(urf) {
        const sections = [
            '# Kiro Prompts',
            `*Imported from ${urf.metadata.sourceIDE} on ${new Date().toLocaleDateString()}*`,
            ''
        ];
        // Check if we have categorized rules
        const hasCategories = urf.rules.general.length > 0 ||
            urf.rules.codeStyle.length > 0 ||
            urf.rules.behavior.length > 0 ||
            urf.rules.projectSpecific.length > 0;
        if (!hasCategories && urf.rules.raw) {
            // Use raw content if no categories
            sections.push(urf.rules.raw);
        }
        else {
            sections.push('## Default Behavior');
            if (urf.rules.behavior.length > 0) {
                urf.rules.behavior.forEach(rule => {
                    sections.push(`- ${rule}`);
                });
            }
            else {
                sections.push('- Act as a helpful assistant');
            }
            sections.push('');
            if (urf.rules.codeStyle.length > 0) {
                sections.push('## Coding Standards');
                urf.rules.codeStyle.forEach(rule => {
                    sections.push(`- ${rule}`);
                });
                sections.push('');
            }
            if (urf.rules.projectSpecific.length > 0) {
                sections.push('## Project Rules');
                urf.rules.projectSpecific.forEach(rule => {
                    sections.push(`- ${rule}`);
                });
                sections.push('');
            }
            if (urf.rules.general.length > 0) {
                sections.push('## General Guidelines');
                urf.rules.general.forEach(rule => {
                    sections.push(`- ${rule}`);
                });
            }
        }
        return {
            ide: 'kiro',
            files: [{
                    path: '.kiro/prompts.md',
                    content: sections.join('\n')
                }]
        };
    }
}
//# sourceMappingURL=ruleConverter.js.map