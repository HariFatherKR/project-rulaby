export interface IDEConfig {
    name: string;
    ruleFiles: string[];
    detectPatterns: string[];
}
export interface DetectedRule {
    ide: string;
    filePath: string;
    content: string;
    fileSize: number;
}
export declare class RuleDetector {
    private static readonly IDE_CONFIGS;
    static detectCurrentIDE(): Promise<string>;
    static findRuleFiles(ide?: string): Promise<DetectedRule[]>;
    static getIDEConfig(ide: string): IDEConfig | undefined;
}
//# sourceMappingURL=ruleDetector.d.ts.map