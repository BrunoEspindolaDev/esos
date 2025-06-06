const analyzeText = (text, invalidTerms) => {
  const textLower = text.toLowerCase();
  const result = invalidTerms.filter(term =>
    textLower.includes(term.toLowerCase())
  );
  return result;
};

module.exports = {
  analyzeText
};
