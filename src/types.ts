export type Language = "EN" | "RU" | "KZ";
export type Concept =
  | "Probability basics"
  | "Conditional probability"
  | "Hypothesis testing"
  | "p-values interpretation";
export type Certainty = "low" | "medium" | "high";
export type Classification = "Mastered" | "Fragile" | "Gap" | "Misconception";
export type Screen = "diagnose" | "recommend" | "practice" | "reflect";
export type AlertStatus = "pending" | "approved" | "editing" | "dismissed";
export type PracticeKey = Concept | "Challenge" | string;
