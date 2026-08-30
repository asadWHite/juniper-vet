import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { doctors, favorites } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { body, fail, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return fail("Please sign in.", 401);
  try {
    const rows = await db
      .select({
        doctorId: doctors.id,
        name: doctors.name,
        specialty: doctors.specialty,
        photoUrl: doctors.photoUrl,
      })
      .from(favorites)
      .innerJoin(doctors, eq(favorites.doctorId, doctors.id))
      .where(eq(favorites.userId, user.id));
    return ok({ favorites: rows.map((r) => r.doctorId), doctors: rows });
  } catch (err) {
    console.error("[favorites GET]", err);
    return fail("Favorites could not be loaded.", 500);
  }
}

// POST toggles a doctor in favorites
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return fail("Please sign in first to save doctors.", 401);

  const data = await body<{ doctorId?: string }>(req);
  if (!data?.doctorId) return fail("Missing doctor.", 422);

  try {
    const existing = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, user.id), eq(favorites.doctorId, data.doctorId)))
      .limit(1);

    if (existing.length) {
      await db
        .delete(favorites)
        .where(and(eq(favorites.userId, user.id), eq(favorites.doctorId, data.doctorId)));
      return ok({ favorite: false });
    }
    await db.insert(favorites).values({ userId: user.id, doctorId: data.doctorId });
    return ok({ favorite: true });
  } catch (err) {
    console.error("[favorites POST]", err);
    return fail("Could not update favorites.", 500);
  }
}
