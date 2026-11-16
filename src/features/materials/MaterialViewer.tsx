import { useState } from "react";
import {
  focusLabel,
  formatPages,
  slideRange,
  type Lecture,
  type Segment,
} from "../../data/materials";
import { SlideCard } from "./SlideCard";

type Props = {
  lecture: Lecture;
  /** when set, only these slides are shown (a recommendation); otherwise the whole lecture */
  segment?: Segment;
  conceptLabel?: string;
  startPage?: number;
  /** pages recommended to this student, marked inside the full lecture */
  recommended?: number[];
  onClose: () => void;
  onReviewed?: () => void;
  reviewed?: boolean;
};

export function MaterialViewer({
  lecture,
  segment,
  conceptLabel,
  startPage,
  recommended = [],
  onClose,
  onReviewed,
  reviewed,
}: Props) {
  const pages = segment
    ? lecture.slides.filter((slide) => slide.page >= segment.from && slide.page <= segment.to)
    : lecture.slides;
  const [index, setIndex] = useState(
    Math.max(
      0,
      pages.findIndex((slide) => slide.page === startPage),
    ),
  );
  const slide = pages[index] || pages[0];
  if (!slide) return null;
  const isRecommended = !segment && recommended.includes(slide.page);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal viewer" onClick={(event) => event.stopPropagation()}>
        <div className="viewer-head">
          <div>
            {segment ? (
              <>
                <div className="eyebrow">
                  RECOMMENDED FOR YOU · {(conceptLabel || "").toUpperCase()}
                </div>
                <h2>
                  {lecture.title.split(" · ")[0]} · {slideRange(segment)}
                </h2>
                <p className="muted">
                  {focusLabel[segment.focus ?? "explanation"]} · approved by your teacher for this
                  concept.
                </p>
              </>
            ) : (
              <>
                <div className="eyebrow">COURSE MATERIAL</div>
                <h2>{lecture.title}</h2>
                <p className="muted">
                  {lecture.slides.length} slides
                  {recommended.length ? ` · recommended for you: ${formatPages(recommended)}` : ""}
                </p>
              </>
            )}
          </div>
          <button className="btn text" onClick={onClose} aria-label="Close">
            Close
          </button>
        </div>
        {isRecommended && <div className="slide-flag">Recommended for you after your check-in</div>}
        <SlideCard slide={slide} lectureTitle={lecture.title} />
        <div className="viewer-nav">
          <button
            className="btn secondary"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          >
            Previous
          </button>
          <span>
            Slide {slide.page} · {index + 1} of {pages.length}
          </span>
          {index < pages.length - 1 ? (
            <button className="btn secondary" onClick={() => setIndex(index + 1)}>
              Next
            </button>
          ) : segment && onReviewed ? (
            <button
              className="btn primary"
              disabled={reviewed}
              onClick={() => {
                onReviewed();
                onClose();
              }}
            >
              {reviewed ? "Reviewed" : "Mark as reviewed"}
            </button>
          ) : (
            <button className="btn primary" onClick={onClose}>
              Done
            </button>
          )}
        </div>
        {!segment && (
          <div className="slide-strip">
            {pages.map((item, position) => (
              <button
                key={item.page}
                className={`strip-dot ${position === index ? "active" : ""} ${recommended.includes(item.page) ? "rec" : ""}`}
                onClick={() => setIndex(position)}
                aria-label={`Slide ${item.page}`}
              >
                {item.page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
