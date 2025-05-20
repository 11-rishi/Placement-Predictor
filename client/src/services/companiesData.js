// Expanded real company and question data for demo purposes
export const companiesData = [
  {
    name: "Google",
    type: "tech",
    aptitude: [
      {
        question: "If the sum of two numbers is 30 and their difference is 10, what are the numbers?",
        answer: "20 and 10"
      },
      {
        question: "A train 100m long passes a man in 10 seconds. What is the speed of the train?",
        answer: "10 m/s"
      }
    ],
    coding: [
      {
        question: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
        answer: "Use a hashmap to store indices while iterating."
      },
      {
        question: "Implement a function to check if a string is a palindrome.",
        answer: "Compare string with its reverse."
      }
    ]
  },
  {
    name: "Amazon",
    type: "tech",
    aptitude: [
      {
        question: "A shopkeeper sells an item at a loss of 10%. If the selling price is Rs. 450, what was the cost price?",
        answer: "Rs. 500"
      },
      {
        question: "What is the next number in the series: 3, 9, 27, ?",
        answer: "81"
      }
    ],
    coding: [
      {
        question: "Find the first non-repeating character in a string.",
        answer: "Use a hashmap to count occurrences."
      },
      {
        question: "Reverse the words in a given sentence.",
        answer: "Split, reverse, and join the words."
      }
    ]
  },
  {
    name: "Microsoft",
    type: "tech",
    aptitude: [
      {
        question: "If 5x = 80, what is x?",
        answer: "16"
      },
      {
        question: "A car travels 60 km in 1.5 hours. What is its average speed?",
        answer: "40 km/h"
      }
    ],
    coding: [
      {
        question: "Check if a binary tree is balanced.",
        answer: "Check height difference for all nodes."
      },
      {
        question: "Find the intersection of two arrays.",
        answer: "Use sets or hashmaps."
      }
    ]
  },
  {
    name: "TCS",
    type: "tech",
    aptitude: [
      {
        question: "A can do a piece of work in 20 days, B in 30 days. In how many days will they complete the work together?",
        answer: "12 days"
      },
      {
        question: "What is the next number in the series: 2, 6, 12, 20, ?",
        answer: "30"
      }
    ],
    coding: [
      {
        question: "Write a program to reverse a linked list.",
        answer: "Iterate and reverse pointers."
      },
      {
        question: "Find the largest element in an array without using built-in functions.",
        answer: "Iterate and track max value."
      }
    ]
  },
  {
    name: "Infosys",
    type: "tech",
    aptitude: [
      {
        question: "If the average of 5 numbers is 20, what is their sum?",
        answer: "100"
      },
      {
        question: "What is 15% of 200?",
        answer: "30"
      }
    ],
    coding: [
      {
        question: "Find the factorial of a number.",
        answer: "Iterate or use recursion to multiply numbers."
      },
      {
        question: "Check if a number is prime.",
        answer: "Check divisibility up to sqrt(n)."
      }
    ]
  },
  {
    name: "Wipro",
    type: "tech",
    aptitude: [
      {
        question: "If a train travels 120 km in 2 hours, what is its speed?",
        answer: "60 km/h"
      },
      {
        question: "What is the square root of 144?",
        answer: "12"
      }
    ],
    coding: [
      {
        question: "Find the sum of all even numbers in an array.",
        answer: "Iterate and sum if even."
      },
      {
        question: "Check if a string contains only digits.",
        answer: "Use regex or isdigit."
      }
    ]
  },
  {
    name: "Capgemini",
    type: "tech",
    aptitude: [
      {
        question: "If a person walks 10 km in 2 hours, what is his speed?",
        answer: "5 km/h"
      },
      {
        question: "What is the cube of 3?",
        answer: "27"
      }
    ],
    coding: [
      {
        question: "Find the minimum value in an array.",
        answer: "Iterate and track min value."
      },
      {
        question: "Check if two strings are anagrams.",
        answer: "Sort and compare or use hashmap."
      }
    ]
  },
  {
    name: "Cognizant",
    type: "tech",
    aptitude: [
      {
        question: "If a rectangle has length 10 and width 5, what is its area?",
        answer: "50"
      },
      {
        question: "What is 25% of 80?",
        answer: "20"
      }
    ],
    coding: [
      {
        question: "Find the GCD of two numbers.",
        answer: "Use Euclidean algorithm."
      },
      {
        question: "Check if a year is a leap year.",
        answer: "Check divisibility by 4, 100, 400."
      }
    ]
  },
  {
    name: "IBM",
    type: "tech",
    aptitude: [
      {
        question: "If a box contains 5 red and 7 blue balls, what is the probability of picking a red ball?",
        answer: "5/12"
      },
      {
        question: "What is the value of pi (approx)?",
        answer: "3.14"
      }
    ],
    coding: [
      {
        question: "Reverse a string without using built-in functions.",
        answer: "Iterate from end to start."
      },
      {
        question: "Find the second largest number in an array.",
        answer: "Track two max values."
      }
    ]
  },
  {
    name: "HCL",
    type: "tech",
    aptitude: [
      {
        question: "If a car covers 150 km in 3 hours, what is its speed?",
        answer: "50 km/h"
      },
      {
        question: "What is the square of 13?",
        answer: "169"
      }
    ],
    coding: [
      {
        question: "Find the average of numbers in an array.",
        answer: "Sum and divide by count."
      },
      {
        question: "Check if a number is even or odd.",
        answer: "Check divisibility by 2."
      }
    ]
  },
  // Non-tech companies
  {
    name: "Deloitte",
    type: "non-tech",
    interview: [
      {
        question: "Tell me about yourself.",
        keywords: ["background", "skills", "experience"]
      },
      {
        question: "Why do you want to work at Deloitte?",
        keywords: ["company values", "growth", "opportunity"]
      }
    ],
    hr: [
      {
        question: "Describe a challenging situation and how you handled it.",
        keywords: ["challenge", "solution", "result"]
      },
      {
        question: "Where do you see yourself in 5 years?",
        keywords: ["career", "growth", "goals"]
      }
    ]
  },
  {
    name: "Accenture",
    type: "non-tech",
    interview: [
      {
        question: "What are your strengths and weaknesses?",
        keywords: ["strengths", "weaknesses", "improvement"]
      },
      {
        question: "Describe a time you worked in a team.",
        keywords: ["teamwork", "collaboration", "role"]
      }
    ],
    hr: [
      {
        question: "How do you handle stress and pressure?",
        keywords: ["stress", "pressure", "cope"]
      },
      {
        question: "Why should we hire you?",
        keywords: ["skills", "fit", "contribution"]
      }
    ]
  },
  {
    name: "EY",
    type: "non-tech",
    interview: [
      {
        question: "Why do you want to join EY?",
        keywords: ["values", "growth", "opportunity"]
      },
      {
        question: "Describe a difficult project you managed.",
        keywords: ["project", "challenge", "result"]
      }
    ],
    hr: [
      {
        question: "How do you prioritize your work?",
        keywords: ["prioritize", "tasks", "time management"]
      },
      {
        question: "What motivates you?",
        keywords: ["motivation", "goals", "drive"]
      }
    ]
  },
  {
    name: "KPMG",
    type: "non-tech",
    interview: [
      {
        question: "Tell me about a time you failed.",
        keywords: ["failure", "lesson", "improvement"]
      },
      {
        question: "Why consulting?",
        keywords: ["consulting", "problem solving", "client"]
      }
    ],
    hr: [
      {
        question: "How do you handle feedback?",
        keywords: ["feedback", "improve", "accept"]
      },
      {
        question: "What are your career aspirations?",
        keywords: ["career", "aspirations", "future"]
      }
    ]
  },
  {
    name: "PwC",
    type: "non-tech",
    interview: [
      {
        question: "Why should we hire you?",
        keywords: ["skills", "fit", "contribution"]
      },
      {
        question: "Describe a time you led a team.",
        keywords: ["leadership", "team", "result"]
      }
    ],
    hr: [
      {
        question: "How do you handle conflict at work?",
        keywords: ["conflict", "resolve", "communication"]
      },
      {
        question: "What is your greatest achievement?",
        keywords: ["achievement", "success", "goal"]
      }
    ]
  },
  // Add more tech companies
  {
    name: "Oracle",
    type: "tech",
    aptitude: [
      { question: "What is the sum of the first 10 natural numbers?", answer: "55" },
      { question: "What is the binary of 15?", answer: "1111" }
    ],
    coding: [
      { question: "Find the largest of three numbers.", answer: "Compare all three and return the largest." },
      { question: "Check if a string is a palindrome.", answer: "Compare string with its reverse." }
    ]
  },
  {
    name: "SAP",
    type: "tech",
    aptitude: [
      { question: "What is 20% of 250?", answer: "50" },
      { question: "What is the next prime after 7?", answer: "11" }
    ],
    coding: [
      { question: "Reverse an array.", answer: "Iterate and swap from ends." },
      { question: "Find the sum of digits of a number.", answer: "Iterate and add digits." }
    ]
  },
  {
    name: "Salesforce",
    type: "tech",
    aptitude: [
      { question: "What is the square of 15?", answer: "225" },
      { question: "What is the cube root of 27?", answer: "3" }
    ],
    coding: [
      { question: "Find the factorial of 5.", answer: "120" },
      { question: "Check if a number is even.", answer: "Check divisibility by 2." }
    ]
  },
  {
    name: "Adobe",
    type: "tech",
    aptitude: [
      { question: "What is 12 * 12?", answer: "144" },
      { question: "What is the value of pi (approx)?", answer: "3.14" }
    ],
    coding: [
      { question: "Find the minimum in an array.", answer: "Iterate and track min value." },
      { question: "Reverse a string.", answer: "Iterate from end to start." }
    ]
  },
  {
    name: "Apple",
    type: "tech",
    aptitude: [
      { question: "What is the next number in the series: 2, 4, 8, 16, ?", answer: "32" },
      { question: "What is 100 divided by 4?", answer: "25" }
    ],
    coding: [
      { question: "Find the average of numbers in an array.", answer: "Sum and divide by count." },
      { question: "Check if a number is odd.", answer: "Check divisibility by 2." }
    ]
  },
  // Add more non-tech companies
  {
    name: "KPMG",
    type: "non-tech",
    interview: [
      { question: "Describe your teamwork experience.", keywords: ["teamwork", "collaboration"] },
      { question: "How do you handle deadlines?", keywords: ["time management", "prioritization"] },
      { question: "Tell me about a time when you had to analyze complex data to make a decision.", keywords: ["analysis", "decision-making", "data"] },
      { question: "How do you approach problem-solving in a business context?", keywords: ["problem-solving", "business", "approach"] },
      { question: "Describe a situation where you had to present complex information to a non-technical audience.", keywords: ["presentation", "communication", "simplify"] },
      { question: "Tell me about a time when you identified a process improvement opportunity.", keywords: ["improvement", "process", "initiative"] }
    ],
    hr: [
      { question: "What motivates you?", keywords: ["motivation", "drive"] },
      { question: "How do you handle criticism?", keywords: ["feedback", "improvement"] },
      { question: "What are your long-term career goals?", keywords: ["career", "goals", "future"] },
      { question: "How do you handle stress in the workplace?", keywords: ["stress", "coping", "workplace"] },
      { question: "Tell me about a time when you failed and what you learned from it.", keywords: ["failure", "learning", "growth"] }
    ]
  },
  {
    name: "EY",
    type: "non-tech",
    interview: [
      { question: "Why EY?", keywords: ["values", "culture"] },
      { question: "Describe a time you solved a problem.", keywords: ["problem-solving", "initiative"] },
      { question: "How do you stay updated with industry trends and developments?", keywords: ["industry", "trends", "learning"] },
      { question: "Tell me about a time when you had to meet a tight deadline.", keywords: ["deadline", "pressure", "time management"] },
      { question: "Describe a project where you had to collaborate with multiple departments.", keywords: ["collaboration", "cross-functional", "teamwork"] },
      { question: "How do you approach risk assessment in your work?", keywords: ["risk", "assessment", "mitigation"] }
    ],
    hr: [
      { question: "How do you manage stress?", keywords: ["stress", "coping"] },
      { question: "What are your strengths?", keywords: ["strengths", "skills"] },
      { question: "How do you approach professional development?", keywords: ["development", "learning", "growth"] },
      { question: "What leadership style do you prefer?", keywords: ["leadership", "style", "management"] },
      { question: "How do you contribute to a positive team culture?", keywords: ["culture", "team", "positivity"] }
    ]
  },
  {
    name: "PwC",
    type: "non-tech",
    interview: [
      { question: "What makes you a good fit for PwC?", keywords: ["fit", "values"] },
      { question: "Describe a leadership experience.", keywords: ["leadership", "initiative"] },
      { question: "How do you handle competing priorities?", keywords: ["priorities", "time management", "organization"] },
      { question: "Describe a situation where you had to adapt to unexpected changes.", keywords: ["adaptability", "change", "flexibility"] },
      { question: "How do you ensure accuracy in your work?", keywords: ["accuracy", "quality", "attention to detail"] },
      { question: "Tell me about a time when you had to make a difficult business decision.", keywords: ["decision-making", "business", "challenge"] }
    ],
    hr: [
      { question: "How do you handle failure?", keywords: ["failure", "learning"] },
      { question: "What are your career goals?", keywords: ["goals", "ambition"] },
      { question: "What are your salary expectations?", keywords: ["salary", "compensation", "expectations"] },
      { question: "Why are you leaving your current position?", keywords: ["leaving", "current job", "motivation"] },
      { question: "How do you handle ambiguity in the workplace?", keywords: ["ambiguity", "uncertainty", "adaptability"] }
    ]
  },
  {
    name: "Accenture",
    type: "non-tech",
    interview: [
      { question: "Describe a successful project you worked on.", keywords: ["project", "success"] },
      { question: "How do you adapt to change?", keywords: ["adaptability", "flexibility"] },
      { question: "How do you approach cost-benefit analysis?", keywords: ["cost-benefit", "analysis", "decision-making"] },
      { question: "Describe a situation where you had to negotiate with stakeholders.", keywords: ["negotiation", "stakeholders", "communication"] },
      { question: "How do you measure success in your projects?", keywords: ["success", "metrics", "measurement"] },
      { question: "Tell me about a time when you had to work with limited resources.", keywords: ["resources", "constraints", "efficiency"] }
    ],
    hr: [
      { question: "What is your greatest achievement?", keywords: ["achievement", "success"] },
      { question: "How do you handle conflict?", keywords: ["conflict", "resolution"] },
      { question: "What professional values are most important to you?", keywords: ["values", "professional", "ethics"] },
      { question: "How do you approach networking and relationship building?", keywords: ["networking", "relationships", "communication"] },
      { question: "What questions do you have for us?", keywords: ["questions", "curiosity", "interest"] }
    ]
  },
  {
    name: "McKinsey",
    type: "non-tech",
    interview: [
      { question: "How do you ensure client satisfaction?", keywords: ["client", "satisfaction", "service"] },
      { question: "Describe a situation where you had to resolve a conflict within a team.", keywords: ["conflict", "resolution", "team"] },
      { question: "How do you approach strategic planning?", keywords: ["strategy", "planning", "long-term"] },
      { question: "Tell me about a time when you had to influence without authority.", keywords: ["influence", "authority", "persuasion"] },
      { question: "How do you ensure compliance with regulations in your work?", keywords: ["compliance", "regulations", "standards"] }
    ],
    hr: [
      { question: "How would your colleagues describe your working style?", keywords: ["working style", "colleagues", "perception"] },
      { question: "What aspects of this role interest you the most?", keywords: ["interest", "role", "motivation"] },
      { question: "How do you define success?", keywords: ["success", "definition", "achievement"] },
      { question: "What are your strengths and weaknesses?", keywords: ["strengths", "weaknesses", "self-awareness"] },
      { question: "How do you handle disagreements with superiors?", keywords: ["disagreement", "superiors", "communication"] }
    ]
  },
  {
    name: "Boston Consulting Group",
    type: "non-tech",
    interview: [
      { question: "Describe a situation where you had to deliver bad news to a client or stakeholder.", keywords: ["bad news", "communication", "client"] },
      { question: "How do you approach continuous improvement in your work?", keywords: ["improvement", "continuous", "development"] },
      { question: "Tell me about a time when you had to make a decision with incomplete information.", keywords: ["decision", "incomplete information", "uncertainty"] },
      { question: "How do you build relationships with clients?", keywords: ["relationships", "clients", "communication"] },
      { question: "Describe a situation where you had to manage a project from start to finish.", keywords: ["project management", "end-to-end", "execution"] }
    ],
    hr: [
      { question: "What do you know about our company culture?", keywords: ["culture", "company", "knowledge"] },
      { question: "How do you approach learning new skills?", keywords: ["learning", "skills", "development"] },
      { question: "What challenges are you looking for in this position?", keywords: ["challenges", "position", "growth"] },
      { question: "How do you prioritize your tasks?", keywords: ["prioritization", "tasks", "time management"] },
      { question: "What makes you unique as a candidate?", keywords: ["unique", "candidate", "differentiation"] }
    ]
  },
  {
    name: "Bain & Company",
    type: "non-tech",
    interview: [
      { question: "How do you approach quality control in your deliverables?", keywords: ["quality", "deliverables", "control"] },
      { question: "Tell me about a time when you had to pivot your strategy.", keywords: ["pivot", "strategy", "adaptability"] },
      { question: "How do you handle ethical dilemmas in a professional setting?", keywords: ["ethics", "dilemma", "professional"] },
      { question: "Describe a situation where you had to work under pressure.", keywords: ["pressure", "stress", "performance"] },
      { question: "How do you balance attention to detail with meeting deadlines?", keywords: ["balance", "detail", "deadlines"] }
    ],
    hr: [
      { question: "Describe your ideal work environment.", keywords: ["environment", "ideal", "workplace"] },
      { question: "How do you maintain work-life balance?", keywords: ["work-life", "balance", "wellbeing"] },
      { question: "What are your expectations from your manager?", keywords: ["expectations", "manager", "supervision"] },
      { question: "How do you handle change in the workplace?", keywords: ["change", "workplace", "adaptability"] },
      { question: "Tell me about a time you went above and beyond for a client or team.", keywords: ["above and beyond", "client", "extra effort"] }
    ]
  },
  {
    name: "Goldman Sachs",
    type: "non-tech",
    interview: [
      { question: "How do you analyze market trends?", keywords: ["market", "trends", "analysis"] },
      { question: "Describe a time when you had to make a financial recommendation.", keywords: ["financial", "recommendation", "analysis"] },
      { question: "How do you approach valuation of a company?", keywords: ["valuation", "company", "finance"] },
      { question: "Tell me about a time when you identified a financial risk.", keywords: ["risk", "financial", "identification"] },
      { question: "How do you stay updated with financial regulations?", keywords: ["regulations", "financial", "compliance"] }
    ],
    hr: [
      { question: "Why do you want to work in finance?", keywords: ["finance", "motivation", "career"] },
      { question: "How do you handle high-pressure situations?", keywords: ["pressure", "handling", "stress"] },
      { question: "What financial publications do you read regularly?", keywords: ["publications", "reading", "industry"] },
      { question: "How would you describe your analytical skills?", keywords: ["analytical", "skills", "self-assessment"] },
      { question: "What interests you about our firm specifically?", keywords: ["interest", "firm", "specific"] }
    ]
  },
  {
    name: "Morgan Stanley",
    type: "non-tech",
    interview: [
      { question: "How do you approach financial modeling?", keywords: ["financial", "modeling", "approach"] },
      { question: "Describe a time when you had to analyze financial statements.", keywords: ["financial statements", "analysis", "accounting"] },
      { question: "How do you evaluate investment opportunities?", keywords: ["investment", "evaluation", "opportunity"] },
      { question: "Tell me about a time when you had to present financial data to stakeholders.", keywords: ["presentation", "financial", "stakeholders"] },
      { question: "How do you approach risk management in investments?", keywords: ["risk", "management", "investment"] }
    ],
    hr: [
      { question: "Why investment banking?", keywords: ["investment banking", "career", "motivation"] },
      { question: "How do you stay organized during busy periods?", keywords: ["organization", "busy", "time management"] },
      { question: "What financial markets interest you the most?", keywords: ["markets", "interest", "finance"] },
      { question: "How do you handle competing deadlines?", keywords: ["deadlines", "competing", "prioritization"] },
      { question: "Where do you see yourself in 5 years in the financial industry?", keywords: ["future", "financial industry", "career path"] }
    ]
  }
];