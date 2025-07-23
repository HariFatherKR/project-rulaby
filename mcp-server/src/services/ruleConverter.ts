import { UniversalRuleFormat } from './ruleParser.js';

export interface ConvertedRule {
  ide: string;
  files: Array<{
    path: string;
    content: string;
  }>;
}

export class RuleConverter {
  static fromURF(urf: UniversalRuleFormat, targetIDE: string): ConvertedRule {
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
  
  private static toCursor(urf: UniversalRuleFormat): ConvertedRule {
    const sections: string[] = [
      '# Cursor Rules',
      `# Imported from ${urf.metadata.sourceIDE} on ${new Date().toLocaleDateString()}`,
      ''
    ];
    
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
    
    return {
      ide: 'cursor',
      files: [{
        path: '.cursorrules',
        content: sections.join('\n')
      }]
    };
  }
  
  private static toWindsurf(urf: UniversalRuleFormat): ConvertedRule {
    const sections: string[] = [
      '# Windsurf Configuration',
      `# Imported from ${urf.metadata.sourceIDE} on ${new Date().toLocaleDateString()}`,
      ''
    ];
    
    sections.push('assistant_behavior:');
    
    // Combine all rules for Windsurf format
    const allRules = [
      ...urf.rules.general,
      ...urf.rules.behavior,
      ...urf.rules.codeStyle,
      ...urf.rules.projectSpecific
    ];
    
    sections.push(...allRules.map(rule => `  - ${rule}`));
    
    return {
      ide: 'windsurf',
      files: [{
        path: '.windsurfrules',
        content: sections.join('\n')
      }]
    };
  }
  
  private static toClaudeCode(urf: UniversalRuleFormat): ConvertedRule {
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
    const sections: string[] = [
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
  
  private static toGeminiCLI(urf: UniversalRuleFormat): ConvertedRule {
    const sections: string[] = [
      '# Gemini Rules',
      `*Imported from ${urf.metadata.sourceIDE} on ${new Date().toLocaleDateString()}*`,
      ''
    ];
    
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
    
    return {
      ide: 'gemini-cli',
      files: [{
        path: '.gemini/rules.md',
        content: sections.join('\n')
      }]
    };
  }
  
  private static toKiro(urf: UniversalRuleFormat): ConvertedRule {
    const sections: string[] = [
      '# Kiro Prompts',
      `*Imported from ${urf.metadata.sourceIDE} on ${new Date().toLocaleDateString()}*`,
      ''
    ];
    
    sections.push('## Default Behavior');
    if (urf.rules.behavior.length > 0) {
      urf.rules.behavior.forEach(rule => {
        sections.push(`- ${rule}`);
      });
    } else {
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
    
    return {
      ide: 'kiro',
      files: [{
        path: '.kiro/prompts.md',
        content: sections.join('\n')
      }]
    };
  }
}