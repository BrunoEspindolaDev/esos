const { analyzeText } = require('@utils/functions');

describe('Functions Utils', () => {
  describe('analyzeText', () => {
    const mockTerms = ['bad', 'evil', 'horrible'];

    it('should return empty array when text contains no invalid terms', () => {
      const text = 'This is a good message';
      const result = analyzeText(text, mockTerms);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should return invalid terms when text contains them', () => {
      const text = 'This is a bad message';
      const result = analyzeText(text, mockTerms);

      expect(result).toContain('bad');
      expect(result.length).toBe(1);
    });

    it('should return multiple invalid terms when text contains them', () => {
      const text = 'This is a bad and evil message';
      const result = analyzeText(text, mockTerms);

      expect(result).toContain('bad');
      expect(result).toContain('evil');
      expect(result.length).toBe(2);
    });

    it('should be case insensitive', () => {
      const text = 'This is a BAD message';
      const result = analyzeText(text, mockTerms);

      expect(result).toContain('bad');
      expect(result.length).toBe(1);
    });

    it('should handle empty text', () => {
      const text = '';
      const result = analyzeText(text, mockTerms);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should handle empty invalid terms array', () => {
      const text = 'This is a bad message';
      const result = analyzeText(text, []);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should handle terms as part of larger words', () => {
      const text = 'This is a badger message';
      const result = analyzeText(text, mockTerms);

      expect(result).toContain('bad');
    });

    it('should handle repeated terms', () => {
      const text = 'bad bad bad';
      const result = analyzeText(text, mockTerms);

      expect(result).toContain('bad');
      expect(result.length).toBe(1); // Should not duplicate
    });

    it('should handle mixed case in invalid terms', () => {
      const mixedTerms = ['Bad', 'EVIL', 'horrible'];
      const text = 'This is a bad message';
      const result = analyzeText(text, mixedTerms);

      expect(result).toContain('Bad');
      expect(result.length).toBe(1);
    });

    it('should handle null or undefined text gracefully', () => {
      expect(() => analyzeText(null, mockTerms)).toThrow();
      expect(() => analyzeText(undefined, mockTerms)).toThrow();
    });
  });
});
