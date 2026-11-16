import type { Classification } from "../types";

const order: Classification[] = ["Misconception", "Gap", "Fragile", "Mastered"];

export type PracticeOutcome = { correct: boolean; hintsUsed: number; examMode: boolean };

/**
 * Rule-based mastery update after one practice task.
 * - Correct without hints: +2 levels (exam style counts the same, hints are limited there).
 * - Correct with 1 hint: +1 level.
 * - Correct with 2–3 hints: +1 level, but never above Fragile (needs another try alone).
 * - Incorrect: no change.
 * A misconception can rise at most to Fragile in one task: it must be confirmed again.
 */
export function updateStatus(current: Classification, outcome: PracticeOutcome): Classification {
  if (!outcome.correct) return current;
  const level = order.indexOf(current);
  const gain = outcome.hintsUsed === 0 ? 2 : 1;
  let cap = 3;
  if (outcome.hintsUsed >= 2) cap = 2;
  if (current === "Misconception") cap = Math.min(cap, 2);
  return order[Math.min(level + gain, cap)];
}

export function explainChange(
  from: Classification,
  to: Classification,
  outcome: PracticeOutcome,
): string {
  if (!outcome.correct) return "Answer was not correct yet, so the status stays the same.";
  if (from === to)
    return "Correct, but with several hints, so the status stays until you solve one alone.";
  const how =
    outcome.hintsUsed === 0
      ? "without hints"
      : `with ${outcome.hintsUsed} hint${outcome.hintsUsed === 1 ? "" : "s"}`;
  const note =
    from === "Misconception" && to === "Fragile" ? " One more correct answer will confirm it." : "";
  return `Solved ${how}${outcome.examMode ? " in exam style" : ""}.${note}`;
}
