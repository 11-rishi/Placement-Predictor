const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';

const LANGUAGES = {
  python3: 71,
  java: 62,
  cpp: 54
};

// Helper function to format code based on language
const formatCode = (code, language) => {
  switch (language) {
    case 'python3':
      return code;
    case 'java':
      // Add main class if not present
      if (!code.includes('public class Main')) {
        return `public class Main {
    public static void main(String[] args) {
        ${code}
    }
}`;
      }
      return code;
    case 'cpp':
      // Add main function if not present
      if (!code.includes('int main()')) {
        return `#include <iostream>
using namespace std;

int main() {
    ${code}
    return 0;
}`;
      }
      return code;
    default:
      return code;
  }
};

// Helper function to parse output based on language
const parseOutput = (output, language) => {
  try {
    // Remove any extra whitespace and newlines
    output = output.trim();
    
    // Try to parse as JSON if it looks like JSON
    if (output.startsWith('{') || output.startsWith('[')) {
      return JSON.parse(output);
    }
    
    // For Python, try to evaluate if it's a number or boolean
    if (language === 'python3') {
      if (output === 'True') return true;
      if (output === 'False') return false;
      if (!isNaN(output)) return Number(output);
    }
    
    return output;
  } catch (error) {
    return output;
  }
};

const runCode = async (sourceCode, language, testCases) => {
  try {
    console.log('Starting code execution with:', {
      language,
      testCases,
      apiKey: process.env.REACT_APP_RAPIDAPI_KEY ? 'Present' : 'Missing'
    });

    if (!process.env.REACT_APP_RAPIDAPI_KEY) {
      throw new Error('RapidAPI key is missing. Please check your .env file.');
    }

    const results = [];
    let passedTests = 0;

    // Format the code based on language
    const formattedCode = formatCode(sourceCode, language);
    console.log('Formatted code:', formattedCode);

    // Run each test case
    for (const testCase of testCases) {
      try {
        console.log('Processing test case:', testCase);

        // Create submission
        const submissionResponse = await fetch(`${JUDGE0_API_URL}/submissions`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          },
          body: JSON.stringify({
            source_code: formattedCode,
            language_id: LANGUAGES[language],
            stdin: JSON.stringify(testCase.input),
            cpu_time_limit: 5, // 5 seconds
            memory_limit: 128 // 128MB
          })
        });

        if (!submissionResponse.ok) {
          const errorText = await submissionResponse.text();
          console.error('Submission failed:', {
            status: submissionResponse.status,
            statusText: submissionResponse.statusText,
            error: errorText
          });
          throw new Error(`Failed to submit code: ${submissionResponse.statusText}`);
        }

        const { token } = await submissionResponse.json();
        console.log('Submission token:', token);

        // Wait for results with timeout
        let result;
        let attempts = 0;
        const maxAttempts = 10; // 10 seconds timeout

        do {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const response = await fetch(`${JUDGE0_API_URL}/submissions/${token}`, {
            headers: {
              'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Result fetch failed:', {
              status: response.status,
              statusText: response.statusText,
              error: errorText
            });
            throw new Error(`Failed to get results: ${response.statusText}`);
          }
          
          result = await response.json();
          console.log('Execution status:', result.status);
          attempts++;
        } while (result.status.id <= 2 && attempts < maxAttempts);

        // Process results
        if (result.status.id === 3) {
          const output = parseOutput(result.stdout, language);
          const expectedOutput = testCase.output;
          const success = JSON.stringify(output) === JSON.stringify(expectedOutput);
          
          console.log('Test case result:', {
            output,
            expected: expectedOutput,
            success
          });

          if (success) passedTests++;

          results.push({
            input: testCase.input,
            output: output,
            expected: expectedOutput,
            success: success,
            error: null
          });
        } else {
          const error = result.stderr || result.compile_output || 'Unknown error';
          console.error('Execution failed:', error);
          results.push({
            input: testCase.input,
            output: null,
            expected: testCase.output,
            success: false,
            error: error
          });
        }
      } catch (error) {
        console.error('Error processing test case:', error);
        results.push({
          input: testCase.input,
          output: null,
          expected: testCase.output,
          success: false,
          error: error.message || 'Failed to process test case'
        });
      }
    }

    console.log('Final results:', {
      success: passedTests === testCases.length,
      passedTests,
      totalTests: testCases.length
    });

    return {
      success: passedTests === testCases.length,
      results: results,
      passedTests: passedTests,
      totalTests: testCases.length
    };
  } catch (error) {
    console.error('Code execution error:', error);
    return {
      success: false,
      results: [],
      passedTests: 0,
      totalTests: testCases.length,
      error: error.message || 'Failed to execute code. Please try again.'
    };
  }
};

export default runCode; 