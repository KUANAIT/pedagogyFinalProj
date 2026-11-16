import type { Classification, Concept } from "../types";

export const classNames = [
  "Aigerim B.",
  "Daniyar K.",
  "Madina T.",
  "Nursultan A.",
  "Dana M.",
  "Alikhan S.",
  "Kamila Zh.",
  "Yerlan O.",
  "Aruzhan K.",
  "Timur B.",
  "Saule N.",
  "Arman D.",
  "Zarina E.",
  "Bekzat R.",
  "Ainur S.",
  "Miras T.",
  "Togzhan A.",
  "Ilyas M.",
  "Asel K.",
  "Dias Zh.",
  "Malika O.",
  "Sanzhar B.",
  "Aliya N.",
  "Rustem K.",
  "Inkar T.",
  "Adil S.",
  "Gulnaz A.",
  "Erasyl M.",
  "Laura D.",
];

export const statusWeights: Record<Concept, [number, number, number, number]> = {
  // Mastered, Fragile, Gap, Misconception
  "Probability basics": [0.86, 0.1, 0.03, 0.01],
  "Conditional probability": [0.72, 0.14, 0.09, 0.05],
  "Hypothesis testing": [0.68, 0.14, 0.1, 0.08],
  "p-values interpretation": [0.5, 0.16, 0.08, 0.26],
};

export function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export const simulatedClass: {
  name: string;
  statuses: Record<Concept, Classification>;
  score: number;
}[] = (() => {
  const random = seeded(42);
  const order: Classification[] = ["Mastered", "Fragile", "Gap", "Misconception"];
  return classNames.map((name) => {
    const statuses = {} as Record<Concept, Classification>;
    let correct = 0;
    (Object.keys(statusWeights) as Concept[]).forEach((concept) => {
      const roll = random();
      let acc = 0;
      let pick: Classification = "Mastered";
      statusWeights[concept].some((weight, index) => {
        acc += weight;
        if (roll < acc) {
          pick = order[index];
          return true;
        }
        return false;
      });
      statuses[concept] = pick;
      if (pick === "Mastered" || pick === "Fragile") correct += 1.5;
    });
    return { name, statuses, score: Math.round((correct / 6) * 100) };
  });
})();
