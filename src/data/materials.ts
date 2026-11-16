import type { Concept } from "../types";

export type Slide = { page: number; title: string; text: string; image?: string };
export type SegmentStatus = "pending" | "approved" | "rejected";
/** explanation = full walkthrough of a concept; misconception = slide that tackles one specific wrong idea; recap = short summary */
export type SegmentFocus = "explanation" | "misconception" | "recap";
export type Segment = {
  id: string;
  lectureId: string;
  from: number;
  to: number;
  concept: string;
  confidence: number;
  status: SegmentStatus;
  opened: number;
  focus?: SegmentFocus;
  /** misconception labels (from quiz distractors) this segment addresses */
  addresses?: string[];
};
export type Lecture = { id: string; title: string; source: "demo" | "upload"; slides: Slide[] };

export const lecture4: Lecture = {
  id: "lec4",
  title: "Lecture 4 · Probability basics",
  source: "demo",
  slides: [
    { page: 1, title: "Lecture 4: Probability basics", text: "Statistics 101 · Week 4" },
    {
      page: 2,
      title: "Sample space and events",
      text: "The sample space lists every possible outcome. An event is a set of outcomes. P(A) = favourable outcomes / all equally likely outcomes.",
    },
    {
      page: 3,
      title: "Equally likely outcomes",
      text: "A fair coin has two equally likely outcomes, so P(heads) = 1/2 = 0.5. Do not invent extra outcomes: one toss has two outcomes, not four.",
    },
    {
      page: 4,
      title: "Certain and impossible events",
      text: "P(certain event) = 1 and P(impossible event) = 0. Every probability lies between 0 and 1. Certainty is not an even chance.",
    },
    {
      page: 5,
      title: "The complement rule",
      text: "P(not A) = 1 − P(A). If P(rain) = 0.3, then P(no rain) = 0.7.",
    },
    {
      page: 6,
      title: "Recap: probability in four lines",
      text: "Outcomes, events, P between 0 and 1, complement rule. Equally likely outcomes: count and divide.",
    },
  ],
};

export const lecture5: Lecture = {
  id: "lec5",
  title: "Lecture 5 · Conditional probability",
  source: "demo",
  slides: [
    { page: 1, title: "Lecture 5: Conditional probability", text: "Statistics 101 · Week 5" },
    {
      page: 2,
      title: "Probability given an event",
      text: "P(A | B) = P(A and B) / P(B): the probability of A given that B happened.",
    },
    {
      page: 3,
      title: "Example: Statistics and Economics",
      text: "40% take Statistics, 10% take both. P(Economics | Statistics) = 0.10 / 0.40 = 0.25.",
    },
    {
      page: 4,
      title: "Mutually exclusive events",
      text: "Mutually exclusive events cannot occur together: P(A and B) = 0. They need not be equally likely.",
    },
    {
      page: 5,
      title: "Exclusive is not independent",
      text: "Independent: P(A | B) = P(A). Mutually exclusive events with non-zero probability are never independent: if one happens, the other cannot.",
    },
    {
      page: 6,
      title: "Recap: conditional probability",
      text: "Condition first, then divide by P(condition). Exclusive ≠ independent.",
    },
  ],
};

export const lecture6: Lecture = {
  id: "lec6",
  title: "Lecture 6 · Hypothesis tests and p-values",
  source: "demo",
  slides: [
    { page: 1, title: "Lecture 6: Hypothesis tests and p-values", text: "Statistics 101 · Week 6" },
    {
      page: 2,
      title: "Null and alternative hypotheses",
      text: "H0: no effect. H1: an effect exists. A hypothesis test asks whether the data are consistent with H0.",
    },
    {
      page: 3,
      title: "Decision rule",
      text: "Reject H0 when p < α. Failing to reject H0 is not proof that H0 is true: we simply lack evidence against it.",
    },
    {
      page: 4,
      title: "Type I and Type II errors",
      text: "Type I: reject a true null hypothesis (false alarm). Type II: keep a false null hypothesis (missed effect). Sample size changes power, not the definition.",
    },
    {
      page: 5,
      title: "What a p-value is",
      text: "p-value = P(data this extreme | H0 true). It is computed assuming the null hypothesis.",
    },
    {
      page: 6,
      title: "Common misreading",
      text: "A p-value is NOT the probability that H0 is true. p = 0.03 does not mean a 3% chance H0 is true, and 1 − p is not a confidence level.",
    },
    {
      page: 7,
      title: "Significance vs effect size",
      text: "A small p-value says the data are unusual under H0. It does not say how big the effect is. Report the effect size too.",
    },
    {
      page: 8,
      title: "Worked example",
      text: "p = 0.03 with α = 0.05: data this extreme occur about 3% of the time if H0 were true, so we reject H0.",
    },
    {
      page: 9,
      title: "Recap: testing",
      text: "State H0 and H1, compare p with α, remember the two error types.",
    },
    {
      page: 10,
      title: "Recap: p-values",
      text: "p = P(data | H0), not P(H0 | data). Significance ≠ size of the effect.",
    },
  ],
};

export const demoLectures: Lecture[] = [lecture4, lecture5, lecture6];

const seg = (
  lectureId: string,
  from: number,
  to: number,
  concept: Concept,
  confidence: number,
  opened: number,
  focus: SegmentFocus,
  addresses: string[] = [],
): Segment => ({
  id: `${lectureId}-${from}-${to}`,
  lectureId,
  from,
  to,
  concept,
  confidence,
  status: "approved",
  opened,
  focus,
  addresses,
});

export const demoSegments: Segment[] = [
  seg("lec4", 2, 5, "Probability basics", 0.9, 14, "explanation"),
  seg("lec4", 3, 3, "Probability basics", 0.86, 5, "misconception", [
    "counts one of four imagined outcomes",
    "overestimates equally likely outcomes",
  ]),
  seg("lec4", 4, 4, "Probability basics", 0.88, 4, "misconception", [
    "confuses certain and impossible events",
    "treats certainty as an even chance",
    "assumes certainty cannot be quantified",
    "treats either outcome as certain",
  ]),
  seg("lec4", 6, 6, "Probability basics", 0.8, 7, "recap"),
  seg("lec5", 2, 5, "Conditional probability", 0.87, 10, "explanation"),
  seg("lec5", 4, 5, "Conditional probability", 0.84, 6, "misconception", [
    "treats mutually exclusive events as identical",
    "assumes exclusive events must be equally likely",
    "confuses mutual exclusivity with independence",
  ]),
  seg("lec5", 6, 6, "Conditional probability", 0.79, 3, "recap"),
  seg("lec6", 2, 4, "Hypothesis testing", 0.85, 11, "explanation"),
  seg("lec6", 3, 3, "Hypothesis testing", 0.83, 8, "misconception", [
    "treats failure to reject as proof that H0 is true",
    "believes the decision changes the sample statistic",
    "assumes outliers determine the hypothesis decision",
  ]),
  seg("lec6", 4, 4, "Hypothesis testing", 0.86, 6, "misconception", [
    "confuses Type I and Type II errors",
    "equates small samples with Type I error",
    "confuses calculation mistakes with inference errors",
  ]),
  seg("lec6", 9, 9, "Hypothesis testing", 0.78, 4, "recap"),
  seg("lec6", 5, 8, "p-values interpretation", 0.9, 17, "explanation"),
  seg("lec6", 6, 6, "p-values interpretation", 0.92, 12, "misconception", [
    "treats the p-value as the probability that H0 is true",
    "treats confidence as the complement of the p-value",
  ]),
  seg("lec6", 7, 7, "p-values interpretation", 0.88, 6, "misconception", [
    "confuses statistical significance with effect size",
  ]),
  seg("lec6", 10, 10, "p-values interpretation", 0.81, 5, "recap"),
];

export const lecture7Sample: Lecture = {
  id: "lec7",
  title: "Lecture 7 · Confidence intervals and significance (sample)",
  source: "demo",
  slides: [
    { page: 1, title: "Lecture 7: Confidence intervals", text: "Statistics 101 · Week 7" },
    {
      page: 2,
      title: "Interpreting a p-value again",
      text: "A small p-value means the data would be unusual if H0 were true. Statistical significance is not effect size.",
    },
    {
      page: 3,
      title: "From p-values to decisions",
      text: "Compare p with α. Report p-values with context, not only significant / not significant.",
    },
    {
      page: 4,
      title: "Testing two groups",
      text: "Hypothesis test for two independent means: t-test. Null hypothesis: equal means. Reject H0 if p < α.",
    },
    {
      page: 5,
      title: "Errors in practice",
      text: "Type I and Type II errors in medical tests. Reject a true null hypothesis = false alarm.",
    },
    {
      page: 6,
      title: "Probability refresher",
      text: "Equally likely outcomes, complement rule, P(A) between 0 and 1.",
    },
  ],
};

export const focusLabel: Record<SegmentFocus, string> = {
  explanation: "Full explanation",
  misconception: "Targets a misconception",
  recap: "Quick recap",
};

/**
 * Picks the most specific approved material for a student's status on a concept.
 * Misconception → slide that addresses the student's own wrong idea; Gap → full explanation; Fragile → recap.
 */
export function pickMaterial(
  segments: Segment[],
  concept: Concept,
  status: "Mastered" | "Fragile" | "Gap" | "Misconception" | undefined,
  studentMisconceptions: string[],
): { segment: Segment; reason: string } | undefined {
  const pool = segments.filter(
    (segment) => segment.status === "approved" && segment.concept === concept,
  );
  const byFocus = (focus: SegmentFocus) =>
    pool.filter((segment) => (segment.focus ?? "explanation") === focus);
  if (status === "Misconception") {
    const target = byFocus("misconception").find((segment) =>
      (segment.addresses || []).some((label) => studentMisconceptions.includes(label)),
    );
    if (target) return { segment: target, reason: "covers the exact mistake in your answer" };
  }
  if (status === "Fragile") {
    const recap = byFocus("recap")[0];
    if (recap) return { segment: recap, reason: "you were right but not sure" };
  }
  const explanation = byFocus("explanation")[0] || pool[0];
  if (explanation) return { segment: explanation, reason: "start with the whole topic" };
  return undefined;
}

export const slideRange = (segment: Pick<Segment, "from" | "to">) =>
  segment.from === segment.to ? `slide ${segment.from}` : `slides ${segment.from}–${segment.to}`;

/** [2,3,4,6] → "slides 2–4, 6" */
export function formatPages(pages: number[]): string {
  const sorted = [...pages].sort((a, b) => a - b);
  const parts: string[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j += 1;
    parts.push(i === j ? `${sorted[i]}` : `${sorted[i]}–${sorted[j]}`);
    i = j;
  }
  return `${sorted.length === 1 ? "slide" : "slides"} ${parts.join(", ")}`;
}
