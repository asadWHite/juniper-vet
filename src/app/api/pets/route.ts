import { eq } from "drizzle-orm";
import { db } from "@/db";
import { pets } from "@/db/schema";
import { getSessionUser, newId } from "@/lib/auth";
import { body, fail, ok } from "@/lib/api";
import { petDefaultPhoto } from "@/data/images";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return fail("Please sign in.", 401);
  try {
    const rows = await db.select().from(pets).where(eq(pets.userId, user.id));
    return ok({
      pets: rows.map((p) => ({ ...p, photoUrl: p.photoUrl ?? petDefaultPhoto(p.species) })),
    });
  } catch (err) {
    console.error("[pets GET]", err);
    return fail("Pets could not be loaded.", 500);
  }
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return fail("Please sign in.", 401);

  const data = await body<{
    name?: string;
    species?: string;
    breed?: string;
    sex?: string;
    birthDate?: string;
    weightKg?: string;
    notes?: string;
  }>(req);
  if (!data) return fail("Invalid request.", 400);
  if (!data.name?.trim() || !data.species?.trim())
    return fail("A name and a species are required.", 422, "validation");
  if (!["dog", "cat", "rabbit", "bird", "other"].includes(data.species))
    return fail("Unknown species.", 422, "validation");
  if (data.birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.birthDate))
    return fail("Birth date must be YYYY-MM-DD.", 422, "validation");

  try {
    const id = newId();
    await db.insert(pets).values({
      id,
      userId: user.id,
      name: data.name.trim().toUpperCase(),
      species: data.species,
      breed: data.breed?.trim().toUpperCase() || null,
      sex: data.sex?.trim().toUpperCase() || null,
      birthDate: data.birthDate || null,
      weightKg: data.weightKg?.trim() || null,
      notes: data.notes?.trim() || null,
      photoUrl: petDefaultPhoto(data.species),
    });
    return ok({ id }, { status: 201 });
  } catch (err) {
    console.error("[pets POST]", err);
    return fail("The pet could not be saved.", 500);
  }
}
