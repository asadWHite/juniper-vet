export type Urgency = "routine" | "soon" | "priority";

export type SlotState = "available" | "booked" | "blocked" | "past" | "unavailable";

export interface SlotVm {
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  state: SlotState;
}

export type DayStatus = "past" | "unavailable" | "full" | "limited" | "available";

export interface DayVm {
  date: string; // "YYYY-MM-DD"
  weekday: string; // "MON"
  dayNum: string; // "01"
  status: DayStatus;
}

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
}

export interface PetVm {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string | null;
  ageLabel: string | null;
  weightKg: string | null;
  notes: string | null;
  photoUrl: string | null;
}

export interface AppointmentCard {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: "booked" | "completed" | "cancelled" | "no_show";
  notes: string | null;
  petName: string;
  petSpecies: string;
  petPhoto: string | null;
  doctorId: string;
  doctorName: string;
  doctorPhoto: string;
  serviceId: string;
  serviceName: string;
  hasReview: boolean;
  review: { rating: number; comment: string } | null;
}

export type Answers = Record<string, string | string[]>;

export interface NextSlot {
  doctorId: string;
  date: string;
  start: string;
}

export interface ApiError {
  error: { code: string; message: string };
}
