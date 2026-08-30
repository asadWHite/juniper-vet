// DB-backed availability queries (server-only).
import { and, eq, gte, lte, ne, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  appointments,
  blockedSlots,
  doctorSchedules,
  doctorServices,
  doctors,
  services,
} from "@/db/schema";
import { computeDaySlots, dayStatusFromSlots, toDayVm, BOOKING_HORIZON_DAYS, type ScheduleLike } from "@/lib/availability";
import { addDaysISO, todayISO, weekdayIndex } from "@/lib/dates";
import type { DayVm, SlotVm } from "@/types";

const ACTIVE_STATUSES = ["booked", "no_show"] as const; // occupied intervals

async function scheduleFor(doctorId: string, date: string): Promise<ScheduleLike | null> {
  const rows = await db
    .select()
    .from(doctorSchedules)
    .where(
      and(eq(doctorSchedules.doctorId, doctorId), eq(doctorSchedules.dayOfWeek, weekdayIndex(date)))
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function getServiceDuration(serviceId: string): Promise<number | null> {
  const rows = await db
    .select({ d: services.durationMinutes })
    .from(services)
    .where(eq(services.id, serviceId))
    .limit(1);
  return rows[0]?.d ?? null;
}

export async function getDaySlots(
  doctorId: string,
  serviceId: string,
  date: string
): Promise<SlotVm[]> {
  const duration = await getServiceDuration(serviceId);
  if (!duration) return [];
  const schedule = await scheduleFor(doctorId, date);

  const appts = await db
    .select({ startTime: appointments.startTime, endTime: appointments.endTime })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, doctorId),
        eq(appointments.date, date),
        ne(appointments.status, "cancelled")
      )
    );

  const blocked = await db
    .select({ startTime: blockedSlots.startTime, endTime: blockedSlots.endTime })
    .from(blockedSlots)
    .where(and(eq(blockedSlots.doctorId, doctorId), eq(blockedSlots.date, date)));

  return computeDaySlots({
    date,
    schedule,
    durationMinutes: duration,
    appointments: appts,
    blocked,
  });
}

export async function getDayStrip(
  doctorId: string,
  serviceId: string,
  fromDate?: string
): Promise<DayVm[]> {
  const today = todayISO();
  const start = fromDate && fromDate > today ? fromDate : today;
  const end = addDaysISO(start, BOOKING_HORIZON_DAYS - 1);

  const sched = await db
    .select()
    .from(doctorSchedules)
    .where(eq(doctorSchedules.doctorId, doctorId));
  const byDay = new Map(sched.map((s) => [s.dayOfWeek, s]));

  const dates: string[] = [];
  for (let i = 0; i < BOOKING_HORIZON_DAYS; i++) dates.push(addDaysISO(start, i));

  const appts = await db
    .select({ date: appointments.date, startTime: appointments.startTime, endTime: appointments.endTime })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, doctorId),
        gte(appointments.date, start),
        lte(appointments.date, end),
        inArray(appointments.status, [...ACTIVE_STATUSES])
      )
    );

  const blocked = await db
    .select({ date: blockedSlots.date, startTime: blockedSlots.startTime, endTime: blockedSlots.endTime })
    .from(blockedSlots)
    .where(
      and(eq(blockedSlots.doctorId, doctorId), gte(blockedSlots.date, start), lte(blockedSlots.date, end))
    );

  const duration = (await getServiceDuration(serviceId)) ?? 30;

  return dates.map((date) => {
    const schedule = byDay.get(weekdayIndex(date)) ?? null;
    const slots = computeDaySlots({
      date,
      schedule,
      durationMinutes: duration,
      appointments: appts.filter((a) => a.date === date),
      blocked: blocked.filter((b) => b.date === date),
    });
    return toDayVm(date, dayStatusFromSlots(slots, !!schedule, date));
  });
}

export interface DoctorNextSlot {
  doctorId: string;
  date: string;
  start: string;
}

// Next available slot per eligible doctor — used for "NEXT AVAILABLE" chips.
export async function getNextSlots(serviceId: string): Promise<DoctorNextSlot[]> {
  const eligible = await db
    .select({ id: doctors.id })
    .from(doctors)
    .where(eq(doctors.active, true));

  const links = await db
    .select({ doctorId: doctorServices.doctorId })
    .from(doctorServices)
    .where(eq(doctorServices.serviceId, serviceId));
  const allowed = new Set(links.map((l) => l.doctorId));

  const out: DoctorNextSlot[] = [];
  for (const doc of eligible) {
    if (!allowed.has(doc.id)) continue;

    const strip = await getDayStrip(doc.id, serviceId);
    const day = strip.find((d) => d.status === "available" || d.status === "limited");
    if (!day) continue;
    const slots = await getDaySlots(doc.id, serviceId, day.date);
    const slot = slots.find((s) => s.state === "available");
    if (slot) out.push({ doctorId: doc.id, date: day.date, start: slot.start });
  }
  return out;
}

// Verify inside the booking transaction whether an interval is still free.
export async function intervalIsFree(args: {
  doctorId: string;
  serviceId: string;
  date: string;
  startTime: string;
}): Promise<{ ok: boolean; endTime: string }> {
  const slots = await getDaySlots(args.doctorId, args.serviceId, args.date);
  const slot = slots.find((s) => s.start === args.startTime);
  if (!slot || slot.state !== "available") return { ok: false, endTime: "" };
  return { ok: true, endTime: slot.end };
}
