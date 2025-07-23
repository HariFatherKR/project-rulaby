import { UniversalRuleFormat } from './ruleParser.js';
export interface ConvertedRule {
    ide: string;
    files: Array<{
        path: string;
        content: string;
    }>;
}
export declare class RuleConverter {
    static fromURF(urf: UniversalRuleFormat, targetIDE: string): ConvertedRule;
    private static toCursor;
    private static toWindsurf;
    private static toClaudeCode;
    private static toGeminiCLI;
    private static toKiro;
}
//# sourceMappingURL=ruleConverter.d.ts.map