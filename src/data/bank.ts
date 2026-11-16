export type BankQuestion = {
  id: number;
  text: string;
  options: string[];
  correct: number;
  concept: string;
  /** "ai" = teacher kept the assistant's suggestion, "teacher" = teacher chose or typed another concept */
  source: "ai" | "teacher";
  confidence?: number;
};

export const initialBank: BankQuestion[] = [
  {
    id: 1,
    text: "A test gives p = 0.12 with α = 0.05. What do you conclude?",
    options: [
      "Reject the null hypothesis",
      "Do not reject the null hypothesis",
      "The null hypothesis is proven true",
      "The effect is 12% large",
    ],
    correct: 1,
    concept: "p-values interpretation",
    source: "ai",
    confidence: 0.91,
  },
];
