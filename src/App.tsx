import { useMemo, useState } from "react";

type Language = "EN" | "RU" | "KZ";
type Concept =
  | "Probability basics"
  | "Conditional probability"
  | "Hypothesis testing"
  | "p-values interpretation";
type Certainty = "low" | "medium" | "high";
type Classification = "Mastered" | "Fragile" | "Gap" | "Misconception";
type Screen = "diagnose" | "recommend" | "practice" | "reflect";
type AlertStatus = "pending" | "approved" | "editing" | "dismissed";

const copy = {
  EN: {
    university: "University LMS",
    studentView: "Student view",
    teacherView: "Teacher view",
    reset: "Reset demo",
    course: "Statistics 101",
    week: "Week",
    grades: "Grades",
    assistant: "Assistant",
    simulated: "Simulated demo – AI features not operational",
    checkin: "Week 6 check-in · 6 questions · not graded",
    question: "Question",
    of: "of",
    next: "Next",
    results: "See results",
    skip: "Skip",
    note: "This check helps the assistant suggest your next step. It does not affect your grade.",
    quizGoal: "Your goal this week:",
    understandGoal: "Understand the topic",
    midtermGoal: "Prepare for the midterm",
    sure: "I'm sure",
    notSure: "Not sure",
    reasoning: "Explain your reasoning in one sentence",
    reasoningPlaceholder: "Optional response",
    detected: "Concepts the assistant detected in this quiz",
    inferredNote: "AI-inferred, your teacher can correct this",
    mastered: "Mastered",
    fragile: "Fragile",
    gap: "Gap",
    misconception: "Misconception",
    suggestedPlan: "Suggested plan",
    quickRefresher: "Quick 5-min refresher",
    shortReview: "Short topic review (video + summary)",
    talkTeacher: "Talk to teacher",
    examStyle: "exam-style",
    stepByStep: "step-by-step explanation + practice",
    mapping: "Question-to-concept mapping (AI-inferred)",
    detectedConcept: "Detected concept",
    probabilityBasics: "Probability basics",
    conditionalProbability: "Conditional probability",
    pValuesInterpretation: "p-values interpretation",
    whyConfident:
      "You answered {count} {questions} confidently but chose {options} that {misconception}.",
    whyMastered: "You answered every question correctly and confidently.",
    whyGap: "You were unsure and answered incorrectly on {concept}.",
    whyFragile: "You answered correctly but were not yet confident on {concept}.",
    yourResults: "Your results",
    resultIntro: "Based on your check-in, here is a focused next step.",
    suggested: "Suggested next step:",
    why: "Why this?",
    start: "Start",
    choose: "Choose another topic",
    askTeacher: "Ask teacher",
    chooseTitle: "Choose a different practice topic",
    cancel: "Cancel",
    probability: "Probability",
    hypothesis: "Hypothesis testing",
    challenge: "Choosing the right test",
    probabilityPractice: "Probability basics practice (10 min)",
    pPractice: "p-values practice (10 min)",
    challengePractice: "Challenge task: choosing the right test (15 min)",
    missed: "You missed {missed} of 3 items on {topic}.",
    passed: "You answered at least 2 of 3 items correctly in both topics.",
    taskTitle: "{topic} · Task 1 of 4",
    task: "A study reports p = 0.03 and uses α = 0.05. Should the null hypothesis be rejected? Enter “yes” or “no”.",
    answer: "Your answer",
    answerPlaceholder: "Type your answer",
    check: "Check answer",
    correct: "Correct. Since 0.03 < 0.05, the result is statistically significant.",
    incorrect: "Not quite. Compare the p-value with the significance level.",
    tryHint: "Try Hint 2",
    hintPanel: "Step-by-step hints",
    hint1: "Hint 1: Nudge",
    hint2: "Hint 2: Key concept",
    hint3: "Hint 3: Worked example",
    hint1Text: "Compare 0.03 with the threshold 0.05.",
    hint2Text: "Reject the null hypothesis when p is less than or equal to α.",
    hint3Text: "Here, 0.03 is below 0.05, so reject the null hypothesis.",
    locked: "Locked until the previous hint is used",
    tryFirst: "Try first. Hints become available step by step.",
    continue: "Continue",
    beforeFinish: "Before you finish",
    confidence: "How confident are you with p-values now?",
    low: "Not confident",
    high: "Very confident",
    goal: "Your goal for next week",
    goalPlaceholder: "For example: review confidence intervals",
    remind: "Remind me on Monday",
    save: "Save and finish",
    support: "Would you like to ask your teacher or book office hours?",
    office: "Book office hours",
    teacherTitle: "Teacher view · Statistics 101",
    active: "Students active this week",
    average: "Average check-in score",
    needing: "Students needing support",
    stuck:
      "14 students share a misconception: treating the p-value as the probability that H0 is true. Suggestion: address it in Thursday seminar.",
    alertApproved: "Suggestion approved for the Thursday seminar.",
    alertEditing: "Suggestion opened for editing.",
    alertDismissed: "Suggestion dismissed.",
    approve: "Approve",
    edit: "Edit",
    dismiss: "Dismiss",
    drafted: "AI-drafted practice items waiting for review (3)",
    item: "Item",
    topic: "Topic",
    status: "Status",
    actions: "Actions",
    draft: "Draft",
    approved: "Approved",
    reject: "Reject",
    footer:
      "The assistant never assigns grades. All content is released only after teacher approval.",
    back: "Back",
    confLabel: "Confidence:",
    confLow: "Low",
    confMed: "Medium",
    confHigh: "High",
    score: "{correct} of {total} correct",
    examToggle: "Exam-style tasks",
    requestSent: "Request sent to your teacher (simulated).",
    officeSent: "Office hours request sent (simulated).",
    notInDemo: "This section is not part of the demo. Use the Assistant.",
    saveChanges: "Save",
    reasoningFlag: "Your written explanation also suggests this misunderstanding.",
    recommended: "Recommended",
    mappingNote: "Changing a concept here updates the student's results immediately.",
  },
  RU: {
    university: "University LMS",
    studentView: "Студент",
    teacherView: "Преподаватель",
    reset: "Сбросить демо",
    course: "Статистика 101",
    week: "Неделя",
    grades: "Оценки",
    assistant: "Ассистент",
    simulated: "Демонстрация – функции ИИ не работают",
    checkin: "Проверка недели 6 · 6 вопросов · без оценки",
    question: "Вопрос",
    of: "из",
    next: "Далее",
    results: "Показать результаты",
    skip: "Пропустить",
    note: "Проверка помогает ассистенту предложить следующий шаг и не влияет на оценку.",
    quizGoal: "Ваша цель на этой неделе:",
    understandGoal: "Понять тему",
    midtermGoal: "Подготовиться к рубежному контролю",
    sure: "Я уверен(а)",
    notSure: "Не уверен(а)",
    reasoning: "Объясните ход рассуждений одним предложением",
    reasoningPlaceholder: "Необязательный ответ",
    detected: "Понятия, определённые ассистентом в этой проверке",
    inferredNote: "Определено ИИ, преподаватель может исправить",
    mastered: "Освоено",
    fragile: "Неустойчиво",
    gap: "Пробел",
    misconception: "Заблуждение",
    suggestedPlan: "Предлагаемый план",
    quickRefresher: "Краткое повторение · 5 мин",
    shortReview: "Краткий обзор темы (видео + конспект)",
    talkTeacher: "Поговорить с преподавателем",
    examStyle: "в формате экзамена",
    stepByStep: "пошаговое объяснение + практика",
    mapping: "Связь вопросов с понятиями (определено ИИ)",
    detectedConcept: "Определённое понятие",
    probabilityBasics: "Основы вероятности",
    conditionalProbability: "Условная вероятность",
    pValuesInterpretation: "Интерпретация p-значений",
    whyConfident:
      "Вы уверенно ответили на {count} {questions}, но выбрали {options}, которые показывают заблуждение: {misconception}.",
    whyMastered: "Вы ответили на все вопросы правильно и уверенно.",
    whyGap: "Вы не были уверены и ответили неверно по теме «{concept}».",
    whyFragile: "Вы ответили правильно, но пока не уверены в теме «{concept}».",
    yourResults: "Ваши результаты",
    resultIntro: "На основе проверки предлагаем следующий шаг.",
    suggested: "Рекомендуемый следующий шаг:",
    why: "Почему?",
    start: "Начать",
    choose: "Выбрать другую тему",
    askTeacher: "Спросить преподавателя",
    chooseTitle: "Выберите другую тему практики",
    cancel: "Отмена",
    probability: "Вероятность",
    hypothesis: "Проверка гипотез",
    challenge: "Выбор подходящего теста",
    probabilityPractice: "Основы вероятности (10 мин)",
    pPractice: "Практика по p-значениям (10 мин)",
    challengePractice: "Сложная задача: выбор теста (15 мин)",
    missed: "Вы ошиблись в {missed} из 3 заданий по теме «{topic}».",
    passed: "Вы верно ответили минимум на 2 из 3 вопросов в обеих темах.",
    taskTitle: "{topic} · Задание 1 из 4",
    task: "В исследовании p = 0.03 при α = 0.05. Следует ли отклонить нулевую гипотезу? Введите «yes» или «no».",
    answer: "Ваш ответ",
    answerPlaceholder: "Введите ответ",
    check: "Проверить",
    correct: "Верно. 0.03 < 0.05, результат статистически значим.",
    incorrect: "Не совсем. Сравните p-значение с уровнем значимости.",
    tryHint: "Откройте подсказку 2",
    hintPanel: "Пошаговые подсказки",
    hint1: "Подсказка 1: Направление",
    hint2: "Подсказка 2: Основное понятие",
    hint3: "Подсказка 3: Пример решения",
    hint1Text: "Сравните 0.03 с порогом 0.05.",
    hint2Text: "Отклоните нулевую гипотезу, если p не больше α.",
    hint3Text: "0.03 меньше 0.05, поэтому нулевая гипотеза отклоняется.",
    locked: "Откроется после предыдущей подсказки",
    tryFirst: "Сначала попробуйте сами. Подсказки открываются поэтапно.",
    continue: "Продолжить",
    beforeFinish: "Перед завершением",
    confidence: "Насколько уверенно вы понимаете p-значения?",
    low: "Не уверен(а)",
    high: "Очень уверен(а)",
    goal: "Ваша цель на следующую неделю",
    goalPlaceholder: "Например: повторить доверительные интервалы",
    remind: "Напомнить в понедельник",
    save: "Сохранить и завершить",
    support: "Хотите задать вопрос преподавателю или записаться на консультацию?",
    office: "Записаться на консультацию",
    teacherTitle: "Преподаватель · Статистика 101",
    active: "Активны на этой неделе",
    average: "Средний результат проверки",
    needing: "Нужна поддержка",
    stuck:
      "14 студентов разделяют заблуждение: p-значение — это вероятность истинности H0. Предложение: разобрать это на семинаре в четверг.",
    alertApproved: "Предложение добавлено в семинар в четверг.",
    alertEditing: "Предложение открыто для редактирования.",
    alertDismissed: "Предложение отклонено.",
    approve: "Одобрить",
    edit: "Изменить",
    dismiss: "Отклонить",
    drafted: "Практические задания ИИ на проверке (3)",
    item: "Задание",
    topic: "Тема",
    status: "Статус",
    actions: "Действия",
    draft: "Черновик",
    approved: "Одобрено",
    reject: "Удалить",
    footer:
      "Ассистент не выставляет оценки. Материалы публикуются только после одобрения преподавателя.",
    back: "Назад",
    confLabel: "Уверенность:",
    confLow: "Низкая",
    confMed: "Средняя",
    confHigh: "Высокая",
    score: "Верно: {correct} из {total}",
    examToggle: "Задания в формате экзамена",
    requestSent: "Запрос отправлен преподавателю (симуляция).",
    officeSent: "Запрос на консультацию отправлен (симуляция).",
    notInDemo: "Этот раздел не входит в демо. Используйте Ассистента.",
    saveChanges: "Сохранить",
    reasoningFlag: "Ваше объяснение тоже указывает на это заблуждение.",
    recommended: "Рекомендовано",
    mappingNote: "Изменение понятия здесь сразу обновляет результаты студента.",
  },
  KZ: {
    university: "University LMS",
    studentView: "Студент",
    teacherView: "Оқытушы",
    reset: "Демоны қалпына келтіру",
    course: "Статистика 101",
    week: "Апта",
    grades: "Бағалар",
    assistant: "Көмекші",
    simulated: "Демо нұсқа – ЖИ функциялары жұмыс істемейді",
    checkin: "6-апта тексеруі · 6 сұрақ · бағаланбайды",
    question: "Сұрақ",
    of: "/",
    next: "Келесі",
    results: "Нәтижені көру",
    skip: "Өткізіп жіберу",
    note: "Бұл тексеру келесі қадамды ұсынуға көмектеседі және бағаға әсер етпейді.",
    quizGoal: "Осы аптадағы мақсатыңыз:",
    understandGoal: "Тақырыпты түсіну",
    midtermGoal: "Аралық бақылауға дайындалу",
    sure: "Сенімдімін",
    notSure: "Сенімді емеспін",
    reasoning: "Ойыңызды бір сөйлеммен түсіндіріңіз",
    reasoningPlaceholder: "Міндетті емес жауап",
    detected: "Көмекші осы тексеруде анықтаған ұғымдар",
    inferredNote: "ЖИ анықтаған, оқытушы түзете алады",
    mastered: "Меңгерілген",
    fragile: "Тұрақсыз",
    gap: "Олқылық",
    misconception: "Қате түсінік",
    suggestedPlan: "Ұсынылған жоспар",
    quickRefresher: "5 минуттық қысқаша қайталау",
    shortReview: "Тақырыпқа қысқаша шолу (бейне + конспект)",
    talkTeacher: "Оқытушымен сөйлесу",
    examStyle: "емтихан форматында",
    stepByStep: "қадамдық түсіндіру + жаттығу",
    mapping: "Сұрақтар мен ұғымдар байланысы (ЖИ анықтаған)",
    detectedConcept: "Анықталған ұғым",
    probabilityBasics: "Ықтималдық негіздері",
    conditionalProbability: "Шартты ықтималдық",
    pValuesInterpretation: "p-мәндерін түсіндіру",
    whyConfident:
      "Сіз {count} {questions} сенімді жауап бердіңіз, бірақ мына қате түсінікті көрсететін {options} таңдадыңыз: {misconception}.",
    whyMastered: "Сіз барлық сұраққа дұрыс және сенімді жауап бердіңіз.",
    whyGap: "Сіз «{concept}» тақырыбында сенімсіз болып, қате жауап бердіңіз.",
    whyFragile: "Сіз дұрыс жауап бердіңіз, бірақ «{concept}» тақырыбында әлі сенімсізсіз.",
    yourResults: "Нәтижелеріңіз",
    resultIntro: "Тексеру нәтижесі бойынша келесі қадам ұсынылды.",
    suggested: "Ұсынылған келесі қадам:",
    why: "Неліктен?",
    start: "Бастау",
    choose: "Басқа тақырыпты таңдау",
    askTeacher: "Оқытушыдан сұрау",
    chooseTitle: "Басқа жаттығу тақырыбын таңдаңыз",
    cancel: "Болдырмау",
    probability: "Ықтималдық",
    hypothesis: "Гипотезаны тексеру",
    challenge: "Дұрыс тестті таңдау",
    probabilityPractice: "Ықтималдық негіздері (10 мин)",
    pPractice: "p-мәндері бойынша жаттығу (10 мин)",
    challengePractice: "Күрделі тапсырма: дұрыс тестті таңдау (15 мин)",
    missed: "«{topic}» тақырыбындағы 3 тапсырманың {missed} қате орындалды.",
    passed: "Екі тақырып бойынша кемінде 3 тапсырманың 2-еуі дұрыс орындалды.",
    taskTitle: "{topic} · 1/4 тапсырма",
    task: "Зерттеуде p = 0.03 және α = 0.05. Нөлдік гипотезаны жоққа шығару керек пе? «yes» немесе «no» енгізіңіз.",
    answer: "Жауабыңыз",
    answerPlaceholder: "Жауапты енгізіңіз",
    check: "Жауапты тексеру",
    correct: "Дұрыс. 0.03 < 0.05, нәтиже статистикалық маңызды.",
    incorrect: "Дұрыс емес. p-мәнін маңыздылық деңгейімен салыстырыңыз.",
    tryHint: "2-кеңесті қолданып көріңіз",
    hintPanel: "Қадамдық кеңестер",
    hint1: "1-кеңес: Бағыт",
    hint2: "2-кеңес: Негізгі ұғым",
    hint3: "3-кеңес: Шешілген мысал",
    hint1Text: "0.03 санын 0.05 шегімен салыстырыңыз.",
    hint2Text: "p мәні α-дан кем немесе тең болса, нөлдік гипотезаны жоққа шығарыңыз.",
    hint3Text: "0.03 саны 0.05-тен аз, сондықтан нөлдік гипотеза жоққа шығарылады.",
    locked: "Алдыңғы кеңестен кейін ашылады",
    tryFirst: "Алдымен өзіңіз орындаңыз. Кеңестер біртіндеп ашылады.",
    continue: "Жалғастыру",
    beforeFinish: "Аяқтар алдында",
    confidence: "p-мәндерін қаншалықты сенімді түсінесіз?",
    low: "Сенімсіз",
    high: "Өте сенімді",
    goal: "Келесі аптаға мақсатыңыз",
    goalPlaceholder: "Мысалы: сенімділік интервалдарын қайталау",
    remind: "Дүйсенбіде еске салу",
    save: "Сақтау және аяқтау",
    support: "Оқытушыға сұрақ қойғыңыз немесе кеңеске жазылғыңыз келе ме?",
    office: "Кеңеске жазылу",
    teacherTitle: "Оқытушы · Статистика 101",
    active: "Осы аптада белсенді",
    average: "Орташа тексеру нәтижесі",
    needing: "Қолдау қажет",
    stuck:
      "14 студенттің қате түсінігі бірдей: p-мәні H0 ақиқат болу ықтималдығы деп есептейді. Ұсыныс: бейсенбідегі семинарда талқылау.",
    alertApproved: "Ұсыныс бейсенбідегі семинарға мақұлданды.",
    alertEditing: "Ұсыныс өңдеуге ашылды.",
    alertDismissed: "Ұсыныс қабылданбады.",
    approve: "Мақұлдау",
    edit: "Өңдеу",
    dismiss: "Қабылдамау",
    drafted: "ЖИ дайындаған тексерудегі тапсырмалар (3)",
    item: "Тапсырма",
    topic: "Тақырып",
    status: "Күйі",
    actions: "Әрекеттер",
    draft: "Жоба",
    approved: "Мақұлданды",
    reject: "Жою",
    footer: "Көмекші баға қоймайды. Барлық материал тек оқытушы мақұлдағаннан кейін жарияланады.",
    back: "Артқа",
    confLabel: "Сенімділік:",
    confLow: "Төмен",
    confMed: "Орташа",
    confHigh: "Жоғары",
    score: "Дұрыс: {total} сұрақтың {correct}",
    examToggle: "Емтихан форматындағы тапсырмалар",
    requestSent: "Сұрау оқытушыға жіберілді (симуляция).",
    officeSent: "Кеңеске жазылу сұрауы жіберілді (симуляция).",
    notInDemo: "Бұл бөлім демоға кірмейді. Көмекшіні пайдаланыңыз.",
    saveChanges: "Сақтау",
    reasoningFlag: "Сіздің түсіндірмеңіз де осы қате түсінікті көрсетеді.",
    recommended: "Ұсынылған",
    mappingNote: "Мұнда ұғымды өзгерту студент нәтижесін бірден жаңартады.",
  },
} as const;

const concepts: Concept[] = [
  "Probability basics",
  "Conditional probability",
  "Hypothesis testing",
  "p-values interpretation",
];

const conceptPrerequisites: Record<Concept, Concept[]> = {
  "Probability basics": [],
  "Conditional probability": ["Probability basics"],
  "Hypothesis testing": ["Probability basics"],
  "p-values interpretation": ["Probability basics"],
};

const questions: {
  text: string;
  options: string[];
  correct: number;
  concept: Concept;
  misconceptions: Record<number, string>;
}[] = [
  {
    text: "A p-value of 0.03 means…",
    options: [
      "There is a 3% chance the null hypothesis is true",
      "The observed data would be unusual if the null hypothesis were true",
      "The result is 97% accurate",
      "The effect has a size of 0.03",
    ],
    correct: 1,
    concept: "p-values interpretation",
    misconceptions: {
      0: "treats the p-value as the probability that H0 is true",
      2: "treats confidence as the complement of the p-value",
      3: "confuses statistical significance with effect size",
    },
  },
  {
    text: "When p < α, the usual decision is to…",
    options: [
      "Reject the null hypothesis",
      "Accept the null hypothesis",
      "Increase the sample mean",
      "Remove outliers",
    ],
    correct: 0,
    concept: "Hypothesis testing",
    misconceptions: {
      1: "treats failure to reject as proof that H0 is true",
      2: "believes the decision changes the sample statistic",
      3: "assumes outliers determine the hypothesis decision",
    },
  },
  {
    text: "A Type I error occurs when we…",
    options: [
      "Reject a true null hypothesis",
      "Keep a false null hypothesis",
      "Use a small sample",
      "Calculate the mean incorrectly",
    ],
    correct: 0,
    concept: "Hypothesis testing",
    misconceptions: {
      1: "confuses Type I and Type II errors",
      2: "equates small samples with Type I error",
      3: "confuses calculation mistakes with inference errors",
    },
  },
  {
    text: "A fair coin is tossed once. The probability of heads is…",
    options: ["0.25", "0.50", "0.75", "1.00"],
    correct: 1,
    concept: "Probability basics",
    misconceptions: {
      0: "counts one of four imagined outcomes",
      2: "overestimates equally likely outcomes",
      3: "treats either outcome as certain",
    },
  },
  {
    text: "If two events are mutually exclusive, then…",
    options: [
      "They always occur together",
      "They cannot occur together",
      "They have equal probability",
      "They are independent",
    ],
    correct: 1,
    concept: "Conditional probability",
    misconceptions: {
      0: "treats mutually exclusive events as identical",
      2: "assumes exclusive events must be equally likely",
      3: "confuses mutual exclusivity with independence",
    },
  },
  {
    text: "The probability of a certain event is…",
    options: ["0", "0.5", "1", "Undefined"],
    correct: 2,
    concept: "Probability basics",
    misconceptions: {
      0: "confuses certain and impossible events",
      1: "treats certainty as an even chance",
      3: "assumes certainty cannot be quantified",
    },
  },
];

type PracticeKey = Concept | "Challenge";

const practiceTasks: Record<
  Exclude<PracticeKey, "Hypothesis testing">,
  { title: string; task: string; accept: string[]; correct: string; incorrect: string; hints: [string, string, string] }
> = {
  "Probability basics": {
    title: "Probability basics",
    task: "A fair die is rolled once. What is the probability of getting an even number? Enter a decimal.",
    accept: ["0.5", "0,5", ".5", "1/2", "50"],
    correct: "Correct. 3 even outcomes out of 6 equally likely outcomes = 0.5.",
    incorrect: "Not quite. Count the favourable outcomes and divide by all possible outcomes.",
    hints: [
      "List all outcomes of one die roll.",
      "P(event) = favourable outcomes / all equally likely outcomes.",
      "Even numbers: 2, 4, 6 → 3 of 6 → 3/6 = 0.5.",
    ],
  },
  "Conditional probability": {
    title: "Conditional probability",
    task: "40% of students take Statistics; 10% take both Statistics and Economics. What is P(Economics | Statistics)? Enter a decimal.",
    accept: ["0.25", "0,25", ".25", "1/4", "25"],
    correct: "Correct. P(E | S) = P(E and S) / P(S) = 0.10 / 0.40 = 0.25.",
    incorrect: "Not quite. Divide the joint probability by the probability of the condition.",
    hints: [
      "The condition is 'the student takes Statistics'.",
      "P(A | B) = P(A and B) / P(B).",
      "0.10 / 0.40 = 0.25.",
    ],
  },
  "p-values interpretation": {
    title: "p-values interpretation",
    task: "A study reports p = 0.03. Which statement is correct? Type A or B. A) There is a 3% chance that H0 is true. B) Data this extreme would occur about 3% of the time if H0 were true.",
    accept: ["b"],
    correct: "Correct. A p-value is computed assuming H0 is true; it is not the probability that H0 is true.",
    incorrect: "Not quite. Ask yourself: what does the p-value assume about H0?",
    hints: [
      "A p-value is calculated under an assumption. Which one?",
      "p = P(data this extreme | H0 true), not P(H0 true | data).",
      "So statement B is correct; statement A reverses the condition.",
    ],
  },
  Challenge: {
    title: "Challenge: choosing the right test",
    task: "You compare mean exam scores of two independent groups. Which test fits best? Type 't-test' or 'chi-square'.",
    accept: ["t-test", "t test", "ttest", "t"],
    correct: "Correct. Comparing two independent means calls for an independent-samples t-test.",
    incorrect: "Not quite. Think about the type of variable: means of a numeric outcome or counts in categories?",
    hints: [
      "Is the outcome numeric or categorical?",
      "Numeric outcome + two independent groups → compare means.",
      "Use an independent-samples t-test.",
    ],
  },
};

const initialItems = [
  { id: 1, item: "Interpret p = 0.04 in context", topic: "p-values", status: "draft" },
  { id: 2, item: "Select a test for two groups", topic: "Hypothesis testing", status: "draft" },
  { id: 3, item: "Calculate a simple event", topic: "Probability", status: "draft" },
];

function Icon({
  name,
  size = 18,
}: {
  name: "book" | "chart" | "spark" | "lock" | "check" | "user" | "chevron" | "info";
  size?: number;
}) {
  const paths = {
    book: (
      <>
        <path d="M4 4.5h5a3 3 0 0 1 3 3v11a3 3 0 0 0-3-3H4z" />
        <path d="M20 4.5h-5a3 3 0 0 0-3 3v11a3 3 0 0 1 3-3h5z" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V9" />
        <path d="M10 19V5" />
        <path d="M16 19v-7" />
        <path d="M22 19H2" />
      </>
    ),
    spark: (
      <>
        <path d="M12 3v3" />
        <path d="M12 18v3" />
        <path d="m4.22 4.22 2.12 2.12" />
        <path d="m17.66 17.66 2.12 2.12" />
        <path d="M3 12h3" />
        <path d="M18 12h3" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

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
  const [conceptMapping, setConceptMapping] = useState<Concept[]>(
    questions.map((question) => question.concept),
  );
  const [navNote, setNavNote] = useState(false);
  const [alertText, setAlertText] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const c = copy[lang];

  function conceptLabel(concept: Concept) {
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

  const conceptStatuses = useMemo(() => {
    const severity: Record<Classification, number> = {
      Mastered: 0,
      Fragile: 1,
      Gap: 2,
      Misconception: 3,
    };
    return concepts.map((concept) => {
      const related = assessments.filter((assessment) => assessment.concept === concept);
      const status = related.reduce<Classification>(
        (worst, assessment) =>
          severity[assessment.classification] > severity[worst] ? assessment.classification : worst,
        "Mastered",
      );
      return { concept, status };
    });
  }, [assessments]);

  const wrongCount = assessments.filter((assessment) => !assessment.correct).length;
  const needsSupport = conceptStatuses.some(
    ({ status }) => status === "Misconception" || status === "Gap",
  );
  const allMastered = conceptStatuses.every(({ status }) => status === "Mastered");
  const planSteps = useMemo<{ key: PracticeKey; label: string }[]>(() => {
    if (allMastered) return [{ key: "Challenge", label: c.challengePractice }];
    const mode = learningGoal === "midterm" ? c.examStyle : c.stepByStep;
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
          const prerequisiteOrder =
            conceptPrerequisites[a.concept].length - conceptPrerequisites[b.concept].length;
          if (prerequisiteOrder !== 0) return prerequisiteOrder;
        }
        return concepts.indexOf(a.concept) - concepts.indexOf(b.concept);
      })
      .slice(0, 2)
      .map(({ concept, status }) => ({
        key: concept,
        label:
          status === "Fragile"
            ? `${conceptLabel(concept)} · ${c.quickRefresher}`
            : `${conceptLabel(concept)} · ${mode}`,
      }));
  }, [allMastered, c, conceptStatuses, learningGoal]);
  const selectedKey: PracticeKey = override || planSteps[0]?.key || "Challenge";
  const keyLabel = (key: PracticeKey) =>
    key === "Challenge" ? c.challenge : conceptLabel(key);

  const topicLabel = (topic: string) =>
    topic === "Probability" ? c.probability : topic === "Hypothesis testing" ? c.hypothesis : topic;
  const fill = (template: string, values: Record<string, string | number>) =>
    Object.entries(values).reduce(
      (result, [key, value]) => result.replace(`{${key}}`, String(value)),
      template,
    );

  function reset() {
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
    setAlertText(null);
    setEditingItem(null);
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
    const isCorrect =
      selectedKey === "Hypothesis testing"
        ? ["yes", "y", "да", "иә", "reject", "отклонить", "жоққа шығару"].some((term) =>
            normalized.includes(term),
          )
        : selectedKey === "p-values interpretation"
          ? normalized === "b" || normalized.startsWith("b)")
          : practiceTasks[selectedKey].accept.some((term) =>
              selectedKey === "Challenge" ? normalized.startsWith(term) && !normalized.includes("chi") : normalized === term || normalized === term + "%",
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
              className={week === 6 ? "nav-item current-week" : "nav-item"}
              onClick={() => setNavNote(true)}
            >
              <span>
                {c.week} {week}
              </span>
              {week === 6 && <Icon name="chevron" size={16} />}
            </button>
          ))}
          <button className="nav-item" onClick={() => setNavNote(true)}>
            <span className="nav-with-icon">
              <Icon name="chart" size={17} />
              {c.grades}
            </span>
          </button>
          <button className="nav-item active" onClick={() => setNavNote(false)}>
            <span className="nav-with-icon">
              <Icon name="spark" size={17} />
              {c.assistant}
            </span>
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
              disabled={
                answers[qIndex] === null ||
                certainties[qIndex] === null
              }
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
    const firstNeed = conceptStatuses.find(({ status }) => status !== "Mastered");
    const why = topMisconception
      ? fill(c.whyConfident, {
          count: topMisconception[1],
          questions:
            lang === "EN"
              ? topMisconception[1] === 1
                ? "question"
                : "questions"
              : lang === "RU"
                ? "вопроса"
                : "сұраққа",
          options:
            lang === "EN"
              ? topMisconception[1] === 1
                ? "an option"
                : "options"
              : lang === "RU"
                ? "варианты"
                : "нұсқаларды",
          misconception:
            topMisconception[1] === 1
              ? topMisconception[0]
              : topMisconception[0].replace(/^treats /, "treat "),
        })
      : allMastered
        ? c.whyMastered
        : firstNeed?.status === "Gap"
          ? fill(c.whyGap, { concept: conceptLabel(firstNeed.concept) })
          : fill(c.whyFragile, {
              concept: firstNeed ? conceptLabel(firstNeed.concept) : "",
            });
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
              <div className="overline">{c.suggestedPlan}</div>
              <label className="exam-toggle">
                <input
                  type="checkbox"
                  checked={learningGoal === "midterm"}
                  onChange={(event) => setLearningGoal(event.target.checked ? "midterm" : "understand")}
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
                {planSteps.map((step, index) => (
                  <div className="plan-step" key={step.label}>
                    <span>{index + 1}</span>
                    <strong>{step.label}</strong>
                  </div>
                ))}
              </div>
            )}
            {override && (
              <div className="inline-confirm">
                <Icon name="check" size={16} /> {c.choose}: {keyLabel(override)}
              </div>
            )}
            <details>
              <summary>{c.why}</summary>
              <p>{why}</p>
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
                {([...concepts, "Challenge"] as PracticeKey[]).map((key) => (
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

  function Practice() {
    const localized = selectedKey === "Hypothesis testing";
    const t = localized ? null : practiceTasks[selectedKey];
    const taskTopic = keyLabel(selectedKey);
    const taskText = t ? t.task : c.task;
    const correctText = t ? t.correct : c.correct;
    const incorrectText = t ? t.incorrect : c.incorrect;
    const hintTexts = t ? t.hints : [c.hint1Text, c.hint2Text, c.hint3Text];
    return (
      <div className="content-wide">
        <div className="eyebrow">
          {c.assistant} / {taskTopic}
        </div>
        <h1>{fill(c.taskTitle, { topic: taskTopic })}</h1>
        <div className="practice-grid">
          <section className="panel task-card">
            <div className="task-tag">STATISTICS 101 · WEEK 6</div>
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
            {attempts >= 2 && feedback === "incorrect" && (
              <button className="hint-prompt" onClick={() => setHintsOpen(Math.max(2, hintsOpen))}>
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
              {feedback === "correct" && (
                <button className="btn secondary" onClick={() => setScreen("reflect")}>
                  {c.continue}
                </button>
              )}
              {feedback === "incorrect" && (
                <button className="btn secondary" onClick={() => setScreen("reflect")}>
                  {c.continue}
                </button>
              )}
            </div>
          </section>
          <aside className="hint-panel">
            <h2>{c.hintPanel}</h2>
            <p>{c.tryFirst}</p>
            {[1, 2, 3].map((level) => {
              const unlocked = level === 1 || hintsOpen >= level - 1;
              const open = hintsOpen >= level;
              const title = level === 1 ? c.hint1 : level === 2 ? c.hint2 : c.hint3;
              const text = hintTexts[level - 1];
              return (
                <div className={`hint ${!unlocked ? "locked" : ""}`} key={level}>
                  <button
                    disabled={!unlocked}
                    onClick={() => setHintsOpen(open ? level - 1 : Math.max(hintsOpen, level))}
                  >
                    <span>
                      {!unlocked && <Icon name="lock" size={15} />} {title}
                    </span>
                    {unlocked && <span>{open ? "−" : "+"}</span>}
                  </button>
                  {open && <p>{text}</p>}
                  {!unlocked && <small>{c.locked}</small>}
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
          <button
            className="btn primary finish"
            disabled={confidence === null}
            onClick={() => setView("teacher")}
          >
            {c.save}
          </button>
        </section>
      </div>
    );
  }

  function TeacherDashboard() {
    const supportCount = 13 + (needsSupport ? 1 : 0);
    const suggestion = alertText ?? c.stuck;
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
          <div className="updated">Updated from current demo session</div>
        </div>
        <div className="summary-grid">
          <div className="summary-card">
            <span>{c.active}</span>
            <strong>112</strong>
            <small>+8 this week</small>
          </div>
          <div className="summary-card">
            <span>{c.average}</span>
            <strong>64%</strong>
            <small>Across 112 students</small>
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
            <div className="overline">LEARNING ALERT</div>
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
              <p>
                {c.inferredNote}. {c.mappingNote}
              </p>
            </div>
            <span>{questions.length} questions</span>
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
                      <select
                        value={conceptMapping[index]}
                        onChange={(event) =>
                          setConceptMapping((current) =>
                            current.map((concept, conceptIndex) =>
                              conceptIndex === index ? (event.target.value as Concept) : concept,
                            ),
                          )
                        }
                        aria-label={`${c.detectedConcept} ${index + 1}`}
                      >
                        {concepts.map((concept) => (
                          <option value={concept} key={concept}>
                            {conceptLabel(concept)}
                          </option>
                        ))}
                      </select>
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
                          onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
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
        <footer className="teacher-footer">
          <Icon name="info" size={17} />
          {c.footer}
        </footer>
      </main>
    );
  }

  return (
    <div className="app-shell">
      {TopBar()}
      {view === "teacher" ? (
        TeacherDashboard()
      ) : (
        <div className="student-frame">
          {Sidebar()}
          <main className="student-main">
            {SimulatedLabel()}
            {screen === "diagnose" && Diagnose()}
            {screen === "recommend" && Results()}
            {screen === "practice" && Practice()}
            {screen === "reflect" && Reflect()}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
