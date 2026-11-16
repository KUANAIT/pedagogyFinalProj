import type { Classification, Concept, PracticeKey } from "../types";

export const concepts: Concept[] = [
  "Probability basics",
  "Conditional probability",
  "Hypothesis testing",
  "p-values interpretation",
];

export const conceptPrerequisites: Record<Concept, Concept[]> = {
  "Probability basics": [],
  "Conditional probability": ["Probability basics"],
  "Hypothesis testing": ["Probability basics"],
  "p-values interpretation": ["Probability basics"],
};

export const questions: {
  text: string;
  options: string[];
  correct: number;
  concept: Concept;
  misconceptions: Record<number, string>;
}[] = [
  {
    text: "A p-value of 0.03 means…",
    options: [
      "There is a 3% chance the null hypothesis is true",
      "The observed data would be unusual if the null hypothesis were true",
      "The result is 97% accurate",
      "The effect has a size of 0.03",
    ],
    correct: 1,
    concept: "p-values interpretation",
    misconceptions: {
      0: "treats the p-value as the probability that H0 is true",
      2: "treats confidence as the complement of the p-value",
      3: "confuses statistical significance with effect size",
    },
  },
  {
    text: "When p < α, the usual decision is to…",
    options: [
      "Reject the null hypothesis",
      "Accept the null hypothesis",
      "Increase the sample mean",
      "Remove outliers",
    ],
    correct: 0,
    concept: "Hypothesis testing",
    misconceptions: {
      1: "treats failure to reject as proof that H0 is true",
      2: "believes the decision changes the sample statistic",
      3: "assumes outliers determine the hypothesis decision",
    },
  },
  {
    text: "A Type I error occurs when we…",
    options: [
      "Reject a true null hypothesis",
      "Keep a false null hypothesis",
      "Use a small sample",
      "Calculate the mean incorrectly",
    ],
    correct: 0,
    concept: "Hypothesis testing",
    misconceptions: {
      1: "confuses Type I and Type II errors",
      2: "equates small samples with Type I error",
      3: "confuses calculation mistakes with inference errors",
    },
  },
  {
    text: "A fair coin is tossed once. The probability of heads is…",
    options: ["0.25", "0.50", "0.75", "1.00"],
    correct: 1,
    concept: "Probability basics",
    misconceptions: {
      0: "counts one of four imagined outcomes",
      2: "overestimates equally likely outcomes",
      3: "treats either outcome as certain",
    },
  },
  {
    text: "If two events are mutually exclusive, then…",
    options: [
      "They always occur together",
      "They cannot occur together",
      "They have equal probability",
      "They are independent",
    ],
    correct: 1,
    concept: "Conditional probability",
    misconceptions: {
      0: "treats mutually exclusive events as identical",
      2: "assumes exclusive events must be equally likely",
      3: "confuses mutual exclusivity with independence",
    },
  },
  {
    text: "The probability of a certain event is…",
    options: ["0", "0.5", "1", "Undefined"],
    correct: 2,
    concept: "Probability basics",
    misconceptions: {
      0: "confuses certain and impossible events",
      1: "treats certainty as an even chance",
      3: "assumes certainty cannot be quantified",
    },
  },
];

export const practiceTasks: Record<
  Exclude<PracticeKey, "Hypothesis testing">,
  {
    title: string;
    task: string;
    accept: string[];
    correct: string;
    incorrect: string;
    hints: [string, string, string];
  }
> = {
  "Probability basics": {
    title: "Probability basics",
    task: "A fair die is rolled once. What is the probability of getting an even number? Enter a decimal.",
    accept: ["0.5", "0,5", ".5", "1/2", "50"],
    correct: "Correct. 3 even outcomes out of 6 equally likely outcomes = 0.5.",
    incorrect: "Not quite. Count the favourable outcomes and divide by all possible outcomes.",
    hints: [
      "List all outcomes of one die roll.",
      "P(event) = favourable outcomes / all equally likely outcomes.",
      "Even numbers: 2, 4, 6 → 3 of 6 → 3/6 = 0.5.",
    ],
  },
  "Conditional probability": {
    title: "Conditional probability",
    task: "40% of students take Statistics; 10% take both Statistics and Economics. What is P(Economics | Statistics)? Enter a decimal.",
    accept: ["0.25", "0,25", ".25", "1/4", "25"],
    correct: "Correct. P(E | S) = P(E and S) / P(S) = 0.10 / 0.40 = 0.25.",
    incorrect: "Not quite. Divide the joint probability by the probability of the condition.",
    hints: [
      "The condition is 'the student takes Statistics'.",
      "P(A | B) = P(A and B) / P(B).",
      "0.10 / 0.40 = 0.25.",
    ],
  },
  "p-values interpretation": {
    title: "p-values interpretation",
    task: "A study reports p = 0.03. Which statement is correct? Type A or B. A) There is a 3% chance that H0 is true. B) Data this extreme would occur about 3% of the time if H0 were true.",
    accept: ["b"],
    correct:
      "Correct. A p-value is computed assuming H0 is true; it is not the probability that H0 is true.",
    incorrect: "Not quite. Ask yourself: what does the p-value assume about H0?",
    hints: [
      "A p-value is calculated under an assumption. Which one?",
      "p = P(data this extreme | H0 true), not P(H0 true | data).",
      "So statement B is correct; statement A reverses the condition.",
    ],
  },
  Challenge: {
    title: "Challenge: choosing the right test",
    task: "You compare mean exam scores of two independent groups. Which test fits best? Type 't-test' or 'chi-square'.",
    accept: ["t-test", "t test", "ttest", "t"],
    correct: "Correct. Comparing two independent means calls for an independent-samples t-test.",
    incorrect:
      "Not quite. Think about the type of variable: means of a numeric outcome or counts in categories?",
    hints: [
      "Is the outcome numeric or categorical?",
      "Numeric outcome + two independent groups → compare means.",
      "Use an independent-samples t-test.",
    ],
  },
};

export const initialItems = [
  { id: 1, item: "Interpret p = 0.04 in context", topic: "p-values", status: "draft" },
  { id: 2, item: "Select a test for two groups", topic: "Hypothesis testing", status: "draft" },
  { id: 3, item: "Calculate a simple event", topic: "Probability", status: "draft" },
];

export const historyWeeks: {
  week: number;
  date: string;
  score: string;
  statuses: Record<Concept, Classification>;
}[] = [
  {
    week: 4,
    date: "26 Oct",
    score: "3 of 6",
    statuses: {
      "Probability basics": "Gap",
      "Conditional probability": "Gap",
      "Hypothesis testing": "Gap",
      "p-values interpretation": "Gap",
    },
  },
  {
    week: 5,
    date: "2 Nov",
    score: "4 of 6",
    statuses: {
      "Probability basics": "Mastered",
      "Conditional probability": "Fragile",
      "Hypothesis testing": "Gap",
      "p-values interpretation": "Misconception",
    },
  },
];
