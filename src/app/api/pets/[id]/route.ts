import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments, medicalRecords, pets, vaccinations } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { body, fail, ok } from "@/lib/api";
import { ageLabelFromDates } from "@/lib/dates";
import { petDefaultPhoto } from "@/data/images";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function owned(userId: string, id: string) {
  const rows = await db
    .select()
    .from(pets)
    .where(and(eq(pets.id, id), eq(pets.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function GET(_req: Request, ctx: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail("Please sign in.", 401);
  const { id } = await ctx.params;
  try {
    const pet = await owned(user.id, id);
    if (!pet) return fail("Pet not found.", 404);
    const [recs, vacs, appts] = await Promise.all([
      db.select().from(medicalRecords).where(eq(medicalRecords.petId, id)),
      db.select().from(vaccinations).where(eq(vaccinations.petId, id)),
      db
        .select()
        .from(appointments)
        .where(and(eq(appointments.petId, id), eq(appointments.userId, user.id))),
    ]);
    return ok({
      pet: { ...pet, photoUrl: pet.photoUrl ?? petDefaultPhoto(pet.species), computedAge: ageLabelFromDates(pet.birthDate) },
      records: recs,
      vaccinations: vacs,
      appointments: appts,
    });
  } catch (err) {
    console.error("[pet GET]", err);
    return fail("The pet profile could not be loaded.", 500);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail("Please sign in.", 401);
  const { id } = await ctx.params;
  const data = await body<Record<string, string>>(req);
  if (!data) return fail("Invalid request.", 400);

  try {
    const pet = await owned(user.id, id);
    if (!pet) return fail("Pet not found.", 404);

    await db
      .update(pets)
      .set({
        name: (data.name ?? pet.name).trim().toUpperCase(),
        species: data.species ?? pet.species,
        breed: (data.breed ?? pet.breed ?? "").trim().toUpperCase() || null,
        sex: (data.sex ?? pet.sex ?? "").trim().toUpperCase() || null,
        birthDate: data.birthDate ?? pet.birthDate,
        weightKg: (data.weightKg ?? pet.weightKg ?? "").trim() || null,
        notes: (data.notes ?? pet.notes ?? "").trim() || null,
        ageLabel: ageLabelFromDates(data.birthDate ?? pet.birthDate),
      })
      .where(eq(pets.id, id));
    return ok({ ok: true });
  } catch (err) {
    console.error("[pet PATCH]", err);
    return fail("The pet could not be updated.", 500);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail("Please sign in.", 401);
  const { id } = await ctx.params;
  try {
    const pet = await owned(user.id, id);
    if (!pet) return fail("Pet not found.", 404);
    await db.delete(pets).where(eq(pets.id, id));
    return ok({ ok: true });
  } catch (err) {
    console.error("[pet DELETE]", err);
    return fail("The pet could not be removed.", 500);
  }
}
