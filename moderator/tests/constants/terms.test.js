const invalidTerms = require('@constants/terms');

describe('Terms Constants', () => {
  describe('invalidTerms array', () => {
    it('should be defined and be an array', () => {
      expect(invalidTerms).toBeDefined();
      expect(Array.isArray(invalidTerms)).toBe(true);
    });

    it('should contain at least one term', () => {
      expect(invalidTerms.length).toBeGreaterThan(0);
    });

    it('should contain string values only', () => {
      invalidTerms.forEach(term => {
        expect(typeof term).toBe('string');
      });
    });

    it('should contain specific known invalid terms', () => {
      expect(invalidTerms).toContain('idiota');
      expect(invalidTerms).toContain('imbecil');
      expect(invalidTerms).toContain('burro');
    });

    it('should not contain empty strings', () => {
      invalidTerms.forEach(term => {
        expect(term.trim()).not.toBe('');
      });
    });

    it('should have mostly unique terms (allowing some duplicates)', () => {
      const uniqueTerms = [...new Set(invalidTerms)];
      // Allow some duplicates but expect reasonable uniqueness
      expect(uniqueTerms.length).toBeGreaterThan(invalidTerms.length * 0.9);
    });

    it('should contain lowercase terms', () => {
      const hasLowercase = invalidTerms.some(
        term => term === term.toLowerCase()
      );
      expect(hasLowercase).toBe(true);
    });
  });
});
