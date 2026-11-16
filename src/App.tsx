import { useEffect, useMemo, useState } from "react";
import type {
  AlertStatus,
  Certainty,
  Classification,
  Concept,
  Language,
  PracticeKey,
  Screen,
} from "./types";
import { copy } from "./data/copy";
import {
  concepts,
  conceptPrerequisites,
  questions,
  practiceTasks,
  initialItems,
  historyWeeks,
} from "./data/course";
import { simulatedClass } from "./data/classSim";
import { loadSaved } from "./lib/storage";
import { Icon } from "./components/Icon";
import {
  demoLectures,
  demoSegments,
  focusLabel,
  pickMaterial,
  slideRange,
  type Lecture,
  type Segment,
} from "./data/materials";
import { explainChange, updateStatus } from "./logic/mastery";
import { MaterialViewer } from "./features/materials/MaterialViewer";
import { TeacherMaterials } from "./features/materials/TeacherMaterials";
import { StudentMaterials } from "./features/materials/StudentMaterials";
import { QuestionBank } from "./features/bank/QuestionBank";
import { initialBank, type BankQuestion } from "./data/bank";
import { ConceptPicker } from "./components/ConceptPicker";

function App() {
  const [lang, setLang] = useState<Language>("EN");
  const [view, setView] = useState<"student" | "teacher">("student");
  const [screen, setScreen] = useState<Screen>("diagnose");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(6).fill(null));
  const [certainties, setCertainties] = useState<(Certainty | null)[]>(Array(6).fill(null));
  const [learningGoal, setLearningGoal] = useState<"understand" | "midterm" | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [override, setOverride] = useState<PracticeKey | null>(null);
  const [topicMenu, setTopicMenu] = useState(false);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [hintsOpen, setHintsOpen] = useState(0);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [goal, setGoal] = useState("");
  const [remind, setRemind] = useState(false);
  const [supportChoice, setSupportChoice] = useState<string | null>(null);
  const [alertStatus, setAlertStatus] = useState<AlertStatus>("pending");
  const [items, setItems] = useState(initialItems);
  const [conceptMapping, setConceptMapping] = useState<string[]>(
    questions.map((question) => question.concept),
  );
  const [navNote, setNavNote] = useState(false);
  const [lectures, setLectures] = useState<Lecture[]>(demoLectures);
  const [segments, setSegments] = useState<Segment[]>(demoSegments);
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);
  const [viewer, setViewer] = useState<{
    segmentId?: string;
    lectureId?: string;
    page?: number;
  } | null>(null);
  const [practiceUpdates, setPracticeUpdates] = useState<Partial<Record<string, Classification>>>(
    {},
  );
  const [lastChange, setLastChange] = useState<{
    concept: string;
    from: Classification;
    to: Classification;
    note: string;
  } | null>(null);
  const [hintsPeak, setHintsPeak] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(180);
  const examMode = learningGoal === "midterm";
  useEffect(() => {
    if (view !== "student" || screen !== "practice" || !examMode || feedback === "correct") return;
    const timer = setInterval(() => setSecondsLeft((value) => (value > 0 ? value - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [view, screen, examMode, feedback]);
  const [alertText, setAlertText] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [studentPage, setStudentPage] = useState<
    "assistant" | "progress" | "week5" | "week7" | "grades" | "materials"
  >("assistant");
  const [teacherTab, setTeacherTab] = useState<"overview" | "class" | "bank" | "materials">(
    "overview",
  );
  const [onlySupport, setOnlySupport] = useState(false);
  const [bank, setBank] = useState<BankQuestion[]>(() => loadSaved("bank-v2", initialBank));
  const [customConcepts, setCustomConcepts] = useState<string[]>(() => loadSaved("concepts", []));
  const allConcepts = [...concepts, ...customConcepts];
  const addConcept = (name: string) =>
    setCustomConcepts((list) => (list.includes(name) ? list : [...list, name]));
  const [savedGoal, setSavedGoal] = useState<string>(() => loadSaved("goal", ""));
  useEffect(() => {
    try {
      window.localStorage.setItem("ala-demo-bank-v2", JSON.stringify(bank));
      window.localStorage.setItem("ala-demo-concepts", JSON.stringify(customConcepts));
      window.localStorage.setItem("ala-demo-goal", JSON.stringify(savedGoal));
    } catch {
      /* storage unavailable */
    }
  }, [bank, savedGoal, customConcepts]);
  const c = copy[lang];

  function conceptLabel(concept: string) {
    if (!(concepts as string[]).includes(concept)) return concept;
    if (concept === "Probability basics") return c.probabilityBasics;
    if (concept === "Conditional probability") return c.conditionalProbability;
    if (concept === "Hypothesis testing") return c.hypothesis;
    return c.pValuesInterpretation;
  }

  const assessments = useMemo(
    () =>
      questions.map((question, index) => {
        const correct = answers[index] === question.correct;
        const sure = certainties[index] !== "low";
        const classification: Classification = correct
          ? sure
            ? "Mastered"
            : "Fragile"
          : sure
            ? "Misconception"
            : "Gap";
        return {
          concept: conceptMapping[index],
          classification,
          correct,
          misconception:
            answers[index] === null
              ? null
              : question.misconceptions[answers[index] as number] || null,
        };
      }),
    [answers, certainties, conceptMapping],
  );

  const activeConcepts = useMemo(() => {
    const list = [...concepts];
    conceptMapping.forEach((item) => {
      if (!list.includes(item as Concept)) list.push(item as Concept);
    });
    return list;
  }, [conceptMapping]);

  const conceptStatuses = useMemo(() => {
    const severity: Record<Classification, number> = {
      Mastered: 0,
      Fragile: 1,
      Gap: 2,
      Misconception: 3,
    };
    return activeConcepts.map((concept) => {
      const related = assessments.filter((assessment) => assessment.concept === concept);
      const status = related.reduce<Classification>(
        (worst, assessment) =>
          severity[assessment.classification] > severity[worst] ? assessment.classification : worst,
        "Mastered",
      );
      return { concept, status: practiceUpdates[concept] ?? status };
    });
  }, [assessments, practiceUpdates, activeConcepts]);

  const pickFor = (concept: string) => {
    const status = conceptStatuses.find((item) => item.concept === concept)?.status;
    const own = assessments
      .filter(
        (item) =>
          item.concept === concept && item.classification === "Misconception" && item.misconception,
      )
      .map((item) => item.misconception as string);
    return pickMaterial(segments, concept as Concept, status, own);
  };
  const materialFor = (concept: string) => pickFor(concept)?.segment;
  const lectureOf = (segment: Segment) =>
    lectures.find((lecture) => lecture.id === segment.lectureId);
  const wrongCount = assessments.filter((assessment) => !assessment.correct).length;
  const needsSupport = conceptStatuses.some(
    ({ status }) => status === "Misconception" || status === "Gap",
  );
  const allMastered = conceptStatuses.every(({ status }) => status === "Mastered");
  const planSteps = useMemo<{ key: PracticeKey; label: string }[]>(() => {
    const mode = learningGoal === "midterm" ? c.examStyle : c.stepByStep;
    if (allMastered) return [{ key: "Challenge", label: `${c.challengePractice} · ${mode}` }];
    const priority: Record<Classification, number> = {
      Misconception: 0,
      Gap: 1,
      Fragile: 2,
      Mastered: 3,
    };
    return conceptStatuses
      .filter(({ status }) => status !== "Mastered")
      .sort((a, b) => {
        const statusOrder = priority[a.status] - priority[b.status];
        if (statusOrder !== 0) return statusOrder;
        if (a.status === "Gap") {
          const aPrereq =
            (conceptPrerequisites as Record<string, Concept[]>)[a.concept]?.length ?? 0;
          const bPrereq =
            (conceptPrerequisites as Record<string, Concept[]>)[b.concept]?.length ?? 0;
          const prerequisiteOrder = aPrereq - bPrereq;
          if (prerequisiteOrder !== 0) return prerequisiteOrder;
        }
        return activeConcepts.indexOf(a.concept) - activeConcepts.indexOf(b.concept);
      })
      .slice(0, 2)
      .map(({ concept, status }) => ({
        key: concept,
        label:
          status === "Fragile"
            ? `${conceptLabel(concept)} · ${c.quickRefresher}`
            : `${conceptLabel(concept)} · ${mode}`,
      }));
  }, [activeConcepts, allMastered, c, conceptStatuses, learningGoal]);
  const recommendedPages: Record<string, number[]> = {};
  if (screen !== "diagnose") {
    planSteps.forEach((step) => {
      if (step.key === "Challenge") return;
      const segment = pickFor(step.key)?.segment;
      if (!segment) return;
      const list = (recommendedPages[segment.lectureId] ||= []);
      for (let page = segment.from; page <= segment.to; page += 1)
        if (!list.includes(page)) list.push(page);
    });
    Object.values(recommendedPages).forEach((list) => list.sort((x, y) => x - y));
  }
  const selectedKey: PracticeKey = override || planSteps[0]?.key || "Challenge";
  const keyLabel = (key: PracticeKey) => (key === "Challenge" ? c.challenge : conceptLabel(key));

  const topicLabel = (topic: string) =>
    topic === "Probability" ? c.probability : topic === "Hypothesis testing" ? c.hypothesis : topic;
  const fill = (template: string, values: Record<string, string | number>) =>
    Object.entries(values).reduce(
      (result, [key, value]) => result.replace(`{${key}}`, String(value)),
      template,
    );

  function reset() {
    setLectures(demoLectures);
    setSegments(demoSegments);
    setReviewedIds([]);
    setViewer(null);
    setPracticeUpdates({});
    setLastChange(null);
    setHintsPeak(0);
    setView("student");
    setScreen("diagnose");
    setQIndex(0);
    setAnswers(Array(6).fill(null));
    setCertainties(Array(6).fill(null));
    setLearningGoal(null);
    setReasoning("");
    setOverride(null);
    setTopicMenu(false);
    setPracticeAnswer("");
    setAttempts(0);
    setFeedback(null);
    setHintsOpen(0);
    setConfidence(null);
    setGoal("");
    setRemind(false);
    setSupportChoice(null);
    setAlertStatus("pending");
    setItems(initialItems);
    setConceptMapping(questions.map((question) => question.concept));
    setNavNote(false);
    setSecondsLeft(180);
    setAlertText(null);
    setEditingItem(null);
    setStudentPage("assistant");
    setTeacherTab("overview");
    setOnlySupport(false);
    setSavedGoal("");
    setBank(initialBank);
    setCustomConcepts([]);
  }

  function answerCurrent(value: number) {
    setAnswers((current) => current.map((answer, index) => (index === qIndex ? value : answer)));
  }

  function advanceQuiz() {
    if (qIndex < questions.length - 1) setQIndex((index) => index + 1);
    else setScreen("recommend");
  }

  function checkAnswer() {
    const normalized = practiceAnswer.trim().toLowerCase();
    const task = (practiceTasks as Record<string, { accept: string[] }>)[selectedKey];
    const isCorrect =
      selectedKey === "Hypothesis testing"
        ? ["yes", "y", "да", "иә", "reject", "отклонить", "жоққа шығару"].some((term) =>
            normalized.includes(term),
          )
        : selectedKey === "p-values interpretation"
          ? normalized === "b" || normalized.startsWith("b)")
          : (task?.accept ?? ["0.5", "1/2"]).some((term) =>
              selectedKey === "Challenge"
                ? normalized.startsWith(term) && !normalized.includes("chi")
                : normalized === term || normalized === term + "%",
            );
    setFeedback(isCorrect ? "correct" : "incorrect");
    if (!isCorrect) setAttempts((value) => value + 1);
  }

  function TopBar() {
    return (
      <header className="topbar">
        <div className="brand">
          <strong>{c.university}</strong>
        </div>
        <div className="top-actions">
          <div className="view-toggle" aria-label="View switch">
            <button
              className={view === "student" ? "active" : ""}
              onClick={() => setView("student")}
            >
              {c.studentView}
            </button>
            <span>|</span>
            <button
              className={view === "teacher" ? "active" : ""}
              onClick={() => setView("teacher")}
            >
              {c.teacherView}
            </button>
          </div>
          <div className="languages" aria-label="Language switch">
            {(["EN", "RU", "KZ"] as Language[]).map((language, index) => (
              <span key={language}>
                <button
                  className={lang === language ? "active" : ""}
                  onClick={() => setLang(language)}
                >
                  {language}
                </button>
                {index < 2 && " | "}
              </span>
            ))}
          </div>
          {view === "student" && (
            <div className="user">
              <Icon name="user" size={17} /> Aruzhan S.
            </div>
          )}
          <button className="reset-link" onClick={reset}>
            {c.reset}
          </button>
        </div>
      </header>
    );
  }

  function SimulatedLabel() {
    return (
      <div className="simulated">
        <span className="status-dot" />
        {c.simulated}
      </div>
    );
  }

  function Sidebar() {
    return (
      <aside className="sidebar">
        <div className="course-label">COURSE</div>
        <div className="course-title">
          <Icon name="book" /> <span>{c.course}</span>
        </div>
        <nav>
          {[5, 6, 7].map((week) => (
            <button
              key={week}
              className={
                (week === 6 && studentPage === "assistant") ||
                (week === 7 && studentPage === "week7") ||
                (week === 5 && studentPage === "week5")
                  ? "nav-item current-week"
                  : "nav-item"
              }
              onClick={() => {
                setNavNote(false);
                setStudentPage(week === 5 ? "week5" : week === 7 ? "week7" : "assistant");
              }}
            >
              <span>
                {c.week} {week}
              </span>
              {week === 6 && <Icon name="chevron" size={16} />}
            </button>
          ))}
          <button
            className={studentPage === "progress" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setNavNote(false);
              setStudentPage("progress");
            }}
          >
            <span className="nav-with-icon">
              <Icon name="chart" size={17} />
              My progress
            </span>
          </button>
          <button
            className={studentPage === "materials" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setNavNote(false);
              setStudentPage("materials");
            }}
          >
            <span className="nav-with-icon">
              <Icon name="book" size={17} />
              Materials
            </span>
          </button>
          <button
            className={studentPage === "grades" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setNavNote(false);
              setStudentPage("grades");
            }}
          >
            <span className="nav-with-icon">
              <Icon name="book" size={17} />
              {c.grades}
            </span>
          </button>
          <button
            className={studentPage === "assistant" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setNavNote(false);
              setStudentPage("assistant");
            }}
          >
            <span className="nav-with-icon">
              <Icon name="spark" size={17} />
              BilimQadam
            </span>
            <span className="nav-sub">{c.assistant}</span>
          </button>
        </nav>
        {navNote && <div className="nav-note">{c.notInDemo}</div>}
        <div className="sidebar-term">Fall semester · 2026</div>
      </aside>
    );
  }

  function Diagnose() {
    const q = questions[qIndex];
    return (
      <div className="content-narrow">
        <div className="eyebrow">
          {c.assistant} / {c.checkin.split(" · ")[0]}
        </div>
        <h1>{c.checkin}</h1>
        <div className="question-progress">
          <div className="progress-meta">
            <strong>
              {c.question} {qIndex + 1} {c.of} {questions.length}
            </strong>
            <span>{Math.round(((qIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }} />
          </div>
        </div>
        <section className="panel question-card">
          <div className="question-number">0{qIndex + 1}</div>
          <h2>{q.text}</h2>
          <div className="options">
            {q.options.map((option, index) => (
              <label
                className={`option ${answers[qIndex] === index ? "selected" : ""}`}
                key={option}
              >
                <input
                  type="radio"
                  name={`q-${qIndex}`}
                  checked={answers[qIndex] === index}
                  onChange={() => answerCurrent(index)}
                />
                <span className="radio-custom" />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {qIndex === 3 && (
            <>
              <label className="field-label" htmlFor="quiz-reasoning">
                {c.reasoning}
              </label>
              <input
                id="quiz-reasoning"
                className="text-input"
                value={reasoning}
                onChange={(event) => setReasoning(event.target.value)}
                placeholder={c.reasoningPlaceholder}
              />
            </>
          )}
          <div className="confidence-row">
            <span>{c.confLabel}</span>
            {(["low", "medium", "high"] as Certainty[]).map((level) => (
              <label
                key={level}
                className={`conf-option ${certainties[qIndex] === level ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name={`conf-${qIndex}`}
                  checked={certainties[qIndex] === level}
                  onChange={() =>
                    setCertainties((current) =>
                      current.map((certainty, index) => (index === qIndex ? level : certainty)),
                    )
                  }
                />
                {level === "low" ? c.confLow : level === "medium" ? c.confMed : c.confHigh}
              </label>
            ))}
          </div>
          <div className="button-row">
            {qIndex > 0 && (
              <button className="btn secondary" onClick={() => setQIndex((index) => index - 1)}>
                {c.back}
              </button>
            )}
            <button
              className="btn primary"
              disabled={answers[qIndex] === null || certainties[qIndex] === null}
              onClick={() => advanceQuiz()}
            >
              {qIndex === questions.length - 1 ? c.results : c.next}
            </button>
          </div>
        </section>
        <p className="supporting-note">
          <Icon name="info" size={17} />
          {c.note}
        </p>
      </div>
    );
  }

  function Results() {
    const misconceptionAnswers = assessments.filter(
      (assessment) => assessment.classification === "Misconception",
    );
    const misconceptionCounts = misconceptionAnswers.reduce<Record<string, number>>(
      (counts, assessment) => {
        if (assessment.misconception) {
          counts[assessment.misconception] = (counts[assessment.misconception] || 0) + 1;
        }
        return counts;
      },
      {},
    );
    const topMisconception = Object.entries(misconceptionCounts).sort((a, b) => b[1] - a[1])[0];
    const reasoningText = reasoning.toLowerCase();
    const reasoningFlag =
      /(probab|chance|likel|вероятн|шанс|ықтимал).{0,40}(h0|null|нулев|нөлдік).{0,20}(true|верн|истин|ақиқат|дұрыс)/.test(
        reasoningText,
      ) ||
      /(h0|null|нулев|нөлдік).{0,30}(true|верн|истин|ақиқат).{0,30}(probab|chance|вероятн|ықтимал)/.test(
        reasoningText,
      );
    const confidentWrong = misconceptionAnswers.length;
    const whyLines: string[] = allMastered
      ? [c.whyMastered]
      : planSteps.map((step, index) => {
          if (step.key === "Challenge") return c.whyMastered;
          const related = assessments.filter((item) => item.concept === step.key);
          const wrongSure = related.filter((item) => item.classification === "Misconception");
          const wrongUnsure = related.filter((item) => item.classification === "Gap");
          const rightUnsure = related.filter((item) => item.classification === "Fragile");
          const name = conceptLabel(step.key);
          const n = (k: number, word: string) => `${k} ${word}${k === 1 ? "" : "s"}`;
          let reason = "";
          if (wrongSure.length) {
            const kinds = Array.from(
              new Set(wrongSure.map((item) => item.misconception).filter(Boolean)),
            );
            const toYou = (text: string) => text.replace(/^(\w+?)s /, "$1 ");
            reason = `you answered ${n(wrongSure.length, "question")} confidently but incorrectly. Your ${wrongSure.length === 1 ? "answer suggests" : "answers suggest"} that you ${kinds.map((k) => toYou(k as string)).join(", and ")}.`;
          } else if (wrongUnsure.length) {
            reason = `you were unsure and answered ${n(wrongUnsure.length, "question")} incorrectly, so this needs a step-by-step explanation.`;
          } else if (rightUnsure.length) {
            reason = `you answered correctly but were not confident (${n(rightUnsure.length, "question")}), so a short refresher is enough.`;
          }
          return `Step ${index + 1} · ${name}: ${reason}`;
        });
    const firstNeed = conceptStatuses.find(({ status }) => status !== "Mastered");
    const why = topMisconception
      ? fill(c.whyConfident, {
          count: confidentWrong,
          questions: lang === "RU" ? "вопроса" : "сұраққа",
          options: lang === "RU" ? "варианты" : "нұсқаларды",
          misconception: topMisconception[0],
        })
      : allMastered
        ? c.whyMastered
        : firstNeed?.status === "Gap"
          ? fill(c.whyGap, { concept: conceptLabel(firstNeed.concept) })
          : fill(c.whyFragile, { concept: firstNeed ? conceptLabel(firstNeed.concept) : "" });
    const statusText = (status: Classification) =>
      status === "Mastered"
        ? c.mastered
        : status === "Fragile"
          ? c.fragile
          : status === "Gap"
            ? c.gap
            : c.misconception;
    return (
      <div className="content-wide">
        <div className="eyebrow">
          {c.assistant} / {c.yourResults}
        </div>
        <h1>{c.yourResults}</h1>
        <div className="score-line">
          <strong>
            {fill(c.score, { correct: questions.length - wrongCount, total: questions.length })}
          </strong>
          <span>· {c.checkin.split(" · ").slice(-1)[0]}</span>
        </div>
        <p className="lead">{c.resultIntro}</p>
        {lastChange && (
          <div className="update-banner">
            <Icon name="check" size={17} />
            <span>
              Updated after practice: <strong>{conceptLabel(lastChange.concept)}</strong>{" "}
              {lastChange.from === lastChange.to ? (
                <>stays {lastChange.to}</>
              ) : (
                <>
                  {lastChange.from} → {lastChange.to}
                </>
              )}
              . {lastChange.note}
            </span>
          </div>
        )}
        <section className="panel result-panel">
          <div className="result-heading">
            <div>
              <h2>{c.detected}</h2>
              <p>{c.inferredNote}</p>
            </div>
          </div>
          {conceptStatuses.map(({ concept, status }) => (
            <div className="concept-row" key={concept}>
              <strong>{conceptLabel(concept)}</strong>
              <span className={`concept-chip ${status.toLowerCase()}`}>{statusText(status)}</span>
            </div>
          ))}
        </section>
        <section className="recommend-card">
          <div className="recommend-icon">
            <Icon name="spark" />
          </div>
          <div className="recommend-content">
            <div className="plan-header">
              <div className="section-label">{c.suggestedPlan}</div>
              <label className="exam-toggle">
                <input
                  type="checkbox"
                  checked={learningGoal === "midterm"}
                  onChange={(event) =>
                    setLearningGoal(event.target.checked ? "midterm" : "understand")
                  }
                />
                {c.examToggle}
              </label>
            </div>
            {wrongCount > 4 ? (
              <div className="review-plan">
                <strong>{c.shortReview}</strong>
                <button onClick={() => setSupportChoice("teacher")}>{c.talkTeacher}</button>
              </div>
            ) : (
              <div className="plan-list">
                {planSteps.map((step, index) => {
                  const pick = step.key === "Challenge" ? undefined : pickFor(step.key);
                  const material = pick?.segment;
                  const lecture = material ? lectureOf(material) : undefined;
                  const slideRef = material
                    ? material.from === material.to
                      ? `slide ${material.from}`
                      : `slides ${material.from}–${material.to}`
                    : "";
                  const slideTitle =
                    material && lecture && material.from === material.to
                      ? lecture.slides.find((slide) => slide.page === material.from)?.title
                      : undefined;
                  return (
                    <div className="plan-step-wrap" key={step.label}>
                      <div className="plan-step">
                        <span>{index + 1}</span>
                        <strong>{step.label}</strong>
                      </div>
                      {material && lecture && (
                        <div className="plan-material">
                          <Icon name="book" size={15} />
                          <span>
                            First review: <strong>{lecture.title.split(" · ")[0]}</strong> ·{" "}
                            {slideRef}
                            {slideTitle ? ` “${slideTitle}”` : ""}
                            <small className="material-why">
                              {focusLabel[material.focus ?? "explanation"]} · {pick?.reason}
                            </small>
                          </span>
                          {reviewedIds.includes(material.id) ? (
                            <span className="status-pill approved">Reviewed</span>
                          ) : (
                            <button
                              className="link-btn"
                              onClick={() => setViewer({ segmentId: material.id })}
                            >
                              Open slides
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {override && (
              <div className="inline-confirm">
                <Icon name="check" size={16} /> {c.choose}: {keyLabel(override)}
              </div>
            )}
            <details>
              <summary>{c.why}</summary>
              {lang === "EN" ? (
                <>
                  {!allMastered && (
                    <p className="muted">
                      Confident but wrong: {confidentWrong} of {questions.length} answers · total
                      wrong: {wrongCount} of {questions.length}
                    </p>
                  )}
                  <ul className="why-list">
                    {whyLines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>{why}</p>
              )}
              {reasoningFlag && <p className="reasoning-flag">{c.reasoningFlag}</p>}
            </details>
            <div className="button-row">
              <button
                className="btn primary"
                onClick={() => {
                  setPracticeAnswer("");
                  setFeedback(null);
                  setAttempts(0);
                  setHintsOpen(0);
                  setHintsPeak(0);
                  setSecondsLeft(180);
                  setScreen("practice");
                }}
              >
                {c.start}
              </button>
              <button className="btn secondary" onClick={() => setTopicMenu(true)}>
                {c.choose}
              </button>
              <button className="btn secondary" onClick={() => setSupportChoice("teacher")}>
                {c.askTeacher}
              </button>
            </div>
            {supportChoice === "teacher" && (
              <div className="inline-confirm">
                <Icon name="check" size={16} /> {c.requestSent}
              </div>
            )}
          </div>
        </section>
        {topicMenu && (
          <div className="modal-backdrop" onClick={() => setTopicMenu(false)}>
            <div className="modal" onClick={(event) => event.stopPropagation()}>
              <h2>{c.chooseTitle}</h2>
              <div className="topic-list">
                {([...allConcepts, "Challenge"] as PracticeKey[]).map((key) => (
                  <button
                    key={key}
                    className={`topic-option ${selectedKey === key ? "selected" : ""}`}
                    onClick={() => {
                      setOverride(key);
                      setTopicMenu(false);
                    }}
                  >
                    <span>{keyLabel(key)}</span>
                    {planSteps[0]?.key === key && <small>{c.recommended}</small>}
                  </button>
                ))}
              </div>
              <div className="button-row">
                <button className="btn secondary" onClick={() => setTopicMenu(false)}>
                  {c.cancel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function finishPractice() {
    if (selectedKey !== "Challenge") {
      const current = conceptStatuses.find((item) => item.concept === selectedKey)?.status ?? "Gap";
      const outcome = {
        correct: feedback === "correct",
        hintsUsed: Math.max(hintsPeak, hintsOpen),
        examMode,
      };
      const next = updateStatus(current, outcome);
      setPracticeUpdates((map) => ({ ...map, [selectedKey]: next }));
      setLastChange({
        concept: selectedKey,
        from: current,
        to: next,
        note: explainChange(current, next, outcome),
      });
    }
    setScreen("reflect");
  }

  function Practice() {
    const localized = selectedKey === "Hypothesis testing";
    const t = localized
      ? null
      : (practiceTasks as Record<string, (typeof practiceTasks)["Probability basics"]>)[
          selectedKey
        ];
    const taskTopic = keyLabel(selectedKey);
    const taskText = t ? t.task : c.task;
    const correctText = t ? t.correct : c.correct;
    const incorrectText = t ? t.incorrect : c.incorrect;
    const hintTexts = t ? t.hints : [c.hint1Text, c.hint2Text, c.hint3Text];
    const hintMaterial = selectedKey === "Challenge" ? undefined : materialFor(selectedKey);
    const hintLecture = hintMaterial ? lectureOf(hintMaterial) : undefined;
    return (
      <div className="content-wide">
        <div className="eyebrow">
          {c.assistant} / {taskTopic}
        </div>
        <h1>{fill(c.taskTitle, { topic: taskTopic })}</h1>
        <div className="practice-grid">
          <section className="panel task-card">
            <div className="task-meta">
              <div className="task-tag">STATISTICS 101 · WEEK 6</div>
              <span className={`mode-badge ${examMode ? "exam" : ""}`}>
                {examMode ? c.examBadge : c.stepBadge}
                {examMode && (
                  <strong>
                    {" "}
                    · {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
                  </strong>
                )}
              </span>
            </div>
            {examMode && secondsLeft === 0 && feedback !== "correct" && (
              <div className="feedback incorrect">
                <Icon name="info" size={18} />
                <span>{c.timeUp}</span>
              </div>
            )}
            <h2>{taskText}</h2>
            <label className="field-label" htmlFor="answer">
              {c.answer}
            </label>
            <input
              id="answer"
              className="text-input"
              value={practiceAnswer}
              onChange={(event) => {
                setPracticeAnswer(event.target.value);
                setFeedback(null);
              }}
              placeholder={c.answerPlaceholder}
            />
            {feedback && (
              <div className={`feedback ${feedback}`}>
                <Icon name={feedback === "correct" ? "check" : "info"} size={18} />
                <span>{feedback === "correct" ? correctText : incorrectText}</span>
              </div>
            )}
            {attempts >= 2 && feedback === "incorrect" && !examMode && (
              <button
                className="hint-prompt"
                onClick={() => {
                  setHintsPeak((peak) => Math.max(peak, 2));
                  setHintsOpen(Math.max(2, hintsOpen));
                }}
              >
                {c.tryHint} <Icon name="chevron" size={15} />
              </button>
            )}
            <div className="button-row">
              <button
                className="btn primary"
                disabled={!practiceAnswer.trim()}
                onClick={checkAnswer}
              >
                {c.check}
              </button>
              {feedback && (
                <button className="btn secondary" onClick={finishPractice}>
                  {c.continue}
                </button>
              )}
            </div>
          </section>
          <aside className="hint-panel">
            <h2>{c.hintPanel}</h2>
            <p>{c.tryFirst}</p>
            {[1, 2, 3].map((level) => {
              const examBlocked = examMode && level > 1;
              const unlocked = !examBlocked && (level === 1 || hintsOpen >= level - 1);
              const open = hintsOpen >= level;
              const title = level === 1 ? c.hint1 : level === 2 ? c.hint2 : c.hint3;
              const text = hintTexts[level - 1];
              return (
                <div className={`hint ${!unlocked ? "locked" : ""}`} key={level}>
                  <button
                    disabled={!unlocked}
                    onClick={() => {
                      if (!open) setHintsPeak((peak) => Math.max(peak, level));
                      setHintsOpen(open ? level - 1 : Math.max(hintsOpen, level));
                    }}
                  >
                    <span>
                      {!unlocked && <Icon name="lock" size={15} />} {title}
                    </span>
                    {unlocked && <span>{open ? "−" : "+"}</span>}
                  </button>
                  {open && <p>{text}</p>}
                  {open && level === 2 && hintMaterial && hintLecture && (
                    <button
                      className="link-btn"
                      onClick={() =>
                        setViewer({ segmentId: hintMaterial.id, page: hintMaterial.from })
                      }
                    >
                      See {hintLecture.title.split(" · ")[0]}, {slideRange(hintMaterial)}
                    </button>
                  )}
                  {!unlocked && <small>{examBlocked ? c.examLocked : c.locked}</small>}
                </div>
              );
            })}
          </aside>
        </div>
      </div>
    );
  }

  function Reflect() {
    const showSupport = (confidence !== null && confidence <= 2 && needsSupport) || hintsOpen >= 3;
    return (
      <div className="content-narrow">
        <div className="eyebrow">
          {c.assistant} / {c.beforeFinish}
        </div>
        <h1>{c.beforeFinish}</h1>
        <section className="panel reflect-card">
          <h2>{c.confidence}</h2>
          <div className="confidence-scale">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className={confidence === value ? "selected" : ""}
                onClick={() => setConfidence(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="scale-labels">
            <span>{c.low}</span>
            <span>{c.high}</span>
          </div>
          <label className="field-label" htmlFor="goal">
            {c.goal}
          </label>
          <textarea
            id="goal"
            className="text-input"
            rows={3}
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            placeholder={c.goalPlaceholder}
          />
          <label className="checkbox">
            <input
              type="checkbox"
              checked={remind}
              onChange={(event) => setRemind(event.target.checked)}
            />
            <span>{c.remind}</span>
          </label>
          {showSupport && (
            <div className="support-card">
              <strong>{c.support}</strong>
              <div className="button-row">
                <button className="btn secondary" onClick={() => setSupportChoice("teacher")}>
                  {c.askTeacher}
                </button>
                <button className="btn secondary" onClick={() => setSupportChoice("office")}>
                  {c.office}
                </button>
              </div>
              {supportChoice && (
                <div className="inline-confirm">
                  <Icon name="check" size={16} />
                  {supportChoice === "teacher" ? c.requestSent : c.officeSent}
                </div>
              )}
            </div>
          )}
          <div className="button-row">
            <button
              className="btn secondary"
              onClick={() => {
                if (goal) setSavedGoal(goal);
                setOverride(null);
                setPracticeAnswer("");
                setFeedback(null);
                setAttempts(0);
                setHintsOpen(0);
                setScreen("recommend");
              }}
            >
              Back to my updated plan
            </button>
            <button
              className="btn primary"
              disabled={confidence === null}
              onClick={() => {
                setSavedGoal(goal);
                setStudentPage("progress");
                window.scrollTo(0, 0);
              }}
            >
              {c.save}
            </button>
          </div>
        </section>
      </div>
    );
  }

  const statusClass = (status: Classification) => status.toLowerCase();
  const statusShort = (status: Classification) =>
    status === "Mastered"
      ? "Mastered"
      : status === "Fragile"
        ? "Fragile"
        : status === "Gap"
          ? "Gap"
          : "Misconc.";
  const quizDone = screen !== "diagnose";

  function Progress() {
    const rows = [...historyWeeks];
    return (
      <div className="content-wide">
        <div className="eyebrow">STATISTICS 101 / MY PROGRESS</div>
        <h1>My progress</h1>
        <p className="lead">
          How each concept changed across weekly check-ins. Check-ins are not graded.
        </p>
        <section className="panel">
          <div className="table-wrap">
            <table className="progress-table">
              <thead>
                <tr>
                  <th>Concept</th>
                  {rows.map((row) => (
                    <th key={row.week}>
                      Week {row.week}
                      <small>
                        {row.date} · {row.score}
                      </small>
                    </th>
                  ))}
                  <th>
                    Week 6
                    <small>
                      {quizDone
                        ? `this week · ${questions.length - wrongCount} of 6`
                        : "not taken yet"}
                    </small>
                  </th>
                </tr>
              </thead>
              <tbody>
                {concepts.map((concept) => {
                  const now = conceptStatuses.find((item) => item.concept === concept)?.status;
                  return (
                    <tr key={concept}>
                      <td>
                        <strong>{conceptLabel(concept)}</strong>
                      </td>
                      {rows.map((row) => (
                        <td key={row.week}>
                          <span className={`concept-chip ${statusClass(row.statuses[concept])}`}>
                            {row.statuses[concept]}
                          </span>
                        </td>
                      ))}
                      <td>
                        {quizDone && now ? (
                          <>
                            <span className={`concept-chip ${statusClass(now)}`}>{now}</span>
                            {practiceUpdates[concept] && (
                              <small className="after-practice">after practice</small>
                            )}
                          </>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
        <div className="progress-grid">
          <section className="panel">
            <div className="section-label">YOUR GOAL</div>
            <p>{savedGoal || "No goal saved yet. You can set one at the end of a check-in."}</p>
          </section>
          <section className="panel">
            <div className="section-label">WHAT CHANGED</div>
            <p>
              Probability basics moved from Gap to Mastered after Week 5 practice. p-values
              interpretation is still the main focus.
            </p>
          </section>
        </div>
        {!quizDone && (
          <button className="btn primary" onClick={() => setStudentPage("assistant")}>
            Take the Week 6 check-in
          </button>
        )}
      </div>
    );
  }

  function Week5() {
    const week = historyWeeks[1];
    return (
      <div className="content-narrow">
        <div className="eyebrow">STATISTICS 101 / WEEK 5</div>
        <h1>Week 5 check-in</h1>
        <div className="score-line">
          <strong>{week.score} correct</strong>
          <span>· completed {week.date} · not graded</span>
        </div>
        <section className="panel result-panel">
          <div className="result-heading">
            <div className="section-label">CONCEPTS</div>
          </div>
          {concepts.map((concept) => (
            <div className="concept-row" key={concept}>
              <strong>{conceptLabel(concept)}</strong>
              <span className={`concept-chip ${statusClass(week.statuses[concept])}`}>
                {week.statuses[concept]}
              </span>
            </div>
          ))}
        </section>
        <section className="panel week-plan-panel">
          <div className="section-label">PLAN YOU COMPLETED</div>
          <ul className="done-list">
            <li>
              <Icon name="check" size={16} /> p-values interpretation · step-by-step practice · 3
              hints used
            </li>
            <li>
              <Icon name="check" size={16} /> Hypothesis testing · quick refresher
            </li>
          </ul>
          <p className="muted">Goal you set: "Ask about p-values in the seminar."</p>
        </section>
        <div className="button-row">
          <button className="btn secondary" onClick={() => setStudentPage("progress")}>
            See all weeks in My progress
          </button>
          <button className="btn primary" onClick={() => setStudentPage("assistant")}>
            Go to Week 6 check-in
          </button>
        </div>
      </div>
    );
  }

  function Grades() {
    const graded = [
      {
        item: "Assignment 1 · Descriptive statistics",
        weight: "10%",
        result: "17 / 20",
        by: "Teacher",
        date: "19 Oct",
      },
      {
        item: "Assignment 2 · Probability",
        weight: "10%",
        result: "15 / 20",
        by: "Teacher",
        date: "2 Nov",
      },
      {
        item: "Midterm exam",
        weight: "30%",
        result: "Scheduled · 30 Nov",
        by: "Teacher",
        date: "—",
      },
      { item: "Group project", weight: "20%", result: "In progress", by: "Teacher", date: "—" },
      { item: "Final exam", weight: "30%", result: "Scheduled", by: "Teacher", date: "—" },
    ];
    return (
      <div className="content-wide">
        <div className="eyebrow">STATISTICS 101 / GRADES</div>
        <h1>Grades</h1>
        <p className="lead">Summative assessment. All marks are given by your teacher.</p>
        <section className="panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Weight</th>
                  <th>Result</th>
                  <th>Marked by</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {graded.map((row) => (
                  <tr key={row.item}>
                    <td>
                      <strong>{row.item}</strong>
                    </td>
                    <td>{row.weight}</td>
                    <td>{row.result}</td>
                    <td>{row.by}</td>
                    <td>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="panel info-panel">
          <Icon name="info" size={18} />
          <div>
            <strong>Weekly check-ins are not here.</strong>
            <p>
              Assistant check-ins are formative: they guide practice and are never graded. The
              assistant does not read or change this page, and its data is not used for marks.
            </p>
          </div>
        </section>
        <section className="panel callout-panel">
          <div className="section-label">BEFORE THE MIDTERM</div>
          <p>
            Your check-ins show p-values interpretation as the main focus. Exam-style practice is
            available in the Assistant.
          </p>
          <button
            className="btn secondary"
            onClick={() => {
              setLearningGoal("midterm");
              setStudentPage("assistant");
            }}
          >
            Practise in exam style
          </button>
        </section>
      </div>
    );
  }

  function Week7() {
    return (
      <div className="content-narrow">
        <div className="eyebrow">STATISTICS 101 / WEEK 7</div>
        <h1>Week 7 check-in</h1>
        <section className="panel locked-panel">
          <Icon name="lock" size={22} />
          <div>
            <strong>Opens on Monday, 23 November</strong>
            <p>
              {bank.length} question{bank.length === 1 ? "" : "s"} prepared by your teacher so far.
              Topics are mapped by the assistant and confirmed by the teacher.
            </p>
          </div>
        </section>
        <ul className="week7-list">
          {bank.map((question) => (
            <li key={question.id}>
              <span className={`concept-chip fragile`}>{conceptLabel(question.concept)}</span>
              <span className="muted">Question hidden until the check-in opens</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function ClassView() {
    const demoRow = {
      name: "Aruzhan S. (demo)",
      statuses: Object.fromEntries(
        conceptStatuses.map(({ concept, status }) => [concept, status]),
      ) as Record<Concept, Classification>,
      score: Math.round(((questions.length - wrongCount) / questions.length) * 100),
    };
    const roster = quizDone ? [demoRow, ...simulatedClass] : simulatedClass;
    const visible = onlySupport
      ? roster.filter((row) =>
          Object.values(row.statuses).some((s) => s === "Gap" || s === "Misconception"),
        )
      : roster;
    return (
      <section className="table-section">
        <div className="section-heading">
          <div>
            <h2>Class overview · Group 3</h2>
            <p>Status per concept from the Week 6 check-in (simulated class data).</p>
          </div>
          <label className="exam-toggle">
            <input
              type="checkbox"
              checked={onlySupport}
              onChange={(e) => setOnlySupport(e.target.checked)}
            />
            Only students needing support
          </label>
        </div>
        <div className="concept-summary">
          {concepts.map((concept) => {
            const mis = roster.filter((row) => row.statuses[concept] === "Misconception").length;
            const gap = roster.filter((row) => row.statuses[concept] === "Gap").length;
            return (
              <div key={concept} className="summary-card">
                <span>{conceptLabel(concept)}</span>
                <strong>{mis + gap}</strong>
                <small>
                  {mis} misconception · {gap} gap
                </small>
              </div>
            );
          })}
        </div>
        <div className="table-wrap">
          <table className="heatmap">
            <thead>
              <tr>
                <th>Student</th>
                {concepts.map((concept) => (
                  <th key={concept}>{conceptLabel(concept)}</th>
                ))}
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.name} className={row.name.includes("demo") ? "demo-row" : ""}>
                  <td>
                    <strong>{row.name}</strong>
                  </td>
                  {concepts.map((concept) => (
                    <td key={concept}>
                      <span className={`heat ${statusClass(row.statuses[concept])}`}>
                        {statusShort(row.statuses[concept])}
                      </span>
                    </td>
                  ))}
                  <td>{row.score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  function TeacherDashboard() {
    const roster = quizDone
      ? [
          ...simulatedClass.map((row) => row.statuses),
          Object.fromEntries(
            conceptStatuses.map(({ concept, status }) => [concept, status]),
          ) as Record<Concept, Classification>,
        ]
      : simulatedClass.map((row) => row.statuses);
    const supportCount = roster.filter((st) =>
      Object.values(st).some((x) => x === "Gap" || x === "Misconception"),
    ).length;
    const pMis = roster.filter((st) => st["p-values interpretation"] === "Misconception").length;
    const avgScore = Math.round(
      (simulatedClass.reduce((sum, row) => sum + row.score, 0) +
        (quizDone ? ((questions.length - wrongCount) / questions.length) * 100 : 0)) /
        (simulatedClass.length + (quizDone ? 1 : 0)),
    );
    const defaultAlert =
      lang === "EN"
        ? `${pMis} students share a misconception: treating the p-value as the probability that H0 is true. Suggestion: address it in Thursday seminar.`
        : c.stuck.replace(/\d+/, String(pMis));
    const suggestion = alertText ?? defaultAlert;
    const alertMessage =
      alertStatus === "approved"
        ? `${c.alertApproved} ${suggestion}`
        : alertStatus === "dismissed"
          ? c.alertDismissed
          : suggestion;
    return (
      <main className="teacher-main">
        {SimulatedLabel()}
        <div className="teacher-heading">
          <div>
            <div className="eyebrow">COURSE DASHBOARD / WEEK 6</div>
            <h1>{c.teacherTitle}</h1>
          </div>
          <div className="updated">
            Group 3 · {roster.length} students · updated from current demo session
          </div>
        </div>
        <div className="teacher-tabs">
          {(
            [
              ["overview", "Overview"],
              ["class", "Class overview"],
              ["bank", "Question bank"],
              [
                "materials",
                `Materials${segments.some((x) => x.status === "pending") ? ` (${segments.filter((x) => x.status === "pending").length})` : ""}`,
              ],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              className={teacherTab === key ? "active" : ""}
              onClick={() => setTeacherTab(key)}
            >
              {label}
            </button>
          ))}
        </div>
        {teacherTab === "class" && ClassView()}
        {teacherTab === "bank" && (
          <QuestionBank
            bank={bank}
            setBank={setBank}
            week6={questions}
            week6Mapping={conceptMapping}
            onRemapWeek6={(index, concept) =>
              setConceptMapping((current) =>
                current.map((value, i) => (i === index ? concept : value)),
              )
            }
            builtIn={concepts}
            allConcepts={allConcepts}
            onCreateConcept={addConcept}
            conceptLabel={conceptLabel}
          />
        )}
        {teacherTab === "materials" && (
          <TeacherMaterials
            lectures={lectures}
            segments={segments}
            concepts={allConcepts}
            onCreateConcept={addConcept}
            conceptLabel={conceptLabel}
            reviewedIds={reviewedIds}
            onAddLecture={(lecture, newSegments) => {
              setLectures((list) => [...list, lecture]);
              setSegments((list) => [...list, ...newSegments]);
            }}
            onUpdateSegment={(id, patch) =>
              setSegments((list) =>
                list.map((segment) => (segment.id === id ? { ...segment, ...patch } : segment)),
              )
            }
          />
        )}
        {teacherTab === "overview" && (
          <>
            <div className="summary-grid">
              <div className="summary-card">
                <span>{c.active}</span>
                <strong>{roster.length}</strong>
                <small>Group 3, Statistics 101</small>
              </div>
              <div className="summary-card">
                <span>{c.average}</span>
                <strong>{avgScore}%</strong>
                <small>Across {roster.length} students</small>
              </div>
              <div className="summary-card attention">
                <span>{c.needing}</span>
                <strong>{supportCount}</strong>
                <small>Review recommended</small>
              </div>
            </div>
            <section className={`alert-card ${alertStatus}`}>
              <div className="alert-symbol">
                <Icon name="info" />
              </div>
              <div>
                <div className="section-label">LEARNING ALERT</div>
                {alertStatus === "editing" ? (
                  <div className="alert-edit">
                    <textarea
                      className="text-input"
                      rows={3}
                      value={suggestion}
                      onChange={(event) => setAlertText(event.target.value)}
                    />
                  </div>
                ) : (
                  <h2>{alertMessage}</h2>
                )}
              </div>
              {alertStatus !== "dismissed" && (
                <div className="alert-actions">
                  <button className="btn primary" onClick={() => setAlertStatus("approved")}>
                    {c.approve}
                  </button>
                  {alertStatus === "editing" ? (
                    <button className="btn secondary" onClick={() => setAlertStatus("pending")}>
                      {c.saveChanges}
                    </button>
                  ) : (
                    <button className="btn secondary" onClick={() => setAlertStatus("editing")}>
                      {c.edit}
                    </button>
                  )}
                  <button className="btn text" onClick={() => setAlertStatus("dismissed")}>
                    {c.dismiss}
                  </button>
                </div>
              )}
            </section>
            <section className="table-section">
              <div className="section-heading">
                <div>
                  <h2>{c.mapping}</h2>
                  <p>{c.mappingNote}</p>
                </div>
                <span>{questions.length} questions · published</span>
              </div>
              <div className="table-wrap mapping-table">
                <table>
                  <thead>
                    <tr>
                      <th>{c.question}</th>
                      <th>{c.detectedConcept}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question, index) => (
                      <tr key={question.text}>
                        <td>
                          <strong>
                            {c.question} {index + 1}
                          </strong>
                          <small>{question.text}</small>
                        </td>
                        <td>
                          <ConceptPicker
                            value={conceptMapping[index]}
                            options={allConcepts}
                            label={conceptLabel}
                            onChange={(value) =>
                              setConceptMapping((current) =>
                                current.map((concept, conceptIndex) =>
                                  conceptIndex === index ? value : concept,
                                ),
                              )
                            }
                            onCreate={addConcept}
                            ariaLabel={`${c.detectedConcept} ${index + 1}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="table-section drafted-section">
              <div className="section-heading">
                <h2>{c.drafted}</h2>
                <span>{items.length} items</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>{c.item}</th>
                      <th>{c.topic}</th>
                      <th>{c.status}</th>
                      <th>{c.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {editingItem === item.id ? (
                            <input
                              className="text-input table-input"
                              value={item.item}
                              onChange={(event) =>
                                setItems((rows) =>
                                  rows.map((row) =>
                                    row.id === item.id ? { ...row, item: event.target.value } : row,
                                  ),
                                )
                              }
                            />
                          ) : (
                            <strong>{item.item}</strong>
                          )}
                        </td>
                        <td>{topicLabel(item.topic)}</td>
                        <td>
                          <span className={`status-pill ${item.status}`}>
                            {item.status === "approved" ? c.approved : c.draft}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              onClick={() =>
                                setItems((rows) =>
                                  rows.map((row) =>
                                    row.id === item.id ? { ...row, status: "approved" } : row,
                                  ),
                                )
                              }
                            >
                              {c.approve}
                            </button>
                            <button
                              onClick={() =>
                                setEditingItem(editingItem === item.id ? null : item.id)
                              }
                            >
                              {editingItem === item.id ? c.saveChanges : c.edit}
                            </button>
                            <button
                              className="reject"
                              onClick={() =>
                                setItems((rows) => rows.filter((row) => row.id !== item.id))
                              }
                            >
                              {c.reject}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
        <footer className="teacher-footer">
          <Icon name="info" size={17} />
          {c.footer}
        </footer>
      </main>
    );
  }

  return (
    <div className="app-shell">
      {viewer &&
        (() => {
          if (viewer.lectureId) {
            const lecture = lectures.find((item) => item.id === viewer.lectureId);
            if (!lecture) return null;
            return (
              <MaterialViewer
                key={lecture.id}
                lecture={lecture}
                startPage={viewer.page}
                recommended={recommendedPages[lecture.id] || []}
                onClose={() => setViewer(null)}
              />
            );
          }
          const segment = segments.find((item) => item.id === viewer.segmentId);
          const lecture = segment ? lectureOf(segment) : undefined;
          if (!segment || !lecture) return null;
          return (
            <MaterialViewer
              key={segment.id}
              lecture={lecture}
              segment={segment}
              conceptLabel={conceptLabel(segment.concept)}
              startPage={viewer.page}
              reviewed={reviewedIds.includes(segment.id)}
              onReviewed={() =>
                setReviewedIds((ids) => (ids.includes(segment.id) ? ids : [...ids, segment.id]))
              }
              onClose={() => setViewer(null)}
            />
          );
        })()}
      {TopBar()}
      {view === "teacher" ? (
        TeacherDashboard()
      ) : (
        <div className="student-frame">
          {Sidebar()}
          <main className="student-main">
            {SimulatedLabel()}
            {studentPage === "progress" && Progress()}
            {studentPage === "week7" && Week7()}
            {studentPage === "week5" && Week5()}
            {studentPage === "grades" && Grades()}
            {studentPage === "materials" && (
              <StudentMaterials
                lectures={lectures}
                segments={segments}
                conceptLabel={conceptLabel}
                recommended={recommendedPages}
                onOpen={(lecture) => setViewer({ lectureId: lecture.id })}
              />
            )}
            {studentPage === "assistant" && screen === "diagnose" && Diagnose()}
            {studentPage === "assistant" && screen === "recommend" && Results()}
            {studentPage === "assistant" && screen === "practice" && Practice()}
            {studentPage === "assistant" && screen === "reflect" && Reflect()}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
