export declare class ShareCodeGenerator {
    private readonly charset;
    generate(): string;
    private randomString;
    validate(shareCode: string): boolean;
}
export declare class PasswordGenerator {
    private readonly words;
    private readonly symbols;
    generate(): string;
    private getRandomElement;
}
//# sourceMappingURL=generators.d.ts.map