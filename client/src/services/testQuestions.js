// Question pool for different types of questions
const aptitudeQuestionPool = [
  {
    id: 'apt1',
    type: 'aptitude',
    difficulty: 'easy',
    question: 'What is the time complexity of binary search?',
    options: [
      'O(1)',
      'O(log n)',
      'O(n)',
      'O(n log n)'
    ],
    answer: 'O(log n)',
    explanation: 'Binary search divides the search interval in half each time, making it O(log n).'
  },
  {
    id: 'apt2',
    type: 'aptitude',
    difficulty: 'medium',
    question: 'Which of the following is NOT a valid sorting algorithm?',
    options: [
      'Quick Sort',
      'Bubble Sort',
      'Merge Sort',
      'Stack Sort'
    ],
    answer: 'Stack Sort',
    explanation: 'Stack Sort is not a valid sorting algorithm. The other options are well-known sorting algorithms.'
  },
  {
    id: 'apt3',
    type: 'aptitude',
    difficulty: 'medium',
    question: 'What is the output of the following code?\n\nint x = 5;\nint y = x++ + ++x;\ncout << y;',
    options: [
      '10',
      '11',
      '12',
      '13'
    ],
    answer: '12',
    explanation: 'x++ returns 5 and increments x to 6. ++x increments x to 7 and returns 7. So y = 5 + 7 = 12.'
  },
  {
    id: 'apt4',
    type: 'aptitude',
    difficulty: 'hard',
    question: 'Which data structure would be most efficient for implementing a priority queue?',
    options: [
      'Array',
      'Linked List',
      'Binary Heap',
      'Stack'
    ],
    answer: 'Binary Heap',
    explanation: 'Binary Heap provides O(log n) time complexity for both insertion and deletion, making it ideal for priority queues.'
  },
  {
    id: 'apt5',
    type: 'aptitude',
    difficulty: 'medium',
    question: 'What is the time complexity of finding the maximum element in an unsorted array?',
    options: [
      'O(1)',
      'O(log n)',
      'O(n)',
      'O(n log n)'
    ],
    answer: 'O(n)',
    explanation: 'We need to scan through each element once to find the maximum, making it O(n).'
  },
  {
    id: 'apt6',
    type: 'aptitude',
    difficulty: 'hard',
    question: 'Which of the following is true about a binary search tree?',
    options: [
      'All nodes in the left subtree are greater than the root',
      'All nodes in the right subtree are less than the root',
      'The left subtree of a node contains only nodes with keys less than the node\'s key',
      'The right subtree of a node contains only nodes with keys greater than the node\'s key'
    ],
    answer: 'The left subtree of a node contains only nodes with keys less than the node\'s key',
    explanation: 'In a binary search tree, all nodes in the left subtree must be less than the root, and all nodes in the right subtree must be greater than the root.'
  },
  {
    id: 'apt7',
    type: 'aptitude',
    difficulty: 'medium',
    question: 'What is the space complexity of a recursive implementation of Fibonacci sequence?',
    options: [
      'O(1)',
      'O(n)',
      'O(2^n)',
      'O(n log n)'
    ],
    answer: 'O(2^n)',
    explanation: 'The recursive implementation of Fibonacci has exponential space complexity due to the call stack.'
  },
  {
    id: 'apt8',
    type: 'aptitude',
    difficulty: 'hard',
    question: 'Which of the following is NOT a valid application of a stack?',
    options: [
      'Function call management',
      'Expression evaluation',
      'Graph traversal',
      'Undo operations'
    ],
    answer: 'Graph traversal',
    explanation: 'Graph traversal is typically implemented using queues (BFS) or recursion (DFS), not stacks.'
  },
  {
    id: 'apt9',
    type: 'aptitude',
    difficulty: 'medium',
    question: 'What is the time complexity of inserting an element at the beginning of an array?',
    options: [
      'O(1)',
      'O(log n)',
      'O(n)',
      'O(n log n)'
    ],
    answer: 'O(n)',
    explanation: 'Inserting at the beginning requires shifting all existing elements, making it O(n).'
  },
  {
    id: 'apt10',
    type: 'aptitude',
    difficulty: 'hard',
    question: 'Which of the following is true about a hash table?',
    options: [
      'It always provides O(1) time complexity for all operations',
      'It can have collisions which affect performance',
      'It requires the keys to be sorted',
      'It cannot store duplicate keys'
    ],
    answer: 'It can have collisions which affect performance',
    explanation: 'Hash tables can have collisions which may degrade performance to O(n) in worst case.'
  }
];

const codingQuestionPool = [
  {
    id: 'code3',
    type: 'coding-theory',
    difficulty: 'easy',
    title: 'Code Output Prediction',
    description: `What will be the output of the following JavaScript code?\n\nconst arr = [1, 2, 3];\narr.push(arr);\nconsole.log(arr.length);`,
    options: ['3', '4', 'undefined', 'Error'],
    answer: '4',
    explanation: 'arr.push(arr) adds the array itself as the last element, so the length becomes 4.'
  },
  {
    id: 'code4',
    type: 'coding-theory',
    difficulty: 'medium',
    title: 'Bug Finding',
    description: `What is the bug in the following Python function?\n\ndef add_items(items=[]):\n    items.append(1)\n    return items`,
    options: [
      'The function does not return anything',
      'The default argument items=[] is mutable and shared across calls.',
      'Syntax error in function definition',
      'items.append(1) will throw an error'
    ],
    answer: 'The default argument items=[] is mutable and shared across calls.',
    explanation: 'Default mutable arguments retain changes between function calls.'
  },
  {
    id: 'code5',
    type: 'coding-theory',
    difficulty: 'easy',
    title: 'Time Complexity',
    description: `What is the time complexity of the following Java code?\n\nfor (int i = 1; i < n; i *= 2) {\n    // some code\n}`,
    options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
    answer: 'O(log n)',
    explanation: 'The loop variable doubles each time, so it runs log₂(n) times.'
  },
  {
    id: 'code6',
    type: 'coding-theory',
    difficulty: 'easy',
    title: 'Fill in the Blank',
    description: `Fill in the blank to swap two integers a and b in C++:\n\nint temp = a;\na = _______;\nb = temp;`,
    options: ['a', 'b', 'temp', 'swap'],
    answer: 'b',
    explanation: 'a = b; is the correct line.'
  },
  {
    id: 'code7',
    type: 'coding-theory',
    difficulty: 'medium',
    title: 'Pseudocode/Algorithm Design',
    description: `Which of the following pseudocode snippets correctly reverses a singly linked list?`,
    options: [
      'prev = null; current = head; while current: next = current.next; current.next = prev; prev = current; current = next; return prev',
      'current = head; while current: current = current.next; return head',
      'prev = head; while prev: prev = prev.next; return prev',
      'current = head; prev = null; while current: current.next = null; current = current.next; return prev'
    ],
    answer: 'prev = null; current = head; while current: next = current.next; current.next = prev; prev = current; current = next; return prev',
    explanation: 'This is the standard algorithm for reversing a singly linked list.'
  }
];

const interviewQuestionPool = [
  {
    id: 'int1',
    type: 'interview',
    difficulty: 'medium',
    question: 'Explain the concept of virtual memory in operating systems.',
    expectedPoints: [
      'Definition of virtual memory',
      'How virtual memory works',
      'Benefits of virtual memory',
      'Page replacement algorithms',
      'Memory management'
    ],
    sampleAnswer: `Virtual memory is a memory management technique that provides an "idealized abstraction of the storage resources that are actually available on a given machine." It creates the illusion of a very large (main) memory.

How it works:
1. The system divides memory into pages
2. Each process has its own virtual address space
3. The OS maps virtual addresses to physical addresses
4. Pages can be swapped to disk when not in use

Benefits:
- Allows programs to use more memory than physically available
- Provides memory protection
- Enables efficient memory sharing
- Simplifies memory management

Common page replacement algorithms include:
- FIFO (First In First Out)
- LRU (Least Recently Used)
- Clock algorithm

Memory management involves:
- Page table management
- Page fault handling
- Memory allocation and deallocation
- Swapping`
  }
];

const hrQuestionPool = [
  {
    id: 'hr1',
    type: 'hr',
    difficulty: 'medium',
    question: 'How do you handle conflicts in a team environment?',
    expectedPoints: [
      'Conflict identification',
      'Communication approach',
      'Problem-solving strategy',
      'Team collaboration',
      'Learning from conflicts'
    ],
    sampleAnswer: `When handling team conflicts, I follow a structured approach:

1. Identify the root cause:
   - Listen to all parties involved
   - Understand different perspectives
   - Identify underlying issues

2. Communicate effectively:
   - Maintain professionalism
   - Use active listening
   - Focus on facts, not personalities
   - Encourage open dialogue

3. Problem-solving:
   - Brainstorm solutions together
   - Evaluate options objectively
   - Reach consensus
   - Implement agreed solutions

4. Team collaboration:
   - Foster a positive environment
   - Encourage team building
   - Set clear expectations
   - Regular check-ins

5. Learning:
   - Document lessons learned
   - Implement preventive measures
   - Improve team processes
   - Share best practices`
  }
];

// Company-specific question pools
const companySpecificQuestions = {
  'Google': {
    aptitude: [
      {
        id: 'google-apt1',
        type: 'aptitude',
        difficulty: 'hard',
        question: 'What is the time complexity of finding all pairs of elements in an array whose sum equals a target value?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
        answer: 'O(n²)',
        explanation: 'Using a nested loop to check each pair requires O(n²) time.'
      },
      // Add more Google-specific aptitude questions
    ],
    coding: [
      {
        id: 'google-code1',
        type: 'coding-theory',
        difficulty: 'hard',
        title: 'Algorithm Design',
        description: 'Which approach would be most efficient for implementing PageRank?',
        options: [
          'Depth-first search with recursion',
          'Iterative matrix multiplication',
          'Breadth-first search with queue',
          'Dynamic programming with memoization'
        ],
        answer: 'Iterative matrix multiplication',
        explanation: 'PageRank is essentially an iterative algorithm using matrix operations.'
      },
      // Add more Google-specific coding questions
    ]
  },
  'Microsoft': {
    aptitude: [
      {
        id: 'ms-apt1',
        type: 'aptitude',
        difficulty: 'hard',
        question: 'What is the most efficient way to detect a cycle in a linked list?',
        options: [
          'Using a hash set to store visited nodes',
          'Using Floyd\'s cycle-finding algorithm',
          'Using a counter for each node',
          'Using recursive DFS'
        ],
        answer: 'Using Floyd\'s cycle-finding algorithm',
        explanation: 'Floyd\'s algorithm uses O(1) extra space and is optimal for cycle detection.'
      },
      // Add more Microsoft-specific aptitude questions
    ],
    coding: [
      {
        id: 'ms-code1',
        type: 'coding-theory',
        difficulty: 'hard',
        title: 'System Design',
        description: 'Which design pattern would be most appropriate for implementing a plugin system?',
        options: [
          'Singleton Pattern',
          'Factory Pattern',
          'Observer Pattern',
          'Strategy Pattern'
        ],
        answer: 'Factory Pattern',
        explanation: 'Factory Pattern allows for dynamic object creation and is ideal for plugin systems.'
      },
      // Add more Microsoft-specific coding questions
    ]
  }
  // Add more companies with their specific questions
};

// Get random questions from a pool
const getRandomQuestions = (pool, count) => {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Get questions for a specific company
export const getQuestionsForCompany = (companyName, type) => {
  // Check if company has specific questions
  const hasSpecificQuestions = companySpecificQuestions[companyName];
  
  if (hasSpecificQuestions) {
    // Mix company-specific questions with general pool
    if (type === 'tech') {
      const specificAptitude = hasSpecificQuestions.aptitude || [];
      const specificCoding = hasSpecificQuestions.coding || [];
      
      return {
        aptitude: getRandomQuestions([...specificAptitude, ...aptitudeQuestionPool], 5),
        coding: getRandomQuestions([...specificCoding, ...codingQuestionPool], 3)
      };
    } else {
      return {
        interview: getRandomQuestions(interviewQuestionPool, 3),
        hr: getRandomQuestions(hrQuestionPool, 2)
      };
    }
  } else {
    // Use general question pool for companies without specific questions
    if (type === 'tech') {
      return {
        aptitude: getRandomQuestions(aptitudeQuestionPool, 5),
        coding: getRandomQuestions(codingQuestionPool, 3)
      };
    } else {
      return {
        interview: getRandomQuestions(interviewQuestionPool, 3),
        hr: getRandomQuestions(hrQuestionPool, 2)
      };
    }
  }
};

// Function to get answer key for a specific test
export const getAnswerKey = (questions) => {
  return questions.map(q => ({
    question: q.question || q.title,
    answer: q.answer || q.solution || q.expectedPoints,
    explanation: q.explanation || q.sampleAnswer
  }));
};

export {
  aptitudeQuestionPool,
  codingQuestionPool,
  interviewQuestionPool,
  hrQuestionPool
}; 