class EvaluationModel {
  constructor() {
    this.isModelLoaded = true; // Always loaded since we're using rule-based evaluation
  }

  preprocessText(text) {
    // Basic text preprocessing
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  calculateSimilarity(text1, text2) {
    const words1 = this.preprocessText(text1);
    const words2 = this.preprocessText(text2);
    
    // Calculate Jaccard similarity
    const intersection = new Set([...words1].filter(x => words2.includes(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  evaluateAptitudeAnswer(userAnswer, correctAnswer) {
    // For aptitude questions, we can use exact matching
    return userAnswer === correctAnswer;
  }

  evaluateCodingAnswer(code, testCases) {
    // For coding questions, we'll use the Judge0 API results
    return testCases.every(testCase => testCase.success);
  }

  evaluateNonTechAnswer(userAnswer, expectedPoints) {
    // Rule-based evaluation with improved similarity checking
    const coveredPoints = expectedPoints.filter(point => {
      const similarity = this.calculateSimilarity(userAnswer, point);
      // Consider a point covered if similarity is above threshold
      return similarity > 0.7;
    });

    // Calculate score based on covered points
    const score = coveredPoints.length / expectedPoints.length;

    return {
      score,
      coveredPoints,
      missingPoints: expectedPoints.filter(point => !coveredPoints.includes(point))
    };
  }

  evaluateAnswer(questionType, userAnswer, correctAnswer, expectedPoints = []) {
    switch (questionType) {
      case 'aptitude':
        return this.evaluateAptitudeAnswer(userAnswer, correctAnswer);
      
      case 'coding':
        return this.evaluateCodingAnswer(userAnswer, correctAnswer);
      
      case 'non-tech':
        return this.evaluateNonTechAnswer(userAnswer, expectedPoints);
      
      default:
        throw new Error('Invalid question type');
    }
  }
}

export default new EvaluationModel(); 