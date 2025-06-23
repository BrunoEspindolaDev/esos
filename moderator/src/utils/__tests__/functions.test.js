const { analyzeText } = require('../functions');

describe('analyzeText', () => {
  it('should return empty if no terms', () => {
    expect(analyzeText('hello', [])).toEqual([]);
  });
  it('should find invalid terms (case insensitive)', () => {
    expect(analyzeText('badword', ['badword'])).toEqual(['badword']);
    expect(analyzeText('BADWORD', ['badword'])).toEqual(['badword']);
    expect(analyzeText('badword', ['BADWORD'])).toEqual(['BADWORD']);
  });
  it('should return multiple matches', () => {
    expect(analyzeText('foo bar', ['foo', 'bar'])).toEqual(['foo', 'bar']);
  });
});
