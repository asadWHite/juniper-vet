// ---------------------------------------------------------------------------
// SERVICES — names and durations are demo values; prices intentionally
// withheld (marked "ON REQUEST") until the clinic confirms them.
// ---------------------------------------------------------------------------
import { IMG } from "@/data/images";

export interface ServiceDef {
  id: string; // slug
  index: string;
  name: string;
  short: string;
  description: string;
  durationMinutes: number;
  priceLabel: string;
  preparation: string[];
  image: string;
  imageAlt: string;
}

export const SERVICES: ServiceDef[] = [
  {
    id: "general",
    index: "01",
    name: "GENERAL CARE",
    short: "Full nose-to-tail examination.",
    description:
      "A calm, unhurried examination of the whole animal — heart, lungs, eyes, ears, skin, weight and behaviour. The right first step for most concerns, and the foundation of lifelong preventive care.",
    durationMinutes: 30,
    priceLabel: "PRICE ON REQUEST",
    preparation: [
      "BRING VACCINATION BOOKLET IF AVAILABLE",
      "NOTE ANY CHANGES IN EATING, DRINKING OR BEHAVIOUR",
      "DOGS ON LEASH, CATS & SMALL ANIMALS IN CARRIERS",
    ],
    image: IMG.svcGeneral.src,
    imageAlt: IMG.svcGeneral.alt,
  },
  {
    id: "vaccination",
    index: "02",
    name: "VACCINATION",
    short: "Core and lifestyle vaccines.",
    description:
      "Protection matched to species, age and lifestyle — never a one-size schedule. We review the history first, explain what is due and why, and only then vaccinate.",
    durationMinutes: 20,
    priceLabel: "PRICE ON REQUEST",
    preparation: [
      "BRING THE VACCINATION BOOKLET",
      "TELL US ABOUT ANY PAST VACCINE REACTIONS",
      "PET SHOULD BE EATING & BEHAVING NORMALLY",
    ],
    image: IMG.svcVaccination.src,
    imageAlt: IMG.svcVaccination.alt,
  },
  {
    id: "diagnostics",
    index: "03",
    name: "DIAGNOSTICS",
    short: "Lab work and imaging.",
    description:
      "When the exam raises questions, diagnostics give answers: blood panels, urine analysis, ultrasound and digital X-ray, interpreted the same day whenever possible.",
    durationMinutes: 45,
    priceLabel: "PRICE ON REQUEST",
    preparation: [
      "FASTING MAY BE REQUIRED — WE WILL CONFIRM BEFOREHAND",
      "BRING ANY PREVIOUS TEST RESULTS",
      "LIST CURRENT MEDICATION",
    ],
    image: IMG.svcDiagnostics.src,
    imageAlt: IMG.svcDiagnostics.alt,
  },
  {
    id: "dental",
    index: "04",
    name: "DENTAL",
    short: "Oral exams and treatment.",
    description:
      "Most animals over three have some dental disease, and they hide it well. From oral exams to scaling under anaesthesia — plus honest guidance on what home care actually works.",
    durationMinutes: 45,
    priceLabel: "PRICE ON REQUEST",
    preparation: [
      "DO NOT FEED FOR 8 HOURS IF SCALING IS PLANNED — WE CONFIRM FIRST",
      "MENTION ANY DIFFICULTY EATING OR DROPPING FOOD",
      "WATER IS FINE UNLESS WE SAY OTHERWISE",
    ],
    image: IMG.svcDental.src,
    imageAlt: IMG.svcDental.alt,
  },
  {
    id: "surgery",
    index: "05",
    name: "SURGERY",
    short: "Planned soft-tissue procedures.",
    description:
      "Planned soft-tissue procedures with modern anaesthesia monitoring. Every surgical plan starts with a full pre-operative examination and a direct conversation with the doctor.",
    durationMinutes: 60,
    priceLabel: "PRICE ON REQUEST",
    preparation: [
      "ALWAYS BOOKED AFTER A PRIOR EXAMINATION",
      "FASTING INSTRUCTIONS ARE GIVEN INDIVIDUALLY",
      "PLAN A QUIET REST SPACE AT HOME",
    ],
    image: IMG.svcSurgery.src,
    imageAlt: IMG.svcSurgery.alt,
  },
  {
    id: "dermatology",
    index: "06",
    name: "DERMATOLOGY",
    short: "Skin, coat, ears and allergies.",
    description:
      "Itching, ear trouble, hair loss, recurring hotspots. Skin problems are among the most common — and most mismanaged. We look for the cause, not just the cream.",
    durationMinutes: 40,
    priceLabel: "PRICE ON REQUEST",
    preparation: [
      "DO NOT BATHE OR APPLY PRODUCTS FOR 48 HOURS BEFORE",
      "BRING CURRENT SHAMPOOS, DROPS OR SUPPLEMENTS",
      "NOTE WHEN THE ITCHING STARTED",
    ],
    image: IMG.svcDerm.src,
    imageAlt: IMG.svcDerm.alt,
  },
];

export function getService(id: string): ServiceDef | undefined {
  return SERVICES.find((s) => s.id === id);
}
