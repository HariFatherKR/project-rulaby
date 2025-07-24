import { DetectedRule } from "./ruleDetector.js";
export interface UniversalRuleFormat {
    version: "1.0";
    metadata: {
        sourceIDE: string;
        created: string;
        totalSize: number;
        fileCount: number;
    };
    rules: {
        general: string[];
        codeStyle: string[];
        behavior: string[];
        projectSpecific: string[];
        raw: string;
    };
}
export declare class RuleParser {
    static parseToURF(detectedRules: DetectedRule[]): Promise<UniversalRuleFormat>;
    private static parseRulesByIDE;
    private static isCodeStyleRule;
    private static isBehaviorRule;
    private static isProjectSpecificRule;
}
//# sourceMappingURL=ruleParser.d.ts.map