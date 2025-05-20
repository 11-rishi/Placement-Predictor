import { 
  aptitudeQuestionPool, 
  codingQuestionPool, 
  interviewQuestionPool, 
  hrQuestionPool,
  getQuestionsForCompany,
  getAnswerKey 
} from './testQuestions';

// Store test history in localStorage
const saveTestHistory = async (testData) => {
  try {
    const { type, companyName, answers, score } = testData;
    const questions = getQuestionsForCompany(companyName, type);
    const answerKey = getAnswerKey(questions);

    const testHistory = {
      type,
      companyName,
      date: new Date().toISOString(),
      score,
      answers: answers,
      answerKey: answerKey
    };

    // Save to localStorage for now
    const existingHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
    existingHistory.push(testHistory);
    localStorage.setItem('testHistory', JSON.stringify(existingHistory));

    return testHistory;
  } catch (error) {
    console.error('Error saving test history:', error);
    throw error;
  }
};

const getTestHistory = () => {
  try {
    const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
    return history;
  } catch (error) {
    console.error('Error getting test history:', error);
    return [];
  }
};

export const clearTestHistory = () => {
  try {
    localStorage.removeItem('testHistory');
  } catch (error) {
    console.error('Error clearing test history:', error);
  }
};

// Generate new questions for revisits
const generateNewQuestions = (type) => {
  if (type === 'tech') {
    // Shuffle and select new aptitude questions
    const shuffledAptitude = [...aptitudeQuestionPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    // Shuffle and select new coding questions
    const shuffledCoding = [...codingQuestionPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return {
      aptitude: shuffledAptitude,
      coding: shuffledCoding
    };
  } else {
    // Shuffle and select new interview and HR questions
    const shuffledInterview = [...interviewQuestionPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const shuffledHR = [...hrQuestionPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    return {
      interview: shuffledInterview,
      hr: shuffledHR
    };
  }
};

// Get questions for a company, always generating new ones
const getCompanyQuestions = (companyName, type) => {
  // Always get new questions for each test attempt
  return getQuestionsForCompany(companyName, type);
};

export {
  saveTestHistory,
  getTestHistory,
  getCompanyQuestions
}; 