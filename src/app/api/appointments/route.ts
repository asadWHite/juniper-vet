import { and, eq, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { appointments, doctors, pets, reviews, services } from "@/db/schema";
import { getSessionUser, newId } from "@/lib/auth";
import { body, fail, isEmail, ok } from "@/lib/api";
import { ensureSeed } from "@/lib/seed";
import { computeDaySlots } from "@/lib/availability";
import { getServiceDuration } from "@/lib/availability-data";
import { minutesOf } from "@/lib/dates";
import { speciesPhoto } from "@/data/images";
import type { AppointmentCard } from "@/types";

export const dynamic = "force-dynamic";

// ------------------------------------------------------------------ GET mine
export async function GET() {
  const user = await getSessionUser();
  if (!user) return fail("Please sign in.", 401);

  try {
    const rows = await db
      .select({
        id: appointments.id,
        date: appointments.date,
        startTime: appointments.startTime,
        endTime: appointments.endTime,
        durationMinutes: appointments.durationMinutes,
        status: appointments.status,
        notes: appointments.notes,
        petName: appointments.petName,
        petSpecies: appointments.petSpecies,
        petId: appointments.petId,
        doctorId: appointments.doctorId,
        doctorName: doctors.name,
        doctorPhoto: doctors.photoUrl,
        serviceId: appointments.serviceId,
        serviceName: services.name,
      })
      .from(appointments)
      .innerJoin(doctors, eq(appointments.doctorId, doctors.id))
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(eq(appointments.userId, user.id))
      .orderBy(appointments.date, appointments.startTime);

    const petIds = [...new Set(rows.map((r) => r.petId).filter(Boolean))] as string[];
    const petPhotos = new Map<string, string | null>();
    if (petIds.length) {
      const ps = await db.select().from(pets);
      for (const p of ps) if (petIds.includes(p.id)) petPhotos.set(p.id, p.photoUrl);
    }

    const apptIds = rows.map((r) => r.id);
    const revs = apptIds.length
      ? await db
          .select({ appointmentId: reviews.appointmentId, rating: reviews.rating, comment: reviews.comment })
          .from(reviews)
      : [];
    const revMap = new Map(revs.map((r) => [r.appointmentId, { rating: r.rating, comment: r.comment }]));

    const cards: AppointmentCard[] = rows.map((r) => ({
      id: r.id,
      date: r.date,
      startTime: r.startTime,
      endTime: r.endTime,
      durationMinutes: r.durationMinutes,
      status: r.status as AppointmentCard["status"],
      notes: r.notes,
      petName: r.petName,
      petSpecies: r.petSpecies,
      petPhoto: (r.petId && petPhotos.get(r.petId)) || speciesPhoto(r.petSpecies),
      doctorId: r.doctorId,
      doctorName: r.doctorName,
      doctorPhoto: r.doctorPhoto,
      serviceId: r.serviceId,
      serviceName: r.serviceName,
      hasReview: revMap.has(r.id),
      review: revMap.get(r.id) ?? null,
    }));

    return ok({ appointments: cards });
  } catch (err) {
    console.error("[appointments GET]", err);
    return fail("Appointments could not be loaded.", 500);
  }
}

// ------------------------------------------------------------------ POST new
interface CreateBody {
  doctorId?: string;
  serviceId?: string;
  date?: string;
  startTime?: string;
  pet?: { petId?: string | null; name?: string; species?: string; breed?: string };
  contact?: { name?: string; email?: string; phone?: string };
  notes?: string;
  questionnaire?: unknown;
}

export async function POST(req: Request) {
  const data = await body<CreateBody>(req);
  if (!data) return fail("Invalid request.", 400);

  const { doctorId, serviceId, date, startTime } = data;
  if (!doctorId || !serviceId || !date || !startTime)
    return fail("Missing visit details.", 422, "validation");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(startTime))
    return fail("Invalid date or time format.", 422, "validation");

  const petName = (data.pet?.name ?? "").trim();
  const species = (data.pet?.species ?? "").trim();
  if (!petName || !species) return fail("Please tell us who the visit is for.", 422, "validation");

  const user = await getSessionUser();
  const contact = data.contact ?? {};
  if (!user) {
    if (!contact.name?.trim() || !isEmail(contact.email ?? "") || !contact.phone?.trim())
      return fail("We need your name, a valid email and a phone number.", 422, "validation");
  }

  try {
    await ensureSeed();

    const duration = await getServiceDuration(serviceId);
    if (!duration) return fail("Unknown service.", 404);

    const id = newId();
    const endTime = `${String(Math.floor((minutesOf(startTime) + duration) / 60)).padStart(2, "0")}:${String(
      (minutesOf(startTime) + duration) % 60
    ).padStart(2, "0")}`;

    // --- transactional double-booking enforcement --------------------------
    const created = await db.transaction(async (tx) => {
      // serialize concurrent bookings for the same doctor & day
      await tx.execute(
        sql`SELECT pg_advisory_xact_lock(hashtext(${doctorId} || ':' || ${date}))`
      );

      // recompute the day's slots inside the lock
      const [scheduleRows, appts, blocked] = await Promise.all([
        tx.execute(sql`
          SELECT day_of_week AS "dayOfWeek", start_time AS "startTime", end_time AS "endTime",
                 break_start AS "breakStart", break_end AS "breakEnd"
          FROM doctor_schedules
          WHERE doctor_id = ${doctorId}
            AND day_of_week = EXTRACT(ISODOW FROM ${date}::date) % 7
          LIMIT 1
        `),
        tx.execute(sql`
          SELECT start_time AS "startTime", end_time AS "endTime"
          FROM appointments
          WHERE doctor_id = ${doctorId} AND date = ${date} AND status <> 'cancelled'
        `),
        tx.execute(sql`
          SELECT start_time AS "startTime", end_time AS "endTime"
          FROM blocked_slots
          WHERE doctor_id = ${doctorId} AND date = ${date}
        `),
      ]);

      const toRows = (r: unknown) =>
        ((r as { rows?: Record<string, unknown>[] }).rows ?? []) as {
          startTime: string;
          endTime: string;
          dayOfWeek?: number;
          breakStart?: string | null;
          breakEnd?: string | null;
        }[];

      const schedule = toRows(scheduleRows)[0] ?? null;
      const slots = computeDaySlots({
        date,
        schedule: schedule
          ? {
              dayOfWeek: Number(schedule.dayOfWeek ?? 0),
              startTime: String(schedule.startTime),
              endTime: String(schedule.endTime),
              breakStart: schedule.breakStart ?? null,
              breakEnd: schedule.breakEnd ?? null,
            }
          : null,
        durationMinutes: duration,
        appointments: toRows(appts).map((a) => ({ startTime: a.startTime, endTime: a.endTime })),
        blocked: toRows(blocked).map((b) => ({ startTime: b.startTime, endTime: b.endTime })),
      });

      const slot = slots.find((s) => s.start === startTime);
      if (!slot || slot.state !== "available") {
        return { conflict: true as const };
      }

      // attach / create pet for logged-in users
      let petId: string | null = null;
      if (user) {
        if (data.pet?.petId) {
          const owned = await tx
            .select({ id: pets.id })
            .from(pets)
            .where(and(eq(pets.id, data.pet.petId), eq(pets.userId, user.id)))
            .limit(1);
          if (!owned.length) return { forbidden: true as const };
          petId = data.pet.petId;
        } else {
          petId = newId();
          await tx.insert(pets).values({
            id: petId,
            userId: user.id,
            name: petName.toUpperCase(),
            species,
            breed: data.pet?.breed?.trim().toUpperCase() || null,
            photoUrl: speciesPhoto(species),
          });
        }
      }

      const rows = await tx
        .insert(appointments)
        .values({
          id,
          userId: user?.id ?? null,
          petId,
          petName: petName.toUpperCase(),
          petSpecies: species,
          petMeta: [data.pet?.breed?.trim().toUpperCase(), null].filter(Boolean).join(" · ") || null,
          guestName: user ? null : contact.name!.trim().toUpperCase(),
          guestEmail: user ? null : contact.email!.toLowerCase(),
          guestPhone: user ? null : contact.phone!.trim(),
          doctorId,
          serviceId,
          date,
          startTime,
          endTime,
          durationMinutes: duration,
          status: "booked",
          notes: data.notes?.trim() || null,
          questionnaire: data.questionnaire ?? null,
        })
        .returning({ id: appointments.id });
      return { row: rows[0] };
    });

    if ("conflict" in created) {
      return fail(
        "This appointment time was just booked. Please choose another time.",
        409,
        "slot_taken"
      );
    }
    if ("forbidden" in created) {
      return fail("That pet does not belong to your account.", 403, "forbidden");
    }

    const [doc] = await db.select().from(doctors).where(eq(doctors.id, doctorId)).limit(1);
    const [svc] = await db.select().from(services).where(eq(services.id, serviceId)).limit(1);

    return ok(
      {
        appointment: {
          id: created.row.id,
          petName: petName.toUpperCase(),
          serviceName: svc?.name ?? serviceId.toUpperCase(),
          doctorName: doc?.name ?? doctorId,
          date,
          startTime,
          endTime,
          durationMinutes: duration,
          status: "booked",
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    // unique index backstop also surfaces here on a true race
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "23505") {
      return fail(
        "This appointment time was just booked. Please choose another time.",
        409,
        "slot_taken"
      );
    }
    console.error("[appointments POST]", err);
    return fail("The booking could not be completed. Please try again.", 500);
  }
}
