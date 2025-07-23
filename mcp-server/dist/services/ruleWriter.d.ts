import { ConvertedRule } from "./ruleConverter.js";
export declare class RuleWriter {
    static writeRules(convertedRule: ConvertedRule, customPath?: string): Promise<void>;
    private static ensureDirectory;
    static backupExistingRules(ide: string, customPath?: string): Promise<void>;
    private static getRuleFilesByIDE;
}
//# sourceMappingURL=ruleWriter.d.ts.map