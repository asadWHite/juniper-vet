// ---------------------------------------------------------------------------
// RECOMMENDATION ENGINE
// Turns questionnaire answers into a transparent care recommendation.
// It NEVER diagnoses — it only explains, in plain language, why a given
// type of visit makes sense based on what the owner told us.
// ---------------------------------------------------------------------------
import type { Answers, Urgency } from "@/types";
import { answerLabel } from "@/data/questionnaire";

export interface Recommendation {
  serviceId: string;
  serviceLabel: string;
  urgency: Urgency;
  urgencyLabel: string;
  headline: string;
  reasons: string[];
  emergency: boolean;
}

const urgencies: Record<Urgency, string> = {
  routine: "ROUTINE — ANY AVAILABLE DAY",
  soon: "SOON — WITHIN A FEW DAYS",
  priority: "PRIORITY — AS SOON AS POSSIBLE",
};

export function recommend(a: Answers): Recommendation {
  const reason = (a.reason as string) ?? "something-wrong";
  const severity = (a.severity as string) ?? "";
  const symptoms = new Set<string>((a.symptoms as string[]) ?? []);
  const duration = (a.duration as string) ?? "";
  const digestion = (a.digestion as string) ?? "";
  const breathingState = (a.breathing as string) ?? "";

  const emergency =
    severity === "emergency" ||
    (severity === "very-distressed" && (breathingState === "labored" || symptoms.has("breathing") || symptoms.has("not-weight-bearing")));

  // --- choose the service -------------------------------------------------
  let serviceId = "general";
  let serviceLabel = "GENERAL VETERINARY EXAMINATION";
  switch (reason) {
    case "routine-check":
      serviceId = "general";
      serviceLabel = "ANNUAL WELLNESS EXAMINATION";
      break;
    case "vaccination":
      serviceId = "vaccination";
      serviceLabel = "VACCINATION VISIT";
      break;
    case "skin":
      serviceId = "dermatology";
      serviceLabel = "DERMATOLOGY CONSULTATION";
      break;
    case "dental":
      serviceId = "dental";
      serviceLabel = "DENTAL ASSESSMENT";
      break;
    case "digestive":
    case "eating-drinking":
    case "behavior":
    case "injury":
    case "something-wrong":
    case "follow-up":
    case "other":
    default:
      serviceId = "general";
      serviceLabel = "GENERAL VETERINARY EXAMINATION";
  }

  // --- choose the urgency -------------------------------------------------
  let urgency: Urgency = "routine";
  const longDuration = ["several-days", "1-2-weeks", "longer"].includes(duration);
  if (["routine-check", "vaccination", "follow-up"].includes(reason)) {
    urgency = "routine";
  } else if (
    severity === "very-distressed" ||
    symptoms.has("not-weight-bearing") ||
    (symptoms.has("wound") && symptoms.has("bleeding")) ||
    (symptoms.has("not-eating") && longDuration) ||
    (digestion === "both" && severity !== "comfortable")
  ) {
    urgency = "priority";
  } else if (severity === "clearly-uncomfortable" || longDuration || digestion === "vomiting" || digestion === "diarrhea" || breathingState === "faster" || breathingState === "noisy") {
    urgency = "soon";
  }

  // --- explain why, transparently ----------------------------------------
  const reasons: string[] = [];
  if (["routine-check"].includes(reason)) {
    reasons.push("A wellness exam keeps the baseline up to date — most problems are easier (and kinder) to fix when found early.");
  } else if (reason === "vaccination") {
    reasons.push("Vaccines are matched to species, age and lifestyle. We review the existing record first, then give only what is due.");
  } else {
    if (symptoms.size > 0) {
      const named = [...symptoms]
        .slice(0, 3)
        .map((s) => answerLabel("symptoms", s, a).toLowerCase())
        .join(", ");
      reasons.push(`You mentioned: ${named}.`);
    }
    if (reason === "eating-drinking") reasons.push("Changes in eating or drinking are one of the earliest reliable signs that something needs a look.");
    if (reason === "skin") reasons.push("Skin, coat and ear problems deserve a dermatology-led consult rather than symptom-by-symptom creams.");
    if (reason === "dental") reasons.push("Dental problems are frequently hidden — an oral assessment finds what chewing politely conceals.");
    if (reason === "injury") reasons.push("After an injury, an examination rules out fractures and internal damage before it becomes harder to treat.");
    if (reason === "behavior") reasons.push("Behaviour changes in animals very often have a medical root — the exam looks for one first.");
    if (duration && duration !== "not-sure")
      reasons.push(`It has been going on for ${answerLabel("duration", duration, a).toLowerCase()}.`);
    if (severity === "clearly-uncomfortable") reasons.push("They seem clearly uncomfortable, so waiting longer is unlikely to help.");
    if (severity === "very-distressed") reasons.push("They appear very distressed — this should be seen promptly, today if possible.");
    if (severity === "comfortable" || severity === "a-little-unusual")
      reasons.push("They still seem mostly comfortable, which suggests this can be scheduled rather than rushed.");
    reasons.push("A full examination is the right first step — the doctor decides if anything further is needed.");
  }

  const headline = emergency
    ? "THIS MAY NEED PROMPT VETERINARY ATTENTION."
    : `WE RECOMMEND STARTING WITH: ${serviceLabel}`;

  return {
    serviceId,
    serviceLabel,
    urgency,
    urgencyLabel: urgencies[urgency],
    headline,
    reasons,
    emergency,
  };
}
