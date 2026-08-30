// ---------------------------------------------------------------------------
// MEDICAL TEAM — PLACEHOLDER / DEMONSTRATION DATA
// Real names, specializations, education and availability must be provided
// by the clinic. Every record here is clearly marked as demo content in the UI.
// ---------------------------------------------------------------------------
import { IMG } from "@/data/images";

export interface DoctorScheduleDef {
  dayOfWeek: number; // 0 = Sunday
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
}

export interface DoctorDef {
  id: string; // slug
  name: string;
  specialty: string;
  focus: string[];
  languages: string[];
  bio: string;
  photo: string;
  photoAlt: string;
  secondPhoto: string;
  serviceIds: string[];
  schedule: DoctorScheduleDef[];
}

export const DOCTORS: DoctorDef[] = [
  {
    id: "dr-maya-chen",
    name: "DR. MAYA CHEN",
    specialty: "GENERAL & PREVENTIVE MEDICINE",
    focus: ["ANNUAL EXAMS", "VACCINATION PLANS", "SENIOR CARE"],
    languages: ["ENGLISH", "MANDARIN"],
    bio: "Maya leads our preventive program. She believes most illness can be caught early by watching the small things — appetite, sleep, mood — the things only an owner truly knows.",
    photo: IMG.docMaya.src,
    photoAlt: IMG.docMaya.alt,
    secondPhoto: IMG.docMayaAlt.src,
    serviceIds: ["general", "vaccination", "diagnostics"],
    schedule: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "18:00", breakStart: "13:00", breakEnd: "14:00" },
      { dayOfWeek: 2, startTime: "09:00", endTime: "18:00", breakStart: "13:00", breakEnd: "14:00" },
      { dayOfWeek: 3, startTime: "09:00", endTime: "18:00", breakStart: "13:00", breakEnd: "14:00" },
      { dayOfWeek: 4, startTime: "09:00", endTime: "18:00", breakStart: "13:00", breakEnd: "14:00" },
      { dayOfWeek: 5, startTime: "09:00", endTime: "16:00", breakStart: "13:00", breakEnd: "14:00" },
    ],
  },
  {
    id: "dr-jonas-weber",
    name: "DR. JONAS WEBER",
    specialty: "GENERAL & URGENT CARE",
    focus: ["SAME-DAY VISITS", "DIGESTIVE ISSUES", "FIRST OPINION"],
    languages: ["ENGLISH", "GERMAN"],
    bio: "Jonas is usually the first doctor a worried owner meets. Calm, methodical, unhurried — his consults start with what you have noticed at home before anything else.",
    photo: IMG.docJonas.src,
    photoAlt: IMG.docJonas.alt,
    secondPhoto: IMG.docJonasAlt.src,
    serviceIds: ["general", "vaccination", "diagnostics"],
    schedule: [
      { dayOfWeek: 2, startTime: "10:00", endTime: "18:00", breakStart: "13:30", breakEnd: "14:30" },
      { dayOfWeek: 3, startTime: "10:00", endTime: "18:00", breakStart: "13:30", breakEnd: "14:30" },
      { dayOfWeek: 4, startTime: "10:00", endTime: "18:00", breakStart: "13:30", breakEnd: "14:30" },
      { dayOfWeek: 5, startTime: "10:00", endTime: "18:00", breakStart: "13:30", breakEnd: "14:30" },
      { dayOfWeek: 6, startTime: "10:00", endTime: "15:00", breakStart: null, breakEnd: null },
    ],
  },
  {
    id: "dr-amara-osei",
    name: "DR. AMARA OSEI",
    specialty: "DENTISTRY & SOFT-TISSUE SURGERY",
    focus: ["DENTAL SCALING", "ORAL PAIN", "MINOR SURGERY"],
    languages: ["ENGLISH"],
    bio: "Amara runs our surgical suite. Dental disease is the most undertreated problem in companion animals — she is quietly determined to change that, one calm patient at a time.",
    photo: IMG.docAmara.src,
    photoAlt: IMG.docAmara.alt,
    secondPhoto: IMG.docAmaraAlt.src,
    serviceIds: ["dental", "surgery", "general"],
    schedule: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", breakStart: "12:30", breakEnd: "13:30" },
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", breakStart: "12:30", breakEnd: "13:30" },
      { dayOfWeek: 5, startTime: "09:00", endTime: "17:00", breakStart: "12:30", breakEnd: "13:30" },
    ],
  },
  {
    id: "dr-luca-marchetti",
    name: "DR. LUCA MARCHETTI",
    specialty: "DERMATOLOGY & SMALL COMPANIONS",
    focus: ["SKIN & COAT", "ALLERGIES", "RABBITS & BIRDS"],
    languages: ["ENGLISH", "ITALIAN"],
    bio: "Luca looks after our smallest patients and our itchiest ones. Rabbits, birds, guinea pigs — medicine scales down, attention does not.",
    photo: IMG.docLuca.src,
    photoAlt: IMG.docLuca.alt,
    secondPhoto: IMG.docLucaAlt.src,
    serviceIds: ["dermatology", "general", "diagnostics"],
    schedule: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "14:00", breakStart: null, breakEnd: null },
      { dayOfWeek: 2, startTime: "09:00", endTime: "14:00", breakStart: null, breakEnd: null },
      { dayOfWeek: 4, startTime: "12:00", endTime: "18:00", breakStart: null, breakEnd: null },
      { dayOfWeek: 6, startTime: "10:00", endTime: "15:00", breakStart: null, breakEnd: null },
    ],
  },
];

export function getDoctor(id: string): DoctorDef | undefined {
  return DOCTORS.find((d) => d.id === id);
}

export function doctorsForService(serviceId: string): DoctorDef[] {
  return DOCTORS.filter((d) => d.serviceIds.includes(serviceId));
}
