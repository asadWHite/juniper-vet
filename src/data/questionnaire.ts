// ---------------------------------------------------------------------------
// SMART BOOKING QUESTIONNAIRE ENGINE
// The question flow is data-driven: every question declares when it applies,
// so the conversation adapts to previous answers (5–10 relevant questions).
// ---------------------------------------------------------------------------
import { IMG } from "@/data/images";
import type { Answers } from "@/types";

export type Phase = "companion" | "concern" | "context";

export interface QOption {
  id: string;
  label: string;
  sub?: string;
  image?: string;
  tone?: "default" | "danger";
}

export interface QuestionDef {
  id: string;
  phase: Phase;
  eyebrow: string;
  title: string | ((a: Answers) => string);
  hint?: string;
  kind: "visual" | "list" | "multi";
  options: QOption[] | ((a: Answers) => QOption[]);
  when?: (a: Answers) => boolean;
}

const has = (a: Answers, key: string, ...ids: string[]) =>
  ids.includes((a[key] as string) ?? "");

const list = (a: Answers, key: string): string[] => {
  const v = a[key];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : v ? [v] : [];
};

const concerned = (a: Answers) =>
  !has(a, "reason", "routine-check", "vaccination", "follow-up");

const SYMPTOMS: Record<string, QOption[]> = {
  default: [
    { id: "not-eating", label: "NOT EATING", sub: "SKIPPING MEALS OR REDUCED APPETITE" },
    { id: "vomiting", label: "VOMITING", sub: "ONE OR MORE EPISODES" },
    { id: "diarrhea", label: "DIARRHEA", sub: "LOOSE OR FREQUENT STOOL" },
    { id: "coughing", label: "COUGHING", sub: "OR SNEEZING REPEATEDLY" },
    { id: "breathing", label: "BREATHING DIFFERENTLY", sub: "FASTER, NOISIER OR LABOURED" },
    { id: "lethargy", label: "LETHARGY", sub: "LOW ENERGY, SLEEPING MORE" },
    { id: "pain", label: "SIGNS OF PAIN", sub: "WHIMPERING, HIDING, NOT JUMPING" },
    { id: "limping", label: "LIMPING", sub: "FAVOURING A LEG OR STIFF" },
    { id: "skin", label: "SKIN ISSUE", sub: "ITCHING, REDNESS, HAIR LOSS" },
    { id: "behavior", label: "BEHAVIOUR CHANGE", sub: "NOT THEMSELVES LATELY" },
    { id: "other", label: "SOMETHING ELSE", sub: "YOU WILL TELL US MORE LATER" },
  ],
  "eating-drinking": [
    { id: "not-eating", label: "NOT EATING", sub: "REFUSING FOOD ENTIRELY" },
    { id: "eating-less", label: "EATING LESS", sub: "REDUCED APPETITE" },
    { id: "drinking-more", label: "DRINKING MORE", sub: "NOTICEABLY THIRSTIER" },
    { id: "drinking-less", label: "DRINKING LESS", sub: "BOWL BARELY TOUCHED" },
    { id: "eating-fast", label: "EATING DIFFERENTLY", sub: "SLOWER, PICKY OR MESSY" },
    { id: "weight", label: "WEIGHT CHANGE", sub: "GAINING OR LOSING" },
  ],
  injury: [
    { id: "limping", label: "LIMPING", sub: "FAVOURING A LEG" },
    { id: "wound", label: "VISIBLE WOUND", sub: "CUT, SCRAPE OR SWELLING" },
    { id: "fall", label: "FALL OR IMPACT", sub: "JUMPED, DROPPED OR HIT" },
    { id: "bleeding", label: "BLEEDING", sub: "ACTIVE OR RECENT" },
    { id: "pain", label: "SIGNS OF PAIN", sub: "VOCALISING OR GUARDING" },
    { id: "not-weight-bearing", label: "NOT USING A LEG", sub: "AVOIDING WEIGHT ENTIRELY" },
  ],
  skin: [
    { id: "itching", label: "ITCHING", sub: "SCRATCHING OR LICKING" },
    { id: "redness", label: "REDNESS OR RASH", sub: "INFLAMED SKIN" },
    { id: "hair-loss", label: "HAIR LOSS", sub: "PATCHES OR THINNING" },
    { id: "ear", label: "EAR TROUBLE", sub: "SHAKING HEAD, ODOUR" },
    { id: "lumps", label: "LUMP OR BUMP", sub: "SOMETHING NEW UNDER THE SKIN" },
    { id: "odor", label: "UNUSUAL ODOUR", sub: "SKIN OR COAT SMELL" },
  ],
  digestive: [
    { id: "vomiting", label: "VOMITING", sub: "ONE OR MORE EPISODES" },
    { id: "diarrhea", label: "DIARRHEA", sub: "LOOSE OR FREQUENT STOOL" },
    { id: "constipation", label: "CONSTIPATION", sub: "STRAINING OR NO STOOL" },
    { id: "gas", label: "BLOATING / GAS", sub: "DISTENDED OR NOISY BELLY" },
    { id: "appetite", label: "APPETITE CHANGE", sub: "MORE OR LESS THAN USUAL" },
  ],
  behavior: [
    { id: "hiding", label: "HIDING", sub: "AVOIDING PEOPLE OR PLACES" },
    { id: "aggression", label: "NEW AGGRESSION", sub: "GROWLING OR SNAPPING" },
    { id: "anxiety", label: "RESTLESS / ANXIOUS", sub: "PACING, PANTING, CLINGY" },
    { id: "vocal", label: "MORE VOCAL", sub: "BARKING OR MEOWING MORE" },
    { id: "house-soiling", label: "HOUSE SOILING", sub: "ACCIDENTS IN NEW PLACES" },
    { id: "sleep", label: "SLEEP CHANGE", sub: "SLEEPING MUCH MORE OR LESS" },
  ],
};

export const QUESTIONS: QuestionDef[] = [
  {
    id: "species",
    phase: "companion",
    eyebrow: "QUESTION 01",
    title: "WHO ARE WE CARING FOR?",
    kind: "visual",
    options: [
      { id: "dog", label: "DOG", image: IMG.speciesDog.src },
      { id: "cat", label: "CAT", image: IMG.speciesCat.src },
      { id: "rabbit", label: "RABBIT", image: IMG.speciesRabbit.src },
      { id: "bird", label: "BIRD", image: IMG.speciesBird.src },
      { id: "other", label: "OTHER", sub: "GUINEA PIG, FERRET…", image: IMG.speciesOther.src },
    ],
  },
  {
    id: "age",
    phase: "companion",
    eyebrow: "QUESTION 02",
    title: "HOW OLD ARE THEY?",
    kind: "visual",
    options: (a) => {
      const baby = a.species === "cat" ? "KITTEN" : a.species === "dog" ? "PUPPY" : "BABY";
      return [
        { id: "baby", label: baby, sub: "UP TO 1 YEAR", image: IMG.ageBaby.src },
        { id: "young", label: "YOUNG", sub: "1 — 3 YEARS", image: IMG.ageYoung.src },
        { id: "adult", label: "ADULT", sub: "3 — 7 YEARS", image: IMG.ageAdult.src },
        { id: "senior", label: "SENIOR", sub: "7+ YEARS", image: IMG.ageSenior.src },
      ];
    },
  },
  {
    id: "reason",
    phase: "concern",
    eyebrow: "QUESTION 03",
    title: "WHAT BRINGS YOU IN TODAY?",
    hint: "CHOOSE THE CLOSEST OPTION — THE NEXT QUESTIONS ADAPT TO IT.",
    kind: "list",
    options: [
      { id: "routine-check", label: "ROUTINE CHECK-UP", sub: "ANNUAL EXAM, WELLNESS" },
      { id: "vaccination", label: "VACCINATION", sub: "DUE FOR SHOTS OR A BOOSTER" },
      { id: "something-wrong", label: "SOMETHING SEEMS WRONG", sub: "NOT SICK ENOUGH TO NAME — BUT NOT THEMSELVES" },
      { id: "injury", label: "INJURY", sub: "LIMP, FALL, WOUND OR ACCIDENT" },
      { id: "eating-drinking", label: "EATING OR DRINKING DIFFERENTLY", sub: "APPETITE OR THIRST CHANGED" },
      { id: "skin", label: "SKIN / COAT PROBLEM", sub: "ITCHING, REDNESS, HAIR LOSS, EARS" },
      { id: "dental", label: "DENTAL PROBLEM", sub: "BREATH, GUMS, DROPPING FOOD" },
      { id: "digestive", label: "DIGESTIVE PROBLEM", sub: "VOMITING, DIARRHEA, CONSTIPATION" },
      { id: "behavior", label: "BEHAVIOUR CHANGE", sub: "MOOD, SOILING, RESTLESSNESS" },
      { id: "follow-up", label: "MEDICATION / FOLLOW-UP", sub: "RECHECK AFTER TREATMENT" },
      { id: "other", label: "SOMETHING ELSE", sub: "NOT LISTED ABOVE" },
    ],
  },
  {
    id: "symptoms",
    phase: "concern",
    eyebrow: "QUESTION 04",
    title: "WHAT HAVE YOU NOTICED?",
    hint: "SELECT EVERYTHING THAT APPLIES.",
    kind: "multi",
    options: (a) => SYMPTOMS[(a.reason as string) ?? "default"] ?? SYMPTOMS.default,
    when: (a) => has(a, "reason", "something-wrong", "injury", "eating-drinking", "skin", "digestive", "behavior", "dental"),
  },
  {
    id: "duration",
    phase: "context",
    eyebrow: "HOW LONG",
    title: "HOW LONG HAS THIS BEEN HAPPENING?",
    kind: "list",
    options: [
      { id: "today", label: "TODAY", sub: "STARTED IN THE LAST 24 HOURS" },
      { id: "1-2-days", label: "1 — 2 DAYS", sub: "VERY RECENT" },
      { id: "several-days", label: "SEVERAL DAYS", sub: "3 — 6 DAYS" },
      { id: "1-2-weeks", label: "1 — 2 WEEKS", sub: "ONGOING FOR A WHILE" },
      { id: "longer", label: "LONGER", sub: "MORE THAN TWO WEEKS" },
      { id: "not-sure", label: "NOT SURE", sub: "HARD TO SAY EXACTLY" },
    ],
    when: concerned,
  },
  {
    id: "severity",
    phase: "context",
    eyebrow: "RIGHT NOW",
    title: "HOW ARE THEY RIGHT NOW?",
    hint: "BE HONEST — THIS HELPS US PRIORITISE.",
    kind: "list",
    options: [
      { id: "comfortable", label: "COMFORTABLE", sub: "SEEMS FINE BETWEEN EPISODES" },
      { id: "a-little-unusual", label: "A LITTLE UNUSUAL", sub: "SUBTLY OFF, BUT ACTIVE" },
      { id: "clearly-uncomfortable", label: "CLEARLY UNCOMFORTABLE", sub: "VISIBLY BOTHERED BY IT" },
      { id: "very-distressed", label: "VERY DISTRESSED", sub: "IN OBVIOUS DISCOMFORT OR PAIN" },
      { id: "emergency", label: "EMERGENCY — I NEED HELP NOW", sub: "SEVERE SIGNS, CANNOT WAIT", tone: "danger" },
    ],
    when: concerned,
  },
  {
    id: "appetite",
    phase: "context",
    eyebrow: "DAILY HABITS",
    title: "HOW ARE THEY EATING & DRINKING?",
    kind: "list",
    options: [
      { id: "normal", label: "NORMAL", sub: "FOOD AND WATER AS USUAL" },
      { id: "eating-less", label: "EATING LESS", sub: "LEAVING FOOD BEHIND" },
      { id: "not-eating", label: "NOT EATING", sub: "REFUSING MEALS" },
      { id: "drinking-more", label: "DRINKING MORE", sub: "NOTICEABLY THIRSTIER" },
      { id: "drinking-less", label: "DRINKING LESS", sub: "BOWL BARELY TOUCHED" },
    ],
    when: (a) =>
      has(a, "reason", "something-wrong", "digestive", "behavior") &&
      !list(a, "symptoms").some((s) => s.includes("eating") || s.includes("drinking")),
  },
  {
    id: "digestion",
    phase: "context",
    eyebrow: "DIGESTION",
    title: "ANY VOMITING OR DIARRHEA?",
    kind: "list",
    options: [
      { id: "none", label: "NO", sub: "DIGESTION SEEMS NORMAL" },
      { id: "vomiting", label: "VOMITING", sub: "AT LEAST ONCE" },
      { id: "diarrhea", label: "DIARRHEA", sub: "LOOSE OR FREQUENT STOOL" },
      { id: "both", label: "BOTH", sub: "VOMITING AND DIARRHEA" },
    ],
    when: (a) =>
      has(a, "reason", "something-wrong", "eating-drinking") &&
      !list(a, "symptoms").some((s) => ["vomiting", "diarrhea"].includes(s)),
  },
  {
    id: "breathing",
    phase: "context",
    eyebrow: "BREATHING",
    title: "HOW IS THEIR BREATHING?",
    kind: "list",
    options: [
      { id: "normal", label: "NORMAL", sub: "NO CHANGE NOTICED" },
      { id: "faster", label: "FASTER THAN USUAL", sub: "QUICKER BREATHS AT REST" },
      { id: "noisy", label: "NOISY", sub: "WHEEZING OR AUDIBLE EFFORT" },
      { id: "labored", label: "LABOURED", sub: "VISIBLE EFFORT TO BREATHE", tone: "danger" },
    ],
    when: (a) =>
      list(a, "symptoms").some((s) => ["breathing", "coughing"].includes(s)) ||
      (a.species === "bird" && concerned(a)),
  },
  {
    id: "history",
    phase: "context",
    eyebrow: "CONTEXT",
    title: "HAVE THEY SEEN A VET FOR THIS BEFORE?",
    kind: "list",
    options: [
      { id: "first-time", label: "FIRST TIME", sub: "NEVER SEEN FOR THIS ISSUE" },
      { id: "before-same", label: "YES — SAME PROBLEM", sub: "SEEN FOR THIS BEFORE" },
      { id: "on-medication", label: "CURRENTLY ON MEDICATION", sub: "FOR THIS OR SOMETHING ELSE" },
      { id: "new-to-clinic", label: "NEW TO THIS CLINIC", sub: "PREVIOUS RECORDS ELSEWHERE" },
    ],
    when: concerned,
  },
];

export function getQuestionFlow(a: Answers): QuestionDef[] {
  return QUESTIONS.filter((q) => !q.when || q.when(a));
}

export function questionTitle(q: QuestionDef, a: Answers): string {
  return typeof q.title === "function" ? q.title(a) : q.title;
}

export function questionOptions(q: QuestionDef, a: Answers): QOption[] {
  return typeof q.options === "function" ? q.options(a) : q.options;
}

export const OPTION_LABELS: Record<string, Record<string, string>> = {};
for (const q of QUESTIONS) {
  const opts = typeof q.options === "function" ? [] : q.options;
  OPTION_LABELS[q.id] = Object.fromEntries(opts.map((o) => [o.id, o.label]));
}
for (const [key, list] of Object.entries(SYMPTOMS)) {
  OPTION_LABELS[`symptoms:${key}`] = Object.fromEntries(list.map((o) => [o.id, o.label]));
}

const AGE_LABELS: Record<string, string> = {
  baby: "UNDER 1 YEAR",
  young: "1 — 3 YEARS",
  adult: "3 — 7 YEARS",
  senior: "7+ YEARS",
};

export function answerLabel(questionId: string, value: string, a: Answers): string {
  if (questionId === "age") return AGE_LABELS[value] ?? value;
  if (questionId === "symptoms") {
    const key = (a.reason as string) ?? "default";
    return OPTION_LABELS[`symptoms:${key}`]?.[value] ?? OPTION_LABELS["symptoms:default"][value] ?? value;
  }
  return OPTION_LABELS[questionId]?.[value] ?? value;
}
