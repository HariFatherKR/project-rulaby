export class ShareCodeGenerator {
  // Avoid confusing characters: no I, O, 0, 1
  private readonly charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  
  generate(): string {
    const part1 = this.randomString(4);
    const part2 = this.randomString(4);
    return `RULABY-${part1}-${part2}`;
  }
  
  private randomString(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * this.charset.length);
      result += this.charset[randomIndex];
    }
    return result;
  }
  
  validate(shareCode: string): boolean {
    const pattern = /^RULABY-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return pattern.test(shareCode);
  }
}

export class PasswordGenerator {
  private readonly words = [
    'Thunder', 'Storm', 'Crystal', 'Phoenix', 'Dragon',
    'Shadow', 'Blaze', 'Frost', 'Lightning', 'Mystic',
    'Cosmic', 'Nebula', 'Quantum', 'Cipher', 'Matrix'
  ];
  
  private readonly symbols = ['!', '@', '#', '$', '%', '&', '*', '+'];
  
  generate(): string {
    // Select two random words
    const word1 = this.getRandomElement(this.words);
    let word2 = this.getRandomElement(this.words);
    
    // Ensure different words
    while (word2 === word1) {
      word2 = this.getRandomElement(this.words);
    }
    
    // Generate random number between 10-99
    const number = Math.floor(Math.random() * 90) + 10;
    
    // Select random symbol
    const symbol = this.getRandomElement(this.symbols);
    
    // Combine elements
    return `${word1}${symbol}${word2}${number}`;
  }
  
  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}