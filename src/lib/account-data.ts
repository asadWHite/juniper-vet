// Server-side account queries.
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  appointments,
  doctors,
  favorites,
  pets,
  reviews,
  services,
  vaccinations,
} from "@/db/schema";
import { speciesPhoto } from "@/data/images";
import { todayISO } from "@/lib/dates";
import type { AppointmentCard, PetVm } from "@/types";

export async function petsForUser(userId: string): Promise<PetVm[]> {
  const rows = await db.select().from(pets).where(eq(pets.userId, userId)).orderBy(asc(pets.createdAt));
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    species: p.species,
    breed: p.breed,
    sex: p.sex,
    ageLabel: p.ageLabel,
    weightKg: p.weightKg,
    notes: p.notes,
    photoUrl: p.photoUrl ?? speciesPhoto(p.species),
  }));
}

export async function appointmentCardsForUser(userId: string): Promise<AppointmentCard[]> {
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
    .where(eq(appointments.userId, userId))
    .orderBy(desc(appointments.date), desc(appointments.startTime));

  const apptIds = rows.map((r) => r.id);
  const revs = apptIds.length
    ? await db
        .select({ appointmentId: reviews.appointmentId, rating: reviews.rating, comment: reviews.comment })
        .from(reviews)
    : [];
  const revMap = new Map(revs.map((r) => [r.appointmentId, { rating: r.rating, comment: r.comment }]));

  const petRows = await db.select().from(pets).where(eq(pets.userId, userId));
  const photoMap = new Map(petRows.map((p) => [p.id, p.photoUrl]));

  return rows.map((r) => ({
    id: r.id,
    date: r.date,
    startTime: r.startTime,
    endTime: r.endTime,
    durationMinutes: r.durationMinutes,
    status: r.status as AppointmentCard["status"],
    notes: r.notes,
    petName: r.petName,
    petSpecies: r.petSpecies,
    petPhoto: (r.petId && photoMap.get(r.petId)) || speciesPhoto(r.petSpecies),
    doctorId: r.doctorId,
    doctorName: r.doctorName,
    doctorPhoto: r.doctorPhoto,
    serviceId: r.serviceId,
    serviceName: r.serviceName,
    hasReview: revMap.has(r.id),
    review: revMap.get(r.id) ?? null,
  }));
}

export interface Reminder {
  petId: string;
  petName: string;
  name: string;
  dueOn: string | null;
  status: string;
}

export async function remindersForUser(userId: string): Promise<Reminder[]> {
  const rows = await db
    .select({
      petId: pets.id,
      petName: pets.name,
      name: vaccinations.name,
      dueOn: vaccinations.dueOn,
      status: vaccinations.status,
    })
    .from(vaccinations)
    .innerJoin(pets, eq(vaccinations.petId, pets.id))
    .where(eq(pets.userId, userId));
  return rows
    .filter((r) => r.status !== "done")
    .sort((a, b) => (a.dueOn ?? "9999").localeCompare(b.dueOn ?? "9999"));
}

export async function favoriteDoctorsForUser(userId: string) {
  return db
    .select({
      doctorId: doctors.id,
      name: doctors.name,
      specialty: doctors.specialty,
      photoUrl: doctors.photoUrl,
    })
    .from(favorites)
    .innerJoin(doctors, eq(favorites.doctorId, doctors.id))
    .where(eq(favorites.userId, userId));
}

export function splitAppointments(cards: AppointmentCard[]) {
  const today = todayISO();
  const upcoming = cards
    .filter((c) => c.status === "booked" && c.date >= today)
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
  const completed = cards.filter((c) => c.status === "completed");
  const cancelled = cards.filter((c) => c.status === "cancelled" || c.status === "no_show");
  const past = cards.filter((c) => c.date < today && c.status === "booked");
  return { upcoming, completed, cancelled, past };
}
