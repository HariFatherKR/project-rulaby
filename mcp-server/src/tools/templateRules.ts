import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { templates as localTemplates, templateCategories as localCategories } from "../data/templates.js";

// Schema for add_template_rule parameters
const AddTemplateRuleSchema = z.object({
  templateId: z.string().optional().describe("Specific template ID to add"),
  category: z.string().optional().describe("Category of rules to add (e.g., 'react', 'typescript', 'nextjs')"),
  projectType: z.string().optional().describe("Type of project (e.g., 'web', 'api', 'mobile')"),
  targetPath: z.string().optional().describe("Target path for the rule file (defaults to current directory)"),
});

// API configuration
const API_BASE_URL = process.env.RULABY_API_URL || "https://api.rulaby.dev/api/v1";

// Cache for remote template list
let remoteTemplateCache: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch all available templates from server
async function fetchRemoteTemplates() {
  // Check cache
  if (remoteTemplateCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return remoteTemplateCache;
  }

  try {
    console.log(`Fetching templates from: ${API_BASE_URL}/templates`);
    
    const response = await fetch(`${API_BASE_URL}/templates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`API response not OK: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch templates: ${response.statusText}`);
    }

    const data = await response.json() as { success: boolean; templates: any; total: number };
    console.log(`Successfully fetched ${Object.keys(data.templates || {}).length} template categories, total: ${data.total} templates`);
    
    remoteTemplateCache = data.templates;
    cacheTimestamp = Date.now();
    return data.templates;
  } catch (error) {
    console.error('Error fetching remote templates:', error);
    console.error('API URL:', API_BASE_URL);
    return null;
  }
}

// Fetch specific template content from server
async function fetchRemoteTemplate(templateId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/templates?id=${templateId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${response.statusText}`);
    }

    const data = await response.json() as { template: any };
    
    // If it's a local template, return null to use local cache
    if (data.template.is_local) {
      return null;
    }
    
    return data.template;
  } catch (error) {
    console.error(`Error fetching template ${templateId}:`, error);
    return null;
  }
}

// Detect current IDE
async function detectCurrentIDE(targetPath: string): Promise<string> {
  const checks = [
    { file: ".cursorrules", ide: "cursor" },
    { file: ".windsurfrules", ide: "windsurf" },
    { file: ".claude/CLAUDE.md", ide: "claude-code" },
    { file: ".gemini/rules.md", ide: "gemini-cli" },
    { file: ".kiro/prompts.md", ide: "kiro" },
  ];

  for (const check of checks) {
    try {
      await fs.stat(path.join(targetPath, check.file));
      return check.ide;
    } catch {
      // Continue checking
    }
  }

  return "cursor"; // Default to cursor
}

// Get rule file path for IDE
function getRuleFilePath(ide: string, basePath: string): string {
  const paths: Record<string, string> = {
    cursor: ".cursorrules",
    windsurf: ".windsurfrules",
    "claude-code": ".claude/CLAUDE.md",
    "gemini-cli": ".gemini/rules.md",
    kiro: ".kiro/prompts.md",
  };

  return path.join(basePath, paths[ide] || ".cursorrules");
}

// Format content for specific IDE
function formatContentForIDE(content: string, ide: string): string {
  if (ide === "claude-code") {
    // Claude prefers markdown headers
    return `# Project Rules\n\n${content}`;
  } else if (ide === "gemini-cli") {
    // Gemini CLI format
    return `# Gemini CLI Rules\n\n${content}`;
  }
  
  // Default format for cursor, windsurf, kiro
  return content;
}

export async function handleAddTemplateRule(
  request: CallToolRequest
): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    const params = AddTemplateRuleSchema.parse(request.params.arguments);
    const { templateId, category, targetPath = process.cwd() } = params;

    // Detect current IDE
    const currentIDE = await detectCurrentIDE(targetPath);
    const ruleFilePath = getRuleFilePath(currentIDE, targetPath);

    // Ensure directory exists
    const ruleDir = path.dirname(ruleFilePath);
    await fs.mkdir(ruleDir, { recursive: true });

    // Check if rule file exists
    let existingContent = "";
    try {
      existingContent = await fs.readFile(ruleFilePath, "utf-8");
    } catch {
      // File doesn't exist, that's okay
    }

    let template = null;
    let source = "local";

    // If specific templateId provided
    if (templateId) {
      // First check local templates
      template = localTemplates[templateId];
      
      // If not found locally, fetch from server
      if (!template) {
        template = await fetchRemoteTemplate(templateId);
        source = "remote";
      }
      
      if (!template) {
        return {
          content: [{
            type: "text",
            text: `❌ Template '${templateId}' not found in local cache or remote server.`
          }]
        };
      }
    } else {
      // Find templates by category/projectType (only from local for now)
      const matches: string[] = [];
      
      if (category && localCategories[category as keyof typeof localCategories]) {
        matches.push(...localCategories[category as keyof typeof localCategories]);
      }
      
      if (matches.length === 0) {
        return {
          content: [{
            type: "text",
            text: "❌ No matching templates found. Please specify a templateId or valid category."
          }]
        };
      }
      
      // Use first match
      template = localTemplates[matches[0]];
    }

    // Format and add template content
    const formattedContent = formatContentForIDE(template.content, currentIDE);
    const newRules = `\n\n# Template: ${template.name}\n${formattedContent}`;

    // Combine with existing content
    const finalContent = existingContent 
      ? `${existingContent}\n\n# === Added Templates ===\n${newRules}`
      : newRules.trim();

    // Write the combined content
    await fs.writeFile(ruleFilePath, finalContent, "utf-8");

    // Log template usage to server (for both local and remote templates)
    try {
      await fetch(`${API_BASE_URL}/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.name,
          source: source,
          ide: currentIDE
        })
      });
    } catch (error) {
      // Don't fail if logging fails
      console.error('Failed to log template usage:', error);
    }

    return {
      content: [{
        type: "text",
        text: `✅ Successfully added template '${template.name}' to ${ruleFilePath}

Source: ${source === "local" ? "Local cache (npm package)" : "Remote server"}
IDE detected: ${currentIDE}

The rules have been formatted and added to your project.`
      }]
    };

  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `❌ Error adding template rules: ${error instanceof Error ? error.message : String(error)}`
      }]
    };
  }
}

// Helper function to get emoji for category
function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    framework: "🏗️",
    language: "💬",
    backend: "⚙️",
    style: "🎨",
    tool: "🔧",
    mobile: "📱",
    extension: "🧩",
    workflow: "🔄",
    game: "🎮",
    composite: "🔗",
    other: "📋"
  };
  return emojiMap[category] || "📋";
}

// Helper function to format template names
function formatTemplateName(name: string): string {
  // Remove common suffixes
  let formatted = name
    .replace(/-cursorrules-prompt-file$/, "")
    .replace(/-cursorrules-prompt$/, "")
    .replace(/-cursorrules-prom$/, "")
    .replace(/-cursorrules$/, "");
  
  // Convert to title case with spaces
  formatted = formatted
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return formatted;
}

// List all available templates (local + remote)
export async function handleListTemplates(): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    let output = "📚 Available Template Rules:\n\n";
    
    // Show local templates first
    output += "## 🏠 Local Templates (Fast & Offline Access)\n";
    output += "_These templates are bundled with the npm package for instant access_\n\n";
    
    const localCount = Object.keys(localTemplates).length;
    output += `📦 **${localCount} templates available locally**\n\n`;
    
    for (const [category, templateNames] of Object.entries(localCategories)) {
      const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
      output += `### ${getCategoryEmoji(category)} ${categoryTitle}\n`;
      
      for (const name of templateNames) {
        const template = localTemplates[name];
        if (template) {
          const lines = template.content.split('\n').length;
          const displayName = formatTemplateName(name);
          output += `  • **${displayName}** - ${lines} lines\n`;
        }
      }
      output += '\n';
    }

    // Fetch and show remote templates
    const remoteTemplates = await fetchRemoteTemplates();
    
    if (remoteTemplates) {
      output += "## ☁️ Remote Templates (Server):\n\n";
      
      // Sort categories for better organization
      const sortedCategories = Object.entries(remoteTemplates).sort(([a], [b]) => {
        const order = ['framework', 'language', 'backend', 'style', 'tool', 'mobile', 'extension', 'workflow', 'game', 'other'];
        return order.indexOf(a) - order.indexOf(b);
      });
      
      for (const [category, templates] of sortedCategories) {
        const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
        const templateList = templates as any[];
        
        // Skip empty categories
        if (templateList.length === 0) continue;
        
        output += `### ${getCategoryEmoji(category)} ${categoryTitle} (${templateList.length} templates)\n`;
        
        // Sort templates by popularity
        const sortedTemplates = templateList.sort((a, b) => b.usage_count - a.usage_count);
        
        for (const template of sortedTemplates) {
          // Format template name for better readability
          const displayName = formatTemplateName(template.name);
          
          // Build status indicators
          const indicators = [];
          if (template.is_local) indicators.push("📦");
          if (template.usage_count > 100) indicators.push("🔥");
          if (template.is_premium) indicators.push("💎");
          if (template.usage_count > 500) indicators.push("⭐");
          
          const statusIcons = indicators.length > 0 ? ` ${indicators.join(" ")}` : "";
          
          // Format description (truncate if too long)
          const description = template.description ? 
            (template.description.length > 60 ? 
              template.description.substring(0, 57) + "..." : 
              template.description) : "";
          
          output += `  • **${displayName}**${statusIcons}\n`;
          output += `    📊 ${template.lines} lines | 👥 Used ${template.usage_count}x\n`;
          if (description) {
            output += `    💡 ${description}\n`;
          }
          output += '\n';
        }
      }
      
      output += "\n### 📖 Legend:\n";
      output += "- 📦 Available locally (faster loading)\n";
      output += "- 🔥 Popular template (100+ uses)\n";
      output += "- ⭐ Super popular (500+ uses)\n";
      output += "- 💎 Premium template\n";
    } else {
      output += "\n⚠️ Could not fetch remote templates. Showing local templates only.\n";
    }

    output += "\n---\n\n";
    output += "## 💡 How to Use Templates\n\n";
    output += "### Quick Start Examples:\n\n";
    output += "```javascript\n";
    output += "// 1. Add a popular React template\n";
    output += "add_template_rule({ templateId: \"react\" })\n\n";
    output += "// 2. Add all framework templates (local only)\n";
    output += "add_template_rule({ category: \"framework\" })\n\n";
    output += "// 3. Add a specific remote template\n";
    output += "add_template_rule({ templateId: \"flutter-app-expert\" })\n\n";
    output += "// 4. Add to specific project path\n";
    output += "add_template_rule({ \n";
    output += "  templateId: \"typescript\",\n";
    output += "  targetPath: \"/path/to/project\"\n";
    output += "})\n";
    output += "```\n\n";
    output += "💡 **Pro Tip:** Local templates load instantly without network access!";

    return {
      content: [{
        type: "text",
        text: output
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `❌ Error listing templates: ${error instanceof Error ? error.message : String(error)}`
      }]
    };
  }
}