import { useState, type Dispatch, type SetStateAction } from "react";
import type { Concept } from "../../types";
import type { BankQuestion } from "../../data/bank";
import { suggestConcept } from "../../logic/aiSim";
import { ConceptPicker } from "../../components/ConceptPicker";

type Week6Question = { text: string; options: string[]; correct: number };

type Props = {
  startWeek?: 6 | 7;
  bank: BankQuestion[];
  setBank: Dispatch<SetStateAction<BankQuestion[]>>;
  week6: Week6Question[];
  week6Mapping: string[];
  onRemapWeek6: (index: number, concept: string) => void;
  builtIn: Concept[];
  allConcepts: string[];
  onCreateConcept: (name: string) => void;
  conceptLabel: (concept: string) => string;
};

const LETTERS = ["A", "B", "C", "D"];

function OptionList({ items, right }: { items: string[]; right: number }) {
  return (
    <ol className="q-options">
      {items.map((option, index) => (
        <li key={index} className={index === right ? "correct" : ""}>
          <span className="q-letter">{LETTERS[index]}</span>
          {option}
          {index === right && <span className="q-correct-tag">correct</span>}
        </li>
      ))}
    </ol>
  );
}

export function QuestionBank(props: Props) {
  const {
    startWeek = 7,
    bank,
    setBank,
    week6,
    week6Mapping,
    onRemapWeek6,
    builtIn,
    allConcepts,
    onCreateConcept,
    conceptLabel,
  } = props;
  const [week, setWeek] = useState<6 | 7>(startWeek);
  const [text, setText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correct, setCorrect] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState<{ concept: Concept; confidence: number } | null>(
    null,
  );
  const [concept, setConcept] = useState<string | null>(null);

  const filled = options.map((option) => option.trim()).filter(Boolean);
  const correctFilled = correct !== null && options[correct].trim().length > 0;
  const missing = [
    text.trim().length < 8 && "question text",
    filled.length < 2 && "at least 2 answer options",
    !correctFilled && "the correct answer",
    !concept && "a concept",
  ].filter(Boolean) as string[];

  function reset() {
    setText("");
    setOptions(["", "", "", ""]);
    setCorrect(null);
    setSuggestion(null);
    setConcept(null);
  }

  function add() {
    if (missing.length || correct === null || !concept) return;
    const kept = options
      .map((option, index) => ({ option: option.trim(), index }))
      .filter((x) => x.option);
    setBank((rows) => [
      ...rows,
      {
        id: Date.now(),
        text: text.trim(),
        options: kept.map((x) => x.option),
        correct: kept.findIndex((x) => x.index === correct),
        concept,
        source: suggestion && suggestion.concept === concept ? "ai" : "teacher",
        confidence: suggestion?.confidence,
      },
    ]);
    reset();
  }

  return (
    <section className="table-section">
      <div className="section-heading">
        <div>
          <h2>Question bank</h2>
          <p>
            Build weekly check-ins. For each question the assistant suggests a course concept; you
            keep it, pick another or type a new one. Students see only the concept results, never a
            grade.
          </p>
        </div>
      </div>

      <div className="bank-weeks">
        <button className={week === 6 ? "active" : ""} onClick={() => setWeek(6)}>
          <strong>Week 6 check-in</strong>
          <span>Published · {week6.length} questions</span>
        </button>
        <button className={week === 7 ? "active" : ""} onClick={() => setWeek(7)}>
          <strong>Week 7 check-in</strong>
          <span>
            Draft · opens 23 November · {bank.length} question{bank.length === 1 ? "" : "s"}
          </span>
        </button>
      </div>

      {week === 6 && (
        <>
          <p className="muted bank-note">
            Already answered by students. You can still correct a concept: the change updates
            results immediately. Questions cannot be edited after publishing. Concepts were suggested by the
            assistant when the check-in was built.
          </p>
          {week6.map((question, index) => (
            <article className="q-card panel" key={question.text}>
              <header>
                <span className="q-num">Q{index + 1}</span>
                <strong>{question.text}</strong>
              </header>
              <OptionList items={question.options} right={question.correct} />
              <footer>
                <span className="muted">Concept (AI-suggested)</span>
                <ConceptPicker
                  value={week6Mapping[index]}
                  options={allConcepts}
                  label={conceptLabel}
                  onChange={(value) => onRemapWeek6(index, value)}
                  onCreate={onCreateConcept}
                  ariaLabel={`Concept for question ${index + 1}`}
                />
              </footer>
            </article>
          ))}
        </>
      )}

      {week === 7 && (
        <>
          <div className="panel q-builder">
            <h3>New question</h3>
            <label htmlFor="q-text">Question</label>
            <textarea
              id="q-text"
              className="text-input"
              rows={2}
              placeholder="e.g. Given that a student passed the midterm, what is the probability…"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setSuggestion(null);
              }}
            />
            <label>Answer options · mark the correct one</label>
            <div className="q-option-inputs">
              {options.map((option, index) => (
                <div
                  className={`q-option-input ${correct === index ? "is-correct" : ""}`}
                  key={index}
                >
                  <input
                    type="radio"
                    name="q-correct"
                    checked={correct === index}
                    onChange={() => setCorrect(index)}
                    aria-label={`Option ${LETTERS[index]} is correct`}
                  />
                  <span className="q-letter">{LETTERS[index]}</span>
                  <input
                    className="text-input"
                    placeholder={
                      index < 2 ? `Option ${LETTERS[index]}` : `Option ${LETTERS[index]} (optional)`
                    }
                    value={option}
                    onChange={(event) =>
                      setOptions((list) =>
                        list.map((value, i) => (i === index ? event.target.value : value)),
                      )
                    }
                  />
                </div>
              ))}
            </div>

            <label>Concept</label>
            <div className="q-concept-row">
              <button
                className="btn secondary"
                disabled={text.trim().length < 8}
                onClick={() => {
                  const result = suggestConcept(`${text} ${options.join(" ")}`);
                  setSuggestion(result);
                  setConcept(result.concept);
                }}
              >
                Suggest concept (AI)
              </button>
              {suggestion && (
                <span className="ai-suggest-inline">
                  Assistant suggests <strong>{conceptLabel(suggestion.concept)}</strong> ·{" "}
                  {Math.round(suggestion.confidence * 100)}%
                </span>
              )}
              <ConceptPicker
                value={concept ?? ""}
                options={concept || suggestion ? allConcepts : ["", ...allConcepts]}
                label={(value) => (value ? conceptLabel(value) : "Choose a concept…")}
                onChange={setConcept}
                onCreate={onCreateConcept}
                ariaLabel="Concept for the new question"
              />
            </div>

            <div className="button-row">
              <button className="btn primary" disabled={missing.length > 0} onClick={add}>
                Add to Week 7 check-in
              </button>
              <button className="btn text" onClick={reset}>
                Clear
              </button>
              {missing.length > 0 && (text || filled.length > 0) && (
                <span className="muted">Still needed: {missing.join(", ")}</span>
              )}
            </div>
          </div>

          {bank.length === 0 && <p className="muted">No questions yet.</p>}
          {bank.map((question, index) => (
            <article className="q-card panel" key={question.id}>
              <header>
                <span className="q-num">Q{index + 1}</span>
                <strong>{question.text}</strong>
                <button
                  className="link-btn danger"
                  onClick={() => setBank((rows) => rows.filter((row) => row.id !== question.id))}
                >
                  Remove
                </button>
              </header>
              <OptionList items={question.options} right={question.correct} />
              <footer>
                <span className="muted">
                  {question.source === "ai"
                    ? `Concept · AI-suggested${question.confidence ? ` ${Math.round(question.confidence * 100)}%` : ""}, kept by you`
                    : "Concept · set by you"}
                </span>
                <ConceptPicker
                  value={question.concept}
                  options={allConcepts}
                  label={conceptLabel}
                  onChange={(value) =>
                    setBank((rows) =>
                      rows.map((row) =>
                        row.id === question.id
                          ? { ...row, concept: value, source: "teacher" }
                          : row,
                      ),
                    )
                  }
                  onCreate={onCreateConcept}
                  ariaLabel={`Concept for question ${index + 1}`}
                />
              </footer>
            </article>
          ))}
        </>
      )}

      <p className="muted">
        Simulated: concept suggestions use keyword rules. In the full version a language model reads
        the question and its options; the teacher keeps the final decision.
      </p>
    </section>
  );
}
