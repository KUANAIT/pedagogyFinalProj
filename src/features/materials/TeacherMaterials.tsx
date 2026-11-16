import { useState } from "react";
import { ConceptPicker } from "../../components/ConceptPicker";
import { focusLabel, type Lecture, type Segment } from "../../data/materials";
import { lecture7Sample } from "../../data/materials";
import { segmentSlides } from "../../logic/aiSim";
import { readPdf } from "../../lib/pdf";
import { SlideCard } from "./SlideCard";

type Props = {
  lectures: Lecture[];
  segments: Segment[];
  concepts: string[];
  onCreateConcept: (name: string) => void;
  conceptLabel: (concept: string) => string;
  reviewedIds: string[];
  onAddLecture: (lecture: Lecture, segments: Segment[]) => void;
  onUpdateSegment: (id: string, patch: Partial<Segment>) => void;
};

export function TeacherMaterials({
  lectures,
  segments,
  concepts,
  onCreateConcept,
  conceptLabel,
  reviewedIds,
  onAddLecture,
  onUpdateSegment,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      const slides = await readPdf(file);
      if (!slides.length) throw new Error("No pages found");
      const id = `up-${Date.now()}`;
      const lecture: Lecture = {
        id,
        title: file.name.replace(/\.pdf$/i, ""),
        source: "upload",
        slides,
      };
      onAddLecture(lecture, segmentSlides(id, slides));
    } catch {
      setError("Could not read this PDF. Try another file or load the sample lecture.");
    } finally {
      setBusy(false);
    }
  }

  const pending = segments.filter((segment) => segment.status === "pending").length;

  return (
    <section className="table-section">
      <div className="section-heading">
        <div>
          <h2>Course materials</h2>
          <p>
            Upload lecture slides. The assistant suggests which slides explain which concept;
            nothing reaches students until you approve it. Files are read in your browser and are
            not uploaded anywhere.
          </p>
        </div>
        <span>{pending} waiting for review</span>
      </div>
      <div className="panel upload-panel">
        <label className="btn primary upload-btn">
          {busy ? "Reading PDF…" : "Upload lecture (PDF)"}
          <input
            type="file"
            accept="application/pdf"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
              event.target.value = "";
            }}
          />
        </label>
        <button
          className="btn secondary"
          disabled={lectures.some((lecture) => lecture.id === lecture7Sample.id)}
          onClick={() =>
            onAddLecture(lecture7Sample, segmentSlides(lecture7Sample.id, lecture7Sample.slides))
          }
        >
          Load sample lecture
        </button>
        {error && <span className="reasoning-flag">{error}</span>}
      </div>
      {lectures.map((lecture) => {
        const own = segments.filter((segment) => segment.lectureId === lecture.id);
        return (
          <div className="lecture-block" key={lecture.id}>
            <div className="lecture-title">
              <strong>{lecture.title}</strong>
              <span className="muted">
                {lecture.slides.length} slides ·{" "}
                {lecture.source === "upload" ? "uploaded now" : "uploaded earlier"}
              </span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Slides</th>
                    <th>AI-suggested concept</th>
                    <th>Confidence</th>
                    <th>Opened by students</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {own.length === 0 && (
                    <tr>
                      <td colSpan={5} className="muted">
                        No course concept recognised in this file. You can still use it outside the
                        assistant.
                      </td>
                    </tr>
                  )}
                  {own.map((segment) => {
                    const opened = segment.opened + (reviewedIds.includes(segment.id) ? 1 : 0);
                    return (
                      <tr key={segment.id}>
                        <td>
                          <button
                            className="link-btn"
                            onClick={() => setPreview(preview === segment.id ? null : segment.id)}
                          >
                            {segment.from === segment.to
                              ? `Slide ${segment.from}`
                              : `Slides ${segment.from}–${segment.to}`}
                          </button>
                          <small className="material-why">
                            {focusLabel[segment.focus ?? "explanation"]}
                            {segment.addresses?.length ? ` · ${segment.addresses[0]}` : ""}
                          </small>
                          {preview === segment.id && (
                            <div className="thumb-row">
                              {lecture.slides
                                .filter(
                                  (slide) => slide.page >= segment.from && slide.page <= segment.to,
                                )
                                .map((slide) => (
                                  <SlideCard
                                    key={slide.page}
                                    slide={slide}
                                    lectureTitle={lecture.title}
                                    size="thumb"
                                  />
                                ))}
                            </div>
                          )}
                        </td>
                        <td>
                          <ConceptPicker
                            value={segment.concept}
                            options={concepts}
                            label={conceptLabel}
                            onChange={(concept) => onUpdateSegment(segment.id, { concept })}
                            onCreate={onCreateConcept}
                            ariaLabel={`Concept for slides ${segment.from}–${segment.to}`}
                          />
                        </td>
                        <td>
                          <span className={segment.confidence < 0.7 ? "conf low" : "conf"}>
                            {Math.round(segment.confidence * 100)}%
                          </span>
                        </td>
                        <td>{segment.status === "approved" ? opened : "—"}</td>
                        <td>
                          {segment.status === "pending" ? (
                            <div className="table-actions">
                              <button
                                onClick={() => onUpdateSegment(segment.id, { status: "approved" })}
                              >
                                Approve
                              </button>
                              <button
                                className="reject"
                                onClick={() => onUpdateSegment(segment.id, { status: "rejected" })}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`status-pill ${segment.status === "approved" ? "approved" : ""}`}
                            >
                              {segment.status === "approved" ? "Approved" : "Rejected"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
      <p className="muted">
        Simulated: concept suggestions use keyword rules. In the full version a language model reads
        each slide and proposes the concept; the teacher keeps the final decision. A concept you
        type yourself is added to the course list; the assistant recommends its slides once a
        check-in question uses that concept.
      </p>
    </section>
  );
}
