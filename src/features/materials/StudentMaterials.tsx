import type { Concept } from "../../types";
import { formatPages, type Lecture, type Segment } from "../../data/materials";

type Props = {
  lectures: Lecture[];
  segments: Segment[];
  conceptLabel: (concept: string) => string;
  /** lectureId → pages recommended after the latest check-in */
  recommended: Record<string, number[]>;
  onOpen: (lecture: Lecture) => void;
};

export function StudentMaterials({ lectures, segments, conceptLabel, recommended, onOpen }: Props) {
  const visible = lectures.filter((lecture) =>
    segments.some((segment) => segment.lectureId === lecture.id && segment.status === "approved"),
  );
  return (
    <div className="content-wide">
      <div className="eyebrow">STATISTICS 101 / MATERIALS</div>
      <h1>Course materials</h1>
      <p className="lead">
        Full lectures from your teacher. After a check-in, the assistant points you to the exact
        slides you need.
      </p>
      {visible.map((lecture) => {
        const covered = Array.from(
          new Set(
            segments
              .filter(
                (segment) => segment.lectureId === lecture.id && segment.status === "approved",
              )
              .map((segment) => segment.concept),
          ),
        );
        const rec = recommended[lecture.id] || [];
        return (
          <section className="panel material-panel lecture-row" key={lecture.id}>
            <div className="lecture-info">
              <strong>{lecture.title}</strong>
              <span className="muted">{lecture.slides.length} slides</span>
              <div className="lecture-tags">
                {covered.map((concept) => (
                  <span key={concept} className="tag-chip">
                    {conceptLabel(concept)}
                  </span>
                ))}
              </div>
              {rec.length > 0 && (
                <span className="rec-note">
                  Recommended for you after your check-in: {formatPages(rec)}
                </span>
              )}
            </div>
            <button className="btn secondary" onClick={() => onOpen(lecture)}>
              Open lecture
            </button>
          </section>
        );
      })}
    </div>
  );
}
