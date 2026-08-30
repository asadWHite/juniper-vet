// ---------------------------------------------------------------------------
// REAL AVAILABILITY ENGINE (pure functions — no DB access)
// Computes slot states from: doctor schedule, breaks, blocked slots,
// existing appointments, service duration and current time.
// ---------------------------------------------------------------------------
import {
  hhmm,
  minutesOf,
  rangesOverlap,
  todayISO,
  weekdayShort,
  dayNum,
} from "@/lib/dates";
import type { DayStatus, DayVm, SlotState, SlotVm } from "@/types";

export const SLOT_STEP = 30; // minutes between candidate start times
export const BOOKING_LEAD_MIN = 45; // earliest bookable offset from "now"
export const BOOKING_HORIZON_DAYS = 14;

export interface ScheduleLike {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
}

export interface IntervalLike {
  startTime: string;
  endTime: string;
}

export function computeDaySlots(args: {
  date: string; // YYYY-MM-DD
  now?: Date;
  schedule: ScheduleLike | null;
  durationMinutes: number;
  appointments: IntervalLike[];
  blocked: IntervalLike[];
}): SlotVm[] {
  const { date, schedule, durationMinutes, appointments, blocked } = args;
  if (!schedule) return [];
  const now = args.now ?? new Date();
  const today = todayISO();

  const workS = minutesOf(schedule.startTime);
  const workE = minutesOf(schedule.endTime);
  const brkS = schedule.breakStart ? minutesOf(schedule.breakStart) : null;
  const brkE = schedule.breakEnd ? minutesOf(schedule.breakEnd) : null;

  const nowMin = now.getHours() * 60 + now.getMinutes() + BOOKING_LEAD_MIN;
  const appts = appointments.map((a) => [minutesOf(a.startTime), minutesOf(a.endTime)] as const);
  const blocks = blocked.map((b) => [minutesOf(b.startTime), minutesOf(b.endTime)] as const);

  const slots: SlotVm[] = [];
  for (let s = workS; s + durationMinutes <= workE; s += SLOT_STEP) {
    const e = s + durationMinutes;
    let state: SlotState = "available";

    if (date < today) {
      state = "past";
    } else if (date === today && s < nowMin) {
      state = "past";
    } else if (appts.some(([aS, aE]) => rangesOverlap(s, e, aS, aE))) {
      state = "booked";
    } else if (
      (brkS !== null && brkE !== null && rangesOverlap(s, e, brkS, brkE)) ||
      blocks.some(([bS, bE]) => rangesOverlap(s, e, bS, bE))
    ) {
      state = "blocked";
    }

    slots.push({ start: hhmm(s), end: hhmm(e), state });
  }
  return slots;
}

export function dayStatusFromSlots(slots: SlotVm[], hasSchedule: boolean, date: string): DayStatus {
  const today = todayISO();
  if (date < today) return "past";
  if (!hasSchedule) return "unavailable";
  if (slots.length === 0) return "unavailable";
  const free = slots.filter((s) => s.state === "available").length;
  if (free === 0) {
    return slots.every((s) => s.state === "past" || s.state === "blocked") && date === today
      ? "full"
      : "full";
  }
  if (free <= 2) return "limited";
  return "available";
}

export function toDayVm(date: string, status: DayStatus): DayVm {
  return { date, weekday: weekdayShort(date), dayNum: dayNum(date), status };
}

export const DAY_STATUS_LABEL: Record<DayStatus, string> = {
  past: "PAST",
  unavailable: "CLOSED",
  full: "FULL",
  limited: "LIMITED",
  available: "AVAILABLE",
};

export const SLOT_STATUS_LABEL: Record<SlotState, string> = {
  available: "AVAILABLE",
  booked: "BOOKED",
  blocked: "BLOCKED",
  past: "PAST",
  unavailable: "UNAVAILABLE",
};
