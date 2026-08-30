// ---------------------------------------------------------------------------
// IDEMPOTENT SEED
// Populates the clinic catalog (services, doctors, schedules) and clearly
// marked demo content (sample account, pets, appointments, reviews).
// Safe to call on every request — it no-ops once data exists.
// ---------------------------------------------------------------------------
import { count } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import {
  appointments,
  blockedSlots,
  doctorSchedules,
  doctorServices,
  doctors,
  medicalRecords,
  pets,
  reviews,
  services,
  users,
  vaccinations,
} from "@/db/schema";
import { DOCTORS } from "@/data/doctors";
import { SERVICES } from "@/data/services";
import { hashPassword, newId } from "@/lib/auth";
import { addDaysISO, todayISO } from "@/lib/dates";
import { IMG, petDefaultPhoto } from "@/data/images";

let seeded = false;

export async function ensureSeed(): Promise<void> {
  if (seeded) return;
  try {
    // concurrency backstop for bookings (partial unique index)
    await db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS appt_active_slot
      ON appointments (doctor_id, date, start_time)
      WHERE status <> 'cancelled'
    `);

    const existing = await db.select({ c: count() }).from(doctors);
    if ((existing[0]?.c ?? 0) > 0) {
      seeded = true;
      return;
    }

    // --- catalog ----------------------------------------------------------
    for (const s of SERVICES) {
      await db
        .insert(services)
        .values({
          id: s.id,
          name: s.name,
          shortDescription: s.short,
          description: s.description,
          durationMinutes: s.durationMinutes,
          priceLabel: s.priceLabel,
          preparation: s.preparation,
          imageUrl: s.image,
          sortIndex: Number(s.index),
        })
        .onConflictDoNothing();
    }

    for (const d of DOCTORS) {
      await db
        .insert(doctors)
        .values({
          id: d.id,
          name: d.name,
          specialty: d.specialty,
          bio: d.bio,
          photoUrl: d.photo,
          focus: d.focus,
          languages: d.languages,
          active: true,
        })
        .onConflictDoNothing();
      for (const sid of d.serviceIds) {
        await db.insert(doctorServices).values({ doctorId: d.id, serviceId: sid }).onConflictDoNothing();
      }
      for (const sc of d.schedule) {
        await db.insert(doctorSchedules).values({
          doctorId: d.id,
          dayOfWeek: sc.dayOfWeek,
          startTime: sc.startTime,
          endTime: sc.endTime,
          breakStart: sc.breakStart,
          breakEnd: sc.breakEnd,
        });
      }
    }

    // --- demo account + pets ----------------------------------------------
    const demoId = "user-demo";
    await db
      .insert(users)
      .values({
        id: demoId,
        email: "demo@juniper.vet",
        fullName: "ALEX RIVERS",
        phone: "+1 (555) 013-4421",
        passwordHash: hashPassword("juniper-demo"),
      })
      .onConflictDoNothing();

    const rex = "pet-rex";
    const miso = "pet-miso";
    await db.insert(pets).values([
      {
        id: rex,
        userId: demoId,
        name: "REX",
        species: "dog",
        breed: "LABRADOR RETRIEVER",
        sex: "MALE",
        birthDate: addDaysISO(todayISO(), -365 * 3 - 40),
        ageLabel: "3 YRS",
        weightKg: "29.4",
        notes: "Friendly. Gets nervous in the waiting room — treats help.",
        photoUrl: IMG.blackLab.src,
      },
      {
        id: miso,
        userId: demoId,
        name: "MISO",
        species: "cat",
        breed: "DOMESTIC SHORTHAIR",
        sex: "FEMALE",
        birthDate: addDaysISO(todayISO(), -365 * 2 - 10),
        ageLabel: "2 YRS",
        weightKg: "4.1",
        notes: "Indoor cat. Prefers the carrier covered with a blanket.",
        photoUrl: petDefaultPhoto("cat"),
      },
    ]);

    // --- demo appointment history ------------------------------------------
    const today = todayISO();
    await db.insert(appointments).values([
      {
        id: "appt-demo-1",
        userId: demoId,
        petId: rex,
        petName: "REX",
        petSpecies: "dog",
        petMeta: "LABRADOR RETRIEVER · 3 YRS",
        doctorId: "dr-maya-chen",
        serviceId: "general",
        date: addDaysISO(today, -14),
        startTime: "10:00",
        endTime: "10:30",
        durationMinutes: 30,
        status: "completed",
        notes: "Annual wellness examination.",
      },
      {
        id: "appt-demo-2",
        userId: demoId,
        petId: miso,
        petName: "MISO",
        petSpecies: "cat",
        petMeta: "DOMESTIC SHORTHAIR · 2 YRS",
        doctorId: "dr-luca-marchetti",
        serviceId: "dermatology",
        date: addDaysISO(today, -21),
        startTime: "09:30",
        endTime: "10:10",
        durationMinutes: 40,
        status: "completed",
        notes: "Recurring ear irritation — follow-up advised in 6 weeks.",
      },
      {
        id: "appt-demo-3",
        userId: demoId,
        petId: rex,
        petName: "REX",
        petSpecies: "dog",
        petMeta: "LABRADOR RETRIEVER · 3 YRS",
        doctorId: "dr-jonas-weber",
        serviceId: "vaccination",
        date: addDaysISO(today, 3),
        startTime: "10:30",
        endTime: "10:50",
        durationMinutes: 20,
        status: "booked",
        notes: "DHPP booster due.",
      },
    ]);

    await db.insert(vaccinations).values([
      { id: "vac-1", petId: rex, name: "RABIES", administeredOn: addDaysISO(today, -200), dueOn: addDaysISO(today, 165), status: "done" },
      { id: "vac-2", petId: rex, name: "DHPP BOOSTER", administeredOn: null, dueOn: addDaysISO(today, 3), status: "due" },
      { id: "vac-3", petId: miso, name: "FVRCP", administeredOn: addDaysISO(today, -390), dueOn: addDaysISO(today, -5), status: "overdue" },
    ]);

    await db.insert(medicalRecords).values([
      {
        id: "rec-1",
        petId: rex,
        appointmentId: "appt-demo-1",
        title: "ANNUAL WELLNESS EXAMINATION",
        summary: "Healthy condition. Weight stable (29.4 kg). Dental hygiene good — continue chews. Booster due in two weeks.",
        recordedOn: addDaysISO(today, -14),
      },
      {
        id: "rec-2",
        petId: miso,
        appointmentId: "appt-demo-2",
        title: "DERMATOLOGY CONSULTATION",
        summary: "Mild otitis externa, left ear. Drops prescribed for 10 days. Recheck recommended if scratching persists.",
        recordedOn: addDaysISO(today, -21),
      },
    ]);

    // --- demo reviews (clearly marked sample content) ----------------------
    await db.insert(reviews).values([
      {
        id: "rev-1",
        appointmentId: "appt-demo-1",
        userId: demoId,
        doctorId: "dr-maya-chen",
        rating: 5,
        comment: "Rex was a nervous wreck in the car and a calm, tail-wagging patient five minutes later. Nobody rushed us. Everything was explained before it was done.",
        authorLabel: "ALEX R. WITH REX",
        approved: true,
      },
      {
        id: "rev-2",
        appointmentId: "appt-demo-2",
        userId: demoId,
        doctorId: "dr-luca-marchetti",
        rating: 5,
        comment: "Miso's ear had bothered us for weeks. One visit, a clear plan, and the scratching stopped in days. The follow-up call afterwards was a lovely surprise.",
        authorLabel: "ALEX R. WITH MISO",
        approved: true,
      },
    ]);

    // --- demo blocked slot --------------------------------------------------
    await db.insert(blockedSlots).values([
      {
        doctorId: "dr-jonas-weber",
        date: addDaysISO(today, 4),
        startTime: "13:00",
        endTime: "15:00",
        reason: "TEAM TRAINING",
      },
    ]);

    seeded = true;
  } catch (err) {
    console.error("[seed] failed:", err);
  }
}
