import type { Concept } from "../types";
import type { Segment, Slide } from "../data/materials";

const keywords: Record<Concept, RegExp[]> = {
  "p-values interpretation": [/p-?value/g, /p\s?=\s?0?\.\d+/g, /significan/g, /effect size/g],
  "Hypothesis testing": [
    /hypothes/g,
    /\bnull\b/g,
    /\bh0\b/g,
    /\breject/g,
    /type i+\b/g,
    /t-?test/g,
    /\bα\b|alpha/g,
  ],
  "Conditional probability": [
    /conditional/g,
    /given/g,
    /p\s?\(\s?\w+\s?\|/g,
    /independent/g,
    /mutually exclusive/g,
    /\|/g,
  ],
  "Probability basics": [
    /probabilit/g,
    /outcome/g,
    /event/g,
    /complement/g,
    /sample space/g,
    /fair (coin|die)/g,
  ],
};

/** Simulated AI: concept suggestion for one text. Real version: an LLM classifier grounded in course concepts. */
export function scoreText(text: string): { concept: Concept; confidence: number } | null {
  const t = text.toLowerCase();
  const scores = (Object.keys(keywords) as Concept[]).map((concept) => ({
    concept,
    score: keywords[concept].reduce((sum, re) => sum + (t.match(re)?.length || 0), 0),
  }));
  scores.sort((a, b) => b.score - a.score);
  const [best, second] = scores;
  if (!best || best.score === 0) return null;
  const total = scores.reduce((sum, item) => sum + item.score, 0);
  const share = best.score / total;
  const confidence = Math.min(
    0.94,
    0.4 + 0.38 * share + 0.04 * Math.min(best.score, 4) - (second?.score ? 0.03 : 0),
  );
  return { concept: best.concept, confidence: Math.round(confidence * 100) / 100 };
}

export function suggestConcept(text: string): { concept: Concept; confidence: number } {
  return scoreText(text) || { concept: "Probability basics", confidence: 0.5 };
}

/** Groups consecutive slides with the same suggested concept into segments (pending teacher review). */
export function segmentSlides(lectureId: string, slides: Slide[]): Segment[] {
  const tagged = slides.map((slide) => ({ slide, tag: scoreText(`${slide.title} ${slide.text}`) }));
  const segments: Segment[] = [];
  for (const { slide, tag } of tagged) {
    if (!tag) continue;
    const last = segments[segments.length - 1];
    if (last && last.concept === tag.concept && last.to === slide.page - 1) {
      last.to = slide.page;
      last.confidence = Math.round(((last.confidence + tag.confidence) / 2) * 100) / 100;
    } else {
      segments.push({
        id: `${lectureId}-${slide.page}`,
        lectureId,
        from: slide.page,
        to: slide.page,
        concept: tag.concept,
        confidence: tag.confidence,
        status: "pending",
        opened: 0,
      });
    }
  }
  return segments.map((segment) => ({
    ...segment,
    id: `${lectureId}-${segment.from}-${segment.to}`,
  }));
}
